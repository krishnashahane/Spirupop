import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, sessionCookieOptions } from "@/lib/customer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_COOKIE, "", { ...sessionCookieOptions(req), maxAge: 0 });
  return res;
}
