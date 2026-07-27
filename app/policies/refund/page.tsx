import type { Metadata } from "next";
import PolicyShell from "@/components/PolicyShell";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "SpiruPop refund, cancellation and replacement policy by Spiruhome Global Solutions.",
};

export default function RefundPage() {
  return (
    <PolicyShell title="Refund & Cancellation Policy" active="/policies/refund">
      <p>
        At SpiruPop, your wellness and trust matter to us. We are committed to
        delivering high-quality, sustainably sourced superfood formulations with
        the highest standards of safety and quality.
      </p>
      <p>
        As our products are premium ingestible wellness and consumable
        formulations, we maintain strict quality and hygiene standards. However,
        if you experience any issue with your order, we are here to help.
      </p>

      <h2>Cancellation Policy</h2>
      <ul>
        <li>
          Your order can only be cancelled if it has not yet been shipped from
          our facility. To cancel, please write to our customer support team
          immediately at{" "}
          <a href="mailto:support.spirupop@gmail.com">
            support.spirupop@gmail.com
          </a>{" "}
          or call us at +91 7972452200.
        </li>
        <li>
          In such cases, the order will be cancelled, and the refund will be
          processed by us within 5 to 7 business days after the cancellation
          request is acknowledged.
        </li>
        <li>
          Orders cannot be cancelled once they have been handed over to our
          delivery partners and shipped.
        </li>
      </ul>

      <h2>Returns & Replacements</h2>
      <p>
        You can raise a request for a replacement or return within 48 hours of
        delivery only if:
      </p>
      <ol>
        <li>
          The product delivered is visibly damaged, leaking, tampered with,
          broken, or the outer protective seal is compromised.
        </li>
        <li>The wrong or incorrect product is delivered.</li>
        <li>The order arrived incomplete or is missing items.</li>
      </ol>

      <h2>Non-Eligible Cases</h2>
      <p>
        For strict safety and hygiene reasons, the following are completely
        ineligible for refunds, returns, or replacements:
      </p>
      <ul>
        <li>
          Products that have been opened, unsealed, consumed, used, or altered
          in any manner.
        </li>
        <li>
          Original packaging elements (outer mauve HDPE bottles, PVC plastic
          labels, inner seals, or caps) are missing, marked, or damaged.
        </li>
        <li>
          The return/replacement request is generated more than 48 hours after
          the date of delivery.
        </li>
        <li>Delivery delays caused by unforeseen third-party logistics issues.</li>
        <li>A &ldquo;change of mind&rdquo; after purchase.</li>
        <li>
          Individual taste preferences, personal sensory experiences, or
          expected cosmetic/health timelines differing from experience. As
          premium botanical wellness products work naturally and synergistically
          with individual biochemistry, physical outcomes vary from person to
          person.
        </li>
      </ul>

      <h2>How to Raise a Request</h2>
      <p>
        If you would like to report an issue with a product, let us know by
        emailing us at{" "}
        <a href="mailto:support.spirupop@gmail.com">support.spirupop@gmail.com</a>{" "}
        within 48 hours of receiving the product. Your email must contain:
      </p>
      <ul>
        <li>Order ID</li>
        <li>Customer Name</li>
        <li>Items you want to report</li>
        <li>Reason for the request</li>
        <li>
          <strong>Mandatory Proof:</strong> You must include a clear, unedited
          unboxing video and high-resolution images as proof in your email.
          Without a valid unboxing video showing the shipping label and the
          damage upon arrival, we will not be able to initiate an internal
          investigation or approve a replacement.
        </li>
      </ul>
      <p>
        We will investigate and review your return request within 48 working
        hours. If, based on our examination, the product is verified to be
        defective or damaged in transit, we will request you to discard the
        product and we will provide a complimentary replacement shipped directly
        to you.
      </p>

      <h2>Refund Issuance Conditions</h2>
      <p>Refunds are issued selectively and will not be granted if:</p>
      <ul>
        <li>
          The returned item is noticeably tampered with or consumed in part.
        </li>
        <li>
          The shipping address provided by the customer during checkout was
          incorrect or unreachable.
        </li>
        <li>The user fails to comply with the validation criteria mentioned above.</li>
      </ul>
      <p>
        Refunds may be processed back to the original source payment method
        within 5 to 7 business days under the following rare circumstances:
      </p>
      <ul>
        <li>The ordered product is temporarily out of stock.</li>
        <li>
          The shipping location is determined to be entirely unserviceable by
          our logistics network.
        </li>
        <li>
          A customer was accidentally charged twice for a single order due to a
          payment gateway glitch (verified via the same email address).
        </li>
      </ul>
    </PolicyShell>
  );
}
