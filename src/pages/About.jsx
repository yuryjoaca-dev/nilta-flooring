// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Timer,
  Handshake,
  Ruler,
  Wrench,
  Paintbrush,
  Layers,
  Building2,
  HardHat,
  ClipboardCheck,
  Gauge,
  ThumbsUp,
  MapPin,
  Award,
  ArrowRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";

const ACCENT = "#8F2841";

export default function About() {
  return (
    <main className="pt-16 min-h-screen bg-[#050507] text-white">
      {/* ✅ SEO META TAGS + JSON-LD */}
      <Helmet>
        <title>
          About Us | Nilta Flooring – Edmonton Flooring Supply & Installation
        </title>
        <meta
          name="description"
          content="Edmonton-based flooring contractor. We supply and install LVP, laminate, engineered hardwood, and tile with clean prep, tight seams, and on-time delivery."
        />
        <meta property="og:title" content="About Nilta Flooring" />
        <meta
          property="og:description"
          content="Licensed & insured in Alberta. Residential and commercial flooring installed cleanly and on schedule."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nilta.ca/about" />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Nilta Flooring" />
        <meta
          name="twitter:description"
          content="Flooring supply & installation in Edmonton, AB."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"
        />
        <link rel="canonical" href="https://nilta.ca/about" />
      </Helmet>

      {/* ✅ JSON-LD Organization */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Nilta Flooring",
            url: "https://nilta.ca/",
            logo: "https://nilta.ca/logo.png",
            sameAs: [
              "https://www.facebook.com/YOURPAGE",
              "https://www.instagram.com/YOURPAGE",
              "https://twitter.com/YOURPAGE",
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Edmonton",
              addressRegion: "AB",
              addressCountry: "CA",
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+1-780-555-0123",
                contactType: "customer service",
                areaServed: "CA",
              },
            ],
          })}
        </script>
      </Helmet>

      {/* HERO – bigger + video background */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/about-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        // poster="/images/about-hero-poster.jpg"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-[#050507]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Nilta Flooring • About Us
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Built on craft.{" "}
            <span className="text-[#F3E9EC]">Installed with care.</span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-3xl text-white/85 text-sm md:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            We’re an Edmonton-based flooring company supplying and installing
            LVP, laminate, engineered hardwood, and tile—delivered with clear
            communication, tidy sites, and dependable timelines.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <Link
              to="/projects"
              className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base"
            >
              View our projects
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full border border-white/40 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base"
            >
              Talk to our team
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "About Us", to: "/about" },
          ]}
        />
      </section>
      <BreadcrumbLD
        items={[
          { label: "Home", url: "https://nilta.ca/" },
          { label: "About Us", url: "https://nilta.ca/about" },
        ]}
      />

      {/* INTRO / MISSION */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Our mission at Nilta Flooring
          </h2>
          <p className="text-white/80 mt-4 leading-relaxed text-sm md:text-base">
            To make flooring projects predictable and stress-free. From product
            selection to final walkthrough, we keep you informed, protect your
            home or business, and install to plan—no corners cut. Our goal is
            floors that look great, feel solid, and last.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge
              icon={<ShieldCheck className="h-4 w-4" />}
              text="Licensed & Insured"
            />
            <Badge
              icon={<ClipboardCheck className="h-4 w-4" />}
              text="Moisture & Subfloor Prep"
            />
            <Badge
              icon={<Timer className="h-4 w-4" />}
              text="On-Time Scheduling"
            />
            <Badge
              icon={<ThumbsUp className="h-4 w-4" />}
              text="10/10 Client Rating"
            />
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
        >
          <div className="text-sm text-white/60">At a glance</div>
          <ul className="mt-3 space-y-3 text-white/85 text-sm md:text-base">
            <Li icon={<MapPin />} text="Edmonton, Alberta — primary service area" />
            <Li icon={<Users />} text="Certified installers & vetted partners" />
            <Li icon={<HardHat />} text="COR-aligned safety & dust control" />
            <Li icon={<Award />} text="Workmanship & manufacturer warranties" />
          </ul>
          <div className="mt-6">
            <TextArrowLink to="/contact">Work with us</TextArrowLink>
          </div>
        </motion.aside>
      </section>

      {/* VALUES */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <h3 className="text-2xl md:text-3xl font-bold">Our values</h3>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard
            icon={<Handshake className="h-5 w-5 text-[#F3E9EC]" />}
            title="Accountability"
            text="One team from quote to install. Clear ownership at every step."
          />
          <ValueCard
            icon={<ShieldCheck className="h-5 w-5 text-[#F3E9EC]" />}
            title="Safety First"
            text="Protection, dust control, and tidy sites—every single day."
          />
          <ValueCard
            icon={<Gauge className="h-5 w-5 text-[#F3E9EC]" />}
            title="Efficiency"
            text="Sequencing and logistics that keep materials and schedules on track."
          />
          <ValueCard
            icon={<Paintbrush className="h-5 w-5 text-[#F3E9EC]" />}
            title="Craftsmanship"
            text="Level substrates, tight seams, clean transitions, and crisp lines."
          />
        </div>
      </section>

      {/* TEAM / LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl md:text-3xl font-bold">Leadership</h3>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs border border-white/10">
                  {m.role}
                </div>
              </div>
              <div className="p-5">
                <div className="font-semibold">{m.name}</div>
                <div className="text-white/60 text-sm">{m.focus}</div>
                <p className="text-white/75 mt-3 text-sm">{m.blurb}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CAPABILITIES STRIP */}
      <section className="bg-gradient-to-br from-[#8F2841] via-neutral-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
          <Capability
            title="Residential Flooring"
            desc="Whole-home or room-by-room installs—LVP, laminate, engineered hardwood, and tile—with moisture checks and clean finishes."
            items={[
              { icon: <Ruler />, text: "Moisture testing & substrate plan" },
              { icon: <Layers />, text: "Underlay & sound control" },
              { icon: <Wrench />, text: "Levelling, patching & repairs" },
              { icon: <Paintbrush />, text: "Stairs, trims & transitions" },
            ]}
            links={[
              { label: "Explore Residential", to: "/residential", primary: true }
            ]}
          />
          <Capability
            title="Commercial Flooring"
            desc="Phased, code-compliant installs for retail, office, hospitality, and light industrial. Night-shift options available."
            items={[
              { icon: <Building2 />, text: "Tenant improvements" },
              { icon: <HardHat />, text: "Safety, hoarding & logistics" },
              { icon: <ClipboardCheck />, text: "Compliance & inspections" },
              { icon: <Timer />, text: "Tight timelines & phasing" },
            ]}
            links={[
              { label: "Explore Commercial", to: "/commercial", primary: true },
            ]}
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h3 className="text-2xl md:text-3xl font-bold">
          Our project timeline
        </h3>
        <p className="text-white/75 mt-2 max-w-2xl text-sm md:text-base">
          A simple, transparent process that keeps you in the loop from first
          walkthrough to final handover.
        </p>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Discovery",
              text: "Walkthrough, product options, and transparent quote.",
            },
            {
              title: "Plan & Schedule",
              text: "Moisture checks, subfloor prep plan, and logistics.",
            },
            {
              title: "Install",
              text: "Sequenced crews, daily tidy-ups, and quality checks.",
            },
            {
              title: "Handover",
              text: "Final walkthrough, documentation, and warranty.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
            >
              <div className="text-sm text-white/60">Phase {i + 1}</div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <div className="mt-2 text-white/75 text-sm">{s.text}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* KPI BAND */}
      <section className="bg-black/80">
        <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPI value="120+" label="Projects Completed" />
          <KPI value="100%" label="On-Time Installs" />
          <KPI value="10/10" label="Client Satisfaction" />
          <KPI value="5+" label="Active Crews" />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Ready to plan your flooring?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              We’ll recommend the right product, prep plan, and timeline—clearly
              and honestly.
            </div>
          </div>
          <TextArrowLink to="/contact">Request an estimate</TextArrowLink>
        </div>
      </section>
    </main>
  );
}

