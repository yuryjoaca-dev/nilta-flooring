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
          content="Information about how Nilta Flooring uses cookies and similar technologies on this website."
        />
      </Helmet>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Cookie Policy</h1>
        <p className="text-sm text-white/60 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm md:text-base text-white/80 leading-relaxed">
          <p>
            This Cookie Policy explains how Nilta Flooring uses cookies and
            similar technologies on this website. By continuing to browse or use
            our site, you agree to the use of cookies as described below.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you
            visit a website. They help the site remember your actions and
            preferences over time.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Types of Cookies We Use</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <b>Essential cookies</b> – Required for basic site operation,
              security and keeping items in your cart.
            </li>
            <li>
              <b>Performance and analytics cookies</b> – Help us understand how
              visitors use the site so we can improve it.
            </li>
            <li>
              <b>Functional cookies</b> – Remember your preferences, such as
              language or region.
            </li>
            <li>
              <b>Third-party cookies</b> – Set by services such as Stripe
              Checkout or analytics tools.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. Third-Party Services</h2>
          <p>
            We may use third-party services such as Stripe for payments and
            analytics providers to help us understand how our website is used.
            These services may set their own cookies, which are subject to their
            respective privacy policies.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            4. Managing Cookies in Your Browser
          </h2>
          <p>
            Most web browsers allow you to control cookies through their
            settings. You can usually:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Delete existing cookies.</li>
            <li>Block all cookies or specific types of cookies.</li>
            <li>Set preferences for certain websites.</li>
          </ul>
          <p>
            Please note that disabling essential cookies may affect the
            functionality of our Store or prevent certain features from working
            correctly.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time, for example to
            reflect changes in technology or legal requirements. Any updates
            will be posted on this page.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Contact</h2>
          <p>
            If you have any questions about our use of cookies, please contact
            us at{" "}
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
