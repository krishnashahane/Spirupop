import { NextResponse, after } from "next/server";
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

  const orderId = orderReference();
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
