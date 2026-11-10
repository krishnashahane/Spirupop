import { NextResponse } from "next/server";
import { confirmRazorpayOrder, verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

// Razorpay Dashboard → Webhooks:
//   URL:    https://YOUR-DOMAIN/api/razorpay/webhook
//   Secret: same value as RAZORPAY_WEBHOOK_SECRET
//   Events: payment.authorized, payment.captured, order.paid
//
// Marks orders paid even if the customer closes the browser after paying.
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: { order_id?: string } };
      order?: { entity?: { id?: string } };
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  const orderId =
    event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id || "";

  if (!orderId) return NextResponse.json({ ok: true, ignored: true });

  try {
    const result = await confirmRazorpayOrder(orderId);
    return NextResponse.json({ ok: true, state: result.state });
  } catch (e) {
    // Non-2xx makes Razorpay retry the webhook later.
    console.error("razorpay webhook confirm failed", e);
    return NextResponse.json({ error: "Retry" }, { status: 500 });
  }
}
