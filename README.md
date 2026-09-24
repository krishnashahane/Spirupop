# SpiruPop

Production-grade marketing + commerce site for **SpiruPop** — clean spirulina capsules boosted with targeted nutrients.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4.

## Payments

Checkout uses **direct UPI deep linking**, not Razorpay/Stripe.

- Checkout UI: `components/CheckoutModal.tsx`
- Order endpoint: `app/api/order/route.ts`
- UPI configuration: `lib/upi.ts`
- Desktop fallback QR: `public/payment-qr.png`
- Payee name: `SPIRUHOME GLOBAL SOLUTIONS`

### Deployment independence

The public checkout requires **no database, payment API key, CORS setup, or domain-specific source edit**.

The order endpoint validates the customer details and server-side tier price, generates a customer-facing order reference, and then moves directly to UPI payment.
Optional notification delivery runs in the background and can never prevent checkout.

## Optional admin dashboard

`/admin` can use PostgreSQL for persistent order management.

Optional environment variables:

- `DATABASE_URL` or `POSTGRES_URL`
- `ADMIN_PASSWORD` or `ADMIN_SECRET`
- `ORDER_ALERT_EMAIL`
- `WHATSAPP_TO`
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_ID`

See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Development

```bash
npm ci
npm run dev
npm run lint
npm run build
```
