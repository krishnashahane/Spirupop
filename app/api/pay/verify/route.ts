import { NextResponse } from "next/server";
import { confirmRazorpayOrder, verifyPaymentSignature } from "@/lib/razorpay";
import { readJson } from "@/lib/customer";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "private, no-store" };

// Called by the browser right after Razorpay reports success. The signature
// proves the response came from Razorpay; the order is then re-confirmed
// against the Razorpay API before it is marked paid.
export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    const orderId = String(body?.razorpay_order_id ?? "").slice(0, 64);
    const paymentId = String(body?.razorpay_payment_id ?? "").slice(0, 64);
    const signature = String(body?.razorpay_signature ?? "").slice(0, 128);

    if (!orderId || !paymentId || !verifyPaymentSignature(orderId, paymentId, signature)) {
      return NextResponse.json({ error: "Invalid payment response." }, { status: 400, headers: NO_STORE });
    }

    const result = await confirmRazorpayOrder(orderId);
    return NextResponse.json({ state: result.state }, { headers: NO_STORE });
  } catch (e) {
    console.error("payment verify failed", e);
    return NextResponse.json({ error: "Could not confirm payment yet." }, { status: 500, headers: NO_STORE });
  }
}
