"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/science", label: "The Science" },
  { href: "/story", label: "Our Story" },
  { href: "/reviews", label: "Reviews" },
  { href: "/journal", label: "Blogs" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 shadow-[0_1px_20px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 overflow-visible" aria-label="SpiruPop home">
          <Image
            src="/spirupop-logo.png"
            alt="SpiruPop"
            width={200}
            height={200}
            priority
            className="h-14 w-auto origin-left scale-[2] sm:h-16"
          />
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-black/5 bg-white/60 px-2 py-1.5 shadow-sm backdrop-blur lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-mauve/25 text-ink"
                      : "text-ink/70 hover:bg-black/[0.04] hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/#pricing"
            className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-mauve to-aqua px-6 py-2.5 text-sm font-bold text-[#111111] shadow-md shadow-mauve/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-mauve/40 sm:inline-flex"
          >
            Shop Now
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </Link>

          <Link
            href="/account"
            aria-label="My account and orders"
            title="My account & orders"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              pathname === "/account"
                ? "border-mauve bg-mauve/25 text-ink"
                : "border-black/10 bg-white/70 text-ink/80 hover:border-black/20 hover:text-ink"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M4 20c1.5-3.6 4.5-5.5 8-5.5s6.5 1.9 8 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 bg-ink" />
              <span className="block h-0.5 w-6 bg-ink" />
              <span className="block h-0.5 w-6 bg-ink" />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <ul className="flex flex-col px-5 py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#pricing"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-full bg-gradient-to-r from-mauve to-aqua px-5 py-3 text-center text-base font-bold text-[#111111] shadow-md shadow-mauve/30"
              >
                Shop Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
