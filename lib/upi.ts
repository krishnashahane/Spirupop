// UPI app-specific deep links.
// Android uses package-targeted intents with an official Play Store fallback.
// iOS uses the documented app-specific UPI schemes with an App Store fallback.
//
// The merchant VPA is public by design and contains no secret.

export const UPI_VPA = "spiru.pop@kotak";
export const UPI_NAME = "SPIRUHOME GLOBAL SOLUTIONS";

export type UpiApp = {
  name: string;
  logo: string;
  pkg: string;
  iosScheme: string;
  iosId: string;
};

export const UPI_APPS: UpiApp[] = [
  {
    name: "Google Pay",
    logo: "/logos/googlepay.svg",
    pkg: "com.google.android.apps.nbu.paisa.user",
    iosScheme: "gpay://upi/pay",
    iosId: "1193357041",
  },
  {
    name: "PhonePe",
    logo: "/logos/phonepe.svg",
    pkg: "com.phonepe.app",
    iosScheme: "phonepe://upi/pay",
    iosId: "1170055821",
  },
  {
    name: "Paytm",
    logo: "/logos/paytm.svg",
    pkg: "net.one97.paytm",
    iosScheme: "paytm://upi/pay",
    iosId: "473941634",
  },
  {
    name: "FamApp",
    logo: "/logos/fampay.svg",
    pkg: "com.fampay.in",
    iosScheme: "famapp://pay",
    iosId: "1499806454",
  },
  {
    name: "super.money",
    logo: "/logos/supermoney.svg",
    pkg: "money.super.payments",
    iosScheme: "supermoney://pay",
    iosId: "6502597504",
  },
  {
    name: "WhatsApp Pay",
    logo: "/logos/whatsapp.svg",
    pkg: "com.whatsapp",
    iosScheme: "whatsapp://send",
    iosId: "310633997",
  },
];

export function upiQuery(amount: number, note: string): string {
  return (
    `pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(
      UPI_NAME
    )}&am=${encodeURIComponent(amount.toFixed(2))}&cu=INR&tn=${encodeURIComponent(note)}`
  );
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
  // Chrome/Android supports package-targeted UPI intents. The browser fallback
  // is the official Play Store page when that package is not installed.
  const store = playStoreUrl(app);
  const intent =
    `intent://pay?${query}#Intent;scheme=upi;package=${app.pkg};` +
    `S.browser_fallback_url=${encodeURIComponent(store)};end`;

  window.location.assign(intent);
}

function openIOS(app: UpiApp, query: string): void {
  const store = appStoreUrl(app);
  const launch = `${app.iosScheme}?${query}`;

  let handedOff = false;

  const markHandedOff = () => {
    handedOff = true;
  };

  document.addEventListener("visibilitychange", markHandedOff, { once: true });
  window.addEventListener("pagehide", markHandedOff, { once: true });
  window.addEventListener("blur", markHandedOff, { once: true });

  // Keep this navigation directly inside the original button gesture.
  window.location.assign(launch);

  // Safari has no supported synchronous API for checking whether an arbitrary
  // third-party app is installed. Give the app enough time to take focus before
  // sending an uninstalled-app user to the official App Store listing.
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", markHandedOff);
    window.removeEventListener("pagehide", markHandedOff);
    window.removeEventListener("blur", markHandedOff);

    if (!handedOff && !document.hidden) {
      window.location.assign(store);
    }
  }, 2500);
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

  // Desktop cannot launch mobile UPI applications. The checkout QR remains
  // available for payment from a phone.
}
