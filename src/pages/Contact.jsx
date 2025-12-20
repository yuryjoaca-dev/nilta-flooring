// src/pages/Contact.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ShieldCheck,
  ClipboardCheck,
  HardHat,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

const ACCENT = "#8F2841";

export default function Contact() {
  // ---------- Hours ----------
  const HOURS = {
    1: { open: "08:00", close: "18:00" },
    2: { open: "08:00", close: "18:00" },
    3: { open: "08:00", close: "18:00" },
    4: { open: "08:00", close: "18:00" },
    5: { open: "08:00", close: "16:00" },
    6: null,
    0: null,
  };

  // ---------- Local time + open/closed ----------
  const { nowStr, isOpen, todayIdx } = useMemo(() => {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Edmonton",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dayFmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Edmonton",
      weekday: "long",
    });
    const [h, m] = fmt
      .format(now)
      .split(":")
      .map(Number);
    const w = new Date(
      now.toLocaleString("en-CA", { timeZone: "America/Edmonton" })
    ).getDay(); // 0..6

    const slot = HOURS[w];
    let open = false;
    if (slot) {
      const [oh, om] = slot.open.split(":").map(Number);
      const [ch, cm] = slot.close.split(":").map(Number);
      const nowMin = h * 60 + m;
      const oMin = oh * 60 + om;
      const cMin = ch * 60 + cm;
      open = nowMin >= oMin && nowMin <= cMin;
    }

    return {
      nowStr: `${dayFmt.format(now)} • ${fmt.format(now)} (Edmonton)`,
      isOpen: open,
      todayIdx: w,
    };
  }, []);

  // ---------- Business info ----------
  const ADDRESS = "16307 111 Ave Edmonton AB T5M 2S2";
  const PHONE = " 780-222-5669";
  const EMAIL = "hello@niltaflooring.ca"; // update if needed

  const mapEmbedSrc = useMemo(() => {
    const q = encodeURIComponent(`Nilta Flooring Edmonton, ${ADDRESS}`);
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }, [ADDRESS]);

  // ---------- Form state ----------
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    timeline: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const maxChars = 1000;

  const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!form.email.trim() || !validateEmail(form.email))
      next.email = "Enter a valid email address.";
    if (!form.message.trim())
      next.message = "Tell us a bit about your project.";
    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSending(true);

    // Simulate API call
    setTimeout(() => {
      setSending(false);
      setToastOpen(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        type: "",
        timeline: "",
        message: "",
      });
    }, 1100);
  };

  // Auto-hide success toast
  useEffect(() => {
    if (!toastOpen) return;
    const id = setTimeout(() => setToastOpen(false), 3500);
    return () => clearTimeout(id);
  }, [toastOpen]);

  return (
    <main className="pt-16 min-h-screen bg-[#050507] text-white">
      {/* SEO */}
      <Helmet>
        <title>
          Contact Us | Nilta Flooring – Edmonton Flooring Supply & Installation
        </title>
        <meta
          name="description"
          content="Contact Nilta Flooring in Edmonton, AB. Fast, transparent estimates for residential and commercial flooring—LVP, laminate, engineered hardwood, and tile."
        />
        <link rel="canonical" href="https://example.com/contact" />
        <meta property="og:title" content="Contact Nilta Flooring" />
        <meta
          property="og:description"
          content="Tell us about your space. We’ll recommend the right product, prep plan, and timeline."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com/contact" />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop"
        />
      </Helmet>

      {/* Success Toast */}
      {toastOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          role="status"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-green-500/40 bg-green-600/20 px-5 py-4 backdrop-blur shadow-2xl w-[92vw] max-w-xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-green-200">
                  Thanks — your message is on its way.
                </div>
                <div className="text-green-100/90 mt-0.5">
                  Our estimator will reply within one business day. For urgent
                  requests, call {PHONE}.
                </div>
              </div>
              <button
                className="ml-auto opacity-70 hover:opacity-100"
                onClick={() => setToastOpen(false)}
                aria-label="Close notification"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* HERO – video, bigger height, same vibe as other pages */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/contact-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        // poster="/images/contact-hero-poster.jpg"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-[#050507]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Nilta Flooring • Contact
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Let&apos;s plan your{" "}
            <span className="text-[#F3E9EC]">next floor</span> together.
          </motion.h1>

          <motion.p
            className="mt-3 text-white/85 max-w-2xl text-sm md:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Tell us about your space—rooms, square footage, existing floors, and
            timing. We’ll respond within one business day with next steps and
            options.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <a
              href={`tel:+17805550123`}
              className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call {PHONE}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="px-6 py-3 rounded-full border border-white/40 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email us
            </a>
          </motion.div>
        </div>
      </section>

      {/* BREADCRUMBS + JSON-LD */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Contact", to: "/contact" },
          ]}
        />
      </section>
      <BreadcrumbLD
        items={[
          { label: "Home", url: "https://example.com/" },
          { label: "Contact", url: "https://example.com/contact" },
        ]}
      />

      {/* QUICK CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-6 pb-2 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard
          icon={<MapPin className="h-5 w-5" />}
          title="Address"
          text={ADDRESS}
        />
        <InfoCard
          icon={<Phone className="h-5 w-5" />}
          title="Phone"
          text={PHONE}
          href={`tel:+17805550123`}
        />
        <InfoCard
          icon={<Mail className="h-5 w-5" />}
          title="Email"
          text={EMAIL}
          href={`mailto:${EMAIL}`}
        />
        <InfoCard
          icon={<Clock className="h-5 w-5" />}
          title={isOpen ? "Open now" : "Closed"}
          text={nowStr}
          badge={isOpen ? "Open" : "Closed"}
          badgeColor={
            isOpen
              ? "bg-green-500/20 text-green-400 border-green-500/40"
              : "bg-red-500/20 text-red-400 border-red-500/40"
          }
        />
      </section>

      {/* ASSURANCES STRIP */}
      <section className="max-w-7xl mx-auto px-6 pb-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <Assurance
            icon={<ShieldCheck className="h-5 w-5" />}
            text="Licensed & insured in Alberta"
          />
          <Assurance
            icon={<ClipboardCheck className="h-5 w-5" />}
            text="Clear scope & written estimates"
          />
          <Assurance
            icon={<HardHat className="h-5 w-5" />}
            text="Respectful crews & tidy sites"
          />
        </div>
      </section>

      {/* MAP + HOURS + FORM */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-8 items-start">
        {/* MAP + HOURS */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl">
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Find us
              </div>
              <a
                className="text-xs md:text-sm underline hover:text-[#F2C4D0]"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  ADDRESS
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
            <div className="aspect-[16/9] w-full">
              <iframe
                title="Nilta Flooring Map"
                src={mapEmbedSrc}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
            <div className="flex items-center gap-2 font-semibold">
              <Clock className="h-5 w-5" /> Business hours (Edmonton)
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { idx: 1, label: "Monday" },
                { idx: 2, label: "Tuesday" },
                { idx: 3, label: "Wednesday" },
                { idx: 4, label: "Thursday" },
                { idx: 5, label: "Friday" },
                { idx: 6, label: "Saturday" },
              ].map((d) => {
                const slot = HOURS[d.idx];
                const active = d.idx === todayIdx;
                return (
                  <div
                    key={d.idx}
                    className={`rounded-xl border p-4 ${active
                      ? "border-[#8F2841]/70 bg-[#8F2841]/15"
                      : "border-white/10 bg-white/[0.02]"
                      }`}
                  >
                    <div className="font-semibold text-sm md:text-base">
                      {d.label}
                    </div>
                    <div className="text-white/75 text-sm mt-1">
                      {slot ? `${slot.open} – ${slot.close}` : "Closed"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
          <div className="text-xl md:text-2xl font-semibold">
            Get a free flooring estimate
          </div>
          <p className="text-white/75 text-sm mt-1">
            Share your scope—rooms, square footage, product ideas, and timing.
          </p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <FormField
              label="Full name"
              error={errors.name}
              input={
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Full name"
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-[rgba(143,40,65,0.7)]"
                  aria-label="Full name"
                  value={form.name}
                  onChange={handleChange}
                />
              }
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="Email"
                error={errors.email}
                input={
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email"
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-[rgba(143,40,65,0.7)]"
                    aria-label="Email"
                    value={form.email}
                    onChange={handleChange}
                  />
                }
              />
              <FormField
                label="Phone"
                input={
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone"
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-[rgba(143,40,65,0.7)]"
                    aria-label="Phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="Project type"
                input={
                  <select
                    name="type"
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 w-full text-white outline-none focus:ring-2 focus:ring-[rgba(143,40,65,0.7)]"
                    aria-label="Project Type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="" className="text-neutral-900">
                      Select type…
                    </option>
                    <option className="text-neutral-900">Whole-Home</option>
                    <option className="text-neutral-900">Kitchen</option>
                    <option className="text-neutral-900">Bathroom</option>
                    <option className="text-neutral-900">Basement</option>
                    <option className="text-neutral-900">Stairs</option>
                    <option className="text-neutral-900">Commercial</option>
                  </select>
                }
              />

              <FormField
                label="Timeline"
                input={
                  <select
                    name="timeline"
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 w-full text-white outline-none focus:ring-2 focus:ring-[rgba(143,40,65,0.7)]"
                    aria-label="Timeline"
                    value={form.timeline}
                    onChange={handleChange}
                  >
                    <option value="" className="text-neutral-900">
                      Select timeline…
                    </option>
                    <option className="text-neutral-900">
                      As soon as possible
                    </option>
                    <option className="text-neutral-900">1–3 months</option>
                    <option className="text-neutral-900">3–6 months</option>
                    <option className="text-neutral-900">6+ months</option>
                  </select>
                }
              />
            </div>

            <FormField
              label="Project details"
              error={errors.message}
              help={`${form.message.length}/${maxChars}`}
              input={
                <textarea
                  name="message"
                  placeholder="Rooms, square footage, existing flooring, product ideas, site access…"
                  rows="6"
                  maxLength={maxChars}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-[rgba(143,40,65,0.7)]"
                  aria-label="Project details"
                  value={form.message}
                  onChange={handleChange}
                />
              }
            />

            <div className="flex flex-wrap gap-3 items-center">
              <TextArrowButton
                type="submit"
                disabled={sending}
                aria-busy={sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </TextArrowButton>

              <Link
                to="/projects"
                className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
              >
                <span className="relative">Explore projects</span>
                <ArrowRight
                  className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-white/10 bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Prefer a quick call?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              We’ll walk through your scope and outline the next steps.
            </div>
          </div>
          <a
            href={`tel:+17805550123`}
            className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
          >
            <span className="relative">Call {PHONE}</span>
            <ArrowRight
              className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </a>
        </div>
      </section>
    </main>
  );
}

/* --- small components --- */
function InfoCard({ icon, title, text, badge, badgeColor, href }) {
  const body = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/90">
          {icon}
          <div className="font-semibold text-sm md:text-base">{title}</div>
        </div>
        {badge && (
          <span
            className={`text-xs rounded-full px-2 py-0.5 border ${badgeColor || "border-white/15 text-white/70 bg-white/5"
              }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="text-white/75 text-sm mt-2">{text}</div>
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {body}
    </a>
  ) : (
    body
  );
}

function Assurance({ icon, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <div className="mx-auto grid place-items-center h-9 w-9 rounded-lg bg-white/[0.05] border border-white/10 mb-2">
        {icon}
      </div>
      <div className="text-xs md:text-sm text-white/85">{text}</div>
    </div>
  );
}

function FormField({ label, input, error, help }) {
  return (
    <label className="block">
      <span className="block text-xs text-white/60 mb-1">{label}</span>
      {input}
      <div className="mt-1 flex items-center justify-between">
        {error ? (
          <span className="text-xs text-red-400">{error}</span>
        ) : (
          <span />
        )}
        {help && <span className="text-xs text-white/50">{help}</span>}
      </div>
    </label>
  );
}

/* Capsule button with hover arrow */
function TextArrowButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="group inline-flex items-center rounded-full border border-[#8F2841]/90 px-6 py-3 font-semibold text-white/90 hover:bg-[#8F2841] hover:border-[#8F2841] transition disabled:opacity-60 disabled:pointer-events-none"
    >
      <span className="relative">{children}</span>
      <ArrowRight
        className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden="true"
      />
    </button>
  );
}
