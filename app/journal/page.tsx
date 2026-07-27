import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Longevity, performance and the science of Spirulina — insights for the modern professional from the SpiruPop blog.",
};

const POSTS = [
  {
    title: "Your Supplement Cabinet Is Just a Graveyard of Expensive Lies",
    tag: "Clean Label",
    img: "/journal/clean-label.png",
    href: "https://www.linkedin.com/pulse/your-supplement-cabinet-just-graveyard-expensive-lies-spirupop-vucvc/?trackingId=2%2Fz6E8HdQdvO41B%2BJl5EMw%3D%3D",
  },
  {
    title:
      "The CEO's Secret Weapon: How Undiagnosed Toxin Overload Is Killing Your Edge",
    tag: "Performance",
    img: "/journal/performance.png",
    href: "https://www.linkedin.com/pulse/ceos-secret-weapon-how-undiagnosed-toxin-overload-killing-your-qdegf/?trackingId=B5%2BTTLANcpLqidk1%2FwIovg%3D%3D",
  },
  {
    title:
      "The Gut-Brain Connection: Why Spirulina Is Your Secret Weapon for Holistic Health",
    tag: "Gut Health",
    img: "/journal/gut-health.png",
    href: "https://www.linkedin.com/pulse/gut-brain-connection-why-spirulina-your-secret-weapon-holistic-x8wxc/?trackingId=uTUv9GzS7%2FEyak8x7Ny%2FMQ%3D%3D",
  },
  {
    title: "Stress Less, Perform More: How Spirulina Supports Adaptability",
    tag: "Adaptogens",
    img: "/journal/adaptogens.png",
    href: "https://www.linkedin.com/pulse/stress-less-perform-more-how-spirulina-supports-adaptability-1wwxf/?trackingId=MAGYW8iO1F2vyU1Vpcbihg%3D%3D",
  },
  {
    title:
      "Immunity Unlocked: Fortifying Your Defenses with Spirulina at the Workplace",
    tag: "Immunity",
    img: "/journal/immunity.png",
    href: "https://www.linkedin.com/pulse/immunity-unlocked-fortifying-your-defenses-spirulina-workplace-yu3sf/?trackingId=TeZgkk03RoUP9%2BkLM94LoA%3D%3D",
  },
  {
    title:
      "Brain Boost: Spirulina's Role in Enhancing Cognitive Function & Mental Clarity",
    tag: "Cognition",
    img: "/journal/cognition.png",
    href: "https://www.linkedin.com/pulse/brain-boost-spirulinas-role-enhancing-cognitive-function-mental-z5c1f/?trackingId=ctvzvHhegFyZ%2FxprFt4W6Q%3D%3D",
  },
  {
    title:
      "Spirulina for Corporate Athletes: The Secret to Sustained Energy & Peak Performance",
    tag: "Energy",
    img: "/journal/energy.png",
    href: "https://www.linkedin.com/pulse/spirulina-corporate-athletes-secret-sustained-energy-peak-performance-vqjwf/?trackingId=uIB%2BzqMuT1hiI3R5O1H%2BPQ%3D%3D",
  },
  {
    title: "Beyond the Buzzword: Demystifying Spirulina's Power for Professionals",
    tag: "Science",
    img: "/journal/science.png",
    href: "https://www.linkedin.com/pulse/beyond-buzzword-demystifying-spirulinas-power-professionals-mqx2f/?trackingId=SkVUvFQqrOL3O%2FoNVKtzZg%3D%3D",
  },
  {
    title:
      "Optimizing Performance: Why Spirulina Deserves a Place in Your Corporate Routine",
    tag: "Longevity",
    img: "/journal/longevity.png",
    href: "https://www.linkedin.com/pulse/optimizing-performance-why-spirulina-deserves-place-your-corporate-v59mf/?trackingId=n7OwpJ3ej5Z7NjI%2FeSVbwg%3D%3D",
  },
];

export default function JournalPage() {
  return (
    <div className="bg-gradient-to-b from-mauve/30 via-aqua/10 to-mauve/20">
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
        The Blog
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
        Longevity, decoded.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Field notes on Spirulina, performance and clean nutrition for the
        modern&nbsp;professional.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] transition hover:-translate-y-1 hover:border-mauve hover:shadow-lg"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
              <Image
                src={p.img}
                alt={p.tag}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <span className="w-fit rounded-full bg-mauve/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#111111]">
                {p.tag}
              </span>
              <h2 className="mt-5 flex-1 font-display text-lg font-bold leading-snug">
                {p.title}
              </h2>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ink/70 group-hover:gap-2">
                Read on LinkedIn <span aria-hidden>→</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
    </div>
  );
}
