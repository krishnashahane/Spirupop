"use client";

import { useCallback, useEffect, useState } from "react";

type Order = {
  id: number;
  item_title: string;
  amount: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  created_at: string;
};

const STATUSES = [
  "awaiting_payment",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLE: Record<string, string> = {
  awaiting_payment: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json().catch(() => ({}));
    setOrders(Array.isArray(data.orders) ? data.orders : []);
    setAuthed(true);
  }, []);

  useEffect(() => {
    // Fetch orders once on mount; state updates happen after the awaited fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const login = async () => {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Incorrect password.");
      return;
    }
    setPassword("");
    load();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setOrders([]);
  };

  const setStatus = async (id: number, status: string) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  if (authed === null) {
    return (
      <main className="grid min-h-screen place-items-center text-ink/40">
        Loading…
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center bg-mauve/5 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-8 shadow-xl">
          <h1 className="font-display text-2xl font-extrabold">Admin</h1>
          <p className="mt-1 text-sm text-ink/55">
            Enter the admin password to view orders.
          </p>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Password"
            autoFocus
            className="mt-4 w-full rounded-xl border border-black/15 px-3 py-3 text-sm outline-none focus:border-mauve"
          />
          <button
            onClick={login}
            disabled={loading}
            className="btn-primary mt-4 w-full rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-3.5 text-sm font-bold text-[#111111] hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Orders</h1>
          <p className="text-sm text-ink/55">{orders.length} total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]"
          >
            Refresh
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-black/[0.03] text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Delivery address</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-black/5 align-top">
                <td className="px-4 py-3 font-semibold">{o.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                  {new Date(o.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-3">{o.item_title}</td>
                <td className="px-4 py-3 font-semibold">₹{o.amount}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.name}</div>
                  <a
                    href={`tel:+91${o.phone}`}
                    className="text-ink/60 underline"
                  >
                    +91 {o.phone}
                  </a>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {o.address}, {o.city}, {o.state} - {o.pincode}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLE[o.status] || "bg-black/5 text-ink/60"
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink/40">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
