"use client";

import Image from "next/image";
import { type Ingredient } from "@/lib/ingredients";

export default function IngredientModal({
  ingredient,
  onClose,
}: {
  ingredient: Ingredient | null;
  onClose: () => void;
}) {
  if (!ingredient) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
        >
          ✕
        </button>
        <div className="relative h-56 w-full bg-gradient-to-br from-neutral-50 to-white">
          <Image
            src={ingredient.img}
            alt={ingredient.name}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-contain p-4"
          />
        </div>
        <div className="p-8">
          <h3 className="font-display text-2xl font-extrabold">
            {ingredient.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-mauve">
            {ingredient.latin}
          </p>
          <p className="mt-4 leading-relaxed text-ink/75">{ingredient.desc}</p>
        </div>
      </div>
    </div>
  );
}
