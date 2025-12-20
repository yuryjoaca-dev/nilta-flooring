// src/pages/RefundPolicy.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function RefundPolicy() {
  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Refund & Returns Policy | Nilta Flooring</title>
        <meta
          name="description"
          content="Refund and return conditions for Nilta Flooring products and installation services."
        />
      </Helmet>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Refund &amp; Returns Policy
        </h1>
        <p className="text-sm text-white/60 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm md:text-base text-white/80 leading-relaxed">
          <p>
            Nilta Flooring aims to ensure that every customer is satisfied with
            their purchase. Because flooring products are often cut to size or
            custom-ordered, certain limitations apply to returns and refunds.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            1. Returns for Products
          </h2>
          <p>
            We may accept returns within 14 days of delivery, provided that:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>The product is unused and in resalable condition.</li>
            <li>
              Original packaging is intact, including boxes, labels and
              accessories.
            </li>
            <li>
              The product is not a custom order, clearance item or special
              promotion explicitly marked as non-returnable.
            </li>
            <li>
              The customer is responsible for return shipping costs, unless the
              return is due to our error.
            </li>
          </ul>

          <p className="mt-4">
            Custom flooring, special orders, cut materials, clearance items and
            installed products are generally non-refundable.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            2. Damaged or Incorrect Items
          </h2>
          <p>
            If your order arrives damaged or you receive the wrong items, please
            contact us within 48 hours of delivery with photos and a
            description of the issue. We will review the case and may offer a
            replacement, refund or partial credit, depending on the situation.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            3. Installation Services
          </h2>
          <p>
            For installation bookings, refunds are generally not available once
            work has started. If you need to cancel or reschedule, please notify
            us at least 24 hours before the scheduled time. Short-notice
            cancellations may be subject to a fee.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            4. Refund Method and Timing
          </h2>
          <p>
            Approved refunds are typically processed to the original payment
            method via Stripe within 5–10 business days, depending on your
            bank or card issuer.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            5. How to Request a Refund or Return
          </h2>
          <p>
            To request a refund, return or exchange, please contact us with your
            order details, photos (if applicable) and an explanation of the
            issue:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@niltflooring.com"
              className="text-red-400 underline hover:text-red-300"
            >
              support@niltflooring.com
            </a>
          </p>

          <p className="text-xs text-white/50 mt-6">
            This policy is intended as a general guide and may be adapted to
            specific projects or written agreements. For large commercial or
            custom work, additional terms may apply.
          </p>
        </div>
      </section>
    </main>
  );
}
