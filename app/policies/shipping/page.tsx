import type { Metadata } from "next";
import PolicyShell from "@/components/PolicyShell";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "SpiruPop shipping, dispatch and delivery policy across India.",
};

export default function ShippingPage() {
  return (
    <PolicyShell title="Shipping & Delivery Policy" active="/policies/shipping">
      <p>
        Welcome to the SpiruPop community. We are dedicated to making our
        ancient, natural superfood solutions accessible to professionals all
        across India. We coordinate with trusted local delivery networks to
        ensure that your strategic investment in wellness arrives securely at
        your doorstep.
      </p>

      <h2>1. Payment Terms</h2>
      <p>
        SpiruPop runs on a digital e-commerce model to streamline operations and
        ensure authentic distribution. We do not offer Cash on Delivery (COD).
        All shipments are processed only after a successful online payment
        transaction is cleared through our secure checkout gateway.
      </p>

      <h2>2. Dispatch Timelines</h2>
      <p>
        We respect your routine and performance strategy. All orders are
        systematically packaged and dispatched within 24 to 48 hours of order
        confirmation. Orders placed on Sundays or public holidays will be
        processed for dispatch on the next working day.
      </p>

      <h2>3. Estimated Delivery Times</h2>
      <p>
        While we utilize prompt local delivery logistics to speed up transits,
        standard estimated delivery timelines are generally as follows:
      </p>
      <ul>
        <li>
          <strong>Metro Cities</strong> (Mumbai, Delhi, Bengaluru, Pune,
          Chennai, etc.): 3 to 5 business days from dispatch.
        </li>
        <li>
          <strong>Rest of India</strong> (Tier-2, Tier-3, and regional
          locations): 5 to 7 business days from dispatch.
        </li>
      </ul>
      <p>
        Please note: Minor delays may occasionally occur due to unpredictable
        logistics anomalies, weather challenges, or peak festive disruptions. We
        appreciate your professional understanding during these rare events.
      </p>

      <h2>4. Shipping Fees</h2>
      <p>
        To encourage a seamless transition into an enhanced lifestyle, we offer
        Free Shipping across India on all orders placed through our website.
        There are no hidden delivery fees or handling costs added at checkout.
      </p>

      <h2>5. Tracking Your Order</h2>
      <p>
        Once your soft mauve HDPE bottle is dispatched from our facility, an
        automated tracking link will be delivered to your registered email
        address and phone number via text or digital communication channels. You
        can use this tracking link to check your package status in real time.
      </p>

      <h2>6. Address Accuracy & Non-Delivery</h2>
      <p>
        Our delivery partners will attempt delivery up to 3 times before marking
        a package as undeliverable.
      </p>
      <ul>
        <li>
          Please ensure that your delivery address, nearby landmarks, and
          pincode are perfectly accurate while placing the order.
        </li>
        <li>
          If a package is returned to our registered office (Plot no. 275,
          Shubhechha Bunglow, Behind ITI, Khutwad Nagar, Nashik - 422008) due to
          an incorrect address or total unavailability of the recipient, a
          reshipping charge may be applicable to dispatch the package a second
          time.
        </li>
      </ul>
    </PolicyShell>
  );
}
