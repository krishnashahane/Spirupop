// Client-side UPI deep-linking. Opens the exact chosen app with the amount
// pre-filled, paying to the SpiruPop VPA; falls back to the app store when the
// app isn't installed. Apps with a public URL scheme use it (reliable across
// browsers, never grabbed by another UPI handler like WhatsApp); the rest use
// an Android package intent. A JS timeout is the universal "not installed"
// safety net so the user never lands on an "address invalid" error.
export const UPI_VPA = "spiru.pop@kotak";
export const UPI_NAME = "SPIRUHOME GLOBAL SOLUTIONS";

export type UpiApp = {
  name: string;
  logo: string;
  pkg: string;
  scheme?: string; // app's own URL scheme (works on iOS + Android)
  iosId: string;
};

export const UPI_APPS: UpiApp[] = [
  {
    name: "Google Pay",
    logo: "/logos/googlepay.svg",
    pkg: "com.google.android.apps.nbu.paisa.user",
    scheme: "tez://upi/pay",
    iosId: "1193357041",
  },
  {
    name: "PhonePe",
    logo: "/logos/phonepe.svg",
    pkg: "com.phonepe.app",
    scheme: "phonepe://pay",
    iosId: "1170055821",
  },
  {
    name: "Paytm",
    logo: "/logos/paytm.svg",
    pkg: "net.one97.paytm",
    scheme: "paytmmp://pay",
    iosId: "473941634",
  },
  {
    name: "FamApp",
    logo: "/logos/fampay.svg",
    pkg: "com.fampay.in",
    iosId: "1499806454",
  },
  {
    name: "super.money",
    logo: "/logos/supermoney.svg",
    pkg: "money.super.payments",
    iosId: "6502597504",
  },
  {
    name: "WhatsApp Pay",
    logo: "/logos/whatsapp.svg",
    pkg: "com.whatsapp",
    iosId: "310633997",
  },
];

export function upiQuery(amount: number, note: string): string {
  return `pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(
    UPI_NAME
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export function genericUpiHref(amount: number, note: string): string {
  return `upi://pay?${upiQuery(amount, note)}`;
}

// Opens the app; if it isn't installed (page still visible after a beat),
// routes to its store listing to install.
export function openUpiApp(app: UpiApp, amount: number, note: string): void {
  const query = upiQuery(amount, note);
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isAndroid = /android/i.test(ua);
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (typeof navigator !== "undefined" &&
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1);

  // Desktop / unknown: hand off to any UPI handler (or the QR is available).
  if (!isAndroid && !isIOS) {
    window.location.href = genericUpiHref(amount, note);
    return;
  }

  const store = isAndroid
    ? `https://play.google.com/store/apps/details?id=${app.pkg}`
    : `https://apps.apple.com/app/id${app.iosId}`;

  // Build the launch URL that targets THIS app specifically.
  let launch: string;
  if (app.scheme) {
    launch = `${app.scheme}?${query}`;
  } else if (isAndroid) {
    // No public scheme — target the exact package (never a upi:// chooser, so
    // it can't be grabbed by WhatsApp Pay).
    launch = `intent://pay?${query}#Intent;scheme=upi;package=${app.pkg};end`;
  } else {
    // iOS without a scheme: can't deep-link — send to install/open page.
    window.location.href = store;
    return;
  }

  // If the app takes over (page hidden / blurred) we cancel the store fallback.
  let switched = false;
  const cancel = () => {
    switched = true;
  };
  document.addEventListener("visibilitychange", cancel, { once: true });
  window.addEventListener("pagehide", cancel, { once: true });
  window.addEventListener("blur", cancel, { once: true });

  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", cancel);
    window.removeEventListener("pagehide", cancel);
    window.removeEventListener("blur", cancel);
    if (!switched && !document.hidden) window.location.href = store;
  }, 1400);

  window.location.href = launch;
}
