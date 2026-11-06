"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import OrderCard, { type CustomerOrder } from "@/components/OrderCard";

type Customer = { name: string; email: string };
type Mode = "login" | "signup";

const field =
  "w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-base outline-none focus:border-mauve sm:text-sm";

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/account/me", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.customer) {
        setCustomer(data.customer);
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        setCustomer(null);
        setOrders([]);
      }
    } catch {
      setCustomer(null);
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && form.name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/account/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup"
            ? form
            : { email: form.email, password: form.password }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setForm({ name: "", email: "", password: "" });
        await load();
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const logout = async () => {
    await fetch("/api/account/logout", { method: "POST" }).catch(() => {});
    setCustomer(null);
    setOrders([]);
  };

  return (
    <section className="bg-gradient-to-b from-white via-mauve/[0.05] to-aqua/[0.06]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
        {!checked ? (
          <p className="py-20 text-center text-sm text-ink/50">Loading…</p>
        ) : customer ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                  My Account
                </p>
                <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
                  Hi, {customer.name.split(" ")[0]}
                </h1>
                <p className="mt-1 break-all text-sm text-ink/55">{customer.email}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-black/30"
              >
                Log out
              </button>
            </div>

            <h2 className="mt-10 font-display text-xl font-extrabold">My Orders</h2>
            {orders.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-black/15 bg-white/70 p-8 text-center">
                <p className="text-sm text-ink/60">
                  No orders yet. Orders you place while logged in show up here.
                </p>
                <Link
                  href="/#pricing"
                  className="mt-4 inline-block rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-3 text-sm font-bold text-[#111111] shadow-md shadow-mauve/30"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {orders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
            <p className="mt-6 text-center text-xs text-ink/50">
              Ordered as a guest?{" "}
              <Link href="/track" className="font-semibold text-ink underline">
                Track it here
              </Link>{" "}
              and add it to your account.
            </p>
          </>
        ) : (
          <div className="mx-auto max-w-md">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
              <h1 className="text-center font-display text-2xl font-extrabold sm:text-3xl">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1 text-center text-sm text-ink/55">
                {mode === "login"
                  ? "Log in to view and track your orders."
                  : "Track all your SpiruPop orders in one place."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-black/[0.04] p-1">
                {(["login", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setError(null);
                    }}
                    className={`rounded-full py-2 text-sm font-semibold transition ${
                      mode === m ? "bg-white text-ink shadow-sm" : "text-ink/55"
                    }`}
                  >
                    {m === "login" ? "Log in" : "Sign up"}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                )}
                {mode === "signup" && (
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Full name"
                    autoComplete="name"
                    className={field}
                  />
                )}
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Email address"
                  autoComplete="email"
                  inputMode="email"
                  className={field}
                />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={mode === "signup" ? "Password (min 8 characters)" : "Password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className={field}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-3.5 text-sm font-bold text-[#111111] shadow-md shadow-mauve/30 transition hover:brightness-95 disabled:opacity-60"
                >
                  {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
                </button>
              </form>
            </div>

            <div className="mt-5 rounded-3xl border border-black/10 bg-white/70 p-5 text-center">
              <p className="text-sm font-semibold text-ink">Ordered as a guest?</p>
              <p className="mt-1 text-xs text-ink/55">
                No account needed — track with your order number, mobile and PIN code.
              </p>
              <Link
                href="/track"
                className="mt-3 inline-block rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-black/30"
              >
                Track an order
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
