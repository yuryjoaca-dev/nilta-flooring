// src/components/ServicePage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Hammer, Ruler, Paintbrush, Layers, Sparkles, ShieldCheck, Clock, BadgeCheck,
  Wrench, Drill, Rocket, ChevronDown
} from "lucide-react";

const ICONS = {
  Hammer, Ruler, Paintbrush, Layers, Sparkles, ShieldCheck, Clock, BadgeCheck, Wrench, Drill, Rocket
};

export default function ServicePage({
  title,
  subtitle,
  heroImg,
  features = [],          // [{ icon: "Hammer", title: "...", text: "..." }]
  process = [],           // ["Step 1 ...", "Step 2 ...", ...]
  gallery = [],           // [url, url, ...]
  faqs = []               // [{ q: "...", a: "..." }]
}) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img src={heroImg} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold">
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}
            className="mt-4 max-w-2xl text-white/85">{subtitle}</motion.p>
          <div className="mt-8">
            <a href="/contact" className="inline-flex rounded-full border border-red-500/80 px-6 py-3 font-semibold hover:bg-red-600/90 hover:border-red-600">
              Get a Free Quote
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">What’s Included</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = ICONS[f.icon] || Hammer;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-red-500" />
                    <div className="text-lg font-semibold">{f.title}</div>
                  </div>
                  <p className="mt-2 text-white/75">{f.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROCESS */}
      {process.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold">Our Process</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
                <div className="text-sm text-white/60">Step {i + 1}</div>
                <div className="mt-2 font-semibold">{step}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">Recent Work</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <img src={src} alt={`Gallery ${i + 1}`} className="h-56 w-full object-cover hover:scale-105 transition" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <h2 className="text-3xl md:text-4xl font-bold">FAQs</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03]">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                >
                  <span className="font-semibold">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 transition ${openIdx === i ? "rotate-180" : ""}`} />
                </button>
                {openIdx === i && (
                  <div className="px-5 pb-5 text-white/80">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA BAND */}
      <section className="bg-gradient-to-br from-red-700 via-neutral-900 to-black">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-semibold">Ready to start your {title.toLowerCase()}?</div>
          <a href="/projects" className="inline-flex rounded-full border border-red-500/80 px-6 py-3 font-semibold hover:bg-red-600/90 hover:border-red-600">
            Explore Projects
          </a>
        </div>
      </section>
    </main>
  );
}
