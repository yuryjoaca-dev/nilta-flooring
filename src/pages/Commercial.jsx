// src/commercial/Commercial.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";
import {
  Store,
  Landmark,
  Building2,
  HardHat,
  ClipboardCheck,
  Timer,
  Gauge,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FALLBACK_GALLERY = [
  "/commercial/1.jpg",
  "/commercial/2.jpg",
  "/commercial/3.jpg",
  "/commercial/4.jpg",
  "/commercial/5.jpg",
  "/commercial/6.jpg",
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
        const res = await fetch(`${API_BASE}/api/gallery?category=Commercial`);
        if (!res.ok) throw new Error("Failed to load commercial gallery");
        const data = await res.json();
        const urls = data.map((img) => `${API_BASE}${img.url}`);
        setGalleryImages(urls);
      } catch (err) {
        console.error("Failed to load commercial gallery", err);
        setGalleryError("Showing demo photos – could not load gallery.");
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
  }, [lightboxIdx]);

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
            Nilta Flooring • Commercial
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Flooring for{" "}
            <span className="text-[#F3E9EC]">spaces that stay busy</span>.
          </motion.h1>

          <motion.p
            className="mt-3 text-white/85 max-w-2xl text-sm md:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Retail, office, hospitality and light industrial flooring planned
            around business hours, tenants and traffic.
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
            Floors that can handle traffic—and schedules.
          </h2>
          <p className="text-white/80 mt-3 text-sm md:text-base max-w-2xl">
            We coordinate with tenants, property managers and other trades so
            installs happen with minimal disruption—nights, phased areas or
            condensed schedules when needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge text="Retail & mall units" />
            <Badge text="Office fit-outs" />
            <Badge text="Hospitality & lobby areas" />
            <Badge text="Light industrial offices" />
          </div>
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
            text="Retail floors that stay clean-looking under constant foot traffic."
          />
          <Highlight
            icon={<Building2 className="h-4 w-4" />}
            title="Office & workplace"
            text="Quiet, durable finishes for offices, corridors and meeting rooms."
          />
          <Highlight
            icon={<HardHat className="h-4 w-4" />}
            title="Jobsite-ready"
            text="Safety, hoarding and coordination handled like a construction site."
          />
        </motion.div>
      </section>

      {/* GALLERY – clickable with lightbox */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <h3 className="text-2xl md:text-3xl font-bold">Commercial snapshots</h3>
        <p className="text-white/75 mt-2 text-sm md:text-base max-w-2xl">
          Retail, office and public spaces completed with resilient, tile and
          carpet systems.
        </p>

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
                alt={`Commercial project ${i + 1}`}
                className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] border border-white/10">
                Commercial project · #{i + 1}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* SECTORS + HOW WE RUN JOBS */}
      <section className="max-w-7xl mx-auto px-6 pb-12 grid lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
        >
          <h3 className="text-2xl font-bold">Sectors & typical scope</h3>
          <p className="text-white/75 text-sm md:text-base mt-2">
            Supply and install services tailored to how the space operates and
            what traffic it sees.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-white/85 text-sm">
            <FeatureItem
              icon={<Store />}
              text="Retail units, corridors & back-of-house"
            />
            <FeatureItem
              icon={<Landmark />}
              text="Mall common areas & lobbies"
            />
            <FeatureItem
              icon={<Building2 />}
              text="Office tenant improvements"
            />
            <FeatureItem
              icon={<HardHat />}
              text="Showrooms & light industrial offices"
            />
            <FeatureItem
              icon={<ClipboardCheck />}
              text="Moisture tests & substrate prep"
            />
            <FeatureItem
              icon={<Timer />}
              text="Night shifts & phased installs"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
        >
          <h3 className="text-2xl font-bold">How we run commercial projects</h3>
          <ol className="mt-4 space-y-4 text-sm md:text-base text-white/80">
            <li>
              <span className="font-semibold">1. Scope & site review:</span>{" "}
              Drawings, details and site conditions checked before numbers are
              firmed up.
            </li>
            <li>
              <span className="font-semibold">2. Planning:</span> Phasing,
              access, freight, staging and safety aligned with your team.
            </li>
            <li>
              <span className="font-semibold">3. Install:</span> Crews scheduled
              around hours of operation; daily cleanup and progress updates.
            </li>
            <li>


              <span className="font-semibold">4. Close-out:</span> Walkthrough,
              deficiency touch-ups and maintenance guidance.


            </li>
          </ol>

        </motion.div>
      </section>

      {/* KPI / BENEFITS STRIP */}
      <section className="bg-black/75 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-5 text-sm">
          <Benefit
            icon={<Gauge className="h-5 w-5" />}
            title="Tight schedules"
            text="We’re used to night work, phased areas and opening deadlines."
          />
          <Benefit
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Clear documentation"
            text="Scopes, change orders and punchlists kept tidy."
          />
          <Benefit
            icon={<HardHat className="h-5 w-5" />}
            title="Site readiness"
            text="Safety, hoarding and communication aligned with GC/PM."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Planning a commercial flooring project?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              Share drawings or photos and target dates—we&apos;ll come back
              with product options and a realistic schedule.
            </div>
          </div>
          <TextArrowLink to="/contact">
            Start a commercial conversation
          </TextArrowLink>
        </div>
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
        onClick={(e) => e.stopPropagation()} // don’t close when clicking image
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

        {/* Index indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/60 px-3 py-1 rounded-full border border-white/20">
          {index + 1} / {total}
        </div>
      </div>
    </div>
  );
}

/* --- small components --- */

function Badge({ text }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg_WHITE/[0.03] px-3 py-1 text-xs text-white/80">
      {text}
    </span>
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

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/[0.05] border border_white/10">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

function Benefit({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border_white/10 bg-white/[0.03] p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <div className="font-semibold text-sm md:text-base">{title}</div>
      </div>
      <div className="text-white/75 text-xs md:text-sm">{text}</div>
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
