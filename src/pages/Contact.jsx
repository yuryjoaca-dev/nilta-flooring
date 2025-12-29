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
  Sparkles,
} from "lucide-react";
import { API_BASE } from "../config/api";

const ACCENT = "#8F2841";

export default function Contact() {
  // ---------- Hours (Edmonton local time) ----------
  // Mon–Fri: 8:30 AM – 6:00 PM
  // Sat: 9:00 AM – 4:00 PM
  // Sun: Closed
  const HOURS = {
    1: { open: "08:30", close: "18:00" },
    2: { open: "08:30", close: "18:00" },
    3: { open: "08:30", close: "18:00" },
    4: { open: "08:30", close: "18:00" },
    5: { open: "08:30", close: "18:00" },
    6: { open: "09:00", close: "16:00" },
    0: null,
  };

  // ---------- Business info ----------
  const ADDRESS_DISPLAY = "16307 111 Ave NW, Edmonton, AB T5M 2S2";
  const ADDRESS_QUERY = "16307 111 Ave NW, Edmonton, AB T5M 2S2";
  const PHONE_MAIN = "780-222-5669";
  const PHONE_OFFICE = "1-780-761-9500";
  const EMAIL = "info@nilta.ca";

  // ---------- Local time + open/closed ----------
  const { nowStr, isOpen, todayIdx } = useMemo(() => {
    const now = new Date();

    const timeFmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Edmonton",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dayFmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Edmonton",
      weekday: "long",
    });

    const [h, m] = timeFmt.format(now).split(":").map(Number);

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
      nowStr: `${dayFmt.format(now)} • ${timeFmt.format(now)} (Edmonton)`,
      isOpen: open,
      todayIdx: w,
    };
  }, []);

  const mapEmbedSrc = useMemo(() => {
    const q = encodeURIComponent(`Nilta Flooring, ${ADDRESS_QUERY}`);
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }, [ADDRESS_QUERY]);

  const mapsSearchUrl = useMemo(() => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      ADDRESS_QUERY
    )}`;
  }, [ADDRESS_QUERY]);

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
    if (!form.message.trim()) next.message = "Tell us a bit about your project.";
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
    setErrors({}); // clear any previous submit errors

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // if backend returns no json
      }

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          "Failed to send message. Please try again or call us.";
        throw new Error(msg);
      }

      setToastOpen(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        type: "",
        timeline: "",
        message: "",
      });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err?.message || "Failed to send message.",
      }));
    } finally {
      setSending(false);
    }
  };

  // Auto-hide success toast
  useEffect(() => {
    if (!toastOpen) return;
    const id = setTimeout(() => setToastOpen(false), 3500);
    return () => clearTimeout(id);
  }, [toastOpen]);

  const telMain = `tel:+1${PHONE_MAIN.replace(/[^0-9]/g, "")}`;
  const telOffice = `tel:+1${PHONE_OFFICE.replace(/[^0-9]/g, "")}`;

  return (
    <main className="pt-16 min-h-screen bg-[#050507] text-white">
      {/* SEO */}
      <Helmet>
        <title>
          Contact Us | Nilta Flooring – Edmonton Flooring Supply & Installation
        </title>
        <meta
          name="description"
          content="Ready to transform your floors? Contact Nilta Flooring in Edmonton, AB. Fast, transparent estimates for residential and commercial flooring."
        />
        <link rel="canonical" href="https://nilta.ca/contact" />
        <meta property="og:title" content="Contact Nilta Flooring" />
        <meta
          property="og:description"
          content="Tell us about your space—size, existing floors, and timeline. We’ll reply within one business day."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nilta.ca/contact" />
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
                  We’ll reply within one business day. For urgent requests, call{" "}
                  {PHONE_MAIN}.
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

      {/* HERO */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/contact-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-[#050507]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

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
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Ready to transform your floors?{" "}
            <span className="text-[#F3E9EC]">Connect with us today.</span>
          </motion.h1>

          <motion.p
            className="mt-4 text-white/85 max-w-3xl text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            We’d love to hear about your project. Share a few details—like the
            size of the area, your current floors, and your timeline—and we’ll
            get back to you within one business day with next steps.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <a
              href={telMain}
              className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call {PHONE_MAIN}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="px-6 py-3 rounded-full border border-white/35 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email us
            </a>
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full border border-white/15 bg-white/[0.03] hover:bg-white/10 transition text-sm md:text-base inline-flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Open in Maps
            </a>
          </motion.div>

          <motion.div
            className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            <Pill
              icon={<ShieldCheck className="h-4 w-4" />}
              text="Licensed & insured"
            />
            <Pill
              icon={<ClipboardCheck className="h-4 w-4" />}
              text="Clear scopes & estimates"
            />
            <Pill
              icon={<HardHat className="h-4 w-4" />}
              text="Friendly, tidy crews"
            />
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
          { label: "Home", url: "https://nilta.ca/" },
          { label: "Contact", url: "https://nilta.ca/contact" },
        ]}
      />

      {/* HOW TO REACH US */}
      <section className="max-w-7xl mx-auto px-6 pb-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
          <div className="flex items-center gap-2 text-white/90">
            <Sparkles className="h-5 w-5 text-[#F3E9EC]" />
            <div className="font-semibold text-lg md:text-xl">How to reach us</div>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              title="Address"
              text={ADDRESS_DISPLAY}
            />
            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              title="Phone"
              text={PHONE_MAIN}
              href={telMain}
            />
            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              title="Office"
              text={PHONE_OFFICE}
              href={telOffice}
            />
            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              text={EMAIL}
              href={`mailto:${EMAIL}`}
            />
          </div>
        </div>

        
      </section>

      {/* HOURS + STATUS */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-4">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="h-5 w-5" /> Our hours of operation (Edmonton)
              </div>
              <span
                className={`text-xs rounded-full px-2 py-0.5 border ${
                  isOpen
                    ? "bg-green-500/20 text-green-300 border-green-500/40"
                    : "bg-red-500/20 text-red-300 border-red-500/40"
                }`}
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { idx: 1, label: "Monday" },
                { idx: 2, label: "Tuesday" },
                { idx: 3, label: "Wednesday" },
                { idx: 4, label: "Thursday" },
                { idx: 5, label: "Friday" },
                { idx: 6, label: "Saturday" },
                { idx: 0, label: "Sunday" },
              ].map((d) => {
                const slot = HOURS[d.idx];
                const active = d.idx === todayIdx;
                return (
                  <div
                    key={d.idx}
                    className={`rounded-xl border p-4 ${
                      active
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

            <div className="mt-4 text-white/60 text-xs">{nowStr}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
            <div className="text-sm text-white/60">Why choose us?</div>
            <ul className="mt-3 space-y-3 text-white/85 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="mt-1">
                  <ShieldCheck className="h-4 w-4 text-[#F3E9EC]" />
                </span>
                Licensed and insured for your peace of mind
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">
                  <ClipboardCheck className="h-4 w-4 text-[#F3E9EC]" />
                </span>
                Transparent estimates and clear project scopes
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">
                  <HardHat className="h-4 w-4 text-[#F3E9EC]" />
                </span>
                Friendly crews who respect your space and keep things tidy
              </li>
            </ul>

            <div className="mt-6">
              <a
                href={telMain}
                className="group inline-flex w-full justify-center items-center rounded-full border border-white/20 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
              >
                Want to chat instead? Call {PHONE_MAIN}
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAP + FORM */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-8 items-start">
        {/* MAP */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl">
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Find us on the map
              </div>
              <a
                className="text-xs md:text-sm underline hover:text-[#F2C4D0]"
                href={mapsSearchUrl}
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
            <div className="font-semibold text-lg">Nilta Flooring</div>
            <p className="text-white/75 mt-2 text-sm md:text-base leading-relaxed">
              Your trusted Edmonton partner for quality floors that stand the test
              of time.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/projects"
                className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
              >
                <span className="relative">Explore projects</span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0" />
              </Link>
              <Link
                to="/guide"
                className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
              >
                <span className="relative">Guide & tips</span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
          <div className="text-xl md:text-2xl font-semibold">
            Request a free estimate
          </div>
          <p className="text-white/75 text-sm mt-1">
            Single room or entire property—share your scope and we’ll send a
            tailored estimate and timeline.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
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
                    <option className="text-neutral-900">Single Room</option>
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
                  placeholder="Size (sq ft), rooms, current floors, subfloor notes, stairs, pets/kids, access, preferred products…"
                  rows="6"
                  maxLength={maxChars}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-[rgba(143,40,65,0.7)]"
                  aria-label="Project details"
                  value={form.message}
                  onChange={handleChange}
                />
              }
            />

            {/* Submit error message */}
            {errors.submit && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center">
              <TextArrowButton type="submit" disabled={sending} aria-busy={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </TextArrowButton>

              <a
                href={telMain}
                className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
              >
                <span className="relative">Want to chat instead?</span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0" />
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10 bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Want to chat instead?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              Give us a call at {PHONE_MAIN}, and we’ll happily walk you through
              the process.
            </div>
          </div>
          <a
            href={telMain}
            className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
          >
            <span className="relative">Call {PHONE_MAIN}</span>
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0" />
          </a>
        </div>
      </section>
    </main>
  );
}

/* --- small components --- */
function Pill({ icon, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-2">
      <span className="grid place-items-center h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10">
        {icon}
      </span>
      <span className="text-sm text-white/85 font-medium">{text}</span>
    </div>
  );
}

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
            className={`text-xs rounded-full px-2 py-0.5 border ${
              badgeColor || "border-white/15 text-white/70 bg-white/5"
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

function FormField({ label, input, error, help }) {
  return (
    <label className="block">
      <span className="block text-xs text-white/60 mb-1">{label}</span>
      {input}
      <div className="mt-1 flex items-center justify-between">
        {error ? <span className="text-xs text-red-400">{error}</span> : <span />}
        {help && <span className="text-xs text-white/50">{help}</span>}
      </div>
    </label>
  );
}

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
