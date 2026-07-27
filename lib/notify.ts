// Order alerts to the shop owner. Email is fully automatic (via formsubmit.co,
// the same channel the contact form uses). WhatsApp is optional (CallMeBot) and
// only fires when CALLMEBOT_PHONE + CALLMEBOT_APIKEY are set.
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

const OWNER_EMAIL =
  process.env.ORDER_ALERT_EMAIL || "spiruhomeglobalsolutions@gmail.com";
const OWNER_WHATSAPP = process.env.WHATSAPP_TO || "917972452200";

const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://spirupop.vercel.app";

async function sendEmail(o: OrderInfo): Promise<void> {
  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(OWNER_EMAIL)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // FormSubmit ties submissions to an activated origin; without these it
        // rejects server-side calls.
        Origin: SITE_ORIGIN,
        Referer: `${SITE_ORIGIN}/`,
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
    });
  } catch (e) {
    console.error("email alert failed", e);
  }
}

// Official Meta WhatsApp Cloud API. Off until WHATSAPP_TOKEN + WHATSAPP_PHONE_ID
// are set; recipient defaults to the business number.
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
    await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: OWNER_WHATSAPP,
        type: "text",
        text: { body: text },
      }),
    });
  } catch (e) {
    console.error("whatsapp alert failed", e);
  }
}

export async function sendOrderAlert(o: OrderInfo): Promise<void> {
  await Promise.allSettled([sendEmail(o), sendWhatsApp(o)]);
}
