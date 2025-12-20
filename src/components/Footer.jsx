import React from "react";
import { Facebook, Instagram, Twitter, Hammer } from "lucide-react";
import { Link } from "react-router-dom";

const NAV = [
  { label: "Projects", href: "/projects" },
  { label: "Residential", href: "/residential" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-980">
      <div className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl"><Hammer className="h-6 w-6 text-red-500" /> Nilta Flooring Inc.</Link>
          <p className="mt-4 text-white/70 max-w-md">Edmonton-based flooring company supplying and installing high-quality residential and commercial floors across Alberta...</p>
        </div>
        <div>
          <div className="font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2 text-white/80">
            {NAV.map(n => (
              <li key={n.label}><Link className="hover:text-red-400" to={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Contact Us</div>
          <address className="not-italic text-white/80 space-y-2">
            <div>12345 Jasper Ave, Edmonton, AB</div>
            <div>(780) 555‑0123</div>
            <div>hello@niltaflooring.ca</div>
          </address>
          <div className="mt-4 flex items-center gap-4">
            <a aria-label="Facebook" href="#" className="p-2 rounded-lg hover:bg-white/5"><Facebook /></a>
            <a aria-label="Instagram" href="#" className="p-2 rounded-lg hover:bg-white/5"><Instagram /></a>
            <a aria-label="Twitter" href="#" className="p-2 rounded-lg hover:bg-white/5"><Twitter /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-white/50 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Nilta Flooring Inc. All rights reserved.</span>
          <a href="/privacy-policy" className="hover:text-white/80">Privacy Policy</a>
          <a href="/terms-and-conditions" className="hover:text-white/80">Terms & Conditions</a>
          <a href="refund-policy" className="hover:text-white/80"> Refund Policy</a>
        </div>
      </div>
    </footer>
  );
}
