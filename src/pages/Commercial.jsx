// src/pages/Commercial.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";
import { API_BASE } from "../config/api";
import {
  Store,
  Building2,
  HardHat,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

// ✅ Remove the buggy top-level fetch (no auth / runs on import)

const FALLBACK_GALLERY = [
  "/commercial/1.webp",
  "/commercial/2.webp",
  "/commercial/3.webp",
  "/commercial/4.webp",
  "/commercial/5.webp",
  "/commercial/6.webp",
];

export default function Commercial() {
  const heroImg =
    "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=1600&auto=format&fit=crop";
  const heroVideo = "/video/commercial.mp4";

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryError, setGalleryError] = useState("");

  const gallery = galleryImages.length > 0 ? galleryImages : FALLBACK_GALLERY;

  useEffect(() => {
    async function loadGallery() {
      try {
        setGalleryError("");

        const res = await fetch(
          `${API_BASE}/api/gallery?category=${encodeURIComponent("Commercial")}`
        );
        if (!res.ok) throw new Error("Failed to load commercial gallery");

        const data = await res.json();

        // ✅ Cloudinary returns full URLs already -> use img.url directly
        const urls = Array.isArray(data) ? data.map((img) => img.url) : [];
        setGalleryImages(urls);
      } catch (err) {
        console.error("Failed to load commercial gallery", err);
        setGalleryError("Showing demo photos – could not load gallery.");
        setGalleryImages([]);
      }
    }

    loadGallery();
  }, []);

  // Lightbox state
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const goNext = () => {
    setLightboxIdx((prev) =>
      prev === null ? prev : (prev + 1) % gallery.length
    );
  };

  const goPrev = () => {
    setLightboxIdx((prev) =>
      prev === null ? prev : (prev - 1 + gallery.length) % gallery.length
    );
  };

  // ESC + arrow keys when lightbox is open
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="pt-16 min-h-screen bg-[#050507] text-white">
      {/* SEO */}
      <Helmet>
        <title>Commercial Flooring | Nilta – Retail, Office & Hospitality</title>
        <meta
          name="description"
          content="Commercial flooring supply and installation for retail, office, hospitality and light industrial spaces—planned around schedules, tenants and code."
        />
        <link rel="canonical" href="https://example.com/commercial" />
        <meta property="og:title" content="Commercial Flooring – Nilta" />
        <meta
          property="og:description"
          content="LVP, carpet tile, tile and resilient flooring for high-traffic spaces, installed with clear phasing and tidy sites."
        />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={heroImg} />
      </Helmet>

      {/* HERO */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <video
          src={heroVideo}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050507]" />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            NILTA FLOORING • COMMERCIAL
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            FLOORS THAT FIT YOUR BUSINESS’S{" "}
            <span className="text-[#F3E9EC]">RHYTHM.</span>
          </motion.h1>

          <motion.p
            className="mt-3 text-white/85 max-w-2xl text-sm md:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            From retail shops and offices to hospitality and industrial spaces,
            we craft commercial flooring solutions that flow naturally with your
            business, adding a warm, welcoming feel to every step of the day.
          </motion.p>

          <motion.div
            className="mt-5 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base"
            >
              Request a commercial quote
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base"
            >
              View commercial projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Commercial", to: "/commercial" },
          ]}
        />
      </section>

      <BreadcrumbLD
        items={[
          { label: "Home", url: "https://example.com/" },
          { label: "Commercial", url: "https://example.com/commercial" },
        ]}
      />

      {/* INTRO + HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            How we approach commercial flooring
          </h2>

          <p className="text-white/80 mt-3 text-sm md:text-base max-w-2xl">
            We simply want to show how thoughtful planning and a friendly,
            well-executed approach makes a difference in busy spaces.
          </p>

          <p className="text-white/80 mt-3 text-sm md:text-base max-w-2xl">
            That’s why we shape every commercial flooring project around the
            natural flow of your space—working closely with tenants and property
            managers to keep everything running smoothly. If we need to work
            nights, phase installs, or adjust schedules, we do it to keep your
            business on track.
          </p>

          <p className="text-white/80 mt-3 text-sm md:text-base max-w-2xl">
            Below, you’ll see a few examples of commercial projects we’ve
            completed around Edmonton and areas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl text-sm space-y-3"
        >
          <Highlight
            icon={<Store className="h-4 w-4" />}
            title="Client-facing spaces"
            text="Retail flooring designed to stay clean-looking and professional under constant foot traffic."
          />
          <Highlight
            icon={<Building2 className="h-4 w-4" />}
            title="Office & workplace environments"
            text="Quiet, durable finishes for offices, corridors, common areas, and meeting rooms."
          />
          <Highlight
            icon={<HardHat className="h-4 w-4" />}
            title="Active job sites"
            text="Safety, access, and coordination managed with care, clear structure, and respect for everyone on site."
          />
        </motion.div>
      </section>

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <h3 className="text-2xl md:text-3xl font-bold">
          Commercial project snapshots
        </h3>
        <p className="text-white/75 mt-2 text-sm md:text-base max-w-2xl">
          Retail, office, and public spaces completed with resilient flooring,
          tile, or carpet—selected for daily durability, easy maintenance, and
          lasting performance.
        </p>

        {galleryError ? (
          <div className="mt-4 text-xs text-white/60">{galleryError}</div>
        ) : null}

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.03 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl group cursor-zoom-in"
              onClick={() => openLightbox(i)}
            >
              <img
                src={src}
                alt={`Commercial Project · #${i + 1}`}
                className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] border border-white/10">
                Commercial Project · #{i + 1}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ✅ NEW: WHAT COMMERCIAL CLIENTS APPRECIATE MOST */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold">
            What Commercial Clients Appreciate Most
          </h3>

          <div className="mt-5 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid place-items-center h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10">
                  <CalendarClock className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">Schedule awareness</div>
                  <p className="text-white/75 text-sm mt-1">
                    We understand the importance of timing, with experience in
                    night work, phased installations, and meeting opening
                    deadlines.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid place-items-center h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10">
                  <MessagesSquare className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">Clear communication</div>
                  <p className="text-white/75 text-sm mt-1">
                    Scopes, change orders, and punch lists are kept organized,
                    transparent, and easy to follow at every stage.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid place-items-center h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">Site readiness</div>
                  <p className="text-white/75 text-sm mt-1">
                    Safety, access, and coordination carefully managed in
                    partnership with property managers and general contractors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-white/90 font-semibold">
              Planning a commercial flooring project in Edmonton, surrounding
              area, or out of province?
            </p>
            <p className="text-white/75 text-sm mt-2">
              Send us your drawings or photos along with your timelines, and
              we’ll help guide you with suitable product options and a clear,
              realistic installation schedule.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base"
              >
                Send drawings / request quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base"
              >
                View past installs
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ✅ UPDATED: NILTA FLOORING INC. SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 shadow-xl"
        >
          <h3 className="text-xl md:text-2xl font-bold">Nilta Flooring Inc.</h3>
          <p className="text-white/75 mt-3 text-sm md:text-base max-w-3xl">
            Our flooring company, supplying and installing residential and
            commercial flooring nationwide, with a practical, detail-driven
            approach to planning, installation, and lasting performance.
          </p>
        </motion.div>
      </section>

      {/* LIGHTBOX */}
      {lightboxIdx !== null && (
        <Lightbox
          src={gallery[lightboxIdx]}
          index={lightboxIdx}
          total={gallery.length}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </main>
  );
}

/* --- LIGHTBOX MODAL WITH ARROWS + SWIPE --- */
function Lightbox({ src, index, total, onClose, onPrev, onNext }) {
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
      if (delta < 0) onNext();
      else onPrev();
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
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 p-2 hover:bg-white/15 transition"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        <motion.img
          key={src}
          src={src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
        />

        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 p-2 hover:bg-white/15 transition"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/60 px-3 py-1 rounded-full border border-white/20">
          {index + 1} / {total}
        </div>
      </div>
    </div>
  );
}

function Highlight({ icon, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 grid place-items-center h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10">
        {icon}
      </span>
      <div className="text-sm">
        <div className="font-semibold">{title}</div>
        <div className="text-white/75 text-xs mt-0.5">{text}</div>
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
