import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminToken,
  checkPassword,
} from "@/lib/admin";

export const runtime = "nodejs";

// Best-effort brute-force throttle: max 10 failed attempts per IP per 15 min.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;
const fails = new Map<string, { count: number; until: number }>();

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || "unknown";
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const now = Date.now();
  const entry = fails.get(ip);
  if (entry && entry.until > now && entry.count >= MAX_FAILS) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  try {
    if (!password || !checkPassword(password)) {
      const live = entry && entry.until > now ? entry : { count: 0, until: now + WINDOW_MS };
      live.count += 1;
      fails.set(ip, live);
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  fails.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), adminCookieOptions);
  return res;
}
