import { NextResponse } from "next/server";
import { sqlClient } from "@/lib/db";
import {
  currentCustomerId,
  dbConfigured,
  ensureCustomerSchema,
  hashTrackToken,
  readJson,
  safeEqualHex,
} from "@/lib/customer";

export const runtime = "nodejs";

// Lets a logged-in customer add a guest order to their account. Requires the
// secret tracking token, so nobody can claim someone else's order.
export async function POST(req: Request) {
  try {
    const cid = await currentCustomerId();
    if (!cid || !dbConfigured()) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }
    const body = await readJson(req);
    const id = Number(body?.id);
    const token = String(body?.t ?? "").slice(0, 100);
    if (!Number.isInteger(id) || id <= 0 || !token) {
      return NextResponse.json({ error: "Bad request." }, { status: 400 });
    }
    await ensureCustomerSchema();
    const sql = sqlClient();
    const rows = await sql`SELECT track_hash, customer_id FROM sp_orders WHERE id = ${id}`;
    const row = rows[0];
    if (!row || !row.track_hash || !safeEqualHex(String(row.track_hash), hashTrackToken(token))) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (row.customer_id && Number(row.customer_id) !== cid) {
      return NextResponse.json({ error: "This order belongs to another account." }, { status: 409 });
    }
    await sql`UPDATE sp_orders SET customer_id = ${cid} WHERE id = ${id} AND customer_id IS NULL`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("claim failed", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
