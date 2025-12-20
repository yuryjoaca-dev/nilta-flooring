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
    name: "Nilta Flooring Blog",
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

  // ---- data flow
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
  const featured = filtered[0] || POSTS[0];

  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      {/* SEO META */}
      <Helmet>
        <title>Blog | Nilta Flooring – Guides, Design & Commercial</title>
        <meta
          name="description"
          content="Practical flooring guides and insights for residential and commercial spaces in Edmonton, AB—LVP, laminate, engineered hardwood, and tile."
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Nilta Flooring Blog" />
        <meta
          property="og:description"
          content="Guides and insights on flooring products, prep, installation, and care across Edmonton, AB."
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

      {/* HERO – same vibe as About/Projects */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src="/blog/blog-hero-new.webp"
          alt="Blog hero"
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
            Nilta Flooring • Blog
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Flooring Insights & Guides
          </motion.h1>
          <motion.p
            className="mt-3 text-white/85 max-w-2xl text-sm md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Practical advice on selecting, preparing, installing, and maintaining
            floors—for homes and commercial spaces.
          </motion.p>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Blog", to: "/blog" },
          ]}
        />
      </section>
      <BreadcrumbLD
        items={[
          { label: "Home", url: `${SITE_URL}/` },
          { label: "Blog", url: pageUrl },
        ]}
      />

      {/* INTRO + “AT A GLANCE” (like About page structure) */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold">What you&apos;ll find here</h2>
          <p className="text-white/80 mt-4 leading-relaxed text-sm md:text-base max-w-3xl">
            No fluff, no jargon. Just real-world notes from residential and
            commercial jobs across Edmonton—what works, what fails, and how to
            plan a flooring project without guessing.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge text="Homeowners" />
            <Badge text="Property managers" />
            <Badge text="Designers" />
            <Badge text="GCs & trades" />
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl text-sm"
        >
          <div className="text-sm text-white/60">At a glance</div>
          <ul className="mt-3 space-y-3 text-white/85 text-sm">
            <li>• Guides on choosing LVP, laminate, hardwood and tile.</li>
            <li>• Prep checklists: subfloors, moisture, stairs, basements.</li>
            <li>• Notes from commercial projects and phasing.</li>
            <li>• Care tips so floors actually last.</li>
          </ul>
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
                  className={`rounded-full px-3 py-1 text-xs transition border ${cat === c
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

      {/* SEARCH BAR (separate row, like a tool) */}
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
                placeholder="LVP, basements, prep…"
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-white/40"
                aria-label="Search articles"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE – like a hero card at top of list */}
      {featured && (
        <section className="max-w-7xl mx-auto px-6 pb-6">
          <motion.article
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] grid lg:grid-cols-[1.1fr,1fr] shadow-xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/blog/${featured.slug}`}
              className="relative block max-h-[340px]"
            >
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover min-h-[260px] lg:min-h-[340px] transition-transform duration-700 hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur px-3 py-1 text-xs border border-white/20">
                Featured · {featured.category}
              </span>
            </Link>
            <div className="p-6 flex flex-col">
              <div className="text-white/60 text-xs">
                {prettyDate(featured.date)} • {featured.readTime} min read
              </div>
              <Link
                to={`/blog/${featured.slug}`}
                className="mt-2 font-semibold text-2xl md:text-3xl hover:text-[#F2C4D0] transition-colors"
              >
                {featured.title}
              </Link>
              <p className="text-white/80 mt-3 text-sm md:text-base">
                {featured.excerpt}
              </p>
              <div className="mt-auto pt-4">
                <TextArrowLink to={`/blog/${featured.slug}`}>
                  Read article
                </TextArrowLink>
              </div>
            </div>
          </motion.article>
        </section>
      )}

      {/* GRID OF POSTS (rest of the list) */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
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
                className={`h-9 w-9 rounded-xl border text-sm transition ${page === n
                  ? "border-[#8F2841] bg-[#8F2841]/30 text-[#F3E9EC]"
                  : "border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/10"
                  }`}
              >
                {n}
              </button>
            ))}
            <PageBtn
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
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

function Badge({ text }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80">
      {text}
    </span>
  );
}
