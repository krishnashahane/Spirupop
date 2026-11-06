import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sqlClient } from "@/lib/db";
import {
  CUSTOMER_COOKIE,
  EMAIL,
  clientIp,
  createSessionToken,
  dbConfigured,
  ensureCustomerSchema,
  rateLimited,
  readJson,
  sessionCookieOptions,
} from "@/lib/customer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!dbConfigured()) {
      return NextResponse.json({ error: "Accounts are not available right now." }, { status: 503 });
    }
    if (rateLimited(`signup:${clientIp(req)}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }
    const body = await readJson(req);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

    const name = String(body.name ?? "").trim().slice(0, 80);
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);
    const password = String(body.password ?? "");

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!EMAIL.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 72) {
      return NextResponse.json({ error: "Password must be 8–72 characters." }, { status: 400 });
    }

    await ensureCustomerSchema();
    const sql = sqlClient();
    const hash = await bcrypt.hash(password, 10);
    const rows = await sql`
      INSERT INTO sp_customers (email, password_hash, name)
      VALUES (${email}, ${hash}, ${name})
      ON CONFLICT (email) DO NOTHING
      RETURNING id`;

    if (!rows[0]) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(CUSTOMER_COOKIE, await createSessionToken(Number(rows[0].id)), sessionCookieOptions(req));
    return res;
  } catch (e) {
    console.error("signup failed", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
