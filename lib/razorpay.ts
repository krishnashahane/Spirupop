// Server-only Razorpay helpers (Orders + Payments REST API, no SDK).
//
// Credentials come exclusively from the server environment:
//   RAZORPAY_KEY_ID          public key id (also sent to the browser)
//   RAZORPAY_KEY_SECRET      secret — never leaves the server
//   RAZORPAY_WEBHOOK_SECRET  secret set on the Dashboard webhook
//
// An order is marked "paid" ONLY after the server itself confirms with the
// Razorpay API that a payment for that exact Razorpay order is captured for
// the exact amount. Browser callbacks and webhooks merely trigger that check.

import crypto from "crypto";
import { ensureSchema, sqlClient } from "@/lib/db";

const API = "https://api.razorpay.com/v1";

export function razorpayEnabled(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      (process.env.DATABASE_URL || process.env.POSTGRES_URL)
  );
}

export function razorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID || "";
}

function authHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID || "";
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  if (!id || !secret) throw new Error("Razorpay keys are not configured");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

async function rzp<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  const data = (await res.json().catch(() => ({}))) as T & {
    error?: { description?: string };
  };
  if (!res.ok) {
    throw new Error(
      `Razorpay ${path} failed (${res.status}): ${
        data?.error?.description || "unknown error"
      }`
    );
  }
  return data;
}

type RzpOrder = { id: string; amount: number; currency: string; status: string };
type RzpPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string; // created | authorized | captured | refunded | failed
};

/** Creates a Razorpay order for an amount in whole rupees. */
export async function createRazorpayOrder(
  spOrderId: number,
  rupees: number
): Promise<RzpOrder> {
  return rzp<RzpOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: Math.round(rupees * 100),
      currency: "INR",
      receipt: `spirupop_${spOrderId}`,
      notes: { sp_order_id: String(spOrderId) },
    }),
  });
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
}

/** Checkout success signature: HMAC_SHA256(order_id|payment_id, key_secret). */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

/** Webhook signature: HMAC_SHA256(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return safeEqual(expected, signature);
}

export type ConfirmResult =
  | { state: "paid"; spOrderId: number }
  | { state: "pending"; spOrderId: number }
  | { state: "unknown" };

/**
 * Asks Razorpay whether the given Razorpay order has a captured payment for
 * the full amount, capturing an authorized one if needed, and records it.
 * Idempotent: safe to call any number of times from any trigger.
 */
export async function confirmRazorpayOrder(
  rzpOrderId: string
): Promise<ConfirmResult> {
  if (!/^order_[A-Za-z0-9]{6,40}$/.test(rzpOrderId)) return { state: "unknown" };

  await ensureSchema();
  const sql = sqlClient();
  const rows = await sql`
    SELECT id, amount, status, rzp_payment_id
    FROM sp_orders WHERE rzp_order_id = ${rzpOrderId}`;
  const row = rows[0];
  if (!row) return { state: "unknown" };

  const spOrderId = Number(row.id);
  if (row.rzp_payment_id) return { state: "paid", spOrderId };

  const expectedPaise = Number(row.amount) * 100;

  const list = async () =>
    (await rzp<{ items: RzpPayment[] }>(`/orders/${rzpOrderId}/payments`)).items ||
    [];
  const valid = (p: RzpPayment) =>
    p.order_id === rzpOrderId &&
    p.currency === "INR" &&
    Number(p.amount) === expectedPaise;

  let payments = await list();
  let captured = payments.find((p) => valid(p) && p.status === "captured");

  if (!captured) {
    const authorized = payments.find((p) => valid(p) && p.status === "authorized");
    if (authorized) {
      // Accounts without auto-capture would otherwise auto-refund the payment.
      try {
        await rzp(`/payments/${authorized.id}/capture`, {
          method: "POST",
          body: JSON.stringify({ amount: expectedPaise, currency: "INR" }),
        });
      } catch (e) {
        // Usually "already captured" by auto-capture; re-read below.
        console.warn("razorpay capture attempt", e);
      }
      payments = await list();
      captured = payments.find((p) => valid(p) && p.status === "captured");
    }
  }

  if (!captured) return { state: "pending", spOrderId };

  // Record the payment. Status only moves forward from awaiting_payment, so a
  // late confirmation never overwrites shipped/delivered/cancelled set by admin.
  await sql`
    UPDATE sp_orders
    SET rzp_payment_id = ${captured.id},
        paid_at = COALESCE(paid_at, now()),
        status = CASE WHEN status = 'awaiting_payment' THEN 'paid' ELSE status END
    WHERE id = ${spOrderId} AND rzp_payment_id IS NULL`;

  return { state: "paid", spOrderId };
}
