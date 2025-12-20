// src/pages/Projects.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Landmark,
  Home as HomeIcon,
  ArrowRight,
  Factory,
  Hotel,
  Store,
  Building2,
  ShieldCheck,
  Timer,
  Handshake,
  Ruler,
  Wrench,
  Paintbrush,
  ClipboardCheck,
  MapPin,
  HardHat,
  Users,
  BadgeCheck,
  Gauge,
  Layers,
  ChevronDown,
} from "lucide-react";

const ACCENT = "#8F2841";

export default function Projects() {
  // FAQ state + data
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = [
    {
      q: "How accurate are your timelines?",
      a: "We plan around product lead times and site prep. Most residential installs run 1–5 days; larger or multi-area scopes can take longer depending on prep and selections.",
    },
    {
      q: "Do you handle prep and leveling?",
      a: "Yes. We test for moisture, address subfloor issues, perform leveling/patching as scoped, and recommend the right underlay and trims.",
    },
    {
      q: "What flooring products do you install?",
      a: "LVP, laminate, engineered hardwood, and tile. We can supply materials or install client-supplied products if they’re suitable for the space.",
    },
    {
      q: "Do you work around business hours?",
      a: "For commercial spaces, we can phase areas or schedule night shifts to minimize disruption.",
    },
  ];

  return (
    <main className="pt-16 min-h-screen bg-[#050507] text-white">
      {/* HERO WITH VIDEO */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/project-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        // poster="/images/projects-hero-poster.jpg"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050507]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nilta Flooring • Projects
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Proven floors for{" "}
            <span className="text-[#F3E9EC]">real homes</span> and{" "}
            <span className="text-[#F3E9EC]">working spaces</span>.
          </motion.h1>

          <motion.p
            className="mt-4 max-w-3xl text-white/85 text-sm md:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            From family basements to busy corridors, we design and install
            flooring systems that stand up to Alberta’s climate, daily traffic,
            and real-life use.
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
              Request a project walkthrough
            </Link>
            <Link
              to="/materials"
              className="px-6 py-3 rounded-full border border-white/40 text-white/90 hover:bg-white hover:text-black transition text-sm md:text-base"
            >
              See materials we use
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Trust
          item={{
            icon: <ShieldCheck className="h-5 w-5" />,
            title: "Licensed & Insured",
            text: "Alberta-licensed installer. COR-aligned safety procedures.",
          }}
        />
        <Trust
          item={{
            icon: <Timer className="h-5 w-5" />,
            title: "On-Time Delivery",
            text: "Material lead-time planning and milestone schedules.",
          }}
        />
        <Trust
          item={{
            icon: <Handshake className="h-5 w-5" />,
            title: "Transparent Quotes",
            text: "Scope clarity for prep, materials, trims, and transitions.",
          }}
        />
        <Trust
          item={{
            icon: <BadgeCheck className="h-5 w-5" />,
            title: "Warranty",
            text: "Workmanship warranty + manufacturer coverage on product.",
          }}
        />
      </section>

      {/* QUICK PROJECT TAGS / FILTER FEEL (no real filter logic, just visual) */}
      <section className="max-w-7xl mx-auto px-6 pb-4">
        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          {[
            "WholeHouse installs",
            "Basements & suites",
            "Stairs & transitions",
            "Retail & office",
            "Moisture-prone areas",
            "High-traffic corridors",
          ].map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* RESIDENTIAL */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-4">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-white/70">
            <HomeIcon className="h-5 w-5 text-[#F3E9EC]" />
            <span className="uppercase tracking-wide text-xs">Residential</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Residential Flooring
          </h2>
          <p className="text-white/80 mt-2 max-w-3xl">
            Whole-home installs or room-by-room upgrades with moisture checks,
            level substrates, tight seams, and clean site standards.
          </p>
        </header>

        <article className="grid lg:grid-cols-2 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <img
              src="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=1600&auto=format&fit=crop"
              alt="Residential flooring montage"
              className="h-96 w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs border border-white/10">
              Residential
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold">What we handle</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-white/80">
              <Li icon={<Ruler />} text="Moisture testing & subfloor prep" />
              <Li icon={<Wrench />} text="Self-leveling, patching & repairs" />
              <Li icon={<Layers />} text="Underlay & sound control" />
              <Li icon={<Paintbrush />} text="Stairs, nosings & transitions" />
              <Li
                icon={<ClipboardCheck />}
                text="Product sourcing & scheduling"
              />
              <Li icon={<Timer />} text="Clean, on-time installation" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill text="WholeHouse Flooring" />
              <Pill text="Kitchen Flooring" />
              <Pill text="Bathroom Tile & LVP" />
              <Pill text="Basement Flooring" />
              <Pill text="Stairs & Transitions" />
            </div>

            <div className="mt-auto pt-6">
              <TextArrowLink to="/residential">
                Explore featured homes
              </TextArrowLink>
            </div>
          </motion.div>
        </article>
      </section>

      {/* COMMERCIAL */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-white/70">
            <Landmark className="h-5 w-5 text-[#F3E9EC]" />
            <span className="uppercase tracking-wide text-xs">Commercial</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Commercial Flooring
          </h2>
          <p className="text-white/80 mt-2 max-w-3xl">
            Phased, code-compliant installs for retail, office, hospitality, and
            light industrial. Night-shift options keep operations moving.
          </p>
        </header>

        <article className="grid lg:grid-cols-2 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h3 className="text-xl font-semibold">Sectors & capabilities</h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-white/80">
              <Li icon={<Store />} text="Retail rollouts & refits" />
              <Li icon={<Landmark />} text="Mall corridors & common areas" />
              <Li icon={<Factory />} text="Light industrial offices" />
              <Li icon={<Hotel />} text="Hospitality public spaces" />
              <Li icon={<Building2 />} text="Office tenant improvements" />
              <Li icon={<HardHat />} text="Site safety, hoarding & phasing" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill text="Night-shift scheduling" />
              <Pill text="Tenant coordination" />
              <Pill text="Moisture mitigation" />
              <Pill text="Material staging" />
              <Pill text="Daily reports" />
              <Pill text="Warranty support" />
            </div>

            <div className="mt-6">
              <TextArrowLink to="/commercial">
                See commercial approach
              </TextArrowLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <img
              src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=1600&auto=format&fit=crop"
              alt="Commercial flooring montage"
              className="h-96 w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs border border-white/10">
              Commercial
            </div>
          </motion.div>
        </article>
      </section>

      {/* KPI BAND */}
      <section className="bg-gradient-to-br from-[#8F2841] via-neutral-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPI icon={<Gauge className="h-6 w-6" />} value="100%" label="On-Time Installs" />
          <KPI icon={<Users className="h-6 w-6" />} value="10/10" label="Client Satisfaction" />
          <KPI icon={<ClipboardCheck className="h-6 w-6" />} value="120+" label="Projects Completed" />
          <KPI icon={<MapPin className="h-6 w-6" />} value="Edmonton" label="Primary Service Area" />
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold">How We Work</h2>
        <p className="text-white/75 mt-2 max-w-2xl text-sm md:text-base">
          A clear, staged process keeps your project moving—whether it’s a
          single room, a full home refresh or a phased commercial scope.
        </p>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Discovery & Quote",
              text: "Site visit, product options, clear scope and pricing.",
            },
            {
              title: "Plan & Schedule",
              text: "Moisture checks, substrate plan, material logistics.",
            },
            {
              title: "Install & Update",
              text: "Daily tidy-ups, milestone check-ins, quality control.",
            },
            {
              title: "Handover & Warranty",
              text: "Final walkthrough, documentation, warranty support.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
            >
              <div className="text-xs text-white/60 uppercase tracking-wide">
                Step {i + 1}
              </div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <div className="mt-2 text-white/75 text-sm">{s.text}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <h2 className="text-2xl md:text-3xl font-bold">What Clients Say</h2>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              n: "Avery M.",
              t: "Engineered Hardwood",
              q: "Tight seams and flawless transitions. Crew was punctual and kept the site spotless.",
            },
            {
              n: "Jordan K.",
              t: "Basement LVP",
              q: "Moisture testing and leveling were handled perfectly. Looks fantastic.",
            },
            {
              n: "Priya S.",
              t: "Bathroom Tile",
              q: "Crisp tile cuts and grout lines. Small supplier delay, but communication was excellent.",
            },
          ].map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.n}</div>
                <div className="text-sm text-white/60">{r.t}</div>
              </div>
              <p className="mt-3 text-white/80">“{r.q}”</p>
              <div
                className="mt-3 text-yellow-400"
                aria-label="5 star rating"
              >
                ★★★★★
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <h2 className="text-3xl md:text-4xl font-bold">FAQs</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                >
                  <span className="font-semibold">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition ${openIdx === i ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openIdx === i && (
                  <div className="px-5 pb-5 text-white/80 text-sm">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="border-t border-white/10 bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Ready to talk through your project?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              Share your plans, photos or square footage—we&apos;ll outline
              options, timelines and a clear install path.
            </div>
          </div>
          <TextArrowLink to="/contact">Request an estimate</TextArrowLink>
        </div>
      </section>
    </main>
  );
}

/* --- small components --- */
function Trust({ item: { icon, title, text } }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">
      <div className="flex items-center gap-2 text-white/90">
        {icon}
        <div className="font-semibold">{title}</div>
      </div>
      <div className="text-white/75 text-sm mt-1">{text}</div>
    </div>
  );
}

function Li({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10">
        {icon}
      </span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

/* Text-only link: arrow slides in on hover */
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

/* Residential quick links: text-only with hover arrow (smaller) */
function GhostLink({ to, label }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-xs md:text-sm font-semibold text-white/85 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
    >
      <span className="relative">{label}</span>
      <ArrowRight
        className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden="true"
      />
    </Link>
  );
}

function KPI({ icon, value, label }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 text-center shadow-xl">
      <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06]">
        {icon}
      </div>
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-1 text-white/70 text-sm">{label}</div>
    </div>
  );
}

function Pill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80">
      {text}
    </span>
  );
}
