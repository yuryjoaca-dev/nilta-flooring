import React from "react";
import { Instagram, Hammer } from "lucide-react";
import { Link } from "react-router-dom";

const NAV = [
  { label: "Projects", href: "/projects" },
  { label: "Residential", href: "/residential" },
  { label: "Guides & Tips", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const mapsUrl =
    "https://www.google.com/maps/place/Nilta+Flooring/@53.5586217,-113.6048908,42m/data=!3m1!1e3!4m6!3m5!1s0x53a0213143d4e409:0x15831b4db9b30384!8m2!3d53.5582498!4d-113.6045098!16s%2Fg%2F11lkczv91l?entry=ttu";


  return (
    <footer className="bg-neutral-980">
      <div className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-4 gap-10">
        {/* BRAND */}
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center">
            <img
              src="/logo/nilta-logo.webp"
              alt="Nilta Flooring"
              className="h-16 md:h-18 w-auto object-contain"
            />
          </Link>

          <p className="mt-4 text-white/70 max-w-md">
            We are a proudly Canadian flooring company, supplying and installing high-quality residential and commercial flooring nationwide, with a focus on thoughtful planning, clean installs, and floors made for everyday life.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <div className="font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2 text-white/80">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link className="hover:text-red-400 transition" to={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <div className="font-semibold mb-3">Contact Us</div>

          <address className="not-italic text-white/80 space-y-2 text-sm">
            {/* Address + Google Maps */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-red-400 transition"
            >
              <div>16307 111 Ave NW,</div>
              <div>Edmonton, AB</div>
              <div>T5M 2S2</div>
            </a>

            {/* Phones */}
            <div className="pt-2">
              <span className="text-white/60">O: </span>
              <a
                href="tel:+17807619500"
                className="hover:text-red-400 transition"
              >
                1-780-761-9500
              </a>
            </div>
            <div>
              <span className="text-white/60">C: </span>
              <a
                href="tel:+17802225669"
                className="hover:text-red-400 transition"
              >
                1-780-222-5669
              </a>
            </div>

            {/* Email */}
            <div className="pt-2">
              <a
                href="mailto:info@nilta.ca"
                className="hover:text-red-400 transition"
              >
                info@nilta.ca
              </a>
            </div>
          </address>

          {/* SOCIAL */}
          <div className="mt-4 flex items-center gap-4">
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/niltaflooring/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/5 transition"
            >
              <Instagram />
            </a>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-white/50 flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
          <span>
            © {new Date().getFullYear()} Nilta Flooring Inc. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white/80">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-white/80">
              Terms & Conditions
            </Link>
            <Link to="/refund-policy" className="hover:text-white/80">
              Refund Policy
            </Link>
            <Link to="/cookie-policy" className="hover:text-white/80">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
