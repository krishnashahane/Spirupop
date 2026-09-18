// Order alerts to the shop owner. Email is fully automatic via FormSubmit.
// WhatsApp uses the official Meta Cloud API when its server-only credentials
// are configured.
//
// The notification layer is deliberately isolated from checkout success: order
// creation must not fail just because an optional alert provider is unavailable.

export type OrderInfo = {
  orderId: number;
  title: string;
  amount: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

function ownerEmail(): string {
  return process.env.ORDER_ALERT_EMAIL || "spiruhomeglobalsolutions@gmail.com";
}

function ownerWhatsApp(): string {
  return process.env.WHATSAPP_TO || "917972452200";
}

async function sendEmail(o: OrderInfo, siteOrigin: string): Promise<void> {
  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(ownerEmail())}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: siteOrigin,
          Referer: `${siteOrigin}/`,
        },
        body: JSON.stringify({
          _subject: `🛒 New SpiruPop order #${o.orderId} — ₹${o.amount}`,
          Order: `#${o.orderId}`,
          Item: o.title,
          Amount: `₹${o.amount}`,
          Name: o.name,
          Phone: `+91 ${o.phone}`,
          Address: `${o.address}, ${o.city}, ${o.state} - ${o.pincode}`,
        }),
      }
    );

    if (!response.ok) {
      console.error("email alert failed", response.status);
    }
  } catch (e) {
    console.error("email alert failed", e);
  }
}

async function sendWhatsApp(o: OrderInfo): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) return;

  const text =
    `🛒 New SpiruPop order #${o.orderId}\n` +
    `${o.title} — ₹${o.amount}\n` +
    `${o.name}, +91 ${o.phone}\n` +
    `${o.address}, ${o.city}, ${o.state} - ${o.pincode}`;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: ownerWhatsApp(),
          type: "text",
          text: { body: text },
        }),
      }
    );

    if (!response.ok) {
      console.error("whatsapp alert failed", response.status);
    }
  } catch (e) {
    console.error("whatsapp alert failed", e);
  }
}

export async function sendOrderAlert(
  order: OrderInfo,
  siteOrigin: string
): Promise<void> {
  await Promise.allSettled([sendEmail(order, siteOrigin), sendWhatsApp(order)]);
}
