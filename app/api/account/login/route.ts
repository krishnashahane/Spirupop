import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sqlClient } from "@/lib/db";
import {
  CUSTOMER_COOKIE,
  clientIp,
  createSessionToken,
  dbConfigured,
  ensureCustomerSchema,
  rateLimited,
  readJson,
  sessionCookieOptions,
} from "@/lib/customer";

export const runtime = "nodejs";

// Used when the email is unknown so response time doesn't reveal which
// emails have accounts.
const DUMMY_HASH = "$2b$10$kJSK0OF6pMp0JDz0qKPn.OGz///QtnxrgXudVAGf9bp17FajMWKTG";

export async function POST(req: Request) {
  try {
    if (!dbConfigured()) {
      return NextResponse.json({ error: "Accounts are not available right now." }, { status: 503 });
    }
    const body = await readJson(req);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);
    const password = String(body.password ?? "").slice(0, 72);

    if (
      rateLimited(`login-ip:${clientIp(req)}`, 30, 15 * 60 * 1000) ||
      rateLimited(`login-email:${email}`, 10, 15 * 60 * 1000)
    ) {
      return NextResponse.json({ error: "Too many attempts. Please try again in 15 minutes." }, { status: 429 });
    }

    await ensureCustomerSchema();
    const sql = sqlClient();
    const rows = await sql`SELECT id, password_hash FROM sp_customers WHERE email = ${email}`;
    const user = rows[0];
    const ok = await bcrypt.compare(password, user ? String(user.password_hash) : DUMMY_HASH);

    if (!user || !ok) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(CUSTOMER_COOKIE, await createSessionToken(Number(user.id)), sessionCookieOptions(req));
    return res;
  } catch (e) {
    console.error("login failed", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
