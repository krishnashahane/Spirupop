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

// Admin password for /admin. Fixed in code so a stale ADMIN_PASSWORD /
// ADMIN_SECRET env var on the host can't silently replace it.
const ADMIN_PASSWORD = "Spirupop.com@2026";

function pw(): string {
  return ADMIN_PASSWORD;
}

export function adminToken(): string {
  return crypto.createHmac("sha256", pw()).update("sp-admin-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const expected = pw();

  console.log("Received password length:", input.length);
  console.log("Expected password length:", expected.length);
  console.log("Password matches:", input === expected);

  return crypto.timingSafeEqual(
    crypto.createHash("sha256").update(input, "utf8").digest(),
    crypto.createHash("sha256").update(expected, "utf8").digest()
  );
}
