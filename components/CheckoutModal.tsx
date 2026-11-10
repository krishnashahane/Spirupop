"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { inr, type Tier } from "@/lib/tiers";
import { UPI_APPS, openUpiApp, type UpiApp } from "@/lib/upi";
import {
  errorText,
  isPhone,
  loadRazorpay,
  razorpayAppCode,
  type RzpCustom,
  type RzpStandard,
  type RzpSuccess,
} from "@/lib/razorpay-client";

type Step = "details" | "pay";
type PayState = "idle" | "waiting" | "paid";

type RazorpayInfo = { keyId: string; orderId: string; amount: number };

export default function CheckoutModal({
  tier,
  onClose,
}: {
  tier: Tier | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [order, setOrder] = useState<{
    amount: number;
    note: string;
    ref: string;
    trackUrl: string | null;
    razorpay: RazorpayInfo | null;
  } | null>(null);
  const [payState, setPayState] = useState<PayState>("idle");
  const [rzpReady, setRzpReady] = useState(false);
  const [phone, setPhone] = useState(false);
  const rzpRef = useRef<RzpCustom | null>(null);
  const rzpOrderRef = useRef<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    if (payState === "waiting") {
      try {
        rzpRef.current?.emit("payment.cancel");
      } catch {
        /* ignore */
      }
    }
    onClose();
  }, [payState, onClose]);


  useEffect(() => {
    if (!tier) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [tier, handleClose]);

  useEffect(() => {
    if (tier) {
      // Reset transient checkout state whenever a new tier opens the modal.
      /* eslint-disable react-hooks/set-state-in-effect */
      setStep("details");
      setError(null);
      setOrder(null);
      setCopied(false);
      setPayState("idle");
      setPhone(isPhone());
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [tier]);

  useEffect(() => {
    firstRef.current?.focus();
  }, [step]);

  // ------------------------------------------------------------ Razorpay

  // Confirms on the server (which re-checks with Razorpay) and shows success.
  const confirmPaid = useCallback(async (resp: RzpSuccess) => {
    try {
      const res = await fetch("/api/pay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resp),
      });
      const data = (await res.json().catch(() => ({}))) as { state?: string };
      if (data.state === "paid") {
        setPayState("paid");
        setError(null);
      }
      // Otherwise the status poll and the webhook finish the job.
    } catch {
      /* status poll continues */
    }
  }, []);

  const rzpOrderId = order?.razorpay?.orderId ?? null;
  const rzpKey = order?.razorpay?.keyId ?? null;

  // Load Razorpay as soon as the payment step opens, so tapping an app can
  // start the payment instantly inside the same tap.
  useEffect(() => {
    rzpOrderRef.current = rzpOrderId;
    if (step !== "pay" || !rzpKey) return;
    let alive = true;
    loadRazorpay()
      .then((Ctor) => {
        if (!alive) return;
        if (isPhone() && !rzpRef.current) {
          const inst = new Ctor({ key: rzpKey }) as RzpCustom;
          inst.on("payment.success", (r) => {
            const resp = r as RzpSuccess;
            if (resp.razorpay_order_id !== rzpOrderRef.current) return;
            void confirmPaid(resp);
          });
          inst.on("payment.error", (r) => {
            const { text } = errorText(r);
            setPayState((s) => (s === "paid" ? s : "idle"));
            setError(text);
          });
          rzpRef.current = inst;
        }
        setRzpReady(true);
      })
      .catch(() => {
        if (alive) setError("Couldn't load secure payment. Check your internet and try again.");
      });
    return () => {
      alive = false;
    };
  }, [step, rzpKey, rzpOrderId, confirmPaid]);

  // While the customer is in their UPI app, ask the server every few seconds.
  useEffect(() => {
    if (payState !== "waiting" || !rzpOrderId) return;
    let stopped = false;
    const started = Date.now();
    const tick = async () => {
      if (stopped) return;
      try {
        const res = await fetch("/api/pay/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_order_id: rzpOrderId }),
        });
        const data = (await res.json().catch(() => ({}))) as { state?: string };
        if (!stopped && data.state === "paid") {
          setPayState("paid");
          setError(null);
          return;
        }
      } catch {
        /* keep polling */
      }
      if (!stopped && Date.now() - started < 15 * 60 * 1000) {
        timer = window.setTimeout(tick, 4000);
      }
    };
    let timer = window.setTimeout(tick, 4000);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [payState, rzpOrderId]);

  // Phone: open the chosen UPI app through Razorpay (amount locked).
  const payWithApp = (app: UpiApp) => {
    if (!order) return;
    const rp = order.razorpay;
    if (!rp) {
      openUpiApp(app, order.amount, order.note);
      return;
    }
    const code = razorpayAppCode(app);
    const inst = rzpRef.current;
    if (!code || !inst) {
      setError("Secure payment is still loading. Please tap again in a moment.");
      return;
    }
    setError(null);
    setPayState("waiting");
    inst.createPayment(
      {
        amount: rp.amount,
        currency: "INR",
        method: "upi",
        contact: form.phone,
        order_id: rp.orderId,
      },
      { app: code }
    );
  };

  // Computer: Razorpay's own QR for this exact order and amount.
  const openDesktopQr = async () => {
    if (!order?.razorpay || !tier) return;
    const rp = order.razorpay;
    try {
      const Ctor = await loadRazorpay();
      const inst = new Ctor({
        key: rp.keyId,
        order_id: rp.orderId,
        amount: rp.amount,
        currency: "INR",
        name: "SpiruPop",
        description: `${tier.title} · Order #${order.ref}`,
        prefill: { name: form.name, contact: `+91${form.phone}` },
        handler: (resp: RzpSuccess) => void confirmPaid(resp),
        modal: {
          ondismiss: () => setPayState((s) => (s === "paid" ? s : "idle")),
        },
      }) as RzpStandard;
      inst.on("payment.failed", (r) => setError(errorText(r).text));
      setError(null);
      setPayState("waiting");
      inst.open();
    } catch {
      setError("Couldn't load secure payment. Check your internet and try again.");
    }
  };

  if (!tier) return null;

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(null);
    const { name, phone, address, city, state, pincode } = form;
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (
      name.trim().length < 2 ||
      address.trim().length < 6 ||
      city.trim().length < 2 ||
      state.trim().length < 2 ||
      !/^\d{6}$/.test(pincode)
    ) {
      setError("Please complete all fields (6-digit PIN).");
      return;
    }
    setLoading(true);

    // Payment itself is a direct UPI intent and must never be blocked by an
    // optional order-storage/notification service. Try the server endpoint
    // first so deployments with the optional order backend still get a real
    // server-side reference; if that service is unavailable, continue with a
    // local reference and take the customer directly to payment.
    let amount = tier.price;
    let orderRef = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    let trackUrl: string | null = null;
    let razorpay: RazorpayInfo | null = null;

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.id, ...form }),
      });

      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (res.ok) {
        const serverAmount = Number(data.amount);
        if (Number.isFinite(serverAmount) && serverAmount > 0) {
          amount = serverAmount;
        }
        if (data.orderId != null) {
          orderRef = String(data.orderId);
        }
        if (typeof data.trackPath === "string" && data.trackPath.startsWith("/track?")) {
          trackUrl = `${window.location.origin}${data.trackPath}`;
        }
        const rp = data.razorpay as Partial<RazorpayInfo> | null | undefined;
        if (
          rp &&
          typeof rp.keyId === "string" &&
          typeof rp.orderId === "string" &&
          Number.isFinite(Number(rp.amount))
        ) {
          razorpay = { keyId: rp.keyId, orderId: rp.orderId, amount: Number(rp.amount) };
        }
      } else {
        // With Razorpay enabled the order MUST be saved first, otherwise the
        // payment could never be matched to it. Show the server's message.
        if (data.razorpayRequired === true && typeof data.error === "string") {
          setLoading(false);
          setError(data.error);
          return;
        }
        console.warn("Optional order API unavailable; continuing to UPI payment.", {
          status: res.status,
        });
      }
    } catch (e) {
      console.warn(
        "Optional order API unreachable; continuing to UPI payment.",
        e
      );
    }

    setLoading(false);
    setOrder({
      amount,
      note: `SpiruPop ${tier.title} #${orderRef}`,
      ref: orderRef,
      trackUrl,
      razorpay,
    });
    setStep("pay");
  };

  const field =
    "w-full rounded-xl border border-black/15 px-3 py-3 text-sm outline-none focus:border-mauve";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Checkout — ${tier.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        aria-label="Close checkout"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/10 bg-gradient-to-r from-mauve/15 to-aqua/15 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
              Secure Checkout
            </p>
            <h3 className="mt-1 font-display text-xl font-extrabold">
              {tier.title}
            </h3>
            <p className="text-sm text-ink/55">
              {tier.sub} · {inr(tier.price)}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-ink/50 transition hover:bg-black/5 hover:text-ink"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 px-6 pt-4">
          {(["details", "pay"] as Step[]).map((s, i) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full transition ${
                (step === "pay" ? 1 : 0) >= i ? "bg-mauve" : "bg-black/10"
              }`}
            />
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* STEP 1 — details */}
          {step === "details" && (
            <div className="space-y-2.5">
              <input
                ref={firstRef}
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className={field}
              />
              <div className="flex items-center gap-2 rounded-xl border border-black/15 px-3 focus-within:border-mauve">
                <span className="text-sm font-semibold text-ink/60">+91</span>
                <input
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) =>
                    set("phone")(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10-digit mobile number"
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>
              <textarea
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                placeholder="Flat / House no., street, area"
                autoComplete="street-address"
                rows={2}
                className={`${field} resize-none`}
              />
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                  placeholder="City"
                  className={field}
                />
                <input
                  value={form.state}
                  onChange={(e) => set("state")(e.target.value)}
                  placeholder="State"
                  className={field}
                />
              </div>
              <input
                inputMode="numeric"
                value={form.pincode}
                onChange={(e) =>
                  set("pincode")(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit PIN code"
                autoComplete="postal-code"
                className={field}
              />
              <button
                onClick={submit}
                disabled={loading}
                className="btn-primary mt-1 w-full rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-3.5 text-sm font-bold text-[#111111] hover:brightness-95 disabled:opacity-60"
              >
                {loading ? "Saving…" : `Continue to Pay ${inr(tier.price)}`}
              </button>
              <p className="pt-1 text-center text-[11px] leading-relaxed text-ink/45">
                Your details are stored securely to fulfil this order only.
              </p>
            </div>
          )}

          {/* STEP 2 — pay */}
          {step === "pay" && order && (
            <div className="text-center">
              {payState === "paid" ? (
                <div className="rounded-2xl bg-emerald-50 px-4 py-5">
                  <p className="text-3xl" aria-hidden>
                    ✓
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold text-emerald-700">
                    Payment received
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {inr(order.amount)} paid for Order #{order.ref}. We&apos;ll
                    ship it soon.
                  </p>
                </div>
              ) : !order.razorpay ? (
                <>
                <div className="flex items-end justify-center gap-2">
                  <span className="font-display text-3xl font-extrabold">
                    {inr(order.amount)}
                  </span>
                  <span className="mb-1 text-sm font-medium text-ink/50">
                    payable
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">
                  Pay with
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => payWithApp(app)}
                      className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:border-black/20 hover:shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={app.logo}
                        alt=""
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px] shrink-0 object-contain"
                        aria-hidden
                      />
                      {app.name}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
                  Opens the app with the amount pre-filled. Not installed? We&apos;ll
                  take you to install it.
                </p>
                <div className="mt-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/35">
                  <span className="h-px flex-1 bg-black/10" />
                  On a computer? Scan
                  <span className="h-px flex-1 bg-black/10" />
                </div>
                <div className="mx-auto mt-3 w-32 rounded-2xl border border-black/10 bg-white p-2.5 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/payment-qr.png"
                    alt={`Scan to pay ${inr(order.amount)}`}
                    className="h-auto w-full rounded-lg"
                  />
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-ink/45">
                  Order saved. Complete the UPI payment to confirm. SpiruPop never
                  sees your card or bank details.
                </p>
                </>
              ) : (
                <>
                  <div className="flex items-end justify-center gap-2">
                    <span className="font-display text-3xl font-extrabold">
                      {inr(order.amount)}
                    </span>
                    <span className="mb-1 text-sm font-medium text-ink/50">
                      payable
                    </span>
                  </div>
                  {phone && payState === "waiting" ? (
                    <div className="mt-4 rounded-2xl border border-black/10 px-4 py-5">
                      <span className="mx-auto block h-6 w-6 animate-spin rounded-full border-2 border-mauve border-t-transparent" />
                      <p className="mt-3 text-sm font-semibold text-ink">
                        Complete the payment in your UPI app
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-ink/50">
                        This page updates automatically once your payment is
                        confirmed.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            rzpRef.current?.emit("payment.cancel");
                          } catch {
                            /* ignore */
                          }
                          setPayState("idle");
                        }}
                        className="mt-3 rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-ink transition hover:border-black/30"
                      >
                        Choose another app
                      </button>
                    </div>
                  ) : phone ? (
                    <>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">
                        Pay with
                      </p>
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {UPI_APPS.filter((app) => razorpayAppCode(app) !== null).map(
                          (app) => (
                            <button
                              key={app.name}
                              type="button"
                              disabled={!rzpReady}
                              onClick={() => payWithApp(app)}
                              className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:border-black/20 hover:shadow-sm disabled:opacity-50"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={app.logo}
                                alt=""
                                width={22}
                                height={22}
                                className="h-[22px] w-[22px] shrink-0 object-contain"
                                aria-hidden
                              />
                              {app.name}
                            </button>
                          )
                        )}
                      </div>
                      <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
                        {rzpReady
                          ? "Opens the app with the amount pre-filled."
                          : "Loading secure payment…"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mt-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/35">
                        <span className="h-px flex-1 bg-black/10" />
                        On a computer? Scan
                        <span className="h-px flex-1 bg-black/10" />
                      </div>
                      <button
                        type="button"
                        onClick={openDesktopQr}
                        disabled={!rzpReady}
                        className="btn-primary mt-3 w-full rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-3.5 text-sm font-bold text-[#111111] hover:brightness-95 disabled:opacity-60"
                      >
                        {rzpReady ? "Show payment QR" : "Loading secure payment…"}
                      </button>
                    </>
                  )}
                  <p className="mt-4 text-[11px] leading-relaxed text-ink/45">
                    Order saved. Complete the UPI payment to confirm. SpiruPop never
                    sees your card or bank details.
                  </p>
                </>
              )}
              {order.trackUrl && (
                <div className="mt-4 rounded-2xl border border-black/10 bg-gradient-to-r from-mauve/10 to-aqua/10 px-4 py-3 text-left">
                  <p className="text-xs font-bold text-ink">
                    Order #{order.ref} · Save your tracking link
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink/55">
                    Private link to check your order status anytime. You can also
                    track it with your order number, mobile and PIN code.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard
                          ?.writeText(order.trackUrl!)
                          .then(() => setCopied(true))
                          .catch(() => {});
                      }}
                      className="flex-1 rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:border-black/30"
                    >
                      {copied ? "Copied ✓" : "Copy link"}
                    </button>
                    <a
                      href={order.trackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full bg-ink px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-ink/85"
                    >
                      Track order
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
