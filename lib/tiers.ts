// Canonical pricing — the single source of truth for both the UI and the
// server order route (amount is never trusted from the client).
export type Tier = {
  id: string;
  title: string;
  sub: string;
  mrp: number;
  price: number;
  micro: string;
  img: string;
  imgW: number;
  imgH: number;
  badge?: string;
  best?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "b1",
    title: "1 Bottle",
    sub: "30-Day Starter",
    mrp: 599,
    price: 499,
    micro: "Coupon ‘WELCOME100’ applied automatically.",
    img: "/ribbon-1.png",
    imgW: 364,
    imgH: 460,
  },
  {
    id: "b2",
    title: "2 Bottles",
    sub: "60-Day Renewal Scheme",
    mrp: 1198,
    price: 899,
    micro: "Save ₹299 instantly. Continual care for follicle health.",
    img: "/ribbon-2.png",
    imgW: 522,
    imgH: 404,
  },
  {
    id: "b3",
    title: "3 Bottles",
    sub: "90-Day Cellular Ritual",
    mrp: 1797,
    price: 1249,
    micro:
      "Save ₹548. Optimal cellular renewal and visible transformation manifest over 90 days.",
    img: "/ribbon-3.png",
    imgW: 558,
    imgH: 424,
    badge: "Best Value — Recommended for Full Biological Cycle",
    best: true,
  },
];

export const tierById = (id: string): Tier | undefined =>
  TIERS.find((t) => t.id === id);

export const inr = (n: number): string => `₹${n.toLocaleString("en-IN")}`;
