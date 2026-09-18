# SpiruPop Production Deployment

## 1. Requirements

- Node.js compatible with the project's Next.js version
- A PostgreSQL-compatible database (Neon is supported)
- A deployment platform that supports Next.js App Router server routes

## 2. Install and build

```bash
npm ci
npm run lint
npm run build
```

## 3. Required environment variables

Set these in the hosting provider's production environment:

```text
DATABASE_URL=<your PostgreSQL connection string>
ADMIN_PASSWORD=<strong admin password>
SITE_ORIGIN=https://spirupop.com
```

Use `https://www.spirupop.com` instead when that is the canonical hostname.

`POSTGRES_URL` is also supported as the database variable.

## 4. Optional environment variables

```text
ORDER_ALERT_EMAIL=<order notification inbox>
WHATSAPP_TO=<recipient phone in international digits>
WHATSAPP_TOKEN=<Meta token>
WHATSAPP_PHONE_ID=<Meta WhatsApp phone ID>
```

The checkout does not require a payment API secret. The payment step uses the public UPI VPA configured in `lib/upi.ts`.

## 5. Database

The first successful order request creates the `sp_users` and `sp_orders` tables and required indexes if they do not already exist.

The same database must be used by the deployment that needs to view orders in `/admin`.

## 6. Verify the deployment

Open:

```text
https://YOUR-DOMAIN/api/health
```

Expected result:

```json
{
  "ok": true,
  "checks": {
    "database": true,
    "admin": true
  }
}
```

Then test:

1. Home page loads.
2. Pricing → Buy Now opens checkout.
3. Enter valid customer details.
4. Continue to Pay returns the UPI payment step.
5. UPI buttons open the selected app where supported.
6. Desktop QR is displayed.
7. The order appears in `/admin`.
8. Order alerts arrive when optional alert configuration is enabled.

## 7. Domain portability

The application does not hardcode `spirupop.vercel.app` for runtime API or checkout behavior.

Browser API calls use same-origin relative URLs such as `/api/order`.

Absolute public URLs are controlled by `SITE_ORIGIN` and default to `https://spirupop.com`.

## 8. External configuration source code cannot control

GitHub source code cannot automatically create or configure:

- DNS records for the production domain
- hosting-provider environment variables
- PostgreSQL credentials
- FormSubmit recipient activation
- Meta WhatsApp credentials
- the domain's TLS certificate

Those must be configured in the relevant service/account.

## 9. Important payment note

This project uses direct UPI intent links, not Razorpay/Stripe card checkout.

No card number, CVV, bank password, or payment-gateway secret is collected by the site.

The public merchant VPA is defined in `lib/upi.ts`.
