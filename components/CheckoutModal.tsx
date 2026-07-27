"use client";

import { useEffect, useRef, useState } from "react";
import { inr, type Tier } from "@/lib/tiers";
import { UPI_APPS, openUpiApp } from "@/lib/upi";

type Step = "details" | "pay";

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
  const [order, setOrder] = useState<{ amount: number; note: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tier) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [tier, onClose]);

  useEffect(() => {
    if (tier) {
      // Reset transient checkout state whenever a new tier opens the modal.
      /* eslint-disable react-hooks/set-state-in-effect */
      setStep("details");
      setError(null);
      setOrder(null);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [tier]);

  useEffect(() => {
    firstRef.current?.focus();
  }, [step]);

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
    let data: Record<string, unknown> = {};
    let ok = false;
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.id, ...form }),
      });
      data = await res.json().catch(() => ({}));
      ok = res.ok;
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
      return;
    }
    setLoading(false);
    if (!ok) return setError(String(data.error || "Could not place order."));
    const amount = Number(data.amount) || tier.price;
    setOrder({ amount, note: `SpiruPop ${tier.title} #${String(data.orderId)}` });
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
        onClick={onClose}
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
            onClick={onClose}
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
                    onClick={() => openUpiApp(app, order.amount, order.note)}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
