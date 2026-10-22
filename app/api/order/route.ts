import { NextResponse, after } from "next/server";
import { ensureSchema, sqlClient } from "@/lib/db";
import { tierById } from "@/lib/tiers";
import { sendOrderAlert } from "@/lib/notify";
import { SITE_ORIGIN, normalizeOrigin } from "@/lib/site";

export const runtime = "nodejs";

const PHONE = /^[6-9]\d{9}$/;
const PIN = /^\d{6}$/;

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

/**
 * The public checkout must be deployable without a database account.
 * We derive the real public origin from the incoming request for notifications.
 */
function requestSiteOrigin(req: Request): string {
  return (
    normalizeOrigin(req.headers.get("origin")) ||
    normalizeOrigin(req.headers.get("referer")) ||
    SITE_ORIGIN
  );
}

/**
 * Stable-enough public order reference for customer-facing notes.
 * It intentionally does not depend on database state.
 */
function orderReference(): number {
  return Date.now();
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

  // Save the order for the /admin dashboard when a database is configured.
  // A database failure never blocks checkout; it falls back to a time-based
  // order reference.
  let orderId = orderReference();
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    try {
      await ensureSchema();
      const sql = sqlClient();
      const ip = clientIp(req);

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

      const rows = await sql`
        INSERT INTO sp_orders
          (user_id, tier_id, item_title, amount, name, phone, address, city, state, pincode, ip)
        VALUES
          (${Number(users[0].id)}, ${tier.id}, ${tier.title}, ${tier.price}, ${name}, ${phone},
           ${address}, ${city}, ${state}, ${pincode}, ${ip})
        RETURNING id`;

      orderId = Number(rows[0].id);
    } catch (e) {
      console.error("order save failed", e);
    }
  }

  const siteOrigin = requestSiteOrigin(req);

  // Notifications are best-effort and can never block checkout/payment.
  after(() =>
    sendOrderAlert(
      {
        orderId,
        title: tier.title,
        amount: tier.price,
        name,
        phone,
        address,
        city,
        state,
        pincode,
      },
      siteOrigin
    )
  );

  return NextResponse.json({
    ok: true,
    orderId,
    amount: tier.price,
    title: tier.title,
  });
}
