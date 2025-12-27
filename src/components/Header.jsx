// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Hammer } from "lucide-react";

const NAV = [
   
  { label: "Home Page", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Residential", href: "/residential" },
  { label: "Commercial", href: "/commercial" },
  { label: "Products", href: "/store" },
  { label: "Guide & Tips ", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },

];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-wide">
            <Hammer className="h-6 w-6 text-red-500" />
            <span>Nilta Flooring</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`relative transition-colors ${isActive(item.href)
                  ? "text-white"
                  : "text-white/70 hover:text-white"
                  }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-red-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="md:hidden rounded-xl p-2 hover:bg-white/5"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed top-0 right-0 h-screen w-[88vw] max-w-sm bg-neutral-900/95 backdrop-blur-xl shadow-2xl z-50"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Hammer className="h-5 w-5 text-red-500" />
                <span>Menu</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-white/5"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="px-4 pb-6 space-y-2">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-lg hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}
