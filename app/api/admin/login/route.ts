import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminToken,
  checkPassword,
} from "@/lib/admin";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;

const fails = new Map<string, { count: number; until: number }>();

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || "unknown";
}

export async function POST(req: Request) {
  try {
    // Check admin configuration first
    if (!process.env.ADMIN_PASSWORD) {
      console.error("Admin login configuration missing: ADMIN_PASSWORD");
      return NextResponse.json(
        { error: "Admin password is not configured on the server." },
        { status: 500 }
      );
    }

    const ip = clientIp(req);
    const now = Date.now();

    const entry = fails.get(ip);

    if (entry && entry.until > now && entry.count >= MAX_FAILS) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const password = String(body?.password ?? "");

    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    // Validate password
    let validPassword = false;

    try {
      validPassword = checkPassword(password);
    } catch (error) {
      console.error("Admin password validation failed:", error);

      return NextResponse.json(
        { error: "Admin authentication is not configured correctly." },
        { status: 500 }
      );
    }

    if (!validPassword) {
      const live =
        entry && entry.until > now
          ? entry
          : { count: 0, until: now + WINDOW_MS };

      live.count += 1;
      fails.set(ip, live);

      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    fails.delete(ip);

    // Generate authentication token
    let token: string;

    try {
      token = adminToken();
    } catch (error) {
      console.error("Admin token generation failed:", error);

      return NextResponse.json(
        { error: "Admin session is not configured correctly." },
        { status: 500 }
      );
    }

    const proto =
      req.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
      new URL(req.url).protocol.replace(":", "");

    const res = NextResponse.json({ ok: true });

    res.cookies.set(ADMIN_COOKIE, token, {
      ...adminCookieOptions,
      secure: proto === "https",
    });

    return res;

  } catch (error) {
    console.error("Admin login API error:", error);

    return NextResponse.json(
      { error: "Internal server error during admin login." },
      { status: 500 }
    );
  }
}
