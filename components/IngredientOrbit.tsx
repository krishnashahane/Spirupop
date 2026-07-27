"use client";

import Image from "next/image";
import { useState } from "react";
import { INGREDIENTS, type Ingredient } from "@/lib/ingredients";
import IngredientModal from "@/components/IngredientModal";

// Show the 12 botanicals on a continuously rotating ring.
const ITEMS = INGREDIENTS.slice(0, 12);

export default function IngredientOrbit() {
  const [active, setActive] = useState<Ingredient | null>(null);

  return (
    <div className="group relative flex aspect-square w-full max-w-[34rem] items-center justify-center">
      {/* soft glow */}
      <div className="absolute h-3/4 w-3/4 rounded-full bg-gradient-to-br from-emerald-300/40 via-aqua/20 to-mauve/30 blur-3xl" />

      {/* spinning ring — pauses on hover so botanicals are easy to click */}
      <div className="animate-orbit relative h-[80%] w-[80%] group-hover:[animation-play-state:paused]">
        <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
        <div className="absolute inset-[14%] rounded-full border border-mauve/20" />

        {ITEMS.map((ing, i) => {
          const angle = (i / ITEMS.length) * 360;
          return (
            <div
              key={ing.name}
              className="absolute inset-0"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                {/* cancel ring spin so labels stay upright */}
                <div className="animate-orbit-reverse group-hover:[animation-play-state:paused]">
                  <button
                    type="button"
                    onClick={() => setActive(ing)}
                    aria-label={`View ${ing.name} details`}
                    className="flex flex-col items-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve focus-visible:ring-offset-2"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <span className="relative aspect-square h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white shadow-lg ring-2 ring-white sm:h-16 sm:w-16">
                      <Image
                        src={ing.img}
                        alt={ing.name}
                        fill
                        sizes="64px"
                        className="scale-110 object-cover object-center"
                      />
                    </span>
                    <span className="mt-1.5 whitespace-nowrap rounded-full bg-white/85 px-2 py-0.5 text-[9px] font-semibold text-ink shadow-sm backdrop-blur sm:text-[10px]">
                      {ing.name}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* center — product bottle */}
      <div className="pointer-events-none absolute flex items-center justify-center">
        <Image
          src="/bottle-orbit.png"
          alt="SpiruPop Enhanced Spirulina — 12 botanicals, 60 capsules"
          width={1024}
          height={1536}
          priority
          sizes="(max-width: 640px) 8rem, 10rem"
          className="h-40 w-auto object-contain drop-shadow-2xl sm:h-52"
        />
      </div>

      <IngredientModal ingredient={active} onClose={() => setActive(null)} />
    </div>
  );
}
