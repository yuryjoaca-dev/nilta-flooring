// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ImageSlider from "../components/ImageSlider";

const COMPANY = "Nilta Flooring";

/**
 * ✅ Update these paths to match your actual images.
 * Put your storefront + interior photos here.
 */
const STOREFRONT_GALLERY = [
  { src: "/home/storefront/exterior-1.webp", label: "Showroom exterior" },
  { src: "/home/storefront/interior-1.webp", label: "Showroom interior" },
  { src: "/home/storefront/interior-2.webp", label: "Sample wall & displays" },
  { src: "/home/storefront/exterior-2.webp", label: "Storefront signage" },
  { src: "/home/storefront/interior-3.webp", label: "Flooring displays" },
  { src: "/home/storefront/interior-4.webp", label: "Consultation area" },
];

export default function Home() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <main className="bg-[#0b0b0b] text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background image / gradient */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-black via-[#8F2841] to-black opacity-70" />

          <img
            src="/home/home-hero.webp"
            alt="Nilta Flooring"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="uppercase tracking-[0.3em] text-sm text-gray-300 mb-4">
              Premium Flooring • Alberta
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Floors that <span className="text-[#F3E9EC]">transform</span> your
              entire space.
            </h1>
            <p className="text-gray-200 text-base md:text-lg max-w-xl mb-8">
              {COMPANY} specializes in high-end flooring installations — hardwood,
              luxury vinyl, tile and more — with meticulous detail, durable
              materials and a clean, client-focused process.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition"
              >
                View our projects
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full border border-gray-400 text-gray-100 hover:bg-white hover:text-black transition"
              >
                Get a free estimate
              </Link>
            </div>
          </motion.div>

          {/* Hero side card / image */}
          <motion.div
            className="flex-1 max-w-md w-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold mb-2">
                Flooring that’s built to last.
              </h2>
              <p className="text-sm text-gray-300 mb-4">
                We combine premium materials, clean installation and precise
                leveling to create floors that look incredible and feel solid for
                years.
              </p>

              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8F2841]" />
                  Hardwood, vinyl, laminate & tile
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8F2841]" />
                  Residential & light commercial
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8F2841]" />
                  Clean job sites & tight timelines
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✅ NEW: SHOWROOM / STOREFRONT PREVIEW */}
      <section className="bg-[#0f0f10] py-14 md:py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3">
                Visit Our Showroom
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                See Where the Work Happens
              </h2>
              <p className="text-gray-300 mt-3 text-sm md:text-base leading-relaxed">
                From showroom displays to real project setups, take a look inside and get familiar before stopping by.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base"
              >
                Plan a visit
              </Link>
              <a
                href="https://www.google.com/maps/place/Nilta+Flooring/@42.133068,161.5542556,13321001m/data=!3m1!1e3!4m10!1m2!2m1!1shttps:%2F%2Fwww.google.com%2Fmaps%2Fplace%2FNilta+Flooring%2F@53.5582498,-113.6045098,651m%2Fdata%3D*213m1*211e3*214m15*211m8*213m7*211s0x53a0213c395ea7ad:0xb846e04aa5c98811*212s16307+111+Ave+NW,+Edmonton,+AB+T5M+2S2,+Canada*213b1*218m2*213d53.5582498*214d-113.6045098*2116s%2Fg%2F11bw434921*213m5*211s0x53a0213143d4e409:0x15831b4db9b30384*218m2*213d53.5582498*214d-113.6045098*2116s%2Fg%2F11lkczv91l%3Fentry%3Dttu!3m6!1s0x53a0213143d4e409:0x15831b4db9b30384!8m2!3d53.5582498!4d-113.6045098!15sCt4CaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL3BsYWNlL05pbHRhIEZsb29yaW5nL0A1My41NTgyNDk4LC0xMTMuNjA0NTA5OCw2NTFtL2RhdGE9ITNtMSExZTMhNG0xNSExbTghM203ITFzMHg1M2EwMjEzYzM5NWVhN2FkOjB4Yjg0NmUwNGFhNWM5ODgxMSEyczE2MzA3IDExMSBBdmUgTlcsIEVkbW9udG9uLCBBQiBUNU0gMlMyLCBDYW5hZGEhM2IxIThtMiEzZDUzLjU1ODI0OTghNGQtMTEzLjYwNDUwOTghMTZzL2cvMTFidzQzNDkyMSEzbTUhMXMweDUzYTAyMTMxNDNkNGU0MDk6MHgxNTgzMWI0ZGI5YjMwMzg0IThtMiEzZDUzLjU1ODI0OTghNGQtMTEzLjYwNDUwOTghMTZzL2cvMTFsa2N6djkxbD9lbnRyeT10dHUiA4gBAZIBDmZsb29yaW5nX3N0b3Jl4AEA!16s%2Fg%2F11lkczv91l?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full border border-white/25 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base"
              >
                Open in Maps
              </a>
            </div>
          </div>

          {/* Gallery grid */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {STOREFRONT_GALLERY.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setLightbox(img)}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-lg text-left
                  ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-xs md:text-sm font-semibold text-white">
                    {img.label}
                  </div>
                  <div className="text-[11px] text-white/70">Click to view</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm grid place-items-center p-5"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">
                <img
                  src={lightbox.src}
                  alt={lightbox.label}
                  className="w-full max-h-[80vh] object-contain"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-white/80 text-sm">{lightbox.label}</div>
                <button
                  className="text-white/80 text-sm rounded-full border border-white/20 px-4 py-2 hover:bg-white/10 transition"
                  onClick={() => setLightbox(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4 ANIMATED COLUMNS SECTION */}
      <section className="bg-black">
        <div className="flex flex-col md:flex-row w-full min-h-[80vh]">
          {[
            {
              title: "Our Team",
              desc: "Experienced installers, detail-obsessed craftsmanship and a friendly, on-site presence.",
              images: ["/home/our-team-2.webp"],
              link: "/about",
              cta: "Meet the team",
            },
            {
              title: "Projects",
              desc: "From modern condos to full home renovations — explore real Nilta Flooring transformations.",
              images: ["/home/projects.jpg"],
              link: "/projects",
              cta: "See our work",
            },
            {
              title: "Materials We Use",
              desc: "Carefully selected hardwood, luxury vinyl, tile and underlayment from trusted suppliers.",
              images: ["/home/material.webp"],
              link: "/materials",
              cta: "View materials",
            },
            {
              title: "Get in Touch",
              desc: "Tell us about your space and vision — we’ll help you choose the perfect flooring solution.",
              images: ["/home/get-in-touch.webp"],
              link: "/contact",
              cta: "Request a quote",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="
                relative h-[320px] md:h-[80vh] overflow-hidden flex-1 group cursor-pointer
                transition-[flex] duration-700 ease-in-out
                hover:flex-[3]
              "
            >
              {/* Background slider + zoom on hover */}
              <motion.div
                className="absolute inset-0"
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <ImageSlider images={item.images} />
              </motion.div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500" />

              {/* Centered content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
                <motion.h3
                  className="text-2xl md:text-3xl font-bold mb-2"
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {item.title}
                </motion.h3>

                <p
                  className="
                    text-sm md:text-base max-w-[260px] mb-6
                    opacity-0 translate-y-3
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-500 ease-out
                  "
                >
                  {item.desc}
                </p>

                <Link
                  to={item.link}
                  className="
                    bg-[#8F2841] hover:bg-[#a73753]
                    text-white px-5 py-2.5 rounded-full shadow-lg
                    text-sm md:text-base font-semibold
                    transition
                  "
                >
                  {item.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#0f0f10] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why choose <span className="text-[#8F2841]">{COMPANY}</span>?
              </h2>
              <p className="text-gray-300 mb-6">
                Flooring is the foundation of your space — visually and
                structurally. We treat every installation like it&apos;s our own
                home, combining precision, communication and clean work
                practices.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-100">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Detail-driven installs
                  </h3>
                  <p className="text-gray-300">
                    Proper subfloor prep, tight cuts and smooth transitions,
                    minimizing squeaks and gaps.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Clear communication
                  </h3>
                  <p className="text-gray-300">
                    Straightforward timelines, honest expectations and
                    consistent updates throughout the project.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Trusted materials
                  </h3>
                  <p className="text-gray-300">
                    We work with suppliers we trust, using products suited to
                    Alberta&apos;s climate and lifestyle.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Respect for your home
                  </h3>
                  <p className="text-gray-300">
                    Protecting existing finishes, daily clean-ups and a tidy
                    site from start to finish.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/home/premiumflooring-2.webp"
                  alt="Premium flooring installation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-20 -right-2 -left-0 bg-[#8F2841] text-white px-4 py-3 rounded-2xl shadow-lg text-sm">
                <div className="font-semibold">Over 100+ floors installed</div>
                <div className="text-xs text-pink-100">
                  Residential &amp; light commercial projects completed.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MINI CTA SECTION */}
      <section className="bg-[#8F2841] text-white py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">
              Ready to upgrade your flooring?
            </h2>
            <p className="text-sm md:text-base text-[#F9EDEF]">
              Tell us about your project and we&apos;ll help you choose the right
              material, style and installation plan.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-full bg-black hover:bg-zinc-900 text-white font-semibold shadow-lg transition text-sm md:text-base"
          >
            Book a consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
