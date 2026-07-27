import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Everything you need to know about SpiruPop — what it is, how it works, when you'll see results, and where it's made.",
};

const FAQS = [
  {
    q: "What is the recommended daily dosage of SpiruPop, and who can take it?",
    a: "The recommended dosage is exactly 2 capsules a day, formulated as an entirely unisex solution equally effective for both men and women. For best results, take one capsule after breakfast and one after dinner with a full glass of water.",
  },
  {
    q: "Why are the capsules completely opaque light aqua blue?",
    a: "The opaque coating acts as a protective shield against UV light damage. Because we use pure, raw botanical powders, this opacity preserves the delicate nutrients from degrading until you consume them.",
  },
  {
    q: "When will I start seeing visible results in my hair and skin?",
    a: "Initial structural changes in nail strength and skin hydration begin within 30 to 60 days for both male and female biologies. Full follicular density and visible hair volume optimization peak over a consistent, daily 90-day biological cycle.",
  },
  {
    q: "Is SpiruPop safe to take alongside prescription medications?",
    a: "While our 12-in-1 formula consists entirely of clean, traditional botanical powders, cross-interactions are always unique. We highly recommend showing our ingredient matrix to your personal physician before starting if you are on long-term prescriptions.",
  },
  {
    q: "Is this product completely vegetarian?",
    a: "Yes, SpiruPop is 100% vegetarian. We explicitly use premium HPMC vegetable capsule shells instead of cheap, animal-derived gelatin.",
  },
  {
    q: "Does SpiruPop contain any synthetic chemical fillers?",
    a: "No, our philosophy strictly prioritizes clean, uncompromising integrity. Our capsules contain zero synthetic chemical fillers, zero artificial dyes, and are rigorously heavy-metal tested.",
  },
  {
    q: "What makes raw botanical powders better than chemical extracts?",
    a: "Raw powders preserve the plant's whole, unadulterated matrix, keeping all natural co-factors and enzymes intact. This allows your body to absorb and utilize the nutrients exactly as nature intended.",
  },
  {
    q: "How long can I continuously consume these capsules?",
    a: "Since SpiruPop is a natural nutraceutical designed for daily cellular support, it can be safely integrated into your long-term wellness ritual. There is no need to cycle off it.",
  },
  {
    q: "Are there any side effects to taking SpiruPop daily?",
    a: "SpiruPop is a clean, unisex nutraceutical made from functional superfoods and is exceptionally well-tolerated by both men and women. If you have rare, specific allergies to any of our 12 whole botanicals, we recommend consulting your doctor.",
  },
  {
    q: "How does shipping work and how long does it take?",
    a: "We offer complimentary priority shipping all over India on every single order. To guarantee maximum freshness, each bottle is hand-dispatched via our priority courier partners, and live tracking is sent straight to your phone.",
  },
];

export default function FAQPage() {
  return (
    <section className="bg-gradient-to-b from-mauve/30 via-aqua/10 to-mauve/20">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
          Help Center
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-lg text-ink/70">
          Real answers. No fluff. Still curious?{" "}
          <Link
            href="/contact"
            className="font-semibold underline underline-offset-4"
          >
            Contact us
          </Link>
          .
        </p>

        <div className="mt-12 space-y-4">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                {f.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-ink transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
