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
      a: "We work hard to provide realistic, reliable timelines from the start. Each project is carefully planned based on scope, materials, and scheduling, and we keep you updated along the way to avoid any surprises. If anything changes, we communicate early and clearly.",
    },
    {
      q: "Do you handle prep and leveling?",
      a: "Yes—we take care of all the necessary preparations and levelling to ensure a smooth, long-lasting installation. Proper prep is a key part of how we work, and we make sure surfaces are ready before any flooring goes down, so the finished result looks and feels right.",
    },
    {
      q: "What flooring products do you install?",
      a: "We install a wide range of flooring products, including hardwood, luxury vinyl plank (LVP), tile, carpet, and carpet tile. We’ll help you choose the right option based on your space, lifestyle, and how the area is used, ensuring the flooring stays comfortable and performs well over time.",
    },
    {
      q: "Do you work around our hours?",
      a: "Yes—we do our best to schedule work in a way that minimizes disruption to your home or business. For commercial projects, this can include evening, night, or phased installations as needed. We’ll always coordinate with you in advance to find a schedule that works.",
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
            NILTA FLOORING • PROJECTS
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            FLOORS BUILT FOR{" "}
            <span className="text-[#F3E9EC]">REAL LIFE.</span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-3xl text-white/85 text-sm md:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            From family basements to busy corridors, we design and install
            flooring systems that comfortably handle Alberta’s climate, daily
            foot traffic, and the rhythms of everyday life.
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
            text: "Fully licensed installers work with care and clear safety standards, giving you peace of mind throughout your project.",
          }}
        />
        <Trust
          item={{
            icon: <Timer className="h-5 w-5" />,
            title: "On-Time Delivery",
            text: "We set clear milestones so your project progresses smoothly from start to finish.",
          }}
        />
        <Trust
          item={{
            icon: <Handshake className="h-5 w-5" />,
            title: "Transparent Quotes",
            text: "Clear, detailed scopes covering prep, materials, trims, and transitions, so you know exactly what to expect.",
          }}
        />
        <Trust
          item={{
            icon: <BadgeCheck className="h-5 w-5" />,
            title: "Warranty Coverage",
            text: "Our workmanship warranty, paired with manufacturer product coverage, helps ensure long-term peace of mind.",
          }}
        />
      </section>

      {/* QUICK PROJECT TAGS / FILTER FEEL (no real filter logic, just visual) */}
      <section className="max-w-7xl mx-auto px-6 pb-4">
        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          {[
            "Whole-home installs",
            "Basements & secondary suites",
            "Stairs & clean transitions",
            "Retail & office spaces",
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
            Whole-home installations or targeted room-by-room upgrades,
            completed with moisture testing, level substrates, tight seams, and
            clean, respectful job sites.
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
            <h3 className="text-xl font-semibold">What we handle in homes</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-white/80">
              <Li
                icon={<Ruler />}
                text="Moisture testing & subfloor preparation"
              />
              <Li icon={<Wrench />} text="Self-leveling, patching & repairs" />
              <Li icon={<Layers />} text="Underlay and sound control" />
              <Li icon={<Paintbrush />} text="Stairs, nosings & transitions" />
              <Li
                icon={<ClipboardCheck />}
                text="Product sourcing & scheduling"
              />
              <Li icon={<Timer />} text="Clean, on-time installation" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill text="Whole-House Flooring" />
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
            Carefully planned flooring installations for retail, office,
            hospitality, and industrial spaces, with flexible scheduling,
            including night work, to help your business stay on track.
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

            {/* ✅ Updated list per request */}
            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-white/80">
              <Li icon={<Store />} text="Retail rollouts, retrofits, and tenant turnovers." />
              <Li icon={<Landmark />} text="Mall corridors, common areas, and lobbies." />
              <Li icon={<Factory />} text="Industrial facilities and offices." />
              <Li icon={<Hotel />} text="Hospitality public spaces, lounges, and corridors." />
              <Li icon={<Building2 />} text="Office tenant improvements and fit-outs." />
              <Li icon={<ClipboardCheck />} text="Medical and professional office spaces." />
              <Li icon={<Layers />} text="Showrooms and sales centers." />
              <Li icon={<Users />} text="Multi-unit residential common areas." />
              <Li icon={<BadgeCheck />} text="Education and training facilities." />
            </div>

            {/* ✅ New: Project coordination includes */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-white/90">
                Project coordination includes
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Site safety",
                  "Phasing",
                  "Night scheduling",
                  "Tenant coordination",
                  "Moisture mitigation",
                  "Material staging",
                  "Daily progress reports",
                  "Warranty support",
                ].map((t) => (
                  <Pill key={t} text={t} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <TextArrowLink to="/commercial">
                See our commercial approach
              </TextArrowLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] min-h-96"
          >
            <img
              src="/projects/commercial.jpg"
              alt="Commercial flooring montage"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
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
          The flow of a clear step-by-step process keeps everything running
          smoothly, whether you’re updating one room, refreshing your whole
          home, or managing a phased commercial project.
        </p>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Discovery & Quote",
              text: "We review your space, discuss suitable product options, and establish a clear scope to ensure accurate, straightforward pricing.",
            },
            {
              title: "Plan & Schedule",
              text: "We coordinate planning, preparation, and materials on your timeline, making sure everything aligns comfortably with your schedule.",
            },
            {
              title: "Install & Update",
              text: "We take care of daily clean-ups, keep you updated along the way, and ensure quality at every stage of the install.",
            },
            {
              title: "Handover & Warranty",
              text: "We wrap up with a final walkthrough, clear documentation, and warranty support, so you feel confident long after the project is completed.",
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
              q: "Tight seams and flawless transitions. The crew was punctual and kept the site spotless.",
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
              <div className="mt-3 text-yellow-400" aria-label="5 star rating">
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
              Ready to get started?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              Share your plans, photos, or square footage, and we’ll help map
              out options and timing in a way that feels simple and comfortable.
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
