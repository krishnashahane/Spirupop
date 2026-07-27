import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReviewsRail from "@/components/ReviewsRail";

export const metadata: Metadata = {
  title: "Clinical Experiences & User Reviews",
  description:
    "Verified SpiruPop buyer experiences over 30, 60 and 90-day rituals — hair volume, skin radiance and nail strength.",
};

const REVIEWS = [
  {
    name: "Meera R., Bengaluru",
    age: "42",
    timeline: "90-Day Ritual",
    rating: "4.8",
    headline: "Noticeable difference in hair volume.",
    text: "I was highly skeptical about trying another supplement for my hair thinning. After finishing my third bottle of SpiruPop, the results speak for themselves. My hair feels structurally denser at the roots, and the daily shedding has drastically reduced.",
  },
  {
    name: "Rajesh K., Mumbai",
    age: "39",
    timeline: "60-Day Ritual",
    rating: "4.6",
    headline: "Goodbye to dull skin and constant fatigue.",
    text: "Between my corporate travel and stress, my skin looked exhausted and my energy was depleted. Within two months, my skin has a natural, healthy radiance, and I genuinely feel lighter and more energized through the day.",
  },
  {
    name: "Dr. Ananya S., Delhi",
    age: "46",
    timeline: "30-Day Ritual",
    rating: "4.6",
    headline: "My brittle nails are finally strong.",
    text: "As a professional who washes her hands constantly, my nails were splitting and peeling. Just 4 weeks in, the texture is completely smooth and they don't break anymore. Already ordering the 3-bottle bundle.",
  },
  {
    name: "Karthik V., Hyderabad",
    age: "35",
    timeline: "60-Day Ritual",
    rating: "4.7",
    headline: "Two capsules. Zero friction in my routine.",
    text: "What sold me was the simplicity — no powders, no shakes. I take two in the morning and forget about it. My post-workout recovery feels smoother and my skin looks far less stressed than before.",
  },
  {
    name: "Priya N., Pune",
    age: "44",
    timeline: "90-Day Ritual",
    rating: "4.9",
    headline: "The radiance is real and it lasted.",
    text: "I've cycled through expensive serums for years. SpiruPop worked from within. My complexion is more even, and friends keep asking what I changed. The clean veggie capsules sealed the deal for me.",
  },
  {
    name: "Aman G., Chandigarh",
    age: "31",
    timeline: "30-Day Ritual",
    rating: "4.5",
    headline: "Less fatigue, sharper focus by week three.",
    text: "I run on long screen days. By the third week the afternoon energy crash was noticeably softer and my focus held longer. Subtle but consistent — exactly what I wanted from a daily ritual.",
  },
  {
    name: "Sneha T., Kolkata",
    age: "38",
    timeline: "60-Day Ritual",
    rating: "4.7",
    headline: "Hair fall finally under control.",
    text: "Seasonal hair fall always wrecked my confidence. Two months in, my brush is dramatically cleaner and the new growth around my hairline is visible. The Spirulina–Biotin pairing genuinely delivers.",
  },
  {
    name: "Vikram S., Jaipur",
    age: "49",
    timeline: "90-Day Ritual",
    rating: "4.8",
    headline: "A long-term investment that paid off.",
    text: "I treated this as a longevity habit, not a quick fix. Across three months my skin firmed up, nails stopped chipping, and I simply feel more resilient day to day. Will keep this in my stack.",
  },
  {
    name: "Divya M., Chennai",
    age: "41",
    timeline: "30-Day Ritual",
    rating: "4.6",
    headline: "Clean label I can actually trust.",
    text: "As someone who reads every label, the heavy-metal testing and raw whole-plant approach matter to me. Early days, but my skin already looks more hydrated and alive. Excited to continue the cycle.",
  },
  {
    name: "Rohan D., Ahmedabad",
    age: "36",
    timeline: "60-Day Ritual",
    rating: "4.7",
    headline: "Finally a supplement I don't forget to take.",
    text: "The opaque aqua capsules feel premium and the bottle looks great on my desk — so I actually remember it. Beyond looks, my nails are stronger and my skin tone is more even after two months.",
  },
];

export default function ReviewsPage() {
  return (
    <div className="bg-gradient-to-b from-mauve/30 via-aqua/10 to-mauve/20">
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
            Clinical Experiences
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
            Real rituals. Real transformations.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            Natural biological transformation takes time.
            <br />
            Each verified experience is tagged with the exact duration of use.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mauve/35 via-mauve/15 to-aqua/25 p-1 shadow-xl shadow-mauve/15 ring-1 ring-white/50">
          <Image
            src="/couple-ritual.png"
            alt="A couple taking their daily SpiruPop spirulina ritual"
            width={528}
            height={598}
            priority
            className="h-full w-full rounded-[calc(1.5rem-0.25rem)] object-cover mix-blend-multiply"
          />
        </div>
      </div>

      {/* Auto-scrolling review rail (pauses on hover) */}
      <ReviewsRail reviews={REVIEWS} />

      <div className="mt-14 text-center">
        <Link
          href="/#pricing"
          className="inline-block rounded-full bg-gradient-to-r from-mauve to-aqua px-8 py-4 text-sm font-bold text-[#111111] transition hover:brightness-95"
        >
          Begin Your Ritual
        </Link>
      </div>
    </section>
    </div>
  );
}
