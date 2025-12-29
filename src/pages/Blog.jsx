// src/pages/Blog.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import BreadcrumbLD from "../components/BreadcrumbLD.jsx";
import { POSTS } from "../data/blog.js";

const CATEGORIES = ["All", "Guides", "Design", "Build", "Commercial"];

export default function Blog() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // --- SEO / URLs ---
  const SITE_URL = "https://nilta.ca/"; // TODO: replace with real domain
  const pageUrl = `${SITE_URL}/blog`;

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nilta Flooring • Guide & Tips",
    url: pageUrl,
    inLanguage: "en-CA",
    publisher: { "@type": "Organization", name: "Nilta Flooring" },
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: POSTS.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/blog/${p.slug}`,
      item: {
        "@type": "BlogPosting",
        headline: p.title,
        datePublished: p.date,
        image: p.image,
        author: { "@type": "Organization", name: p.author || "Nilta Flooring" },
        description: p.excerpt,
        mainEntityOfPage: `${SITE_URL}/blog/${p.slug}`,
      },
    })),
  };

  // --- Always show the newest GUIDE (independent of filters/search)
  const mostRecentGuide = useMemo(() => {
    const guides = [...POSTS]
      .filter((p) => (p.category || "").toLowerCase() === "guides")
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    return guides[0] || null;
  }, []);

  // ---- data flow (filters/search control the grid only)
  const filtered = useMemo(() => {
    let list = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Fallback if no guides exist for any reason:
  const mostRecentCard = mostRecentGuide || filtered[0] || POSTS[0];

  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      {/* SEO META */}
      <Helmet>
        <title>Guide & Tips | Nilta Flooring – Insights & Practical Guides</title>
        <meta
          name="description"
          content="Flooring insights and practical guidance, shaped by hands-on experience across Alberta residential and commercial projects."
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Nilta Flooring • Guide & Tips" />
        <meta
          property="og:description"
          content="Practical guides on flooring choices, prep, timelines, and care—built from real experience in Edmonton and across Alberta."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* JSON-LD */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogLd)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
      </Helmet>

      {/* HERO */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src="/blog/blog-hero-new.webp"
          alt="Guide & Tips hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-neutral-950" />
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.p
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300 mb-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nilta Flooring • Guide & Tips
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Flooring Insights & Practical Guides
          </motion.h1>
          <motion.p
            className="mt-3 text-white/85 max-w-2xl text-sm md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Flooring insights and practical guidance, shaped by hands-on
            experience across Alberta residential and commercial projects.
          </motion.p>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Guide & Tips", to: "/blog" },
          ]}
        />
      </section>
      <BreadcrumbLD
        items={[
          { label: "Home", url: `${SITE_URL}/` },
          { label: "Guide & Tips", url: pageUrl },
        ]}
      />

      {/* START HERE + ABOUT + WHO FOR */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        {/* Left: Start Here + About */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Start Here */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
            <p className="uppercase tracking-[0.25em] text-[11px] text-white/60">
              Start Here
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">
              Welcome! If you’re not quite sure where to begin, you’re in good
              company.
            </h2>
            <p className="text-white/80 mt-4 leading-relaxed text-sm md:text-base">
              It’s completely normal to have questions—about flooring choices,
              preparation, or the overall process. Our guides are designed to
              make everything feel a bit more approachable and clear.
            </p>
            <p className="text-white/80 mt-3 leading-relaxed text-sm md:text-base">
              Feel free to start with whatever feels most relevant to you right
              now, and you can always return as new questions come up. And
              remember, if you’d rather chat directly, just give us a call.
              We’re more than happy to answer any questions and guide you
              through the first steps of your project.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full border border-red-500/70 px-4 py-2 text-xs md:text-sm font-semibold hover:bg-red-600/10 hover:border-red-600 transition"
              >
                Contact us
              </Link>
              <a
                href="#articles"
                className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-xs md:text-sm font-semibold hover:bg-white/5 transition"
              >
                Browse articles
              </a>
            </div>
          </div>

          {/* About these guides */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold">About these guides</h3>
            <p className="text-white/80 mt-3 leading-relaxed text-sm md:text-base max-w-3xl">
              Everything you’ll find here comes from real experience—jobs
              completed, lessons learned, and conversations we’ve had with
              homeowners, builders, and property managers across Edmonton and
              Alberta.
            </p>
            <p className="text-white/80 mt-3 leading-relaxed text-sm md:text-base max-w-3xl">
              We write the same way we speak on-site and in our showroom:
              honestly, clearly, and without pressure. The goal isn’t to rush
              decisions—it’s to help you feel comfortable making them.
            </p>
          </div>
        </motion.div>

        {/* Right: Who this is for + filters */}
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl text-sm"
        >
          <div className="text-sm text-white/60">Who this is for</div>
          <ul className="mt-3 space-y-3 text-white/85 text-sm">
            <li>• Homeowners planning a refresh or renovation</li>
            <li>• Property managers thinking long-term</li>
            <li>• Designers refining details and materials</li>
            <li>• Builders and trades coordinating work</li>
          </ul>
          <p className="text-xs text-white/60 mt-4">
            Many people wear more than one hat—these guides are meant to support
            that.
          </p>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-xs text-white/60 mb-2">Quick filters</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCat(c);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-xs transition border ${
                    cat === c
                      ? "border-[#8F2841] bg-[#8F2841]/25 text-[#F3E9EC]"
                      : "border-white/15 bg-white/[0.02] text-white/80 hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </motion.aside>
      </section>

      {/* SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-6 pb-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-sm text-white/75">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
            {cat !== "All" ? ` in “${cat}”` : ""}.
          </div>
          <div className="w-full sm:w-auto sm:min-w-[260px]">
            <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-3 py-1.5">
              <span className="text-xs text-white/60 pl-1">Search</span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Basements, prep, waterproofing…"
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-white/40"
                aria-label="Search articles"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MOST RECENT GUIDE */}
      {mostRecentCard && (
        <section className="max-w-7xl mx-auto px-6 pb-6">
          <motion.article
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] grid lg:grid-cols-[1.1fr,1fr] shadow-xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/blog/${mostRecentCard.slug}`}
              className="relative block max-h-[340px]"
            >
              <img
                src={mostRecentCard.image}
                alt={mostRecentCard.title}
                className="h-full w-full object-cover min-h-[260px] lg:min-h-[340px] transition-transform duration-700 hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur px-3 py-1 text-xs border border-white/20">
                Most Recent Guide · {mostRecentCard.category}
              </span>
            </Link>
            <div className="p-6 flex flex-col">
              <div className="text-white/60 text-xs">
                {prettyDate(mostRecentCard.date)} • {mostRecentCard.readTime} min read
              </div>
              <Link
                to={`/blog/${mostRecentCard.slug}`}
                className="mt-2 font-semibold text-2xl md:text-3xl hover:text-[#F2C4D0] transition-colors"
              >
                {mostRecentCard.title}
              </Link>
              <p className="text-white/80 mt-3 text-sm md:text-base">
                {mostRecentCard.excerpt}
              </p>
              <div className="mt-auto pt-4">
                <TextArrowLink to={`/blog/${mostRecentCard.slug}`}>
                  Read article
                </TextArrowLink>
              </div>
            </div>
          </motion.article>
        </section>
      )}

      {/* GRID OF POSTS */}
      <section id="articles" className="max-w-7xl mx-auto px-6 pb-12">
        {shown.length === 0 ? (
          <div className="text-white/70 text-sm">
            No articles match your filters yet. Try another category or search
            term.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((p, i) => (
              <PostCard key={p.slug} post={p} i={i} />
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-9 w-9 rounded-xl border text-sm transition ${
                  page === n
                    ? "border-[#8F2841] bg-[#8F2841]/30 text-[#F3E9EC]"
                    : "border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/10"
                }`}
              >
                {n}
              </button>
            ))}
            <PageBtn disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </PageBtn>
          </div>
        )}
      </section>
    </main>
  );
}

/* --- util & small components --- */
function prettyDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PostCard({ post, i }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: i * 0.03 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col shadow-lg hover:shadow-xl transition-shadow"
    >
      <Link to={`/blog/${post.slug}`} className="relative block">
        <img
          src={post.image}
          alt={post.title}
          className="h-44 w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-black/65 backdrop-blur px-3 py-1 text-[11px] border border-white/15">
          {post.category}
        </span>
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <div className="text-white/55 text-[11px] flex items-center gap-2">
          <span>{prettyDate(post.date)}</span>
          <span className="h-1 w-1 rounded-full bg-white/35" />
          <span>{post.readTime} min read</span>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="font-semibold text-sm md:text-base hover:text-[#F2C4D0] transition-colors"
        >
          {post.title}
        </Link>
        <p className="text-white/75 text-xs md:text-sm line-clamp-3">
          {post.excerpt}
        </p>
        <div className="pt-1">
          <TextArrowLink to={`/blog/${post.slug}`}>Read article</TextArrowLink>
        </div>
      </div>
    </motion.article>
  );
}

function TextArrowLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-xs md:text-sm font-semibold text-white/90 transition hover:border-[#8F2841] hover:bg-[#8F2841]/15 hover:text-[#F2C4D0]"
    >
      <span className="relative">{children}</span>
      <svg
        className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 12h14M13 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function PageBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-3 py-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 disabled:opacity-45 disabled:pointer-events-none text-xs md:text-sm"
    >
      {children}
    </button>
  );
}
