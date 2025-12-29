// src/pages/CookiePolicy.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function CookiePolicy() {
  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Cookie Policy | Nilta Flooring</title>
        <meta
          name="description"
          content="Learn how Nilta Flooring uses cookies and similar technologies to improve your browsing experience and protect your privacy."
        />
      </Helmet>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Cookie Policy</h1>

        <p className="text-sm text-white/60 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm md:text-base text-white/80 leading-relaxed">
          <p>
            This Cookie Policy explains how <strong>Nilta Flooring</strong> ("we",
            "our", or "us") uses cookies and similar technologies when you visit
            our website. This policy explains what these technologies are, why we
            use them, and your rights to control their use.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device when you visit a
            website. They allow the website to recognize your device, remember
            your preferences, and enhance your browsing experience. Cookies may
            be session-based (deleted when you close your browser) or persistent
            (stored for a longer period).
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Why We Use Cookies</h2>
          <p>We use cookies for several purposes, including:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensuring the website functions correctly and securely.</li>
            <li>Remembering your preferences and settings.</li>
            <li>Understanding how visitors interact with our website.</li>
            <li>Improving website performance and user experience.</li>
            <li>Preventing fraudulent activity and enhancing security.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. Types of Cookies We Use</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Required for the operation of
              our website. These include cookies that enable core functionality
              such as security, authentication, and accessibility.
            </li>
            <li>
              <strong>Performance & Analytics Cookies:</strong> Help us understand
              how visitors interact with the site so we can improve usability and
              performance.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Allow the website to remember
              choices you make, such as language preferences or region.
            </li>
            <li>
              <strong>Third-Party Cookies:</strong> Set by external services such
              as payment processors or analytics providers. These are governed by
              the respective third-party privacy policies.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Managing Cookies</h2>
          <p>
            You can manage or disable cookies through your browser settings at
            any time. Most browsers allow you to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>View and delete existing cookies.</li>
            <li>Block cookies entirely or selectively.</li>
            <li>Receive alerts before cookies are stored.</li>
          </ul>
          <p>
            Please note that disabling certain cookies may limit the
            functionality of the website or affect your overall experience.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Third-Party Services</h2>
          <p>
            We may use third-party services such as analytics providers, payment
            processors, or embedded content providers. These services may place
            their own cookies on your device and collect information in
            accordance with their own privacy policies.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes
            in legal requirements or how we operate. When updates are made, the
            “Last updated” date at the top of this page will be revised.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Contact Information</h2>
          <p>
            If you have any questions or concerns about this Cookie Policy or how
            we use cookies, please contact us at{" "}
            <a
              href="mailto:privacy@niltflooring.com"
              className="text-red-400 underline hover:text-red-300"
            >
              privacy@niltflooring.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
