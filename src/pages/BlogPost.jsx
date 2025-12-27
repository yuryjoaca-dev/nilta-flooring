// src/pages/BlogPost.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { POSTS } from "../data/blog.js";

export default function BlogPost() {
  const { slug } = useParams();

  const postIndex = useMemo(
    () => POSTS.findIndex((p) => p.slug === slug),
    [slug]
  );
  const post = postIndex >= 0 ? POSTS[postIndex] : null;

  // Prev/Next based on current order in POSTS
  const prevPost = postIndex > 0 ? POSTS[postIndex - 1] : null;
  const nextPost =
    postIndex >= 0 && postIndex < POSTS.length - 1 ? POSTS[postIndex + 1] : null;

  if (!post) {
    return (
      <main className="pt-16 min-h-screen bg-neutral-950 text-white">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-3xl font-bold">Article not found</div>
          <p className="text-white/70 mt-2">
            The article you’re looking for doesn’t exist.
          </p>
          <Link
            to="/blog"
            className="inline-block mt-6 rounded-full border border-white/15 px-4 py-2 hover:bg-white/5"
          >
            Back to Guide & Tips
          </Link>
        </div>
      </main>
    );
  }

  const SITE_URL = "https://nilta.ca"; // swap to your real domain
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  // Optional: support `post.body` as plain text OR as structured sections
  // If you only add `post.body` (string), this will render nicely with headings/bullets based on simple parsing.
  // Best: pass `post.sections` (array) for full control.
  const hasStructured = Array.isArray(post.sections) && post.sections.length > 0;

  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      {/* SEO */}
      <Helmet>
        <title>{post.title} | Nilta Flooring • Guide & Tips</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      <ProgressBar />

      {/* Hero */}
      <section className="relative h-[46vh] overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
        <div className="relative z-10 max-w-5xl mx-auto h-full px-6 flex flex-col justify-end pb-10">
          <div className="text-white/70 text-sm">
            {new Date(post.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            • {post.readTime} min • {post.category}
          </div>

          <motion.h1
            className="text-3xl md:text-5xl font-extrabold mt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {post.title}
          </motion.h1>

          <div className="text-white/70 text-sm mt-2">
            By {post.author || "the Nilta Flooring Team"}
          </div>
        </div>
      </section>

      {/* Layout: content + right rail */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Article */}
        <ArticleContent post={post} structured={hasStructured} />

        {/* Right rail */}
        <aside className="hidden lg:block">
          <RightRail post={post} canonicalUrl={canonicalUrl} />
        </aside>
      </section>

      {/* Prev / Next */}
      <NavFence prevPost={prevPost} nextPost={nextPost} />

      {/* Related posts */}
      <RelatedPosts currentSlug={post.slug} />
    </main>
  );
}

/* ---------- Components ---------- */

function ProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const p = height > 0 ? (scrollTop / height) * 100 : 0;
      setPct(Math.max(0, Math.min(100, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-white/5">
      <div
        className="h-full bg-red-500 transition-[width] duration-150"
        style={{ width: `${pct}%` }}
        aria-hidden
      />
    </div>
  );
}

function ArticleContent({ post, structured }) {
  const articleRef = useRef(null);
  const [toc, setToc] = useState([]);

  // Simple image zoom
  const [zoomSrc, setZoomSrc] = useState(null);

  // Build TOC from h2/h3 in the rendered content
  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll("h2, h3"));
    const out = headings.map((el) => {
      const id = el.textContent
        ?.toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      if (id && !el.id) el.id = id;
      return { id, text: el.textContent || "", level: el.tagName.toLowerCase() };
    });
    setToc(out);
  }, [post.slug]);

  // Content rendering:
  // - If you add `post.sections`: render them with headings, paragraphs, and bullet lists.
  // - Else if you add `post.body` (string): render with simple parsing (paragraphs + headings).
  // - Else fallback to the old demo blocks (but you should remove them once posts have body/sections).
  return (
    <article className="min-w-0">
      <div
        ref={articleRef}
        className="prose prose-invert prose-headings:scroll-mt-24 max-w-none"
      >
        {/* Intro */}
        <p className="text-white/85 text-lg">{post.excerpt}</p>

        {/* ✅ NEW: Render real post content if provided */}
        {structured ? (
          <StructuredSections sections={post.sections} />
        ) : post.body ? (
          <BodyText body={post.body} />
        ) : (
          <FallbackDemo post={post} onZoom={() => setZoomSrc(post.image)} />
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          <Link
            to="/blog"
            className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/5"
          >
            ← Back to Guide & Tips
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/5"
          >
            Contact Nilta Flooring
          </Link>
        </div>
      </div>

      {/* Right-rail TOC for mobile (collapsible) */}
      {toc.length > 0 && (
        <details className="lg:hidden mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <summary className="cursor-pointer font-semibold">On this page</summary>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {toc.map((h) => (
              <li key={h.id} className={h.level === "h3" ? "ml-3" : ""}>
                <a href={`#${h.id}`} className="hover:text-red-500">
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Lightbox */}
      {zoomSrc && (
        <div
          onClick={() => setZoomSrc(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4"
        >
          <img
            src={zoomSrc}
            alt="Zoomed"
            className="max-h-[85vh] max-w-[92vw] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </article>
  );
}

/* ---------- Content render helpers ---------- */

function StructuredSections({ sections }) {
  return (
    <>
      {sections.map((s, idx) => {
        if (s.type === "h2") return <h2 key={idx}>{s.text}</h2>;
        if (s.type === "h3") return <h3 key={idx}>{s.text}</h3>;
        if (s.type === "p") return <p key={idx}>{s.text}</p>;
        if (s.type === "ul")
          return (
            <ul key={idx}>
              {Array.isArray(s.items) &&
                s.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          );
        if (s.type === "hr") return <hr key={idx} />;
        return null;
      })}
    </>
  );
}

/**
 * If you store content as a single string `post.body`,
 * this turns it into paragraphs and simple "Heading:" blocks.
 */
function BodyText({ body }) {
  const lines = String(body || "")
    .split("\n")
    .map((l) => l.trim());

  const blocks = [];
  let buffer = [];

  const flush = () => {
    const text = buffer.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
    buffer = [];
  };

  for (const line of lines) {
    if (!line) {
      flush();
      continue;
    }

    // Treat lines ending with ":" as headings (like "Innovative Lighting:")
    if (line.endsWith(":") && line.length <= 80) {
      flush();
      blocks.push({ type: "h2", text: line.replace(/:$/, "") });
      continue;
    }

    // Simple divider markers
    if (line === "---" || line === "----" || line === "⸻") {
      flush();
      blocks.push({ type: "hr" });
      continue;
    }

    buffer.push(line);
  }
  flush();

  return (
    <>
      {blocks.map((b, idx) => {
        if (b.type === "h2") return <h2 key={idx}>{b.text}</h2>;
        if (b.type === "hr") return <hr key={idx} />;
        return <p key={idx}>{b.text}</p>;
      })}
    </>
  );
}

/* Old example content (kept as fallback so the page never looks empty) */
function FallbackDemo({ post, onZoom }) {
  return (
    <>
      <h2>What’s inside</h2>
      <ul>
        <li>Moisture testing & choosing the right underlay</li>
        <li>Subfloor levelling, patching, & prep</li>
        <li>Product picks: LVP, laminate, engineered hardwood, and tile</li>
        <li>Trims, transitions & tidy handover</li>
      </ul>

      <h2>Planning & lead times</h2>
      <p>
        For most Edmonton projects, material lead times range from same-week
        pickup to 2–3 weeks for special orders. We plan installs around delivery
        windows, crew availability, and site prep to keep your project
        predictable.
      </p>

      <h3>Moisture & substrate checks</h3>
      <p>
        We test for moisture, inspect deflection, and propose a substrate plan—
        self-level, patch, or repair—so seams stay tight and floors feel solid.
      </p>

      <h3>Choosing the right product</h3>
      <p>
        High-traffic kitchens and basements often benefit from waterproof LVP;
        bedrooms and main areas may lean toward laminate or engineered hardwood.
        Tile shines in bathrooms and entries for durability and clean lines.
      </p>

      <figure className="my-6">
        <img
          src={post.image}
          alt={post.title}
          className="rounded-xl border border-white/10 cursor-zoom-in"
          onClick={onZoom}
        />
        <figcaption className="text-white/60 text-sm mt-2">
          Clean transitions and level substrates make floors look finished.
        </figcaption>
      </figure>

      <h2>Key takeaways</h2>
      <p>
        Clear scope, realistic timelines, and proactive communication reduce risk
        and keep installations on schedule. With moisture-smart prep and the
        right product, you’ll get floors that look great, feel quiet underfoot,
        and last.
      </p>
    </>
  );
}

function RightRail({ post, canonicalUrl }) {
  const [toc, setToc] = useState([]);

  // pull headings from document so the rail updates
  useEffect(() => {
    const root = document.querySelector("article .prose");
    if (!root) return;
    const headings = Array.from(root.querySelectorAll("h2, h3"));
    const out = headings
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: el.tagName.toLowerCase(),
      }))
      .filter((h) => h.id); // avoid empty ids
    setToc(out);
  }, [post.slug]);

  const share = async () => {
    const data = { title: post.title, text: post.excerpt, url: canonicalUrl };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(canonicalUrl);
        alert("Link copied to clipboard.");
      } catch {
        // noop
      }
    }
  };

  return (
    <div className="sticky top-28 space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">
        <div className="font-semibold">On this page</div>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          {toc.length === 0 && <li className="text-white/50">—</li>}
          {toc.map((h) => (
            <li key={h.id} className={h.level === "h3" ? "ml-3" : ""}>
              <a href={`#${h.id}`} className="hover:text-red-500">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">
        <div className="font-semibold">Share</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={share}
            className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
          >
            Share / Copy link
          </button>
          <Link
            to="/contact"
            className="rounded-full border border-red-500/70 px-4 py-2 text-sm hover:bg-red-600/10 hover:border-red-600"
          >
            Contact Nilta Flooring
          </Link>
        </div>
      </div>
    </div>
  );
}

function NavFence({ prevPost, nextPost }) {
  if (!prevPost && !nextPost) return null;

  return (
    <section className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6">
        {prevPost && (
          <Link
            to={`/blog/${prevPost.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
          >
            <div className="relative h-40">
              <img
                src={prevPost.image}
                alt={prevPost.title}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-sm text-white/70">
                Previous
              </div>
            </div>
            <div className="p-4 font-semibold group-hover:text-red-500 transition">
              {prevPost.title}
            </div>
          </Link>
        )}

        {nextPost && (
          <Link
            to={`/blog/${nextPost.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
          >
            <div className="relative h-40">
              <img
                src={nextPost.image}
                alt={nextPost.title}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-sm text-white/70">
                Next
              </div>
            </div>
            <div className="p-4 font-semibold group-hover:text-red-500 transition">
              {nextPost.title}
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}

function RelatedPosts({ currentSlug }) {
  const related = useMemo(() => {
    // simple: take 3 most recent excluding current
    return POSTS.filter((p) => p.slug !== currentSlug).slice(0, 3);
  }, [currentSlug]);

  if (related.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Related articles</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col"
          >
            <Link to={`/blog/${p.slug}`} className="relative block">
              <img
                src={p.image}
                alt={p.title}
                className="h-40 w-full object-cover transition hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs border border-white/10">
                {p.category}
              </span>
            </Link>
            <div className="p-4">
              <div className="text-white/60 text-xs">
                {new Date(p.date).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                • {p.readTime} min
              </div>
              <Link
                to={`/blog/${p.slug}`}
                className="font-semibold hover:text-red-500 transition"
              >
                {p.title}
              </Link>
              <p className="text-white/75 text-sm mt-1">{p.excerpt}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
