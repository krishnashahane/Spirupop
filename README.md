# SpiruPop

Production-grade marketing + commerce site for **SpiruPop** — clean spirulina capsules boosted with targeted nutrients.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4.

## Pages

- `/` — Home (hero, purity journey, benefits, pricing/checkout, certifications)
- `/story` — Our Story
- `/science` — The science
- `/reviews` — Customer reviews
- `/journal` — Journal
- `/faq` — FAQ
- `/contact` — Contact form
- `/policies/*` — privacy · terms · refund · shipping · disclaimer
- `/admin` — protected order management

## Payments

Checkout uses **direct UPI deep linking**.

- Checkout UI: `components/CheckoutModal.tsx`
- Order creation: `app/api/order/route.ts`
- UPI configuration: `lib/upi.ts`
- Desktop fallback QR: `public/payment-qr.png`
- Payee VPA: `spiru.pop@kotak`
- Payee name: `SPIRUHOME GLOBAL SOLUTIONS`

The browser sends order details to the same-origin `/api/order` endpoint. The server validates the tier and address, persists the order in PostgreSQL, and only then moves the customer to the UPI payment step.

## Environment

Copy `.env.example` into your hosting provider's environment settings.

Required:

- `DATABASE_URL` (or `POSTGRES_URL`)
- `ADMIN_PASSWORD`
- `SITE_ORIGIN` for the canonical public hostname

Optional:

- `ORDER_ALERT_EMAIL`
- `WHATSAPP_TO`
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_ID`

Never commit real secrets.

## Production deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md).

Health check:

`/api/health`

## Development

```bash
npm ci
npm run dev
npm run lint
npm run build
```
