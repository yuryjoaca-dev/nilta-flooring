// src/pages/Residential.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";
import {
  Home,
  Ruler,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SITE_URL = "https://example.com"; // TODO: replace with real domain

const API_BASE = "http://localhost:5000";

// --- SERVICES + IMAGES ---
// Change these image paths to your real photos (local or CDN)
const SERVICES = [
  {
    key: "whole-house",
    title: "Whole-House Flooring",
    subtitle: "Continuous flooring that ties together living rooms, halls and bedrooms.",
    icon: <Home className="h-4 w-4" />,
    images: [
      "/residential/wholehouse/1.webp",
      "/residential/wholehouse/2.webp",
      "/residential/wholehouse/3.webp",
      "/residential/wholehouse/4.jpg",
      "/residential/wholehouse/5.jpg",
      "/residential/wholehouse/6.jpg",
    ],
  },
  {
    key: "kitchens",
    title: "Kitchen Flooring",
    subtitle: "Durable, easy-to-clean floors for the busiest room in the house.",
    icon: <Ruler className="h-4 w-4" />,
    images: [
      "/residential/kitchen/1.jpg",
      "/residential/kitchen/2.jpg",
      "/residential/kitchen/3.jpg",
      "/residential/kitchen/4.jpg",
      "/residential/kitchen/5.jpg",
      "/residential/kitchen/6.jpg",
    ],
  },
  {
    key: "bathrooms",
    title: "Bathroom Tile & LVP",
    subtitle: "Waterproofed showers, crisp tile lines and moisture-smart LVP.",
    icon: <Layers className="h-4 w-4" />,
    images: [
      "/residential/bathroom-tile/1.jpg",
      "/residential/bathroom-tile/2.jpg",
      "/residential/bathroom-tile/3.jpg",
      "/residential/bathroom-tile/4.jpg",
      "/residential/bathroom-tile/5.jpg",
      "/residential/bathroom-tile/6.jpg",
    ],
  },
  {
    key: "basement",
    title: "Basement Flooring",
    subtitle: "Floors planned around comfort, sound and moisture in lower levels.",
    icon: <Layers className="h-4 w-4" />,
    images: [
      "/residential/basement/1.jpg",
      "/residential/basement/2.jpg",
      "/residential/basement/3.jpg",
      "/residential/basement/4.jpg",
      "/residential/basement/5.jpg",
      "/residential/basement/6.jpg",
    ],
  },
  {
    key: "stairs",
    title: "Stairs & Transitions",
    subtitle: "Solid, quiet stair runs and clean transitions between rooms.",
    // Reuse Ruler as a simple icon here
    icon: <Ruler className="h-4 w-4" />,
    images: [
      "/residential/stairs-transitions/1.jpg",
      "/residential/stairs-transitions/2.jpg",
      "/residential/stairs-transitions/3.jpg",
      "/residential/stairs-transitions/4.jpg",
      "/residential/stairs-transitions/5.jpg",
      "/residential/stairs-transitions/6.jpg",
    ],
  },
];

async function loadGallery() {
  const res = await fetch(`${API_BASE}/api/gallery`);
  const data = await res.json();

  const byCategory = {};
  data.forEach((img) => {
    if (!byCategory[img.category]) byCategory[img.category] = [];
    byCategory[img.category].push(`${API_BASE}${img.url}`);
  });
}
// Flatten all images so lightbox can move across everything
function buildFlatImages(services) {
  const flat = [];
  services.forEach((service) => {
    service.images.forEach((src) => {
      flat.push({ src, serviceTitle: service.title });
    });
  });
  return flat;
}

function findGlobalIndex(flatImages, src, serviceTitle) {
  return flatImages.findIndex(
    (img) => img.src === src && img.serviceTitle === serviceTitle
  );
}

export default function Residential() {
  const heroImg =
    "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=1600&auto=format&fit=crop";
  const heroVideo = "/video/about-residential.mp4";

  const [galleryByCategory, setGalleryByCategory] = useState({});

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch(`${API_BASE}/api/gallery`);
        if (!res.ok) throw new Error("Failed to load gallery");
        const data = await res.json();

        const byCategory = {};
        data.forEach((img) => {
          if (!byCategory[img.category]) byCategory[img.category] = [];
          byCategory[img.category].push(`${API_BASE}${img.url}`);
        });
        setGalleryByCategory(byCategory);
      } catch (err) {
        console.error("Failed to load gallery images", err);
      }
    }
    loadGallery();
  }, []);

  const services = useMemo(() => {
    const mapKeyToGalleryCategory = (key) => {
      switch (key) {
        case "kitchens":
          return "Kitchen";
        case "bathrooms":
          return "Bathroom";
        case "basement":
          return "Basement";
        case "exterior":
          return "Exterior";
        default:
          return "Residential";
      }
    };

    return SERVICES.map((service) => {
      const cat = mapKeyToGalleryCategory(service.key);
      const imgs = galleryByCategory[cat];
      if (imgs && imgs.length > 0) {
        return { ...service, images: imgs };
      }
      return service;
    });
  }, [galleryByCategory]);

  const FLAT_IMAGES = useMemo(() => buildFlatImages(services), [services]);

  // Lightbox state
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const goNext = () => {
    setLightboxIdx((prev) =>
      prev === null ? prev : (prev + 1) % FLAT_IMAGES.length
    );
  };

  const goPrev = () => {
    setLightboxIdx((prev) =>
      prev === null ? prev : (prev - 1 + FLAT_IMAGES.length) % FLAT_IMAGES.length
    );
  };

  // ESC + arrow keys
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx]);

  const pageUrl = `${SITE_URL}/residential`;

  const ld = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Residential Flooring – Nilta Flooring",
      url: pageUrl,
      about:
        "Residential flooring work by Nilta: whole-house installs, kitchen flooring, bathroom tile & LVP, basement flooring, and stairs & transitions.",
    }),
    [pageUrl]
  );

  return (
    <main className="pt-16 min-h-screen bg-[#050507] text-white">
      {/* SEO */}
      <Helmet>
        <title>
          Residential Flooring | Nilta – Whole-Home, Kitchens, Baths, Basements & Stairs
        </title>
        <meta
          name="description"
          content="Visual overview of our residential flooring work: whole-house installs, kitchen flooring, bathroom tile & LVP, basement flooring, and stairs & transitions in Edmonton."
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Residential Flooring | Nilta Flooring" />
        <meta
          property="og:description"
          content="Browse residential flooring projects: whole-home, kitchens, bathrooms, basements and stairs."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={heroImg} />
      </Helmet>

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      {/* HERO */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <video
          src={heroVideo}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline

        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-[#050507]" />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nilta Flooring • Residential
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            All your{" "}
            <span className="text-[#F3E9EC]">home flooring</span>, in one place.
          </motion.h1>
          <motion.p
            className="mt-3 text-white/85 max-w-2xl text-sm md:text-base"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Whole-house installs, kitchens, bathrooms, basements and stairs—
            this is a visual overview of the kind of floors we build in homes
            across Edmonton.
          </motion.p>
          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base"
            >
              Request a residential estimate
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Residential", to: "/residential" },
          ]}
        />
      </section>
      <BreadcrumbLD
        items={[
          { label: "Home", url: `${SITE_URL}/` },
          { label: "Residential", url: pageUrl },
        ]}
      />

      {/* SHORT GENERAL INFO */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            How we think about floors at home
          </h2>
          <p className="text-white/80 mt-4 text-sm md:text-base max-w-3xl leading-relaxed">
            We don&apos;t look at rooms in isolation. We look at how the whole
            house flows—where the light hits, where water shows up, where kids
            run, where pets sleep, and where stairs and transitions can trip
            people up if they&apos;re not planned right.
          </p>
          <p className="text-white/75 mt-3 text-sm md:text-base max-w-3xl">
            Below, you&apos;ll see a mix of projects: whole-house installs,
            kitchens, bathrooms, basements and stairs. The idea is simple: let
            the photos do most of the talking.
          </p>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl text-sm"
        >
          <div className="text-sm text-white/60">What we handle</div>
          <ul className="mt-3 space-y-2 text-white/85">
            <li>• LVP, laminate, engineered hardwood & tile.</li>
            <li>• Subfloor prep, leveling & moisture checks.</li>
            <li>• Stairs, nosings, trims & transitions.</li>
            <li>• Clean sites and clear timelines.</li>
          </ul>
          <div className="mt-6">
            <Link
              to="/contact"
              className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
            >
              <span>Tell us about your home</span>
              <ArrowRight
                className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.aside>
      </section>

      {/* PROJECT SECTIONS – mostly pictures */}
      <section className="max-w-7xl mx-auto px-6 pb-12 space-y-10">
        {services.map((service) => (
          <motion.section
            key={service.key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Header per service */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wide">
                  {service.icon}
                  <span>{service.key.replace("-", " ")}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mt-1">
                  {service.title}
                </h3>
                <p className="text-white/75 text-sm mt-1 max-w-xl">
                  {service.subtitle}
                </p>
              </div>
            </div>

            {/* Image grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {service.images.map((src, i) => {
                const globalIndex = findGlobalIndex(FLAT_IMAGES, src, service.title);
                return (
                  <motion.figure
                    key={src}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl group cursor-zoom-in"
                    onClick={() => openLightbox(globalIndex)}
                  >
                    <img
                      src={src}
                      alt={`${service.title} project ${i + 1}`}
                      className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] border border-white/10">
                      {service.title} · #{i + 1}
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
          </motion.section>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-black/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Ready to plan new floors?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              Send a few photos and rough square footage—we&apos;ll come back
              with product suggestions and a realistic timeline.
            </div>
          </div>
          <Link
            to="/contact"
            className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
          >
            <span>Request a residential estimate</span>
            <ArrowRight
              className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxIdx !== null && (
        <Lightbox
          src={FLAT_IMAGES[lightboxIdx].src}
          label={FLAT_IMAGES[lightboxIdx].serviceTitle}
          index={lightboxIdx}
          total={FLAT_IMAGES.length}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </main>
  );
}

/* --- LIGHTBOX WITH ARROWS + SWIPE --- */
function Lightbox({ src, label, index, total, onClose, onPrev, onNext }) {
  const startXRef = useRef(null);

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (
      startXRef.current === null ||
      !e.changedTouches ||
      e.changedTouches.length === 0
    )
      return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startXRef.current;

    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        onNext(); // swipe left -> next
      } else {
        onPrev(); // swipe right -> prev
      }
    }
    startXRef.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left arrow */}
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 p-2 hover:bg-white/15 transition"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        {/* Image */}
        <motion.img
          key={src}
          src={src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
        />

        {/* Right arrow */}
        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 p-2 hover:bg-white/15 transition"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>

        {/* Index + label */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/85 bg-black/60 px-3 py-1 rounded-full border border-white/20">
          {label} · {index + 1} / {total}
        </div>
      </div>
    </div>
  );
}
function TextArrowLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center rounded-full border border-white/20 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
    >
      <span className="relative">{children}</span>
      <ArrowRight
        className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden="true"
      />
    </Link>
  );
}