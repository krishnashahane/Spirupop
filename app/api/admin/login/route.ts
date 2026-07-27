import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminToken,
  checkPassword,
} from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  try {
    if (!password || !checkPassword(password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), adminCookieOptions);
  return res;
}
