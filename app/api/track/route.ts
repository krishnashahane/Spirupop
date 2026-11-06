import { NextResponse } from "next/server";
import { sqlClient } from "@/lib/db";
import {
  clientIp,
  dbConfigured,
  ensureCustomerSchema,
  hashTrackToken,
  rateLimited,
  readJson,
  safeEqualHex,
} from "@/lib/customer";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "private, no-store" };
const NOT_FOUND = "We couldn't find an order matching those details.";

// Guest order tracking. Two ways to prove ownership:
//   1. { id, t }               — the secret link shown after checkout
//   2. { id, phone, pincode }  — order number + the mobile and PIN used
export async function POST(req: Request) {
  try {
    if (!dbConfigured()) {
      return NextResponse.json({ error: "Order tracking is not available right now." }, { status: 503, headers: NO_STORE });
    }
    if (rateLimited(`track:${clientIp(req)}`, 20, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429, headers: NO_STORE });
    }
    const body = await readJson(req);
    const id = Number(body?.id);
    if (!body || !Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404, headers: NO_STORE });
    }

    await ensureCustomerSchema();
    const sql = sqlClient();
    const rows = await sql`
      SELECT id, item_title, amount, name, phone, address, city, state, pincode,
             status, created_at, track_hash
      FROM sp_orders WHERE id = ${id}`;
    const row = rows[0];

    let ok = false;
    if (row) {
      const token = String(body.t ?? "").slice(0, 100);
      if (token) {
        ok = Boolean(row.track_hash) && safeEqualHex(String(row.track_hash), hashTrackToken(token));
      } else {
        const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
        const pincode = String(body.pincode ?? "").replace(/\D/g, "");
        ok = phone.length === 10 && phone === row.phone && pincode === row.pincode;
      }
    }

    if (!row || !ok) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404, headers: NO_STORE });
    }

    const order = {
      id: Number(row.id),
      item_title: row.item_title,
      amount: row.amount,
      name: row.name,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      status: row.status,
      created_at: row.created_at,
    };
    return NextResponse.json({ order }, { headers: NO_STORE });
  } catch (e) {
    console.error("track failed", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500, headers: NO_STORE });
  }
}
