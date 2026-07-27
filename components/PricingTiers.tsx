"use client";

import { useState } from "react";
import Image from "next/image";
import CheckoutModal from "./CheckoutModal";
import { TIERS, inr, type Tier } from "@/lib/tiers";

export default function PricingTiers() {
  const [active, setActive] = useState<Tier | null>(null);
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-gradient-to-b from-white via-mauve/[0.05] to-white py-20 scroll-mt-24"
    >
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
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-mauve/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-aqua/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
            Begin Your Ritual
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Choose your biological cycle.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.id}
              className={`group relative flex flex-col items-center text-center rounded-3xl p-8 transition hover:-translate-y-1.5 ${
                t.best
                  ? "border-2 border-mauve bg-gradient-to-b from-mauve/15 to-white shadow-xl shadow-mauve/20"
                  : "border border-black/10 bg-white hover:shadow-lg"
              }`}
            >
              {t.badge && (
                <span className="absolute -top-3 left-1/2 w-[calc(100%-2rem)] max-w-max -translate-x-1/2 rounded-full bg-mauve px-4 py-1 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-[#111111] sm:text-[11px]">
                  ⭐ {t.badge}
                </span>
              )}
              <div className="mb-6 flex h-44 items-end justify-center">
                <Image
                  src={t.img}
                  alt={t.title}
                  width={t.imgW}
                  height={t.imgH}
                  sizes="(max-width: 1024px) 90vw, 360px"
                  className="h-full w-auto object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-display text-2xl font-extrabold">{t.title}</h3>
              <p className="mt-1 text-sm font-medium text-ink/55">{t.sub}</p>
              <div className="mt-6 flex items-end justify-center gap-3">
                <span className="font-display text-4xl font-extrabold">
                  {inr(t.price)}
                </span>
                <span className="mb-1.5 text-lg text-ink/40 line-through">
                  {inr(t.mrp)}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm text-ink/65">{t.micro}</p>
              <button
                type="button"
                onClick={() => setActive(t)}
                className="btn-primary mt-7 mx-auto block w-full rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-3.5 text-center text-sm font-bold text-[#111111] hover:brightness-95"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
      <CheckoutModal tier={active} onClose={() => setActive(null)} />
    </section>
  );
}
