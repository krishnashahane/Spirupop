# SpiruPop

Production-grade marketing + commerce site for **SpiruPop** — clean spirulina capsules boosted with targeted nutrients.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4.

## Pages

- `/` — Home (hero, purity journey, benefits, pricing/checkout, certifications)
- `/story` — Our Story (pristine source · art of preservation · passion)
- `/science` — The science
- `/reviews` — Customer reviews
- `/journal` — Journal (LinkedIn articles)
- `/faq` — FAQ
- `/contact` — Contact form
- `/policies/*` — privacy · terms · refund · shipping · disclaimer

## Brand

Chartreuse `#CCFF00` · Mauve `#E0AFFF` · Aqua `#00FFF0` on ink/white. Logo + favicon: `public/logo.png` / `app/icon.jpg`.

## Email

Contact submissions are delivered to **support.spirupop@gmail.com** via
formsubmit.co. Confirm the address once on the first submission to activate delivery.

## Payments (UPI)

Checkout is a **direct UPI deep link** — no gateway, no server secrets, no card
data ever touches the site.

- Each pricing tier's **Add to Cart** opens `components/PaymentModal.tsx`.
- The primary action is a `upi://pay?...` intent that opens GPay / PhonePe / Paytm
  with the payee (`spiru.pop@kotak`, SPIRUHOME GLOBAL SOLUTIONS) and the exact
  amount pre-filled.
- Desktop fallback: the signed merchant QR (`public/payment-qr.png`).
- Buyers confirm via a prefilled WhatsApp message; SpiruPop never sees card or
  bank details.

## Security

- **Strict CSP** + hardening headers on every response (`proxy.ts`):
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy` (payment/camera/mic/geo disabled), `COOP`, and `HSTS`
  (production).
- No payment secrets, API keys, or server-side money handling — the UPI intent is
  client-only and the payee VPA is public by design.
- All external links (`upi:`, WhatsApp) use `rel="noopener noreferrer"`.
- Contact form honeypot anti-spam + client validation.
- 0 npm audit vulnerabilities (postcss override).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
