// UPI app routing.
//
// Android: app-specific intent:// URLs target the selected package.
// iOS: app-specific UPI URL schemes are used where known; generic upi://pay
// is used only as the fallback. The merchant VPA is public and contains no secret.

export const UPI_VPA = "spiru.pop@kotak";
export const UPI_NAME = "SPIRUHOME GLOBAL SOLUTIONS";

export type UpiApp = {
  name: string;
  logo: string;
  pkg: string;
  androidScheme?: string;
  iosScheme?: string;
  iosId: string;
};

export const UPI_APPS: UpiApp[] = [
  {
    name: "Google Pay",
    logo: "/logos/googlepay.svg",
    pkg: "com.google.android.apps.nbu.paisa.user",
    androidScheme: "upi",
    iosScheme: "tez://upi/pay",
    iosId: "1193357041",
  },
  {
    name: "PhonePe",
    logo: "/logos/phonepe.svg",
    pkg: "com.phonepe.app",
    androidScheme: "upi",
    iosScheme: "phonepe://upi/pay",
    iosId: "1170055821",
  },
  {
    name: "Paytm",
    logo: "/logos/paytm.svg",
    pkg: "net.one97.paytm",
    androidScheme: "upi",
    iosScheme: "paytm://upi/pay",
    iosId: "473941634",
  },
  {
    name: "FamApp",
    logo: "/logos/fampay.svg",
    pkg: "in.fampay.app",
    iosScheme: "in.fampay.app://",
    iosId: "1499806454",
  },
  {
    name: "super.money",
    logo: "/logos/supermoney.svg",
    pkg: "com.hsb.super",
    iosScheme: "super://",
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

function openUrl(url: string): void {
  // Must run directly from the user's tap to satisfy mobile browser gesture
  // requirements for external-app launches.
  window.location.assign(url);
}

export function openUpiApp(app: UpiApp, amount: number, note: string): void {
  const query = upiQuery(amount, note);
  const android = isAndroid();
  const ios = isIOS();

  // Desktop: don't navigate to a mobile-only URI. The QR remains visible.
  if (!android && !ios) return;

  const store = android
    ? `https://play.google.com/store/apps/details?id=${encodeURIComponent(app.pkg)}`
    : `https://apps.apple.com/app/id${app.iosId}`;

  let launch: string;

  if (android) {
    // Android Chrome understands intent:// and can target one exact package.
    launch = `intent://pay?${query}#Intent;scheme=upi;package=${app.pkg};end`;
  } else if (app.iosScheme) {
    // iOS requires the PSP's own URL scheme for deterministic app selection.
    // Do not use phonepe://pay or paytmmp://pay on iOS; those are the Android
    // forms and can be rejected by Safari as an invalid address.
    launch = `${app.iosScheme}?${query}`;
  } else {
    // No known app-specific iOS scheme: never fabricate one.
    // Send the user to the app's App Store page rather than Safari's
    // "address is invalid" page.
    window.location.assign(store);
    return;
  }

  let switched = false;
  const markSwitched = () => {
    switched = true;
  };

  document.addEventListener("visibilitychange", markSwitched, { once: true });
  window.addEventListener("pagehide", markSwitched, { once: true });
  window.addEventListener("blur", markSwitched, { once: true });

  openUrl(launch);

  // If iOS/Android did not hand the page to an app, give the user a useful
  // destination instead of leaving a broken custom-scheme URL in Safari.
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", markSwitched);
    window.removeEventListener("pagehide", markSwitched);
    window.removeEventListener("blur", markSwitched);

    if (!switched && !document.hidden) {
      window.location.assign(store);
    }
  }, 1800);
}
