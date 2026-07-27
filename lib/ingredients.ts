export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type Ingredient = {
  name: string;
  latin: string;
  short: string; // ticker label
  img: string;
  desc: string;
};

export const INGREDIENTS: Ingredient[] = [
  {
    name: "Spirulina",
    latin: "Arthrospira platensis",
    short: "Spirulina",
    img: "/ingredients/spirulina.png",
    desc: "Nature’s premier cellular superfood; a nutrient-dense blue-green algae packed with pure plant protein, vital iron, powerful antioxidants, and essential fatty acids to combat daily fatigue and cellular aging.",
  },
  {
    name: "Curcuma Longa",
    latin: "Turmeric · Haldi",
    short: "Curcuma Longa (Turmeric)",
    img: "/ingredients/curcuma-longa.png",
    desc: "Pure, unadulterated Turmeric engineered to shield your body against systemic cellular inflammation while naturally restoring deep skin radiance and elasticity.",
  },
  {
    name: "Biotin",
    latin: "Vitamin B7",
    short: "Biotin",
    img: "/ingredients/biotin.png",
    desc: "A high-potency essential B-vitamin that directly targets cellular keratin production, structurally fortifying follicles for maximum hair strength, thickness, and volume.",
  },
  {
    name: "Moringa Oleifera",
    latin: "Drumstick",
    short: "Moringa Oleifera",
    img: "/ingredients/moringa-oleifera.png",
    desc: "The ultimate “drumstick” nutritional complex, delivering an intense burst of vital micronutrients and minerals straight to the roots to revive dormant hair follicles.",
  },
  {
    name: "Emblica Officinalis",
    latin: "Amla · Indian Gooseberry",
    short: "Emblica Officinalis (Amla)",
    img: "/ingredients/emblica-officinalis.png",
    desc: "Pure Indian Gooseberry, an exceptional source of natural Vitamin C that stimulates your body’s inherent collagen production to tighten skin and improve hair texture.",
  },
  {
    name: "Glycyrrhiza Glabra",
    latin: "Licorice · Mulethi",
    short: "Glycyrrhiza Glabra (Mulethi)",
    img: "/ingredients/glycyrrhiza-glabra.png",
    desc: "Traditional Licorice Root, highly valued for its ability to brighten hyperpigmentation, soothe the digestive tract, and even out patchy skin tone from within.",
  },
  {
    name: "Linum Usitatissimum",
    latin: "Flaxseed",
    short: "Linum Usitatissimum (Flaxseed)",
    img: "/ingredients/linum-usitatissimum.png",
    desc: "Pure Flaxseed, rich in plant-based Omega-3 fatty acids that deeply hydrate the dermal layer, preventing dry scalp and brittle, splitting nails.",
  },
  {
    name: "Tinospora Cordifolia",
    latin: "Giloy",
    short: "Tinospora Cordifolia (Giloy)",
    img: "/ingredients/tinospora-cordifolia.png",
    desc: "Time-tested Giloy, a legendary cellular rejuvenator that purifies the blood, flushes out toxins, and strengthens your natural immunity against environmental stress.",
  },
  {
    name: "Tribulus Terrestris",
    latin: "Gokshura",
    short: "Tribulus Terrestris (Gokshura)",
    img: "/ingredients/tribulus-terrestris.png",
    desc: "Traditional Gokshura, a vitalizing botanical that supports natural hormonal equilibrium, optimizing internal circulation to ensure nutrients reach your hair and skin.",
  },
  {
    name: "Withania Somnifera",
    latin: "Ashwagandha",
    short: "Withania Somnifera (Ashwagandha)",
    img: "/ingredients/withania-somnifera.png",
    desc: "Pure Ashwagandha, a powerful adaptogen clinically known to balance elevated cortisol, effectively protecting hair against stress-induced thinning and premature graying.",
  },
  {
    name: "Garcinia Cambogia",
    latin: "Vrikshamla",
    short: "Garcinia Cambogia",
    img: "/ingredients/garcinia-cambogia.png",
    desc: "Vrikshamla, an active botanical that optimizes cellular lipid metabolism, assisting in efficient nutrient absorption and keeping your body feeling light and balanced.",
  },
  {
    name: "Terminalia Arjuna",
    latin: "Arjuna Bark",
    short: "Terminalia Arjuna (Arjuna)",
    img: "/ingredients/terminalia-arjuna.png",
    desc: "Pure Arjuna Bark, an elite cardiovascular tonic that promotes optimal blood micro-circulation, ensuring vital oxygen and nutrition flow seamlessly to your scalp, skin cells, and nail beds.",
  },
];
