import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sp_admin";

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

// Admin password
const ADMIN_PASSWORD = "Admin@123";

function pw(): string {
  return ADMIN_PASSWORD;
}

// Generate admin authentication token
export function adminToken(): string {
  return crypto
    .createHmac("sha256", pw())
    .update("sp-admin-v1")
    .digest("hex");
}

// Validate admin password
export function checkPassword(input: string): boolean {
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(pw()).digest();

  return crypto.timingSafeEqual(a, b);
}

// Verify admin session
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(ADMIN_COOKIE)?.value;

  if (!cookie) return false;

  try {
    const a = Buffer.from(cookie);
    const b = Buffer.from(adminToken());

    return (
      a.length === b.length &&
      crypto.timingSafeEqual(a, b)
    );
  } catch {
    return false;
  }
}
