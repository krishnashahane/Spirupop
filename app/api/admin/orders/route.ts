import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { ensureSchema, sqlClient } from "@/lib/db";

export const runtime = "nodejs";

const STATUSES = [
  "awaiting_payment",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSchema();
  const sql = sqlClient();
  const orders = await sql`
    SELECT id, item_title, amount, name, phone, address, city, state, pincode,
           status, created_at
    FROM sp_orders
    ORDER BY created_at DESC
    LIMIT 500`;
  return NextResponse.json({ orders });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let id = 0;
  let status = "";
  try {
    const body = await req.json();
    id = Number(body?.id);
    status = String(body?.status ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!Number.isInteger(id) || id <= 0 || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  await ensureSchema();
  const sql = sqlClient();
  await sql`UPDATE sp_orders SET status = ${status} WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
