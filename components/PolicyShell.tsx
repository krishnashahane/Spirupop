import Link from "next/link";

const POLICIES = [
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms & Conditions" },
  { href: "/policies/shipping", label: "Shipping & Fulfillment" },
  { href: "/policies/refund", label: "Refund & Cancellation" },
  { href: "/policies/disclaimer", label: "Medical Disclaimer" },
];

export default function PolicyShell({
  title,
  children,
  active,
}: {
  title: string;
  children: React.ReactNode;
  active: string;
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-mauve/[0.05] to-aqua/[0.06]">
      {/* subtle dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(17,17,17,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* soft color blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-mauve/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-aqua/15 blur-3xl" />

      <section className="relative mx-auto max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="mb-10 lg:mb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
          Legal
        </p>
        <nav className="mt-4 flex flex-col gap-1">
          {POLICIES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                active === p.href
                  ? "bg-ink text-white"
                  : "text-ink/70 hover:bg-neutral-100"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          {title}
        </h1>
        <div className="policy mt-8 max-w-3xl space-y-5 rounded-3xl border border-white/60 bg-white/70 p-6 leading-relaxed text-ink/75 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </div>
    </section>
    </div>
  );
}
