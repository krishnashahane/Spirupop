"use client";

import { useEffect, useRef } from "react";

type Review = {
  name: string;
  age: string;
  timeline: string;
  rating: string;
  headline: string;
  text: string;
};

export default function ReviewsRail({ reviews }: { reviews: Review[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const loop = [...reviews, ...reviews];

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let raf = 0;
    const step = () => {
      if (!paused.current) {
        el.scrollLeft += 1.25;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft -= el.scrollWidth / 2;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={railRef}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
      onTouchEnd={() => (paused.current = false)}
      className="no-scrollbar mt-5 flex gap-6 overflow-x-auto pb-4"
    >
      {loop.map((r, i) => (
        <article
          key={`${r.name}-${i}`}
          className="review-glitter flex w-[300px] shrink-0 flex-col rounded-3xl bg-[#F9FAFB] p-7 sm:w-[360px]"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
              <span className="text-emerald-500">✓</span> Verified Buyer
            </span>
            <span className="text-sm font-bold text-ink">⭐ {r.rating}</span>
          </div>
          <span className="mt-4 inline-block w-fit rounded-full bg-mauve/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#111111]">
            {r.timeline}
          </span>
          <h3 className="mt-4 font-display text-lg font-bold">“{r.headline}”</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{r.text}</p>
          <div className="mt-6 border-t border-[#E5E7EB] pt-4">
            <p className="text-sm font-bold text-ink">{r.name}</p>
            <p className="text-xs text-ink/50">Age {r.age}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
