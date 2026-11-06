import { NextResponse } from "next/server";
import { sqlClient } from "@/lib/db";
import { currentCustomerId, dbConfigured, ensureCustomerSchema } from "@/lib/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET() {
  try {
    const id = await currentCustomerId();
    if (!id || !dbConfigured()) {
      return NextResponse.json({ customer: null }, { status: 401, headers: NO_STORE });
    }
    await ensureCustomerSchema();
    const sql = sqlClient();
    const users = await sql`SELECT name, email FROM sp_customers WHERE id = ${id}`;
    if (!users[0]) {
      return NextResponse.json({ customer: null }, { status: 401, headers: NO_STORE });
    }
    // Only this customer's orders — filtered by the id from the signed session.
    const orders = await sql`
      SELECT id, item_title, amount, name, address, city, state, pincode, status, created_at
      FROM sp_orders
      WHERE customer_id = ${id}
      ORDER BY created_at DESC
      LIMIT 200`;
    return NextResponse.json(
      { customer: { name: users[0].name, email: users[0].email }, orders },
      { headers: NO_STORE }
    );
  } catch (e) {
    console.error("account load failed", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500, headers: NO_STORE });
  }
}
