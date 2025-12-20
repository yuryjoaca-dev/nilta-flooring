// src/pages/Materials.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";
import {
  Layers,
  Ruler,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const SITE_URL = "https://example.com"; // TODO: replace with your real domain

export default function Materials() {
  const heroImg =
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop";

  const pageUrl = `${SITE_URL}/materials`;

  const ld = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Flooring Materials – Nilta Flooring",
      url: pageUrl,
      description:
        "Overview of the main flooring materials Nilta Flooring works with: ceramic tile, laminate and hardwood.",
    }),
    [pageUrl]
  );

  return (
    <main className="pt-16 min-h-screen bg-[#050507] text-white">
      {/* SEO */}
      <Helmet>
        <title>Materials | Nilta Flooring – Tile, Laminate & Hardwood</title>
        <meta
          name="description"
          content="See the main flooring materials we work with at Nilta Flooring: ceramic & porcelain tile, laminate and hardwood – high quality at competitive pricing in Edmonton."
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Materials | Nilta Flooring" />
        <meta
          property="og:description"
          content="Ceramic tile, laminate and hardwood flooring options – quality products at competitive pricing for homes in Edmonton and surrounding areas."
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
        <img
          src={heroImg}
          alt="Flooring materials hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-[#050507]" />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            Materials
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Materials that{" "}
            <span className="text-[#F3E9EC]">look good</span> and perform in
            real homes.
          </motion.h1>
          <motion.p
            className="mt-3 text-white/85 max-w-2xl text-sm md:text-base"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ceramic tile, laminate and hardwood—from trusted brands, selected
            for Edmonton&apos;s climate, lifestyles and budgets.
          </motion.p>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Materials", to: "/materials" },
          ]}
        />
      </section>
      <BreadcrumbLD
        items={[
          { label: "Home", url: `${SITE_URL}/` },
          { label: "Materials", url: pageUrl },
        ]}
      />

      {/* INTRO ROW */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold">How we choose materials</h2>
          <p className="text-white/80 mt-4 text-sm md:text-base max-w-3xl leading-relaxed">
            Nilta Flooring was started on a simple principle:{" "}
            <span className="font-semibold text-[#F3E9EC]">
              quality doesn&apos;t have to come at a high price
            </span>
            . We stock and install products we&apos;d be comfortable using in
            our own homes—materials with solid warranties, reliable
            manufacturers and finishes that can handle real life.
          </p>
          <p className="text-white/75 mt-3 text-sm md:text-base max-w-3xl">
            Below are the three main categories we work with most often. Each
            has its place depending on your space, budget and how you live day
            to day.
          </p>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl text-sm"
        >
          <div className="text-sm text-white/60">Why clients pick us</div>
          <ul className="mt-3 space-y-2 text-white/85">
            <li>• Competitive pricing on quality brands.</li>
            <li>• Guidance on which product fits each room.</li>
            <li>• Supply + professional installation from one team.</li>
            <li>• Edmonton-based, serving surrounding cities.</li>
          </ul>
          <div className="mt-6">
            <Link
              to="/contact"
              className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
            >
              <span>Ask about materials for your project</span>
              <ArrowRight
                className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.aside>
      </section>

      {/* MATERIAL BLOCKS */}
      <section className="max-w-7xl mx-auto px-6 pb-14 space-y-8">
        {/* CERAMIC TILE */}
        <MaterialBlock
          icon={<Layers className="h-6 w-6" />}
          label="Ceramic Tile"
          badge="Tile • Porcelain • Stone"
          image="/materials/tile-hero.webp" // change to your real image
        >
          <p className="text-white/80 text-sm md:text-base">
            Our collection of tile includes a comprehensive selection of{" "}
            <span className="font-medium">ceramic, porcelain, mosaic and natural stone</span>{" "}
            tiles. We are thrilled to bring one of the best selections of elegant
            tile to Central Alberta at unbeatable pricing. We stock products that
            are sure to satisfy everyone&apos;s taste.
          </p>
          <p className="text-white/75 text-sm md:text-base mt-3">
            Nilta Flooring was started on the principle that{" "}
            <span className="font-medium">quality does not have to come at a high price</span>.
            We stock high quality guaranteed products and offer some of the most
            competitive prices in Edmonton and surrounding cities.
          </p>
        </MaterialBlock>

        {/* LAMINATE */}
        <MaterialBlock
          icon={<Ruler className="h-6 w-6" />}
          label="Laminate"
          badge="Durable • Budget-Friendly"
          reversed
          image="/materials/laminate-hero.webp" // change to your real image
        >
          <p className="text-white/80 text-sm md:text-base">
            Laminate flooring primarily replicates the look and feel of hardwood
            flooring. From modern greys or light oaks, to darker cherries and brown
            mahoganies, there are numerous widths, lengths, textures, finishes, and
            colours to choose from—and it&apos;s relatively easy to install.
          </p>
          <p className="text-white/75 text-sm md:text-base mt-3">
            If you&apos;re thinking about installing laminate flooring in your home,
            we&apos;re happy to walk you through product choices. Our team can point
            you toward options that balance{" "}
            <span className="font-medium">durability, look and budget</span>.
          </p>
        </MaterialBlock>

        {/* HARDWOOD */}
        <MaterialBlock
          icon={<BadgeCheck className="h-6 w-6" />}
          label="Hardwood"
          badge="Premium • Natural"
          image="/materials/hardwood-hero.webp" // change to your real image
        >
          <p className="text-white/80 text-sm md:text-base">
            Its many uses make hardwood an indispensable material. For the flooring
            industry, the best quality woods come from species harvested in sustainable
            forests. The logs are then sawn in different styles like{" "}
            <span className="font-medium">rift-sawn, flat-sawn and quarter-sawn</span> to
            achieve different graining patterns.
          </p>
          <p className="text-white/75 text-sm md:text-base mt-3">
            At our flooring store in Edmonton, we carry{" "}
            <span className="font-medium">numerous top brands</span>. Clients can browse
            a wide variety of collections, from classic oaks to contemporary species
            and finishes—and we handle the installation details.
          </p>
        </MaterialBlock>
      </section>

      {/* CTA */}
      <section className="bg-black/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              Not sure which material fits your space?
            </div>
            <div className="text-white/70 text-sm md:text-base">
              Tell us where the floor is going and how you use the room—we&apos;ll
              recommend tile, laminate or hardwood options that make sense.
            </div>
          </div>
          <Link
            to="/contact"
            className="group inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/10 hover:text-[#F2C4D0]"
          >
            <span>Talk materials with us</span>
            <ArrowRight
              className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}

/* --- small components --- */

function MaterialBlock({ icon, label, badge, reversed = false, image, children }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`grid gap-6 items-stretch ${reversed ? "lg:grid-cols-[1.1fr,1.1fr]" : "lg:grid-cols-[1.1fr,1.1fr]"
        }`}
    >
      {/* Text */}
      <div className={`flex flex-col justify-center ${reversed ? "order-2 lg:order-1" : "order-1"}`}>
        <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10">
            {icon}
          </span>
          <div>
            <div className="font-semibold text-base md:text-lg">{label}</div>
            {badge && (
              <div className="text-[11px] uppercase tracking-wide text-white/50">
                {badge}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">{children}</div>
      </div>

      {/* Image */}
      <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl ${reversed ? "order-1 lg:order-2" : "order-2"}`}>
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover max-h-80 md:max-h-96 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      </div>
    </motion.article>
  );
}
