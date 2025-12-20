// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Privacy Policy | Nilta Flooring</title>
        <meta
          name="description"
          content="Privacy Policy explaining how Nilta Flooring collects, uses and protects personal information."
        />
      </Helmet>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-white/60 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm md:text-base text-white/80 leading-relaxed">
          <p>
            This Privacy Policy describes how Nilta Flooring (&quot;we&quot;,
            &quot;us&quot;, &quot;our&quot;) collects, uses and protects your
            personal information when you visit our website, request a quote,
            place an order or use our services.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            1. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Contact details such as your name, email address and phone number
              when you submit a form or place an order.
            </li>
            <li>
              Address information for shipping, billing and installation
              purposes.
            </li>
            <li>
              Project details you share in quote or contact forms.
            </li>
            <li>
              Payment-related information processed securely by Stripe (we do
              not store full card numbers).
            </li>
            <li>
              Technical data such as IP address, browser type and pages visited,
              typically via cookies or analytics tools.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To process and fulfill orders and bookings.</li>
            <li>To send order confirmations, invoices and service updates.</li>
            <li>To respond to your questions and quote requests.</li>
            <li>To improve our website, services and customer experience.</li>
            <li>To detect and prevent fraud or misuse of our services.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">
            3. Legal Basis for Processing
          </h2>
          <p>
            We process personal data based on one or more of the following legal
            grounds: your consent, performance of a contract, compliance with a
            legal obligation or our legitimate business interests.
          </p>

          <h2 className="text-xl font-semibold mt-6">4. Data Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect
            your information, including encrypted connections (HTTPS) and secure
            third-party payment processing through Stripe. However, no method of
            transmission or storage is completely secure, and we cannot
            guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            5. Sharing of Information
          </h2>
          <p>
            We may share your information with trusted third parties who help us
            operate our business, such as:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Payment processors (e.g. Stripe).</li>
            <li>Email and hosting providers.</li>
            <li>
              Delivery partners and installation teams, where necessary to
              complete your project.
            </li>
          </ul>
          <p>
            We do not sell your personal information to third parties for
            marketing purposes.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Cookies</h2>
          <p>
            We use cookies to enable core site functionality, remember your
            preferences and gather basic analytics. For more details, see our{" "}
            <a
              href="/cookie-policy"
              className="text-red-400 underline hover:text-red-300"
            >
              Cookie Policy
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to access, update
            or request deletion of your personal data. To exercise these rights,
            please contact us using the details below.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            8. Retention of Information
          </h2>
          <p>
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this policy, unless a longer
            retention period is required or permitted by law.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated &quot;Last updated&quot;
            date.
          </p>

          <h2 className="text-xl font-semibold mt-6">10. Contact</h2>
          <p>
            For questions about this Privacy Policy or our data practices,
            please contact:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:privacy@niltflooring.com"
              className="text-red-400 underline hover:text-red-300"
            >
              privacy@niltflooring.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
