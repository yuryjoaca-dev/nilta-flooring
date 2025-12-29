// src/pages/BlogPost.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { POSTS } from "../data/blog.js";

const ACCENT = "#8F2841";

export default function BlogPost() {
  const { slug } = useParams();

  // newest-first order (matches Blog.jsx sorting)
  const orderedPosts = useMemo(() => {
    return [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  const postIndex = useMemo(
    () => orderedPosts.findIndex((p) => p.slug === slug),
    [slug, orderedPosts]
  );
  const post = postIndex >= 0 ? orderedPosts[postIndex] : null;

  const prevPost = postIndex > 0 ? orderedPosts[postIndex - 1] : null;
  const nextPost =
    postIndex >= 0 && postIndex < orderedPosts.length - 1
      ? orderedPosts[postIndex + 1]
      : null;

  // Blog-only fonts
  useEffect(() => {
    const id = "blog-fonts-playfair-inter";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600&display=swap";
      document.head.appendChild(link);
    }

    const root = document.documentElement;
    const prevSerif = root.style.getPropertyValue("--blog-serif");
    const prevSans = root.style.getPropertyValue("--blog-sans");

    root.style.setProperty(
      "--blog-serif",
      '"Playfair Display", ui-serif, Georgia, serif'
    );
    root.style.setProperty(
      "--blog-sans",
      'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial'
    );

    return () => {
      root.style.setProperty("--blog-serif", prevSerif || "");
      root.style.setProperty("--blog-sans", prevSans || "");
    };
  }, []);

  if (!post) {
    return (
      <main className="pt-16 min-h-screen bg-[#050507] text-white">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-3xl font-bold">Article not found</div>
          <p className="text-white/70 mt-2">
            The article you’re looking for doesn’t exist.
          </p>
          <Link
            to="/blog"
            className="inline-block mt-6 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 hover:bg-white/10 transition"
          >
            Back to Guide & Tips
          </Link>
        </div>
      </main>
    );
  }

  const SITE_URL = "https://nilta.ca";
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  const hasStructured = Array.isArray(post.sections) && post.sections.length > 0;
  const hasBody = typeof post.body === "string" && post.body.trim().length > 0;
  const hasContent =
    typeof post.content === "string" && post.content.trim().length > 0;

  const dateLabel = new Date(post.date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main
      className="pt-16 min-h-screen bg-[#050507] text-white"
      style={{ fontFamily: "var(--blog-sans)" }}
    >
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

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[54vh] md:h-[60vh]">
          <motion.img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-[#050507]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07),transparent_56%)] pointer-events-none" />
        </div>

        <div className="relative -mt-24 md:-mt-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] tracking-wide text-white/85">
                  {post.category}
                </span>
                <span className="text-white/60 text-xs">•</span>
                <span className="text-white/75 text-xs tracking-wide">
                  {dateLabel}
                </span>
                <span className="text-white/60 text-xs">•</span>
                <span className="text-white/75 text-xs tracking-wide">
                  {post.readTime} min read
                </span>

                <span className="ml-auto text-white/60 text-xs">
                  By {post.author || "the Nilta Flooring Team"}
                </span>
              </div>

              <h1
                className="mt-4 text-3xl md:text-6xl font-bold leading-[1.05] tracking-[-0.02em]"
                style={{ fontFamily: "var(--blog-serif)" }}
              >
                {post.title}
              </h1>

              <p className="mt-4 text-white/80 text-sm md:text-base leading-[1.9] max-w-3xl">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/blog"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-sm font-semibold hover:bg-white/10 transition"
                >
                  ← Back to Guide & Tips
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition"
                  style={{ background: ACCENT }}
                >
                  Request an estimate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-8">
        <ArticleContent
          post={post}
          structured={hasStructured}
          hasBody={hasBody}
          hasContent={hasContent}
        />
        <aside className="hidden lg:block">
          <RightRail post={post} canonicalUrl={canonicalUrl} />
        </aside>
      </section>

      <NavFence prevPost={prevPost} nextPost={nextPost} />
      <RelatedPosts currentSlug={post.slug} orderedPosts={orderedPosts} />
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
    <div className="fixed top-16 left-0 right-0 z-40 h-[2px] bg-white/5">
      <div
        className="h-full transition-[width] duration-150"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(90deg, rgba(143,40,65,0.0), rgba(143,40,65,0.85), rgba(242,196,208,0.9))",
        }}
        aria-hidden
      />
    </div>
  );
}

function ArticleContent({ post, structured, hasBody, hasContent }) {
  const articleRef = useRef(null);
  const [zoomSrc, setZoomSrc] = useState(null);

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll("h2, h3"));
    headings.forEach((el) => {
      const id = el.textContent
        ?.toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      if (id && !el.id) el.id = id;
    });
  }, [post.slug]);

  return (
    <article className="min-w-0">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl p-6 md:p-8">
        {/* Blog-only typography upgrades */}
        <style>{`
          .blog-article h2, .blog-article h3 {
            font-family: var(--blog-serif) !important;
            font-weight: 700 !important;
            letter-spacing: -0.01em;
          }
          .blog-article h2 {
            position: relative;
            padding-top: 8px;
          }
          .blog-article h2::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 1px;
            width: 72px;
            background: linear-gradient(90deg, rgba(143,40,65,0.95), rgba(242,196,208,0.55));
            opacity: 0.9;
          }

          /* Premium bullet list card */
          .blog-article .lux-list {
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.03);
            border-radius: 18px;
            padding: 14px 16px;
            margin: 18px 0;
          }
          .blog-article .lux-list ul { 
            list-style: none; 
            padding-left: 0;
            margin: 0;
          }
          .blog-article .lux-list li {
            display: flex;
            gap: 10px;
            padding: 10px 0;
            color: rgba(255,255,255,0.82);
          }
          .blog-article .lux-list li + li {
            border-top: 1px solid rgba(255,255,255,0.08);
          }
          .blog-article .lux-dot {
            margin-top: 8px;
            height: 7px;
            width: 7px;
            border-radius: 999px;
            background: #F2C4D0;
            box-shadow: 0 0 0 4px rgba(143,40,65,0.15);
            flex: 0 0 7px;
          }

          /* Callout style for > lines */
          .blog-article .lux-callout {
            border: 1px solid rgba(143,40,65,0.35);
            background: rgba(143,40,65,0.10);
            border-radius: 18px;
            padding: 14px 16px;
            margin: 18px 0;
            color: rgba(255,255,255,0.85);
          }

          /* Slightly nicer HR */
          .blog-article hr {
            border-color: rgba(255,255,255,0.10);
            margin: 34px 0;
          }
        `}</style>

        <div
          ref={articleRef}
          className={[
            "prose prose-invert max-w-none blog-article",
            "prose-headings:scroll-mt-28",
            "prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl md:prose-h2:text-3xl",
            "prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl md:prose-h3:text-2xl",
            "prose-p:text-white/80 prose-p:leading-[1.95] prose-p:text-[15px] md:prose-p:text-[16px]",
            "prose-strong:text-white prose-strong:font-semibold",
            "prose-a:text-[#F2C4D0] hover:prose-a:text-white prose-a:underline prose-a:underline-offset-4",
          ].join(" ")}
        >
          {structured ? (
            <StructuredSections sections={post.sections} />
          ) : hasBody ? (
            <BodyText body={post.body} />
          ) : hasContent ? (
            <MarkdownishText content={post.content} />
          ) : (
            <FallbackDemo post={post} onZoom={() => setZoomSrc(post.image)} />
          )}

          <div className="mt-10 flex flex-wrap gap-2">
            <Link
              to="/blog"
              className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 hover:bg-white/10 transition no-underline"
            >
              ← Back to Guide & Tips
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 hover:bg-white/10 transition no-underline"
            >
              Contact Nilta Flooring
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {zoomSrc && (
        <div
          onClick={() => setZoomSrc(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4"
        >
          <img
            src={zoomSrc}
            alt="Zoomed"
            className="max-h-[85vh] max-w-[92vw] rounded-2xl shadow-2xl border border-white/10"
          />
        </div>
      )}
    </article>
  );
}

/* ---------- Content helpers ---------- */

function StructuredSections({ sections }) {
  return (
    <>
      {sections.map((s, idx) => {
        if (s.type === "h2") return <h2 key={idx}>{s.text}</h2>;
        if (s.type === "h3") return <h3 key={idx}>{s.text}</h3>;
        if (s.type === "p") return <p key={idx}>{s.text}</p>;
        if (s.type === "ul")
          return (
            <div key={idx} className="lux-list">
              <ul>
                {Array.isArray(s.items) &&
                  s.items.map((it, i) => (
                    <li key={i}>
                      <span className="lux-dot" />
                      <span>{it}</span>
                    </li>
                  ))}
              </ul>
            </div>
          );
        if (s.type === "hr") return <hr key={idx} />;
        return null;
      })}
    </>
  );
}

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
    if (line.endsWith(":") && line.length <= 80) {
      flush();
      blocks.push({ type: "h2", text: line.replace(/:$/, "") });
      continue;
    }
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

function renderInline(text) {
  // Simple **bold** support
  const parts = String(text || "").split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function MarkdownishText({ content }) {
  const lines = String(content || "")
    .split("\n")
    .map((l) => l.trim());

  const blocks = [];
  let para = [];
  let ul = [];

  const flushPara = () => {
    const text = para.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
    para = [];
  };

  const flushUl = () => {
    if (ul.length) blocks.push({ type: "ul", items: ul });
    ul = [];
  };

  for (const line of lines) {
    if (!line) {
      flushUl();
      flushPara();
      continue;
    }

    // hr
    if (line === "---" || line === "----" || line === "⸻") {
      flushUl();
      flushPara();
      blocks.push({ type: "hr" });
      continue;
    }

    // callout: > text
    if (line.startsWith("> ")) {
      flushUl();
      flushPara();
      blocks.push({ type: "callout", text: line.replace(/^>\s+/, "") });
      continue;
    }

    // headings
    if (line.startsWith("### ")) {
      flushUl();
      flushPara();
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "") });
      continue;
    }
    if (line.startsWith("## ")) {
      flushUl();
      flushPara();
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "") });
      continue;
    }

    // bullets
    if (line.startsWith("- ") || line.startsWith("• ")) {
      flushPara();
      ul.push(line.replace(/^(-\s+|•\s+)/, ""));
      continue;
    }

    flushUl();
    para.push(line);
  }

  flushUl();
  flushPara();

  return (
    <>
      {blocks.map((b, idx) => {
        if (b.type === "h2") return <h2 key={idx}>{b.text}</h2>;
        if (b.type === "h3") return <h3 key={idx}>{b.text}</h3>;
        if (b.type === "hr") return <hr key={idx} />;
        if (b.type === "callout")
          return (
            <div key={idx} className="lux-callout">
              {renderInline(b.text)}
            </div>
          );
        if (b.type === "ul")
          return (
            <div key={idx} className="lux-list">
              <ul>
                {b.items.map((it, i) => (
                  <li key={i}>
                    <span className="lux-dot" />
                    <span>{renderInline(it)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        return <p key={idx}>{renderInline(b.text)}</p>;
      })}
    </>
  );
}

function FallbackDemo({ post, onZoom }) {
  return (
    <>
      <h2>What’s inside</h2>
      <div className="lux-list">
        <ul>
          <li>
            <span className="lux-dot" />
            <span>Moisture testing & choosing the right underlay</span>
          </li>
          <li>
            <span className="lux-dot" />
            <span>Subfloor levelling, patching, & prep</span>
          </li>
          <li>
            <span className="lux-dot" />
            <span>Product picks: LVP, laminate, engineered hardwood, and tile</span>
          </li>
          <li>
            <span className="lux-dot" />
            <span>Trims, transitions & tidy handover</span>
          </li>
        </ul>
      </div>

      <figure className="my-8">
        <img
          src={post.image}
          alt={post.title}
          className="rounded-2xl border border-white/10 cursor-zoom-in shadow-xl"
          onClick={onZoom}
        />
        <figcaption className="text-white/60 text-sm mt-2">
          Clean transitions and level substrates make floors look finished.
        </figcaption>
      </figure>

      <div className="lux-callout">
        **Pro tip:** Ask for the quote to list **prep**, **materials**, and **installation**
        separately—so you know exactly what you’re paying for.
      </div>
    </>
  );
}

function RightRail({ post, canonicalUrl }) {
  const [toc, setToc] = useState([]);

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
      .filter((h) => h.id);
    setToc(out);
  }, [post.slug]);

  const share = async () => {
    const data = { title: post.title, text: post.excerpt, url: canonicalUrl };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(canonicalUrl);
      } catch {}
    }
  };

  return (
    <div className="sticky top-28 space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl">
        <div className="font-semibold">On this page</div>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          {toc.length === 0 && <li className="text-white/50">—</li>}
          {toc.map((h) => (
            <li key={h.id} className={h.level === "h3" ? "ml-3" : ""}>
              <a href={`#${h.id}`} className="hover:text-[#F2C4D0] transition">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl">
        <div className="font-semibold">Actions</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={share}
            className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Share / Copy link
          </button>
          <Link
            to="/contact"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition"
            style={{ background: ACCENT }}
          >
            Contact
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
        {prevPost && <NavCard label="Previous" post={prevPost} />}
        {nextPost && <NavCard label="Next" post={nextPost} />}
      </div>
    </section>
  );
}

function NavCard({ label, post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-2xl hover:border-white/20 transition"
    >
      <div className="relative h-44">
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute bottom-3 left-3 text-xs tracking-wide text-white/70">
          {label}
        </div>
      </div>
      <div className="p-5">
        <div className="text-white/60 text-xs">
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          • {post.readTime} min
        </div>
        <div className="mt-1 font-semibold group-hover:text-[#F2C4D0] transition">
          {post.title}
        </div>
      </div>
    </Link>
  );
}

function RelatedPosts({ currentSlug, orderedPosts }) {
  const related = useMemo(() => {
    return orderedPosts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  }, [currentSlug, orderedPosts]);

  if (related.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <div className="flex items-end justify-between gap-3 mb-4">
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ fontFamily: "var(--blog-serif)" }}
        >
          Related articles
        </h2>
        <Link
          to="/blog"
          className="text-sm text-white/70 hover:text-[#F2C4D0] transition"
        >
          View all →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((p) => (
          <article
            key={p.slug}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl hover:border-white/20 transition"
          >
            <Link to={`/blog/${p.slug}`} className="relative block">
              <img
                src={p.image}
                alt={p.title}
                className="h-44 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/55 backdrop-blur px-3 py-1 text-xs border border-white/15">
                {p.category}
              </span>
            </Link>
            <div className="p-5">
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
                className="mt-1 block font-semibold hover:text-[#F2C4D0] transition"
              >
                {p.title}
              </Link>
              <p className="text-white/75 text-sm mt-2 line-clamp-3">
                {p.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
