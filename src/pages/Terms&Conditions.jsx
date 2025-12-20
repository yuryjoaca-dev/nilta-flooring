// src/pages/Terms&Conditions.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function TermsAndConditions() {
  return (
    <main className="pt-16 min-h-screen bg-grey-650 text-white">
      <Helmet>
        <title>Terms & Conditions | Nilta Flooring</title>
        <meta
          name="description"
          content="Terms and conditions for using the Nilta Flooring website, purchasing products and booking services."
        />
      </Helmet>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-white/60 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm md:text-base text-white/80 leading-relaxed">
          <p>
            Welcome to Nilta Flooring. By accessing or using our website,
            requesting a quote, purchasing products, or booking services, you
            agree to be bound by these Terms &amp; Conditions. If you do not
            agree, please do not use this website.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Definitions</h2>
          <p>
            In these Terms, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;
            and &quot;our&quot; refer to Nilta Flooring. &quot;Customer&quot;,
            &quot;you&quot; and &quot;your&quot; refer to any individual or
            entity using our website or purchasing our products or services.
            &quot;Products&quot; refers to flooring materials and related
            items. &quot;Services&quot; refers to installation, delivery,
            consultation and related work.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Use of the Website</h2>
          <p>
            You agree to use this website only for lawful purposes. You must not
            attempt to gain unauthorized access, interfere with the operation of
            the site, or submit fraudulent or misleading information.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            3. Pricing and Payment
          </h2>
          <p>
            All prices are shown in Canadian Dollars (CAD) unless stated
            otherwise. Taxes are calculated automatically at checkout based on
            your location. Payments are processed securely through Stripe. We do
            not store full credit card numbers on our servers.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            4. Orders and Availability
          </h2>
          <p>
            All orders are subject to availability and our acceptance. Product
            images are illustrative and actual colours, textures and finishes
            may vary. We reserve the right to cancel or refuse any order, for
            example in case of suspected fraud or pricing errors.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Delivery</h2>
          <p>
            Delivery times are estimates only and are not guaranteed. We are not
            liable for delays caused by carriers, weather conditions, customs or
            other factors beyond our control. It is your responsibility to
            provide accurate delivery information.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            6. Installation Services
          </h2>
          <p>
            If you book installation with us, the work area must be clear,
            accessible and ready as agreed. Unforeseen conditions (such as
            subfloor issues, moisture, structural problems) may result in
            additional charges or rescheduling.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            7. Returns and Refunds
          </h2>
          <p>
            Returns, refunds and cancellations are governed by our{" "}
            <a
              href="/refund-policy"
              className="text-red-400 underline hover:text-red-300"
            >
              Refund &amp; Returns Policy
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold mt-6">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Nilta Flooring is not liable
            for indirect, incidental, special or consequential damages arising
            from the use of our products, services or website. Our total
            liability in connection with any claim is limited to the amount you
            paid for the product or service in question.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Province of Ontario and
            the laws of Canada applicable therein. Any disputes shall be subject
            to the exclusive jurisdiction of the courts of Ontario.
          </p>

          <h2 className="text-xl font-semibold mt-6">10. Contact</h2>
          <p>
            If you have any questions regarding these Terms &amp; Conditions,
            please contact us at{" "}
            <a
              href="mailto:support@niltflooring.com"
              className="text-red-400 underline hover:text-red-300"
            >
              support@niltflooring.com
            </a>
            .
          </p>

          <p className="text-xs text-white/50 mt-6">
            This document is provided for general information and does not
            constitute legal advice. You may wish to consult a legal
            professional to review these terms for your specific business needs.
          </p>
        </div>
      </section>
    </main>
  );
}
