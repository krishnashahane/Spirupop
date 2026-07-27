import type { Metadata } from "next";
import Link from "next/link";
import ScienceGrid from "@/components/ScienceGrid";
import IngredientOrbit from "@/components/IngredientOrbit";

const SPIRULINA_METRICS = [
  {
    title: "The Oxygenator",
    body: "Naturally contains exceptionally high concentrations of Chlorophyll — the deep green pigment that assists in cellular oxygenation and internal purification.",
  },
  {
    title: "Complete Protein Matrix",
    body: "One of the rare plant sources on earth to contain all essential amino acids, providing the exact building blocks required to synthesize keratin.",
  },
  {
    title: "Phycocyanin Armor",
    body: "Infused with Phycocyanin, a potent antioxidant unique to blue-green algae, engineered by nature to neutralize free radicals before they age your cells.",
  },
];

export const metadata: Metadata = {
  title: "The Science & Ingredients Matrix",
  description:
    "The 12-in-1 synergistic formula. Every ingredient accounted for, purely dosed for daily performance — Spirulina, Curcuma Longa, Biotin, Moringa, Amla and more.",
};

export default function SciencePage() {
  return (
    <div className="bg-gradient-to-b from-mauve/30 via-aqua/10 to-mauve/20">
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
          The Ingredients Matrix
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          The 12-in-1 Synergistic Formula
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/70">
          Every ingredient accounted for. Purely dosed for daily performance.
          <br />
          Tap any botanical to reveal its precise scientific breakdown.
        </p>

        <div className="mt-12">
          <ScienceGrid />
        </div>

        {/* 12-botanical orbit */}
        <div className="mt-20 rounded-3xl border border-white/50 bg-white/50 px-5 py-12 shadow-sm backdrop-blur-sm">
          <div className="text-center">
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-ink/45">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-mauve/70" />
              The Full Spectrum
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-mauve/70" />
            </p>
            <h2 className="mt-4 font-display text-4xl font-light italic leading-[1.05] tracking-tight text-ink sm:text-6xl">
              <span className="bg-gradient-to-br from-aqua via-mauve to-purple-600 bg-clip-text font-semibold not-italic text-transparent">
                12 botanicals.
              </span>
              <br />
              One capsule.
            </h2>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-center lg:gap-14">
            <IngredientOrbit />
            <div className="max-w-xl text-left">
              <h3 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                The Genesis of Vitality: What is Spirulina?
              </h3>
              <p className="mt-4 text-lg font-medium text-ink/60">
                3.5 Billion Years of Evolutionary Perfection, Encapsulated for
                Daily Modern Performance.
              </p>
              <p className="mt-6 leading-relaxed text-ink/70">
                Long before modern wellness trends, there was Spirulina. A
                microscopic, blue-green single-celled spiral organism that
                thrives purely on sunlight and water. For a mature body
                navigating stress and environmental depletion, Spirulina acts as
                a <span className="aqua-highlight font-bold text-ink">Cellular Catalyst</span>.
                Because its cell walls are composed of easily digestible
                proteins, your body absorbs its dense matrix of iron,
                antioxidants, and amino acids almost instantly — feeding your
                hair follicles, dermal layers, and nail matrices.
              </p>
              <div className="mt-8 space-y-5">
                {SPIRULINA_METRICS.map((m) => (
                  <div key={m.title} className="flex gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] text-white">
                      ✓
                    </span>
                    <p className="text-sm text-ink/70">
                      <strong className="text-ink">{m.title}:</strong> {m.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Link
            href="/#pricing"
            className="rounded-full bg-gradient-to-r from-mauve to-aqua px-7 py-3.5 text-sm font-bold text-[#111111] transition hover:brightness-95"
          >
            Shop the Formula
          </Link>
          <Link
            href="/reviews"
            className="rounded-full border border-ink/15 px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-neutral-50"
          >
            Read Clinical Experiences
          </Link>
        </div>
      </section>
    </div>
  );
}