/* --- data --- */
const TEAM = [
  {
    name: "Alex Morgan",
    role: "Founder & Project Director",
    focus: "Residential strategy & client success",
    photo: "https://picsum.photos/seed/team1/1200/800",
    blurb:
      "15+ years in flooring and renovations—pairing product knowledge with field pragmatism.",
  },
  {
    name: "Riley Chen",
    role: "Operations Lead",
    focus: "Scheduling, procurement & logistics",
    photo: "https://picsum.photos/seed/team2/1200/800",
    blurb:
      "Keeps materials moving, timelines honest, and job sites humming from start to finish.",
  },
  {
    name: "Jordan Patel",
    role: "Install Manager",
    focus: "Safety, quality & inspections",
    photo: "https://picsum.photos/seed/team3/1200/800",
    blurb:
      "Quality-control focused on level substrates, clean seams, and tidy handovers.",
  },
];

/* --- small components --- */
function Badge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80">
      {icon}
      {text}
    </span>
  );
}

function Li({ icon, text }) {
  return (
    <li className="flex items-center gap-2">
      <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-white/75 mt-2 text-sm">{text}</p>
    </motion.div>
  );
}

function Capability({ title, desc, items = [], links = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-white/75 mt-1 text-sm md:text-base">{desc}</p>
      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-white/85 text-sm">
        {items.map((i, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10">
              {i.icon}
            </span>
            <span>{i.text}</span>
          </div>
        ))}
      </div>
      {links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {links.map((l) => (
            <GhostLink key={l.label} to={l.to} label={l.label} primary={l.primary} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Capsule links – same style as Projects/Home */
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

function GhostLink({ to, label, primary }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center rounded-full px-4 py-2 text-xs md:text-sm font-semibold transition
      ${primary
          ? "border border-[#8F2841]/80 bg-white/[0.03] hover:border-[#8F2841] hover:bg-[#8F2841]/10 text-white/90 hover:text-[#F2C4D0]"
          : "border border-white/15 bg-white/[0.03] hover:border-[#8F2841] hover:bg-[#8F2841]/10 text-white/85 hover:text-[#F2C4D0]"
        }`}
    >
      <span className="relative">{label}</span>
      <ArrowRight
        className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden="true"
      />
    </Link>
  );
}

function KPI({ value, label }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 text-center shadow-xl">
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-1 text-white/70 text-sm">{label}</div>
    </div>
  );
}
