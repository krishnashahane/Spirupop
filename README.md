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

## Admin dashboard

Open `/admin` and sign in with the admin password. The password is set in
`lib/admin.ts` (`ADMIN_PASSWORD`); no environment variable is needed.

Listing orders on `/admin` uses PostgreSQL (optional).

Optional environment variables:

- `DATABASE_URL` or `POSTGRES_URL`
- `ORDER_ALERT_EMAIL`
- `WHATSAPP_TO`
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_ID`

See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Development

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/krishnashahane/Spirupop.git
cd Spirupop
npm ci
npm run dev        # http://localhost:3000  ·  admin: http://localhost:3000/admin
npm run lint
npm run build
```
