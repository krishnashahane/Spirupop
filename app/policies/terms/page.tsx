import type { Metadata } from "next";
import PolicyShell from "@/components/PolicyShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for SpiruPop, operated by Spiruhome Global Solutions.",
};

export default function TermsPage() {
  return (
    <PolicyShell title="Terms & Conditions" active="/policies/terms">
      <h2>Overview</h2>
      <p>
        This website is operated by Spiruhome Global Solutions under the brand
        name SpiruPop. Throughout the site, the terms &ldquo;we&rdquo;,
        &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Spiruhome Global
        Solutions. We offer this website, including all information, tools, and
        services available from this site to you, the user, conditioned upon
        your acceptance of all terms, conditions, policies, and notices stated
        here.
      </p>
      <p>
        By visiting our site and/or purchasing a product from us, you engage in
        our &ldquo;Service&rdquo; and agree to be bound by the following terms
        and conditions (&ldquo;Terms of Service&rdquo;, &ldquo;Terms&rdquo;),
        including those additional terms and conditions and policies referenced
        herein and/or available by hyperlink. These Terms of Service apply to
        all users of the site, including without limitation users who are
        browsers, vendors, customers, merchants, and/or contributors of content.
      </p>
      <p>
        Please read these Terms of Service carefully before accessing or using
        our website. By accessing or using any part of the site, you agree to be
        bound by these Terms of Service. If you do not agree to all the terms
        and conditions of this agreement, then you may not access the website or
        use any services.
      </p>

      <h2>Section 1 — Online Store Terms</h2>
      <p>
        By agreeing to these Terms of Service, you represent that you are at
        least the age of majority in your state or province of residence. You
        may not use our products for any illegal or unauthorized purpose nor
        may you, in the use of the Service, violate any laws in your
        jurisdiction (including but not limited to copyright laws). You must not
        transmit any worms or viruses or any code of a destructive nature. A
        breach or violation of any of the Terms will result in an immediate
        termination of your Services.
      </p>

      <h2>Section 2 — Eligibility and Intended Use</h2>
      <p>
        SpiruPop is a premium wellness movement designed to seamlessly integrate
        natural solutions into the routines of modern professionals. Our
        premiere product features an enhanced Spirulina-based formulation inside
        specialized HPMC vegetable capsules, alongside 11 bioactive botanicals
        targeted for hair, skin, and nails support. These products are intended
        for adult use (ideally optimized for individuals aged 35 and above). By
        purchasing, you acknowledge that you are using these products
        intentionally for personal lifestyle supplementation.
      </p>

      <h2>Section 3 — Modifications to the Service and Prices</h2>
      <p>
        Prices for our products are subject to change without notice. We reserve
        the right at any time to modify or discontinue the Service (or any part
        or content thereof) without notice at any time. We shall not be liable
        to you or to any third-party for any modification, price change,
        suspension or discontinuance of the Service.
      </p>

      <h2>Section 4 — Accuracy of Billing and Prepaid Account Information</h2>
      <p>
        SpiruPop operates exclusively on a digital, prepaid commerce structure
        and does not offer Cash on Delivery (COD). We reserve the right to
        refuse any order you place with us. We may, in our sole discretion,
        limit or cancel quantities purchased per person, per household or per
        order. In the event that we make a change to or cancel an order, we may
        attempt to notify you by contacting the e-mail and/or billing
        address/phone number provided at the time the order was made. You agree
        to provide current, complete and accurate purchase and account
        information for all purchases made at our store.
      </p>

      <h2>Section 5 — Intellectual Property Rights</h2>
      <p>
        The brand name &ldquo;SpiruPop&rdquo; is a trademark currently in
        process. All custom logos, Neo-Minimalist visual aesthetics, graphics,
        copy, and product packaging details displayed on this website are the
        intellectual property of Spiruhome Global Solutions. Unauthorized
        reproduction or use of these assets is strictly prohibited.
      </p>

      <h2>Section 6 — Governing Law and Jurisdiction</h2>
      <p>
        These Terms of Service and any separate agreements whereby we provide
        you Services shall be governed by and construed in accordance with the
        laws of India, and any disputes or legal proceedings arising out of
        these terms shall be subject to the exclusive jurisdiction of the courts
        located in Nashik, Maharashtra, India.
      </p>

      <h2>Section 7 — Contact Information</h2>
      <p>Questions about the Terms of Service should be sent to us at:</p>
      <ul>
        <li>Company Name: Spiruhome Global Solutions</li>
        <li>Brand Name: SpiruPop</li>
        <li>
          Registered Address: Plot no. 275, Shubhechha Bunglow, Behind ITI,
          Khutwad Nagar, Nashik - 422008, Maharashtra, India.
        </li>
        <li>
          Customer Care Email:{" "}
          <a href="mailto:support.spirupop@gmail.com">
            support.spirupop@gmail.com
          </a>
        </li>
        <li>Customer Care Number: +91 7972452200</li>
      </ul>
    </PolicyShell>
  );
}
