import Link from "next/link";
import Image from "next/image";
import { AMAZON_URL, FLIPKART_URL } from "@/lib/links";

const STORE = [
  { href: "/#pricing", label: "Shop Now" },
  { href: "/science", label: "The Science Matrix" },
  { href: "/story", label: "Our Story" },
  { href: "/journal", label: "Blogs" },
  { href: "/contact", label: "Contact us" },
];

const LEGAL = [
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms & Conditions" },
  { href: "/policies/shipping", label: "Shipping & Fulfillment Policy" },
  { href: "/policies/refund", label: "Refund & Cancellation Policy" },
  { href: "/policies/disclaimer", label: "Medical Disclaimer" },
];

const SOCIALS: { label: string; href: string; path: string }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/spiru.pop?igsh=eWFrM2NwZzYxcXEx",
    path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.22.6-.48 1-.9 1.4-.4.42-.8.68-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.22-1-.48-1.4-.9-.42-.4-.68-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.4 6.4 0 1 0 12 18.4 6.4 6.4 0 0 0 12 5.4Zm0 2.2a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm6.6-2.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/spirupop/",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9V9Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@spirupop?si=dXVTMS-cGFXaND6t",
    path: "M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1CrptSNf5Q/",
    path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.45 2.9h-2.35v7A10 10 0 0 0 22 12Z",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#E5E7EB] bg-gradient-to-b from-white via-[#F9FAFB] to-mauve/15 text-[#111111]">
      {/* dot texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(17,17,17,0.09) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* decorative glow shapes */}
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-mauve/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full bg-aqua/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* CTA band */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-mauve/30 bg-gradient-to-br from-white via-mauve/[0.06] to-aqua/[0.08] px-8 py-8 shadow-[0_24px_70px_-40px_rgba(224,175,255,0.8)] sm:px-12 sm:py-9">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-aqua/25 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-cursive text-3xl font-semibold leading-none sm:text-4xl">
                <span className="bg-gradient-to-br from-aqua via-mauve to-purple-600 bg-clip-text text-transparent">
                  Ready to glow from within?
                </span>
              </p>
              <p className="mt-3 max-w-md text-sm text-ink/60">
                One daily pop of pure Indian spirulina + 11 botanicals. Join the
                ritual.
              </p>
            </div>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mauve to-aqua px-7 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-[#111111] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Shop Now →
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Essence */}
          <div className="flex flex-col items-start text-left">
            <Link href="/" aria-label="SpiruPop home" className="-ml-[30px] inline-block">
              <Image
                src="/spirupop-logo.png"
                alt="SpiruPop"
                width={300}
                height={300}
                className="h-36 w-auto"
              />
            </Link>
            <p className="-mt-2 max-w-xs text-sm text-ink/65">
              Tiny algae. Big benefits.
              <br />
              Built for your daily routine.
            </p>
          </div>

          {/* Store Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-ink/50">
              Store
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink/75">
              {STORE.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regulatory & Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-ink/50">
              Regulatory &amp; Legal
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink/75">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Communication */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-ink/50">
              Connect With Us
            </h4>
            <div className="mt-4 flex gap-3">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=support.spirupop@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email support.spirupop@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/60 text-ink/70 transition hover:-translate-y-0.5 hover:border-mauve hover:bg-mauve hover:text-[#111111] hover:shadow-md"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </a>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/60 text-ink/70 transition hover:-translate-y-0.5 hover:border-mauve hover:bg-mauve hover:text-[#111111] hover:shadow-md"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Marketplace shops */}
            <div className="mt-5 flex flex-col gap-2.5 sm:max-w-xs">
              <a
                href={AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white/60 px-4 py-2.5 text-sm font-semibold text-ink/80 transition hover:-translate-y-0.5 hover:border-[#FF9900] hover:shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF9900" aria-hidden>
                  <path d="M18.4 16.9c-2.2 1.6-5.3 2.5-8 2.5a14.5 14.5 0 0 1-9.8-3.7c-.2-.2 0-.4.2-.3a19.7 19.7 0 0 0 9.8 2.6c1.8 0 3.8-.4 5.6-1.1.3-.1.5.2.2.3Zm.8-1c-.3-.3-1.8-.2-2.5-.1-.2 0-.2-.2 0-.3 1.2-.8 3.1-.6 3.3-.3.2.3-.1 2.2-1.2 3.1-.1.1-.3.1-.2-.1.2-.6.7-2 .6-2.3Z" />
                  <path d="M16.6 12.7V6.6c0-2.6-1.8-4.3-4.4-4.3-2.4 0-4.3 1.2-4.7 3.6l2.8.3c.2-1 .9-1.4 1.7-1.4.9 0 1.5.5 1.5 1.6v.7c-2.6 0-5.9.6-5.9 4 0 1.9 1.4 2.9 3.1 2.9 1.4 0 2.2-.3 3.3-1.4.4.5.5.8 1.2 1.4.2.1.4.1.5 0 .4-.4 1.2-1 1.6-1.4.2-.1.1-.4 0-.5-.5-.5-1.1-.9-1.1-2.4Zm-3-.2c-.4.7-1 1.1-1.7 1.1-.9 0-1.5-.7-1.5-1.7 0-1.9 1.7-2.3 3.2-2.3v.5c0 .9 0 1.6-.4 2.3Z" />
                </svg>
                Shop on Amazon
              </a>
              {FLIPKART_URL && (
                <a
                  href={FLIPKART_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white/60 px-4 py-2.5 text-sm font-semibold text-ink/80 transition hover:-translate-y-0.5 hover:border-[#2874F0] hover:shadow-md"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2874F0" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                  </svg>
                  Shop on Flipkart
                </a>
              )}
            </div>
          </div>
        </div>

        {/* oversized brand wordmark */}
        <div className="mt-10 select-none text-center leading-none">
          <span className="bg-gradient-to-b from-ink/10 to-mauve/25 bg-clip-text text-[15vw] font-black tracking-tighter text-transparent sm:text-[9rem]">
            SpiruPop
          </span>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] pt-5 text-xs text-ink/50 sm:flex-row">
          <p>© {new Date().getFullYear()} SpiruPop. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Proudly Made in India
            <span aria-hidden className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] ring-1 ring-black/10">
              <span className="flex h-full w-full flex-col">
                <span className="h-1/3 w-full bg-[#FF9933]" />
                <span className="flex h-1/3 w-full items-center justify-center bg-white text-[7px] leading-none text-[#000080]">
                  ⟳
                </span>
                <span className="h-1/3 w-full bg-[#138808]" />
              </span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
