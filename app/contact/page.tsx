import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions, orders, partnerships? Reach the SpiruPop team directly.",
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-mauve/30 via-aqua/10 to-mauve/20">
    <section className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-12 lg:py-20">
      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
          Say hello
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
          Let&apos;s talk.
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70">
          Questions about your ritual, orders, or partnerships? Drop us a line —
          it lands straight in our inbox.
        </p>

        <div className="mt-7 rounded-2xl border border-white/60 bg-white/50 p-5 backdrop-blur-sm">
          <span className="block text-xs font-semibold uppercase tracking-widest text-ink/50">
            Direct Support Email
          </span>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=support.spirupop@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-semibold text-ink underline decoration-mauve decoration-2 underline-offset-4 transition hover:text-mauve"
          >
            support.spirupop@gmail.com
          </a>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            For medical partner outreach or distribution inquiries, please select{" "}
            <strong className="text-ink">&apos;Business Inquiry&apos;</strong> in the
            dropdown menu.
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-mauve/35 via-mauve/15 to-aqua/25 p-1 shadow-xl shadow-mauve/15 ring-1 ring-white/50">
          <Image
            src="/contact-us.png"
            alt="Happy SpiruPop customers holding the Spirulina bottle"
            width={2507}
            height={1536}
            sizes="(max-width: 768px) 100vw, 45vw"
            className="block h-auto w-full rounded-[1.35rem] mix-blend-multiply"
          />
        </div>
      </div>

      <ContactForm />
    </section>
    </div>
  );
}
