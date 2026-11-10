import { NextResponse } from "next/server";
import { confirmRazorpayOrder } from "@/lib/razorpay";
import { clientIp, rateLimited, readJson } from "@/lib/customer";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "private, no-store" };

// Polled by the checkout while the customer is in their UPI app. It only
// reveals paid/pending for an unguessable Razorpay order id, and every
// answer comes from the Razorpay API, never from the browser.
export async function POST(req: Request) {
  try {
    if (rateLimited(`paystatus:${clientIp(req)}`, 300, 15 * 60 * 1000)) {
      return NextResponse.json({ state: "pending" }, { status: 429, headers: NO_STORE });
    }
    const body = await readJson(req);
    const orderId = String(body?.razorpay_order_id ?? "").slice(0, 64);
    const result = await confirmRazorpayOrder(orderId);
    if (result.state === "unknown") {
      return NextResponse.json({ state: "unknown" }, { status: 404, headers: NO_STORE });
    }
    return NextResponse.json({ state: result.state }, { headers: NO_STORE });
  } catch (e) {
    console.error("payment status failed", e);
    return NextResponse.json({ state: "pending" }, { status: 500, headers: NO_STORE });
  }
}
