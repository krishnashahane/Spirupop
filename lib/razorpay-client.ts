// Browser-side Razorpay loading.
//
// Phones use Razorpay Custom Checkout (razorpay.js) UPI Intent, which opens
// the chosen UPI app with the order amount locked. Computers use Razorpay
// Standard Checkout (checkout.js), which shows a payment QR for that exact
// order. Only one of the two scripts is ever loaded on a page, because both
// define window.Razorpay.

import type { UpiApp } from "@/lib/upi";
import { isAndroid, isIOS } from "@/lib/upi";

export const RZP_CUSTOM_SRC = "https://checkout.razorpay.com/v1/razorpay.js";
export const RZP_STANDARD_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export type RzpSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RzpError = {
  error?: { code?: string; description?: string; reason?: string };
  code?: string;
  description?: string;
  reason?: string;
};

export type RzpCustom = {
  createPayment: (data: Record<string, unknown>, opts?: { app: string }) => void;
  on: (event: string, cb: (r: unknown) => void) => void;
  emit: (event: string) => void;
};

export type RzpStandard = {
  open: () => void;
  on: (event: string, cb: (r: unknown) => void) => void;
};

type RzpCtor = new (opts: Record<string, unknown>) => unknown;

declare global {
  interface Window {
    Razorpay?: RzpCtor;
  }
}

export function isPhone(): boolean {
  return isAndroid() || isIOS();
}

let loading: Promise<RzpCtor> | null = null;

/** Loads the right Razorpay script for this device (once per page). */
export function loadRazorpay(): Promise<RzpCtor> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (loading) return loading;

  const src = isPhone() ? RZP_CUSTOM_SRC : RZP_STANDARD_SRC;
  loading = new Promise<RzpCtor>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () =>
      window.Razorpay ? resolve(window.Razorpay) : reject(new Error("Razorpay unavailable"));
    s.onerror = () => reject(new Error("Could not load Razorpay"));
    document.head.appendChild(s);
  }).catch((e) => {
    loading = null;
    throw e;
  });
  return loading;
}

/**
 * Razorpay UPI Intent app code for a button, or null when Razorpay cannot
 * open that app on this device.
 *
 * Supported one-time payment apps (Razorpay docs, UPI Intent on Mobile Web):
 *   Android: gpay, phonepe, paytm, super_money, … and "any"
 *   iOS:     gpay, phonepe, paytm, super_money, …
 * FamApp and WhatsApp Pay have no dedicated code; on Android "any" opens the
 * phone's own UPI app picker, where they appear when installed.
 */
export function razorpayAppCode(app: UpiApp): string | null {
  const direct: Record<string, string> = {
    "Google Pay": "gpay",
    PhonePe: "phonepe",
    Paytm: "paytm",
    "super.money": "super_money",
  };
  if (direct[app.name]) return direct[app.name];
  if (isAndroid()) return "any";
  return null;
}

export function errorText(r: unknown): { reason: string; text: string } {
  const e = (r as RzpError) || {};
  const inner = e.error || e;
  const reason = String(inner.reason || inner.code || "");
  if (reason === "payment_cancelled") {
    return { reason, text: "Payment was cancelled. You can try again." };
  }
  if (reason === "intent_no_apps_error") {
    return {
      reason,
      text: "Couldn't open that app. Please choose another UPI app.",
    };
  }
  return {
    reason,
    text: inner.description || "Payment didn't go through. Please try again.",
  };
}
