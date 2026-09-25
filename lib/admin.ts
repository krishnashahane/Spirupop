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

function pw(): string {
const p = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || "Spirupop.com@2026";
  if (!p) throw new Error("ADMIN_PASSWORD is not configured");
  return p;
}

export function adminToken(): string {
  return crypto.createHmac("sha256", pw()).update("sp-admin-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(pw()).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const c = jar.get(ADMIN_COOKIE)?.value;
  if (!c) return false;
  try {
    const a = Buffer.from(c);
    const b = Buffer.from(adminToken());
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
