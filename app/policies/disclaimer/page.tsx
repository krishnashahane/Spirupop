import type { Metadata } from "next";
import PolicyShell from "@/components/PolicyShell";

export const metadata: Metadata = {
  title: "Disclaimer Policy",
  description:
    "SpiruPop disclaimer — not medical advice, FSSAI compliance, and contraindications.",
};

export default function DisclaimerPage() {
  return (
    <PolicyShell title="Disclaimer Policy" active="/policies/disclaimer">
      <p>
        Please read this Disclaimer carefully before exploring our website,
        engaging with our social media content (including Instagram marketing
        campaigns), or consuming products managed by Spiruhome Global Solutions.
      </p>

      <h2>1. Not Medical Advice</h2>
      <p>
        The wellness philosophies, natural lifestyle concepts, marketing
        narratives, and product information displayed on this website or our
        social media handles are curated strictly for educational and
        self-directed wellness-enhancement purposes. They do not constitute, nor
        are they intended to replace, professional medical advice, medical
        diagnosis, or personalized clinical treatment. Always consult a
        certified healthcare practitioner or physician before introducing any
        new supplement into your routine.
      </p>

      <h2>2. Statutory FSSAI Compliance</h2>
      <p>
        SpiruPop is a premium nutraceutical supplement comprising a
        nutrient-dense blend of Spirulina (420 mg), Curcuma Longa (20 mg),
        Biotin (40 mcg), and a curated matrix of 9 other bioactive botanicals
        (Moringa oleifera, Emblica officinalis, Glycyrrhiza glabra, Linum
        usitatissimum, Tinospora cordifolia, Tribulus terrestris, Withania
        somnifera, Garcinia cambogia, and Terminalia arjuna) housed in vegetable
        HPMC capsules.
      </p>
      <ul>
        <li>
          <strong>Mandatory Notice:</strong> These statements have not been
          evaluated by the Food Safety and Standards Authority of India (FSSAI).
          This product is not intended to diagnose, treat, cure, or prevent any
          medical disease or physiological condition.
        </li>
        <li>
          SpiruPop is designed to act as an effortless cornerstone for an
          enhanced, active lifestyle; it should not be utilized as a substitute
          for a balanced, diverse diet and healthy living practices.
        </li>
      </ul>

      <h2>3. Individual Variations and Efficacy</h2>
      <p>
        SpiruPop is formulated to provide natural support for adult hair, skin,
        and nails. However, physical biochemistry is highly distinct. Factors
        such as underlying genetic traits, age (specifically within the 35+
        professional demographic), lifestyle complexities, daily stress levels,
        and dietary habits heavily influence how your body assimilates natural
        bioactives. Consequently, SpiruPop does not guarantee uniform, identical,
        or instantaneous transformations. Consider this product a strategic,
        long-term investment in your personal longevity rather than a temporary
        trend.
      </p>

      <h2>4. Contraindications and Personal Allergens</h2>
      <ul>
        <li>
          Please meticulously examine the full list of 12 natural ingredients
          detailed on our PVC plastic labels before consumption to avoid any
          individual allergen risks.
        </li>
        <li>
          If you are currently pregnant, nursing, taking prescription
          medications (especially immunosuppressants, blood pressure, or
          blood-thinning treatments), anticipating a medical operation, or
          suffering from a chronic health condition (such as specific autoimmune
          conditions sensitive to superfoods), you must clear this formulation
          with your physician prior to use.
        </li>
        <li>
          In the rare event that you experience a personal hypersensitivity
          reaction or physical discomfort, discontinue use immediately and seek
          professional medical guidance.
        </li>
      </ul>
    </PolicyShell>
  );
}
