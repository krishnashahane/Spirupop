"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { INGREDIENTS, slugify, type Ingredient } from "@/lib/ingredients";
import IngredientModal from "@/components/IngredientModal";

export default function ScienceGrid() {
  const [active, setActive] = useState<Ingredient | null>(null);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("ingredient");
    if (!slug) return;
    const ing = INGREDIENTS.find((i) => slugify(i.name) === slug);
    if (!ing) return;
    // Deep-link (?ingredient=…): open the matching modal once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(ing);
    document
      .getElementById(slug)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-1.5 lg:grid-cols-4">
        {INGREDIENTS.map((ing) => (
          <button
            key={ing.name}
            id={slugify(ing.name)}
            onClick={() => setActive(ing)}
            className="group flex scroll-mt-28 flex-col items-center rounded-2xl border border-black/10 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-mauve hover:shadow-lg target:border-mauve target:ring-2 target:ring-mauve/40"
          >
            <span className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
              <Image
                src={ing.img}
                alt={ing.name}
                fill
                sizes="56px"
                className="scale-110 object-cover object-center"
              />
            </span>
            <h3 className="mt-4 font-display text-base font-bold leading-tight">
              {ing.name}
            </h3>
            <p className="mt-1 text-xs text-ink/50">{ing.latin}</p>
            <span className="mt-3 text-xs font-semibold text-mauve opacity-0 transition group-hover:opacity-100">
              Read science →
            </span>
          </button>
        ))}
      </div>

      <IngredientModal ingredient={active} onClose={() => setActive(null)} />
    </>
  );
}
