import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "A higher standard for daily wellness. SpiruPop is a long-term strategic investment in your personal longevity, structural vitality, and daily acuity.",
};

const PULL_QUOTES = [
  "Nutrition that fits your life, not your to-do list.",
  "We took nature's most powerful cellular catalyst — and gave it a modern purpose.",
  "This is not a fleeting trend. It is a long-term strategic investment in your personal longevity.",
];

export default function StoryPage() {
  return (
    <div className="bg-gradient-to-b from-mauve/30 via-aqua/10 to-mauve/20">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* decorative shapes */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-mauve/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-aqua/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-mauve" /> Our Story
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            A Higher Standard for
            <br />
            <em className="font-medium italic text-ink/60">Daily Wellness.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
            Honest nutrition, engineered for real life — not another chore on
            your to-do list.
          </p>
        </div>
      </section>

      {/* NARRATIVE */}
      <section className="mx-auto max-w-3xl px-5 pb-4 sm:px-8">
        <Reveal>
          <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur-md sm:p-12">
            <div className="space-y-6 text-lg leading-relaxed text-ink/75">
              <p>
                <span className="float-left mr-3 mt-1 font-display text-6xl font-extrabold leading-none text-mauve">
                  L
                </span>
                et&apos;s Be honest. Modern
                wellness has become exhausting — we are constantly bombarded with
                complicated routines, synthetic pills, and unrealistic trends
                that feel like another overwhelming chore on an already busy
                to-do list.
              </p>

              <figure className="my-8 border-l-4 border-mauve pl-6">
                <blockquote className="font-display text-2xl font-bold leading-snug text-ink">
                  {PULL_QUOTES[0]}
                </blockquote>
              </figure>

              <figure className="my-8 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-lg">
                <Image
                  src="/story/before-after.png"
                  alt="Before: a cluttered pill organizer and complicated supplement instructions. After: one simple SpiruPop capsule."
                  width={1200}
                  height={600}
                  className="h-auto w-full"
                />
              </figure>

              <p>
                Our journey began with a very simple question: why take more,
                when less can give you more? We looked past the temporary trends
                and returned to one of nature&apos;s original, most resilient
                superfoods — Spirulina. For billions of years, this microscopic
                powerhouse has packed an uncompromised matrix of pure plant
                protein, iron, and cellular protection into a single spiral cell.
              </p>

              <figure className="my-8 rounded-2xl bg-gradient-to-br from-mauve/25 to-aqua/20 p-7 text-center">
                <blockquote className="font-display text-2xl font-bold leading-snug text-ink">
                  “{PULL_QUOTES[1]}”
                </blockquote>
              </figure>

              <p>
                At SpiruPop, we are leading a movement to seamlessly integrate
                functional, natural nutrition into your daily routine. By
                combining clean Indian Spirulina with 11 targeted bio-active
                botanicals into one simple daily capsule, we did the hard work so
                you don&apos;t have to. Our mission is simple: to make pure, raw
                nutrition effortless, accessible, and genuinely effective for
                your demanding lifestyle.
              </p>

              <figure className="my-8 border-l-4 border-aqua pl-6">
                <blockquote className="font-display text-2xl font-bold leading-snug text-ink">
                  “{PULL_QUOTES[2]}”
                </blockquote>
              </figure>

              <figure className="my-8 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-lg">
                <Image
                  src="/story/botanical-lab.png"
                  alt="A laboratory spread of SpiruPop's raw botanical powders, spirulina, and extracts alongside scientific testing equipment."
                  width={1200}
                  height={630}
                  className="h-auto w-full"
                />
              </figure>

              <p>
                We are here to help you move away from the burnout and the
                bloating. SpiruPop is engineered to fuel continuous cellular
                renewal — fortify your hair and skin matrices, and restore your
                body&apos;s structural vitality. No empty promises. Just
                uncompromised, honest nutrition working with your body — not
                against it.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* WHOLE-FOOD SYNERGY — editorial showcase */}
      {/* INGREDIENT REVEAL — full-bleed video */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/botanicals-capsule.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* legibility scrim */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

        <div className="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] sm:text-5xl">
              12 botanicals. One capsule.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
              Watch nature&apos;s most resilient ingredients come together inside
              every SpiruPop bottle.
            </p>
            <p className="mt-8 text-sm text-white/75">
              Explore the{" "}
              <Link
                href="/science"
                className="font-semibold text-white underline decoration-white/60 underline-offset-4 transition hover:decoration-white"
              >
                12-in-1 ingredient matrix
              </Link>{" "}
              behind every capsule.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <Reveal>
          <Link
            href="/#pricing"
            className="inline-block rounded-full bg-gradient-to-r from-mauve to-aqua px-8 py-4 text-sm font-bold text-[#111111] transition hover:brightness-95"
          >
            Invest in Your Longevity
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
