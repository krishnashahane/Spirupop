import type { Metadata } from "next";
import PolicyShell from "@/components/PolicyShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SpiruPop (Spiruhome Global Solutions) collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <PolicyShell title="Privacy Policy" active="/policies/privacy">
      <p>
        This Privacy Policy explains how Spiruhome Global Solutions
        (&ldquo;SpiruPop&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
        uses, discloses, and safeguards your information when you visit our
        website or contact our support team.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you voluntarily provide through our contact form —
        your name, email address, mobile number, and message. We do not process
        payments on this website; all purchases are completed securely on
        Amazon.in, which is governed by Amazon&apos;s own privacy policy.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To respond to your support, order, or business inquiries.</li>
        <li>To improve our products, content, and customer experience.</li>
        <li>To send service communications you have requested.</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>
        We never sell your personal data. Information is shared only with trusted
        processors (such as our email delivery provider) strictly to operate our
        service, and only as required by applicable law.
      </p>

      <h2>4. Data Security</h2>
      <p>
        Our website is served exclusively over encrypted HTTPS. We apply
        industry-standard administrative and technical safeguards to protect the
        limited personal data we hold against unauthorised access or disclosure.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal
        information at any time by emailing{" "}
        <a href="mailto:support.spirupop@gmail.com">support.spirupop@gmail.com</a>.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use only essential cookies required for the website to function. We do
        not use intrusive third-party advertising trackers.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this policy? Reach us at{" "}
        <a href="mailto:support.spirupop@gmail.com">support.spirupop@gmail.com</a>.
      </p>
    </PolicyShell>
  );
}
