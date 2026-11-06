import { inr } from "@/lib/tiers";

export type CustomerOrder = {
  id: number;
  item_title: string;
  amount: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  created_at: string;
};

const STEPS = [
  { key: "awaiting_payment", label: "Order placed" },
  { key: "paid", label: "Payment confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const LABEL: Record<string, string> = {
  awaiting_payment: "Awaiting payment confirmation",
  paid: "Payment confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const BADGE: Record<string, string> = {
  awaiting_payment: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function OrderCard({ order }: { order: CustomerOrder }) {
  const cancelled = order.status === "cancelled";
  const current = Math.max(0, STEPS.findIndex((s) => s.key === order.status));
  const date = new Date(order.created_at);

  return (
    <article className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
            Order #{order.id}
          </p>
          <h3 className="mt-1 font-display text-lg font-extrabold leading-snug">
            {order.item_title}
          </h3>
          <p className="text-sm text-ink/55">
            {inr(order.amount)} ·{" "}
            {Number.isNaN(date.getTime())
              ? ""
              : date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            BADGE[order.status] ?? "bg-black/5 text-ink/70"
          }`}
        >
          {LABEL[order.status] ?? order.status}
        </span>
      </div>

      {!cancelled && (
        <ol className="mt-5 grid grid-cols-4 gap-1.5" aria-label="Order progress">
          {STEPS.map((s, i) => {
            const done = i <= current;
            return (
              <li key={s.key} className="min-w-0">
                <span
                  className={`block h-1.5 rounded-full ${
                    done ? "bg-gradient-to-r from-mauve to-aqua" : "bg-black/10"
                  }`}
                />
                <span
                  className={`mt-1.5 block text-[10px] leading-tight sm:text-xs ${
                    done ? "font-semibold text-ink" : "text-ink/40"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-4 border-t border-black/5 pt-3 text-xs leading-relaxed text-ink/55">
        <span className="font-semibold text-ink/70">Deliver to:</span> {order.name},{" "}
        {order.address}, {order.city}, {order.state} – {order.pincode}
      </p>
    </article>
  );
}
