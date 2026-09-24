# SpiruPop Deployment

## Zero-configuration public checkout

The public website and direct UPI checkout do **not** require:
- a payment-provider API key
- Razorpay/Stripe configuration
- PostgreSQL credentials
- CORS configuration
- domain-specific source-code edits

Deploy the repository as a normal Next.js application.

## Build

```bash
npm ci
npm run lint
npm run build
npm start
```

## Environment variables

No environment variables are required for the public checkout.

Optional:

```text
SITE_ORIGIN=https://your-production-domain.example
```

Set SITE_ORIGIN only when you want a specific canonical hostname for metadata/sitemap/robots.

## Payment

Checkout uses direct UPI intents configured in `lib/upi.ts`.

The payment flow is:

1. Customer chooses a tier.
2. Checkout validates the delivery details.
3. `POST /api/order` validates the request.
4. The server returns an order reference and exact server-side tier price.
5. The customer immediately reaches the UPI payment screen.
6. UPI app buttons and the merchant QR work without database or payment-gateway credentials.

Notification delivery is best-effort and never blocks the customer from reaching payment.

## Optional order dashboard

The `/admin` dashboard uses PostgreSQL.

Configure:

```text
DATABASE_URL=<PostgreSQL connection string>
ADMIN_PASSWORD=<strong password>
```

Without these optional values, public checkout still works. The database is not part of the payment-critical path.

## Health check

Open:

```text
https://YOUR-DOMAIN/api/health
```

A healthy public checkout deployment reports `ok: true` and `checks.checkout: true`.

## Domain portability

The source code contains no payment-critical dependency on:
- spirupop.vercel.app
- spirupop.com
- localhost

Browser API calls are same-origin. Server-side notification URLs derive the request origin where available.

## External configuration

DNS, HTTPS/TLS, and optional database/admin settings are controlled by the deployment provider. They are not required for the public UPI checkout.
