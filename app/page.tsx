import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import IngredientTicker from "@/components/IngredientTicker";
import PricingTiers from "@/components/PricingTiers";

const PILLARS = [
  { title: "Hair Longevity & Volume", img: "/pillar-hair.png" },
  { title: "Dermal Elasticity & Radiance", img: "/pillar-dermal.png" },
  { title: "Keratin Repair & Strength", img: "/pillar-nail.png" },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-mauve/30 via-aqua/10 to-mauve/20">
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[92vh] w-full overflow-hidden">
        {/* Full-bleed hero video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/home-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Overlaid text */}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8">
          <div className="fade-up max-w-2xl">
            <span className="inline-flex items-center whitespace-nowrap gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-mauve" /> 12-in-1 Cellular Ritual
            </span>
            <h1 className="mt-6 font-display text-[2.9rem] font-semibold leading-[1.02] tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-[4.6rem]">
              Look Better.
              <br />
              Feel Stronger.
              <br />
              <em className="font-medium italic text-white/70">Age Smarter.</em>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.4)]">
              Science-backed nutrition designed to support healthier hair,
              stronger nails, and vibrant skin from within.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="#pricing"
                className="btn-primary group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mauve to-aqua px-8 py-4 text-sm font-bold text-[#111111]"
              >
                Experience SpiruPop
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </Link>
              <span className="text-sm font-medium text-white/75">
                <span className="text-emerald-400">✓</span> FSSAI Approved |{" "}
                <span className="text-emerald-400">✓</span> 100% Plant-Based
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5 — TRUST MATRIX (THE VALIDATION) */}
      <section className="relative overflow-hidden border-b border-black/5 bg-gradient-to-b from-white via-mauve/[0.04] to-white py-10 sm:py-12">
        {/* subtle dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(17,17,17,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Certified. Trusted. Approved.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink/55">
              Credentials that match our promise — every standard independently
              verified by our manufacturing partners.
            </p>
          </div>
          <div className="relative mx-auto mt-7 aspect-[1468/713] w-full max-w-3xl">
            <Image
              src="/badges/grid.png"
              alt="GMP Certified, FSSAI Licensed, Science-Backed, Gluten Free, 100% Vegan, Clean Label, Non-GMO, No Artificial Additives, Third Party Tested, Made in India"
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* SECTION 1.6 — BOTANICALS SPOTLIGHT */}
      <section className="relative overflow-hidden bg-white py-9 sm:py-12">
        <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
          <div className="px-2 py-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mauve to-aqua px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#111111] shadow-sm">
              ◆ The Formula
            </span>
            <p className="mt-6 font-cursive text-5xl font-semibold leading-none sm:text-6xl">
              <span className="bg-gradient-to-br from-aqua via-mauve to-purple-600 bg-clip-text text-transparent">
                12 bio-active botanicals
              </span>
            </p>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-ink/60">
              One daily pop. Twelve targeted botanicals working in synergy — for
              healthier hair, stronger nails, and radiant skin from within.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 1.7 — INGREDIENT SCROLLER */}
      <IngredientTicker />

      {/* SECTION 3 — PHILOSOPHY */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/modern-nutrition.png')" }}
        />
        {/* Soft scrim for legibility */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 md:py-28">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold text-ink drop-shadow-sm sm:text-4xl">
              Modern Nutrition is Compromised.
            </h2>
            <p className="mt-5 bg-gradient-to-br from-aqua via-mauve to-purple-600 bg-clip-text font-display text-lg font-semibold italic leading-relaxed text-transparent">
              SpiruPop is built to fix this.
            </p>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
              We believe staying healthy shouldn&apos;t require complicated
              routines or a dozen different pills. To solve this, we combined
              pure Indian Spirulina with 11 time-tested natural botanicals into
              one powerful daily capsule. It is honest, uncompromised nutrition
              engineered to fuel cellular renewal and restore your body&apos;s
              structural vitality from the inside out.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4 — BENEFIT PILLARS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-mauve/[0.06] to-white py-12 sm:py-16">
        {/* ambient color blobs */}
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-mauve/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-mauve/20 blur-3xl" />
        {/* faint dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(17,17,17,0.045) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mauve to-aqua px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#111111] shadow-sm">
              ◆ The SpiruPop Effect ◆
            </span>
            <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Beauty,{" "}
              <em className="bg-gradient-to-br from-aqua via-mauve to-purple-600 bg-clip-text font-extrabold italic text-transparent">
                Engineered
              </em>{" "}
              from Within.
            </h2>
            <p className="mt-4 text-lg text-ink/60">
              Science-backed. Nutrient-rich. Naturally effective.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-24 bg-gradient-to-r from-transparent to-mauve/70" />
              <span className="text-mauve">◆</span>
              <span className="h-px w-24 bg-gradient-to-l from-transparent to-mauve/70" />
            </div>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-3 lg:gap-8">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className="group relative h-full overflow-hidden rounded-[1.6rem] border border-white/70 bg-white p-2 shadow-[0_18px_50px_-24px_rgba(17,17,17,0.35)] ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-28px_rgba(17,17,17,0.45)]">
                  <div className="relative aspect-[1700/1000] overflow-hidden rounded-[1.15rem] border border-black/[0.07] ring-1 ring-black/[0.03]">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — RAW SYNERGY */}
      <section className="relative overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/raw-potency.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Legibility scrim */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-28 text-center sm:px-8 md:py-36">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] sm:text-4xl">
              Raw. Whole. Uncompromised Potency.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
              We choose to use pure, raw botanical powders rather than chemically
              stripped extracts. By preserving each plant in its whole, natural
              form, we deliver the complete spectrum of co-factors, micronutrients,
              and enzymes exactly as nature intended. Furthermore, our premium
              opaque light aqua blue HPMC vegetable capsules are specifically
              engineered to shield these light-sensitive botanicals from UV
              degradation, ensuring maximum potency until the moment they are
              consumed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 6 — PRICING */}
      <PricingTiers />

      {/* SECTION 7 — FULFILLMENT INTEGRITY */}
      <section className="relative overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/dispatch-premium.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-36">
          <Reveal>
            <div className="max-w-xl text-left">
              <span className="inline-block rounded-full bg-aqua px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#111111]">
                ✓ Complimentary Pan-India Delivery Activated
              </span>
              <h2 className="mt-6 font-display text-3xl font-extrabold text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] sm:text-4xl">
                On-Demand Premium Dispatch.
              </h2>
              <p className="mt-5 leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
                To guarantee the absolute freshness and structural integrity of
                our raw botanical capsules, every single order is processed and
                packaged individually. Your shipment is handled directly by our
                priority courier networks, ensuring your soft-mauve SpiruPop
                bottle arrives in pristine condition. Tracking metrics will be
                sent straight to your phone the moment your package is
                hand-dispatched.
              </p>
              <Link
                href="/science"
                className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-white hover:gap-2"
              >
                Explore the 12-in-1 Formula <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
