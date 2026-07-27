import { NextResponse, after } from "next/server";
import { ensureSchema, sqlClient } from "@/lib/db";
import { tierById } from "@/lib/tiers";
import { sendOrderAlert } from "@/lib/notify";

export const runtime = "nodejs";

const PHONE = /^[6-9]\d{9}$/;
const PIN = /^\d{6}$/;

// Drop control characters; cap length to keep payloads sane.
function clean(v: unknown, max: number): string {
  const s = String(v ?? "");
  let out = "";
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (c >= 32 && c !== 127) out += ch;
  }
  return out.trim().slice(0, max);
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || "unknown";
}

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("order failed", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

async function handle(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Bad request." }, { status: 415 });
  }

  const raw = await req.text();
  if (raw.length > 4000) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const tier = tierById(clean(body.tierId, 8));
  if (!tier) {
    return NextResponse.json({ error: "Invalid item." }, { status: 400 });
  }

  const phone = clean(body.phone, 10);
  const name = clean(body.name, 80);
  const address = clean(body.address, 300);
  const city = clean(body.city, 60);
  const state = clean(body.state, 60);
  const pincode = clean(body.pincode, 6);

  if (
    !PHONE.test(phone) ||
    name.length < 2 ||
    address.length < 6 ||
    city.length < 2 ||
    state.length < 2 ||
    !PIN.test(pincode)
  ) {
    return NextResponse.json(
      { error: "Please enter a valid mobile number and full delivery address." },
      { status: 400 }
    );
  }

  await ensureSchema();
  const sql = sqlClient();
  const ip = clientIp(req);

  // Rate limit: cap orders per phone and per IP within the last hour.
  const [byPhone, byIp] = await Promise.all([
    sql`SELECT count(*)::int AS n FROM sp_orders
        WHERE phone = ${phone} AND created_at > now() - interval '1 hour'`,
    sql`SELECT count(*)::int AS n FROM sp_orders
        WHERE ip = ${ip} AND created_at > now() - interval '1 hour'`,
  ]);
  if ((byPhone[0]?.n ?? 0) >= 8 || (byIp[0]?.n ?? 0) >= 20) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const users = await sql`
    INSERT INTO sp_users (phone, name) VALUES (${phone}, ${name})
    ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name
    RETURNING id`;
  const uid = Number(users[0].id);

  const rows = await sql`
    INSERT INTO sp_orders
      (user_id, tier_id, item_title, amount, name, phone, address, city, state, pincode, ip)
    VALUES
      (${uid}, ${tier.id}, ${tier.title}, ${tier.price}, ${name}, ${phone},
       ${address}, ${city}, ${state}, ${pincode}, ${ip})
    RETURNING id`;

  const orderId = Number(rows[0].id);

  // Notify the owner after the response is sent — keeps checkout instant.
  after(() =>
    sendOrderAlert({
      orderId,
      title: tier.title,
      amount: tier.price,
      name,
      phone,
      address,
      city,
      state,
      pincode,
    })
  );

  // amount comes from the server-side tier table, never the client.
  return NextResponse.json({
    ok: true,
    orderId,
    amount: tier.price,
    title: tier.title,
  });
}
