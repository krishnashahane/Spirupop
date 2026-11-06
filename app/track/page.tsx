"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import OrderCard, { type CustomerOrder } from "@/components/OrderCard";

const field =
  "w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-base outline-none focus:border-mauve sm:text-sm";

function TrackInner() {
  const params = useSearchParams();
  const linkId = params.get("id") ?? "";
  const linkToken = params.get("t") ?? "";

  const [form, setForm] = useState({ id: "", phone: "", pincode: "" });
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [claim, setClaim] = useState<"idle" | "done" | "error">("idle");
  const [claimMsg, setClaimMsg] = useState("");

  const lookup = useCallback(async (body: Record<string, string>) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.error || "We couldn't find that order.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (linkId && linkToken) lookup({ id: linkId, t: linkToken });
    fetch("/api/account/me", { cache: "no-store" })
      .then((r) => setLoggedIn(r.ok))
      .catch(() => {});
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [linkId, linkToken, lookup]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id.replace(/\D/g, "");
    if (!id) return setError("Enter your order number.");
    if (!/^\d{10}$/.test(form.phone)) return setError("Enter the 10-digit mobile used for the order.");
    if (!/^\d{6}$/.test(form.pincode)) return setError("Enter the 6-digit delivery PIN code.");
    lookup({ id, phone: form.phone, pincode: form.pincode });
  };

  const addToAccount = async () => {
    const res = await fetch("/api/account/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: linkId, t: linkToken }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok) setClaim("done");
    else {
      setClaim("error");
      setClaimMsg(data.error || "Couldn't add this order.");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-8 sm:py-16">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
        Order Tracking
      </p>
      <h1 className="mt-1 text-center font-display text-3xl font-extrabold sm:text-4xl">
        Track your order
      </h1>

      {order ? (
        <div className="mt-8">
          <OrderCard order={order} />
          {linkToken && String(order.id) === linkId && (
            <div className="mt-4 text-center">
              {loggedIn ? (
                claim === "done" ? (
                  <p className="text-sm font-semibold text-emerald-700">
                    Added to your account ✓{" "}
                    <Link href="/account" className="underline">
                      View My Orders
                    </Link>
                  </p>
                ) : (
                  <>
                    <button
                      onClick={addToAccount}
                      className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-black/30"
                    >
                      Add this order to my account
                    </button>
                    {claim === "error" && (
                      <p className="mt-2 text-xs text-red-600">{claimMsg}</p>
                    )}
                  </>
                )
              ) : (
                <p className="text-xs text-ink/55">
                  Bookmark this page to check status anytime, or{" "}
                  <Link href="/account" className="font-semibold text-ink underline">
                    create an account
                  </Link>{" "}
                  to keep all your orders together.
                </p>
              )}
            </div>
          )}
          <button
            onClick={() => {
              setOrder(null);
              setError(null);
            }}
            className="mx-auto mt-6 block text-xs font-semibold text-ink/55 underline"
          >
            Track a different order
          </button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          noValidate
          className="mt-8 space-y-3 rounded-3xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5 sm:p-8"
        >
          <p className="text-sm text-ink/60">
            Enter the order number shown at checkout, plus the mobile number and PIN
            code you used.
          </p>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <input
            inputMode="numeric"
            value={form.id}
            onChange={(e) => setForm((f) => ({ ...f, id: e.target.value.replace(/\D/g, "").slice(0, 15) }))}
            placeholder="Order number (e.g. 1042)"
            className={field}
          />
          <div className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 focus-within:border-mauve">
            <span className="text-sm font-semibold text-ink/60">+91</span>
            <input
              inputMode="numeric"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              placeholder="Mobile number"
              className="w-full bg-transparent py-3 text-base outline-none sm:text-sm"
            />
          </div>
          <input
            inputMode="numeric"
            autoComplete="postal-code"
            value={form.pincode}
            onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
            placeholder="Delivery PIN code"
            className={field}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-3.5 text-sm font-bold text-[#111111] shadow-md shadow-mauve/30 transition hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Track order"}
          </button>
          <p className="pt-1 text-center text-xs text-ink/50">
            Have an account?{" "}
            <Link href="/account" className="font-semibold text-ink underline">
              See My Orders
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <section className="bg-gradient-to-b from-white via-mauve/[0.05] to-aqua/[0.06]">
      <Suspense fallback={<p className="py-20 text-center text-sm text-ink/50">Loading…</p>}>
        <TrackInner />
      </Suspense>
    </section>
  );
}
