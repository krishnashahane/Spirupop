// Customer accounts (email + password) and secure order tracking.
//
// - Passwords are hashed with bcrypt; plaintext is never stored or logged.
// - Sessions are signed JWTs in an httpOnly cookie. The session only carries
//   the customer id; every order query is filtered by that id server-side, so a
//   customer can never read another customer's orders.
// - Guest orders get a random tracking token. Only its SHA-256 hash is stored,
//   so even a database leak does not reveal working tracking links.

import crypto from "crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { ensureSchema, sqlClient } from "@/lib/db";

export const CUSTOMER_COOKIE = "sp_customer";
const SESSION_DAYS = 30;

export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

// ---------------------------------------------------------------- schema

let _ready: Promise<void> | null = null;
export function ensureCustomerSchema(): Promise<void> {
  if (_ready) return _ready;
  _ready = (async () => {
    await ensureSchema();
    const sql = sqlClient();
    await sql`CREATE TABLE IF NOT EXISTS sp_customers (
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )`;
    await sql`ALTER TABLE sp_orders ADD COLUMN IF NOT EXISTS customer_id BIGINT REFERENCES sp_customers(id)`;
    await sql`ALTER TABLE sp_orders ADD COLUMN IF NOT EXISTS track_hash TEXT`;
    await sql`CREATE INDEX IF NOT EXISTS sp_orders_customer_idx ON sp_orders (customer_id, created_at)`;
  })().catch((e) => {
    _ready = null;
    throw e;
  });
  return _ready;
}

// ---------------------------------------------------------------- session

function sessionKey(): Uint8Array {
  // Prefer an explicit secret; otherwise derive a stable server-only key from
  // the database credentials (never sent to the browser).
  const base =
    process.env.AUTH_SECRET ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    "";
  if (!base) throw new Error("No session secret available");
  return new Uint8Array(
    crypto.createHmac("sha256", base).update("sp-customer-session-v1").digest()
  );
}

export async function createSessionToken(customerId: number): Promise<string> {
  return new SignJWT({ cid: customerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(sessionKey());
}

export function sessionCookieOptions(req: Request) {
  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
    new URL(req.url).protocol.replace(":", "");
  return {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  };
}

/** Returns the logged-in customer's id, or null. Never throws. */
export async function currentCustomerId(): Promise<number | null> {
  try {
    const token = (await cookies()).get(CUSTOMER_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, sessionKey(), {
      algorithms: ["HS256"],
    });
    const id = Number(payload.cid);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- tracking

export function newTrackToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(24).toString("base64url");
  return { token, hash: hashTrackToken(token) };
}

export function hashTrackToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function safeEqualHex(a: string, b: string): boolean {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
}

// ---------------------------------------------------------------- helpers

export const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || "unknown";
}

/** Simple per-instance rate limiter: max `limit` hits per `windowMs`. */
const buckets = new Map<string, { n: number; until: number }>();
export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.until < now) {
    buckets.set(key, { n: 1, until: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.until < now) buckets.delete(k);
    }
    return false;
  }
  b.n += 1;
  return b.n > limit;
}

export async function readJson(
  req: Request
): Promise<Record<string, unknown> | null> {
  if (!req.headers.get("content-type")?.includes("application/json")) return null;
  const raw = await req.text();
  if (raw.length > 4000) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}

/** Fields a customer is allowed to see about their own order. */
export type PublicOrder = {
  id: number;
  item_title: string;
  amount: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  created_at: string;
};
