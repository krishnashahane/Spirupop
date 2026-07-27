"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { INGREDIENTS, slugify } from "@/lib/ingredients";

/**
 * Hero baseline: auto-scrolling strip of circular ingredient photos.
 * Supports manual horizontal scroll/drag; auto-scroll pauses on interaction.
 * Each item links to its breakdown on the science page.
 */
export default function IngredientTicker() {
  const ref = useRef<HTMLDivElement>(null);
  const loop = [...INGREDIENTS, ...INGREDIENTS];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let paused = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const step = () => {
      if (!paused) {
        el.scrollLeft += 0.85;
        // seamless loop: reset at the halfway point (duplicated list)
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft -= el.scrollWidth / 2;
      }
      raf = requestAnimationFrame(step);
    };

    const pause = () => (paused = true);
    const resume = () => (paused = false);

    if (!reduce) raf = requestAnimationFrame(step);
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resume);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resume);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <div className="border-t border-black/5 bg-white py-6">
      <div
        ref={ref}
        className="no-scrollbar flex w-full cursor-grab items-start gap-8 overflow-x-auto px-5 active:cursor-grabbing sm:px-8"
      >
        {loop.map((ing, i) => (
          <Link
            key={i}
            href={`/science?ingredient=${slugify(ing.name)}`}
            className="group flex w-24 shrink-0 flex-col items-center text-center"
          >
            <span className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 transition group-hover:ring-mauve">
              <Image
                src={ing.img}
                alt={ing.name}
                fill
                sizes="64px"
                className="scale-110 object-cover object-center"
                draggable={false}
              />
            </span>
            <span className="mt-2 text-[10px] leading-tight text-ink/55 transition group-hover:text-ink">
              {ing.short}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
