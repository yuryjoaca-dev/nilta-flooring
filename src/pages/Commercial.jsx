// src/commercial/Commercial.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";
import { API_BASE } from "../config/api";
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

fetch(`${API_BASE}/api/gallery?category=Commercial`);

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
            We understand that commercial spaces are always full of life.
            Businesses keep buzzing, shoppers come and go, and we know that
            timing those installations is just as crucial as choosing the right
            floors.
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
            completed around Edmonton and areas. We simply want to show how
            thoughtful planning and a friendly, well-executed approach makes a
            difference in busy places.
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

      {/* GALLERY – clickable with lightbox */}
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
            Our Edmonton commercial flooring services are carefully planned
            around the way each space functions and the level of daily traffic
            it supports.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-white/85 text-sm">
            <FeatureItem
              icon={<Store />}
              text="Retail units, corridors, and common areas"
            />
            <FeatureItem icon={<Landmark />} text="Mall common areas and lobbies" />
            <FeatureItem icon={<Building2 />} text="Office tenant improvements" />
            <FeatureItem
              icon={<HardHat />}
              text="Showrooms and industrial offices"
            />
            <FeatureItem
              icon={<ClipboardCheck />}
              text="Moisture testing and substrate preparation"
            />
            <FeatureItem icon={<Timer />} text="Night work and phased installations" />
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
              <span className="font-semibold">1. Scope &amp; site review</span>
              <div className="text-white/75 mt-1 text-sm">
                We take the time to review drawings, site conditions, and project
                details carefully, ensuring everything is clearly understood
                before pricing is finalized.
              </div>
            </li>
            <li>
              <span className="font-semibold">2. Planning &amp; coordination</span>
              <div className="text-white/75 mt-1 text-sm">
                Phasing, access, freight, and safety are thoughtfully coordinated
                with your team to align seamlessly with your schedules and
                operations.
              </div>
            </li>
            <li>
              <span className="font-semibold">3. Installation</span>
              <div className="text-white/75 mt-1 text-sm">
                Our crews work around your hours of operation, maintaining clean
                job sites each day and keeping you informed with clear,
                consistent progress updates.
              </div>
            </li>
            <li>
              <span className="font-semibold">4. Close-out</span>
              <div className="text-white/75 mt-1 text-sm">
                We complete final walkthroughs, handle touch-ups, and provide
                maintenance guidance to support long-term durability.
              </div>
            </li>
          </ol>
        </motion.div>
      </section>

      {/* KPI / BENEFITS STRIP */}
      <section className="bg-black/75 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-5 text-sm">
          <Benefit
            icon={<Gauge className="h-5 w-5" />}
            title="Schedule awareness"
            text="We understand the importance of timing, with experience in night work, phased installations, and meeting opening deadlines."
          />
          <Benefit
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Clear communication"
            text="Scopes, change orders, and punch lists are kept organized, transparent, and easy to follow at every stage."
          />
          <Benefit
            icon={<HardHat className="h-5 w-5" />}
            title="Site readiness"
            text="Safety, access, and coordination carefully managed in partnership with property managers and general contractors."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Planning a commercial flooring project in Edmonton, the surrounding
              area, or out of province?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              Send us your drawings or photos along with your timelines, and
              we’ll help guide you with suitable product options and a clear,
              realistic installation schedule.
            </div>
          </div>
          <TextArrowLink to="/contact">Start a commercial conversation</TextArrowLink>
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
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80">
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
      <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

function Benefit({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">
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
