// UPI app-specific deep links.
//
// Android:
//   Uses Chrome-compatible intent:// URLs targeting the selected package.
//   Includes S.browser_fallback_url so an uninstalled app goes to Play Store.
//
// iOS:
//   Uses documented UPI schemes for Google Pay, PhonePe and Paytm.
//   FamApp, super.money and WhatsApp Pay are sent to their official App Store
//   listing on iOS because a verified web-to-payment scheme is not available in
//   the sources used for this build. Android package-targeted payment intents
//   remain enabled for all six apps.
//   Safari does not expose a supported general-purpose "is this app installed?"
//   API for arbitrary third-party apps.
//
// The merchant VPA is public by design and contains no secret.

export const UPI_VPA = "spiru.pop@kotak";
export const UPI_NAME = "SPIRUHOME GLOBAL SOLUTIONS";

export type UpiApp = {
  name: string;
  logo: string;
  pkg: string;
  iosScheme?: string;
  iosId: string;
  // iOS direct payment is enabled only for schemes documented by the app/payment
  // provider. Android package targeting remains available for every listed app.
  iosDirectPayment: boolean;
};

export const UPI_APPS: UpiApp[] = [
  {
    name: "Google Pay",
    logo: "/logos/googlepay.svg",
    pkg: "com.google.android.apps.nbu.paisa.user",
    iosScheme: "gpay://upi/pay",
    iosId: "1193357041",
    iosDirectPayment: true,
  },
  {
    name: "PhonePe",
    logo: "/logos/phonepe.svg",
    pkg: "com.phonepe.app",
    iosScheme: "phonepe://upi/pay",
    iosId: "1170055821",
    iosDirectPayment: true,
  },
  {
    name: "Paytm",
    logo: "/logos/paytm.svg",
    pkg: "net.one97.paytm",
    iosScheme: "paytm://upi/pay",
    iosId: "473941634",
    iosDirectPayment: true,
  },
  {
    name: "FamApp",
    logo: "/logos/fampay.svg",
    pkg: "com.fampay.in",
    iosId: "1499806454",
    iosDirectPayment: false,
  },
  {
    name: "super.money",
    logo: "/logos/supermoney.svg",
    pkg: "money.super.payments",
    iosId: "6502597504",
    iosDirectPayment: false,
  },
  {
    name: "WhatsApp Pay",
    logo: "/logos/whatsapp.svg",
    pkg: "com.whatsapp",
    iosId: "310633997",
    iosDirectPayment: false,
  },
];

export function upiQuery(amount: number, note: string): string {
  return `pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(
    UPI_NAME
  )}&am=${encodeURIComponent(amount.toFixed(2))}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export function genericUpiHref(amount: number, note: string): string {
  return `upi://pay?${upiQuery(amount, note)}`;
}

function isAndroid(): boolean {
  return typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function appStoreUrl(app: UpiApp): string {
  return `https://apps.apple.com/in/app/id${app.iosId}`;
}

function playStoreUrl(app: UpiApp): string {
  return `https://play.google.com/store/apps/details?id=${encodeURIComponent(
    app.pkg
  )}`;
}

function openAndroid(app: UpiApp, query: string): void {
  const store = playStoreUrl(app);
  const intent =
    `intent://pay?${query}#Intent;scheme=upi;package=${app.pkg};` +
    `S.browser_fallback_url=${encodeURIComponent(store)};end`;

  // Keep this inside the original button gesture.
  window.location.href = intent;
}

function openIOS(app: UpiApp, query: string): void {
  const store = appStoreUrl(app);

  // Only use a verified/documented web-to-iOS UPI payment scheme.
  // For apps without one, go to the official App Store listing rather than
  // sending Safari an unsupported custom URI that can trigger an invalid-address
  // error or open the app without a payment request.
  if (!app.iosDirectPayment || !app.iosScheme) {
    window.location.assign(store);
    return;
  }

  const launch = `${app.iosScheme}?${query}`;

  let handedOff = false;

  const markHandedOff = () => {
    handedOff = true;
  };

  document.addEventListener("visibilitychange", markHandedOff, { once: true });
  window.addEventListener("pagehide", markHandedOff, { once: true });
  window.addEventListener("blur", markHandedOff, { once: true });

  window.location.href = launch;

  // Safari does not provide a supported way for a web page to synchronously
  // query whether another app is installed. When no app handles the scheme,
  // redirect to the official App Store listing after a short grace period.
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", markHandedOff);
    window.removeEventListener("pagehide", markHandedOff);
    window.removeEventListener("blur", markHandedOff);

    if (!handedOff && !document.hidden) {
      window.location.href = store;
    }
  }, 1200);
}

export function openUpiApp(app: UpiApp, amount: number, note: string): void {
  const query = upiQuery(amount, note);

  if (isAndroid()) {
    openAndroid(app, query);
    return;
  }

  if (isIOS()) {
    openIOS(app, query);
    return;
  }

  // Desktop cannot launch a mobile application. Leave the customer on the
  // checkout screen so the visible merchant QR remains available.
}
