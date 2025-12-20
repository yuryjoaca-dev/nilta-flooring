// src/pages/Home.jsx (or wherever you keep pages)
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// If you already have ImageSlider, reuse it. Otherwise, use a static <img>.
import ImageSlider from "../components/ImageSlider";

const COMPANY = "Nilta Flooring";

export default function Home() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background image / gradient */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-black via-[#8F2841] to-black opacity-70" />

          {<img
            src="/home/home-hero.webp"
            alt="Nilta Flooring"
            className="w-full h-full object-cover mix-blend-multiply"
          />}

        </div>

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="uppercase tracking-[0.3em] text-sm text-gray-300 mb-4">
              Premium Flooring • Alberta
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Floors that{" "}
              <span className="text-[#F3E9EC]">
                transform
              </span>{" "}
              your entire space.
            </h1>
            <p className="text-gray-200 text-base md:text-lg max-w-xl mb-8">
              {COMPANY} specializes in high-end flooring installations —
              hardwood, luxury vinyl, tile and more — with meticulous detail,
              durable materials and a clean, client-focused process.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="px-6 py-3 rounded-full bg-[#8F2841] hover:bg-[#a73753] text-white font-semibold shadow-lg transition"
              >
                View our projects
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full border border-gray-400 text-gray-100 hover:bg-white hover:text-black transition"
              >
                Get a free estimate
              </Link>
            </div>
          </motion.div>

          {/* Hero side card / image */}
          <motion.div
            className="flex-1 max-w-md w-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold mb-2">
                Flooring that’s built to last.
              </h2>
              <p className="text-sm text-gray-300 mb-4">
                We combine premium materials, clean installation and precise
                leveling to create floors that look incredible and feel solid
                for years.
              </p>

              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8F2841]" />
                  Hardwood, vinyl, laminate & tile
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8F2841]" />
                  Residential & light commercial
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8F2841]" />
                  Clean job sites & tight timelines
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 ANIMATED COLUMNS SECTION */}
      <section className="bg-black">
        <div className="flex flex-col md:flex-row w-full min-h-[80vh]">
          {[
            {
              title: "Our Team",
              desc: "Experienced installers, detail-obsessed craftsmanship and a friendly, on-site presence.",
              images: ["/home/our-team-2.webp"],
              link: "/about",
              cta: "Meet the team",
            },
            {
              title: "Projects",
              desc: "From modern condos to full home renovations — explore real Nilta Flooring transformations.",
              images: ["/home/projects.jpg"],
              link: "/projects",
              cta: "See our work",
            },
            {
              title: "Materials We Use",
              desc: "Carefully selected hardwood, luxury vinyl, tile and underlayment from trusted suppliers.",
              images: ["/home/material.webp"],
              link: "/materials",
              cta: "View materials",
            },
            {
              title: "Get in Touch",
              desc: "Tell us about your space and vision — we’ll help you choose the perfect flooring solution.",
              images: ["/home/get-in-touch.webp"],
              link: "/contact",
              cta: "Request a quote",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="
                relative h-[320px] md:h-[80vh] overflow-hidden flex-1 group cursor-pointer
                transition-[flex] duration-700 ease-in-out
                hover:flex-[3]
              "
            >
              {/* Background slider + zoom on hover */}
              <motion.div
                className="absolute inset-0"
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <ImageSlider images={item.images} />
                {/* If you don't want slider, replace with:
                  <img src={item.images[0]} className="w-full h-full object-cover" />
                */}
              </motion.div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500" />

              {/* Centered content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
                <motion.h3
                  className="text-2xl md:text-3xl font-bold mb-2"
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {item.title}
                </motion.h3>

                <p
                  className="
                    text-sm md:text-base max-w-[260px] mb-6
                    opacity-0 translate-y-3
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-500 ease-out
                  "
                >
                  {item.desc}
                </p>

                <Link
                  to={item.link}
                  className="
                    bg-[#8F2841] hover:bg-[#a73753]
                    text-white px-5 py-2.5 rounded-full shadow-lg
                    text-sm md:text-base font-semibold
                    transition
                  "
                >
                  {item.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#0f0f10] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why choose{" "}
                <span className="text-[#8F2841]">{COMPANY}</span>?
              </h2>
              <p className="text-gray-300 mb-6">
                Flooring is the foundation of your space — visually and
                structurally. We treat every installation like it&apos;s our own
                home, combining precision, communication and clean work
                practices.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-100">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Detail-driven installs
                  </h3>
                  <p className="text-gray-300">
                    Proper subfloor prep, tight cuts and smooth transitions,
                    minimizing squeaks and gaps.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Clear communication
                  </h3>
                  <p className="text-gray-300">
                    Straightforward timelines, honest expectations and
                    consistent updates throughout the project.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Trusted materials
                  </h3>
                  <p className="text-gray-300">
                    We work with suppliers we trust, using products suited to
                    Alberta&apos;s climate and lifestyle.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-semibold mb-1 text-[#F3E9EC]">
                    Respect for your home
                  </h3>
                  <p className="text-gray-300">
                    Protecting existing finishes, daily clean-ups and a tidy
                    site from start to finish.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/home/premiumflooring-2.webp"
                  alt="Premium flooring installation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-20 -right-2 -left-0  bg-[#8F2841] text-white px-4 py-3 rounded-2xl shadow-lg text-sm">
                <div className="abolute -center font-semibold">Over 100+ floors installed</div>
                <div className="abolute -center text-xs text-pink-100">
                  Residential &amp; light commercial projects completed.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MINI CTA SECTION */}
      <section className="bg-[#8F2841] text-white py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">
              Ready to upgrade your flooring?
            </h2>
            <p className="text-sm md:text-base text-[#F9EDEF]">
              Tell us about your project and we&apos;ll help you choose the
              right material, style and installation plan.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-full bg-black hover:bg-zinc-900 text-white font-semibold shadow-lg transition text-sm md:text-base"
          >
            Book a consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
