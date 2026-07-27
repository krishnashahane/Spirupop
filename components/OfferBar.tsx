"use client";

import { useState } from "react";

const PHRASES = [
  "TINY ALGAE. BIG BENEFITS.",
  "UNLOCK ₹100 OFF YOUR RITUAL — USE CODE:",
  "COMPLIMENTARY PAN-INDIA PRIORITY SHIPPING",
  "12 BIO-ACTIVE BOTANICALS FOR HAIR & SKIN LONGEVITY",
];

const CODE_AFTER = 1; // phrase index that gets the copyable code chip

function CodeChip() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText("WELCOME100");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      title="Click to copy"
      className="ml-1.5 select-all rounded bg-[#111111]/10 px-1.5 py-0.5 font-bold tracking-[0.12em] transition hover:bg-[#111111]/20"
    >
      {copied ? "COPIED ✓" : "WELCOME100"}
    </button>
  );
}

export default function OfferBar() {
  const loop = [...PHRASES, ...PHRASES, ...PHRASES];
  return (
    <div className="group overflow-hidden bg-mauve">
      <div className="flex w-max animate-marquee whitespace-nowrap py-1.5 [animation-duration:90s] group-hover:[animation-play-state:paused]">
        {loop.map((p, i) => (
          <span
            key={i}
            className="mx-5 flex items-center gap-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]"
          >
            <span className="flex items-center">
              {p}
              {i % PHRASES.length === CODE_AFTER && <CodeChip />}
            </span>
            <span className="text-[#111111]/70" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
