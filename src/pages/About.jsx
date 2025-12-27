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
  Sparkles,
  Phone,
  Mail,
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
        <title>About Us | Nilta Flooring – Edmonton Flooring Supply & Installation</title>
        <meta
          name="description"
          content="Nilta Flooring Inc. is an Edmonton-based flooring company. We supply and install LVP, laminate, carpet, engineered hardwood, and tile with clear communication, tidy sites, proper prep, and dependable scheduling."
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
            name: "Nilta Flooring Inc.",
            url: "https://nilta.ca/",
            logo: "https://nilta.ca/logo.png",
            address: {
              "@type": "PostalAddress",
              streetAddress: "16307 111 Ave NW",
              addressLocality: "Edmonton",
              addressRegion: "AB",
              postalCode: "T5M 2S2",
              addressCountry: "CA",
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+1-780-761-9500",
                contactType: "customer service",
                areaServed: "CA",
              },
            ],
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="relative h-[72vh] md:h-[82vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/about-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-[#050507]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/70 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Nilta Flooring • About Us
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
          >
            Floors done right —{" "}
            <span className="text-[#F3E9EC]">from prep to finish.</span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-3xl text-white/85 text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
          >
            At Nilta Flooring, we believe every great floor starts with genuine care and
            craftsmanship. We supply and install LVP, laminate, carpet, carpet-tile,
            hardwood, engineered hardwood, and tile — with clear communication, tidy
            workspaces, and a commitment to staying on schedule.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            <Link
              to="/projects"
              className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition text-sm md:text-base"
            >
              View our projects
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full border border-white/35 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base"
            >
              Request an estimate
            </Link>
          </motion.div>

          <motion.div
            className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
          >
            <Pill icon={<ShieldCheck className="h-4 w-4" />} text="Licensed & insured" />
            <Pill icon={<ClipboardCheck className="h-4 w-4" />} text="Proper prep" />
            <Pill icon={<Timer className="h-4 w-4" />} text="On-time scheduling" />
            <Pill icon={<Sparkles className="h-4 w-4" />} text="Clean finishes" />
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

      {/* ABOUT + MISSION + WHY */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">About Nilta Flooring Inc.</h2>
            <p className="text-white/80 mt-4 leading-relaxed text-sm md:text-base max-w-3xl">
              We’re an Edmonton-based flooring company focused on doing things the right way:
              honest recommendations, solid prep, clean workmanship, and a handover you feel
              good about. Whether it’s a single room refresh or a full commercial fit-out,
              we keep the process simple and predictable.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-2xl bg-white/[0.05] border border-white/10">
                <ThumbsUp className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">Our Mission</h3>
                <p className="text-white/80 mt-3 leading-relaxed text-sm md:text-base">
                  We’re here to make flooring simple and reliable. From helping you choose the
                  right product to the final walkthrough, we keep you in the loop and never cut
                  corners. Our goal is simple: floors that look great, feel solid, and stand the
                  test of time.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge
                    icon={<Handshake className="h-4 w-4" />}
                    text="Clear communication"
                  />
                  <Badge
                    icon={<ClipboardCheck className="h-4 w-4" />}
                    text="Moisture & subfloor prep"
                  />
                  <Badge icon={<Timer className="h-4 w-4" />} text="On-time scheduling" />
                  <Badge
                    icon={<Paintbrush className="h-4 w-4" />}
                    text="Tidy workspaces"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <InfoCard
              title="What we install"
              text="LVP • Laminate • Carpet • Carpet-tile • Hardwood • Engineered hardwood • Tile"
              icon={<Layers className="h-5 w-5 text-[#F3E9EC]" />}
            />
            <InfoCard
              title="How we work"
              text="Proper prep, clean transitions, and walkthroughs that leave you confident—not guessing."
              icon={<Gauge className="h-5 w-5 text-[#F3E9EC]" />}
            />
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl h-fit"
        >
          <div className="text-sm text-white/60">Why choose us</div>
          <p className="text-white/85 mt-3 text-sm md:text-base leading-relaxed">
            We’re fully licensed and insured, with a focus on proper moisture and subfloor prep,
            on-time scheduling, and a track record of happy clients. Our values are all about
            accountability, safety, efficiency, and craftsmanship.
          </p>

          <div className="mt-5 space-y-3 text-white/85 text-sm md:text-base">
            <Li icon={<MapPin />} text="16307 111 Ave NW, Edmonton, AB T5M 2S2" />
            <Li icon={<ShieldCheck />} text="Licensed & insured in Alberta" />
            <Li icon={<HardHat />} text="Clean, safe, respectful job sites" />
            <Li icon={<Award />} text="Workmanship & manufacturer warranties" />
          </div>

          <div className="mt-6 grid gap-2">
            <TextArrowLink to="/contact">Get an estimate</TextArrowLink>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-white/70" />
                  <div>
                    <div className="text-white/70 text-xs">Phone</div>
                    <div className="text-white/90 font-semibold">
                      O: 1-780-761-9500
                    </div>
                    <div className="text-white/90 font-semibold">
                      C: 1-780-222-5669
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-white/70" />
                  <div>
                    <div className="text-white/70 text-xs">Email</div>
                    <div className="text-white/90 font-semibold">info@nilta.ca</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </section>

      {/* VALUES */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <h3 className="text-2xl md:text-3xl font-bold">Our values</h3>
        <p className="text-white/70 mt-2 max-w-2xl text-sm md:text-base">
          The standards we bring to every job—small or large.
        </p>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard
            icon={<Handshake className="h-5 w-5 text-[#F3E9EC]" />}
            title="Accountability"
            text="Clear ownership and honest updates from quote to walkthrough."
          />
          <ValueCard
            icon={<ShieldCheck className="h-5 w-5 text-[#F3E9EC]" />}
            title="Safety"
            text="Protection, dust control, and tidy workspaces—every day."
          />
          <ValueCard
            icon={<Gauge className="h-5 w-5 text-[#F3E9EC]" />}
            title="Efficiency"
            text="Planning and logistics that keep materials and timelines on track."
          />
          <ValueCard
            icon={<Paintbrush className="h-5 w-5 text-[#F3E9EC]" />}
            title="Craftsmanship"
            text="Proper prep, clean transitions, and tight finishing details."
          />
        </div>
      </section>

      {/* TEAM (WITH PHOTOS) */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Meet our team</h3>
            <p className="text-white/70 mt-2 max-w-3xl text-sm md:text-base">
              From Ahmet, our founder with over two decades of flooring expertise, to our
              project managers Vladimir and Andrii—our team is focused on clear planning,
              tidy sites, and results that last.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
          >
            Work with us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl"
            >
              <div className="relative">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute top-3 left-3 rounded-full bg-black/55 backdrop-blur px-3 py-1 text-[11px] border border-white/15">
                  {m.role}
                </div>
              </div>

              <div className="p-5">
                <div className="font-semibold text-lg">{m.name}</div>
                <div className="text-white/70 text-sm">{m.focus}</div>
                <p className="text-white/80 mt-3 text-sm leading-relaxed">{m.blurb}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="text-white/55 text-xs mt-4">
          Tip: replace the photo paths in the TEAM array below with your real image files
          (e.g. /team/ahmet.webp).
        </p>
      </section>

      {/* CAPABILITIES STRIP */}
      <section className="bg-gradient-to-br from-[#8F2841] via-neutral-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
          <Capability
            title="Residential Flooring"
            desc="Whole-home or room-by-room installs—LVP, laminate, carpet, engineered hardwood, and tile—with moisture checks and clean finishes."
            items={[
              { icon: <Ruler />, text: "Moisture testing & substrate plan" },
              { icon: <Layers />, text: "Underlay & sound control" },
              { icon: <Wrench />, text: "Levelling, patching & repairs" },
              { icon: <Paintbrush />, text: "Stairs, trims & transitions" },
            ]}
            links={[{ label: "Explore Residential", to: "/residential", primary: true }]}
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
            links={[{ label: "Explore Commercial", to: "/commercial", primary: true }]}
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h3 className="text-2xl md:text-3xl font-bold">Our project timeline</h3>
        <p className="text-white/75 mt-2 max-w-2xl text-sm md:text-base">
          A simple, transparent process that keeps you in the loop from first walkthrough
          to final handover.
        </p>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Discovery", text: "Walkthrough, product options, and transparent quote." },
            { title: "Plan & Schedule", text: "Moisture checks, subfloor prep plan, and logistics." },
            { title: "Install", text: "Sequenced crews, daily tidy-ups, and quality checks." },
            { title: "Handover", text: "Final walkthrough, documentation, and warranty." },
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

      {/* CTA */}
      <section className="border-t border-white/10 bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">Ready to get started?</div>
            <div className="text-white/70 text-sm md:text-base">
              Let’s make your flooring vision a reality. Reach out for an estimate—and we’ll
              take it from there.
            </div>
          </div>
          <TextArrowLink to="/contact">Request an estimate</TextArrowLink>
        </div>
      </section>
    </main>
  );
}

/* --- data --- */
/**
 * Replace these photo paths with your real team images.
 * Recommended: add files like:
 *   /public/team/ahmet.webp
 *   /public/team/vladimir.webp
 *   /public/team/andrii.webp
 */
const TEAM = [
  {
    name: "Ahmet",
    role: "Founder",
    focus: "20+ years of flooring expertise",
    photo: "/team/ahmet.webp",
    blurb:
      "Built Nilta on craftsmanship and care—focused on prep, planning, and clean finishes that hold up over time.",
  },
  {
    name: "Vladimir",
    role: "Project Manager",
    focus: "Scheduling, coordination & client updates",
    photo: "/team/vladimir.webp",
    blurb:
      "Keeps timelines honest, materials organized, and communication clear—so projects run smoothly from start to finish.",
  },
  {
    name: "Andrii",
    role: "Project Manager",
    focus: "Quality checks, site readiness & finishing",
    photo: "/team/andrii.webp",
    blurb:
      "Focused on the details that matter: proper prep, clean transitions, and a tidy, confident handover.",
  },
];

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
    <div className="flex items-center gap-2">
      <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-white/75 mt-2 text-sm leading-relaxed">{text}</p>
    </div>
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
      ${
        primary
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
