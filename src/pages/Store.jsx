// src/pages/Store.jsx
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowRight,
  Filter,
  CreditCard,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FALLBACK_PRODUCTS = [
  {
    id: "tile-01",
    name: "Ceramic Floor Tile – Light Grey",
    category: "Tile",
    description: "Matte finish tile ideal for kitchens and bathrooms.",
    image: "/store-products/ceramic-floor-tile-light-grey.webp",
    badge: "Popular",
    pricePerSqm: 3.49,
  },
  {
    id: "tile-02",
    name: "Porcelain Tile – Concrete Look",
    category: "Tile",
    description: "Modern concrete-look tile perfect for open spaces.",
    image: "/store-products/porcelai-tile-concrete-look.webp",
    badge: "New",
    pricePerSqm: 4.29,
  },
  {
    id: "lam-01",
    name: "Oak Laminate – Natural",
    category: "Laminate",
    description: "Warm oak tone with durable click-lock installation.",
    image: "/store-products/oak-laminate-natural.webp",
    badge: "Best value",
    pricePerSqm: 2.99,
  },
  {
    id: "lam-02",
    name: "Walnut Laminate – Dark",
    category: "Laminate",
    description: "Elegant dark laminate for living rooms and offices.",
    image: "/store-products/walnut-laminate-dark.webp",
    pricePerSqm: 3.19,
  },
  {
    id: "hard-01",
    name: "Engineered Hardwood – Smoked Oak",
    category: "Hardwood",
    description: "Premium engineered hardwood for main living areas.",
    image: "/store-products/engineered-hardwood-smoked-oak.webp",
    badge: "Premium",
    pricePerSqm: 8.99,
  },
  {
    id: "hard-02",
    name: "Engineered Hardwood – Natural Oak",
    category: "Hardwood",
    description: "Timeless natural oak look with a matte finish.",
    image: "/store-products/engineered-hardwood-natural-oak.webp",
    pricePerSqm: 8.48,
  },
];

function normalizeImageUrl(raw) {
  // raw poate fi: "/uploads/xx.png", "uploads/xx.png", "http://...", "" etc.
  if (!raw) return "/store-products/oak-laminate-natural.webp";
  if (raw.startsWith("http")) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${API_BASE}${path}`;
}

export default function Store() {
  const location = useLocation();

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState("");

  const [cart, setCart] = useState({}); // id -> qty
  const [sendingQuote, setSendingQuote] = useState(false);
  const [paying, setPaying] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ✅ Încarcă produsele la intrare pe pagină + când ruta se schimbă (revii pe store)
  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductError("");

        const res = await fetch(`${API_BASE}/api/products`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();

        // dacă API nu are nimic, rămân fallback-urile
        if (!Array.isArray(data) || data.length === 0) {
          if (isMounted) setLoadingProducts(false);
          return;
        }

        const mapped = data.map((p) => {
          const rawImage = p.mainImage || (p.images && p.images[0]) || "";

          return {
            id: p._id,
            name: p.name,
            category: p.category || "Tile",
            description: p.description || "",
            image: normalizeImageUrl(rawImage),
            badge:
              p.salePrice && p.salePrice < p.price
                ? "On sale"
                : p.stock === 0
                ? "Sold out"
                : undefined,
            pricePerSqm: p.salePrice || p.price,
            stock: p.stock ?? 0,
          };
        });

        if (isMounted) setProducts(mapped);
        if (isMounted) setLoadingProducts(false);
      } catch (err) {
        console.error(err);
        if (isMounted) setProductError("Failed to load products");
        if (isMounted) setLoadingProducts(false);
      }
    }

    loadProducts();

    // ✅ refresh când adminul actualizează (scrie în localStorage)
    // AdminProducts: localStorage.setItem("productsUpdatedAt", Date.now().toString())
    let last = localStorage.getItem("productsUpdatedAt") || "0";
    const interval = setInterval(() => {
      const now = localStorage.getItem("productsUpdatedAt") || "0";
      if (now !== last) {
        last = now;
        loadProducts();
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.key]);

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (!copy[id]) return copy;
      if (copy[id] === 1) delete copy[id];
      else copy[id] -= 1;
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const CATEGORIES = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      const matchesSearch =
        search.trim().length === 0 ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, search]);

  const cartItems = products.filter((p) => cart[p.id]);

  const handleSendQuote = async () => {
    if (cartItems.length === 0) {
      alert("Add at least one product to your quote.");
      return;
    }

    setSendingQuote(true);

    try {
      const res = await fetch(`${API_BASE}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((p) => ({
            id: p.id,
            name: p.name,
            qty: cart[p.id],
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      if (!data.ok) throw new Error("Server error");

      setSendingQuote(false);
      clearCart();
      alert("Your quote request has been sent. We will contact you soon.");
    } catch (e) {
      console.error(e);
      setSendingQuote(false);
      alert("There was an error sending your request. Please try again.");
    }
  };

  const handleStripeCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Add at least one product before checking out.");
      return;
    }

    setPaying(true);

    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((p) => ({
            id: p.id,
            qty: cart[p.id],
          })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL returned");

      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setPaying(false);
      alert("There was an error starting the payment. Please try again.");
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Store | Nilta Flooring – Products</title>
        <meta
          name="description"
          content="Browse tile, laminate and hardwood products available through Nilta Flooring. Request a quote or pay online (Canada only)."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative h-[40vh] overflow-hidden">
        <img
          src="/store/store-hero.webp"
          alt="Flooring store"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-neutral-950" />
        <div className="relative max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Flooring Products
          </h1>
          <p className="mt-3 max-w-xl text-white/85 text-sm md:text-base">
            A selection of tile, laminate and hardwood we commonly supply and
            install. Add items to your cart to request a quote or pay online for
            Canadian orders.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[2fr,1fr] gap-8">
        {/* PRODUCT GRID SIDE */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Products
            </h2>
            <p className="text-xs text-white/60">
              Images are illustrative – we confirm exact product details together.
            </p>
          </div>

          {/* Status */}
          {loadingProducts && (
            <p className="text-sm text-white/70">Loading products...</p>
          )}
          {productError && (
            <p className="text-sm text-red-300">{productError}</p>
          )}

          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Filter className="h-4 w-4" />
              <span>Filter products</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    categoryFilter === cat
                      ? "border-red-500 bg-red-600/80"
                      : "border-white/15 bg-white/5 hover:border-white/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center rounded-full border border-white/15 bg-white/[0.02] px-4 py-2 text-xs md:text-sm">
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
            />
          </div>

          {/* Product grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-white/70 col-span-full">
                No products found for this filter.
              </p>
            ) : (
              filteredProducts.map((p, idx) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-xl flex flex-col"
                >
                  <div className="relative h-40">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {p.badge && (
                      <span className="absolute top-3 left-3 rounded-full bg-red-600/90 text-[11px] px-2 py-0.5 font-semibold">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="text-xs uppercase tracking-wide text-white/60">
                      {p.category}
                    </div>
                    <div className="font-semibold text-sm md:text-base">
                      {p.name}
                    </div>

                    {/* ✅ descriere o singură dată */}
                    <p className="text-xs md:text-sm text-white/70">
                      {p.description}
                    </p>

                    {typeof p.pricePerSqm === "number" && (
                      <p className="text-[11px] text-white/60 mt-1">
                        From{" "}
                        <span className="font-semibold">
                          ${p.pricePerSqm.toFixed(2)} CAD
                        </span>{" "}
                        per m²
                      </p>
                    )}

                    <div className="mt-auto pt-2 flex items-center justify-between">
                      {cart[p.id] ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(p.id)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-white/20 text-xs"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm">{cart[p.id]}</span>
                          <button
                            onClick={() => addToCart(p.id)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-white/20 text-xs"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(p.id)}
                          className="text-xs md:text-sm rounded-full border border-red-500/80 px-3 py-1.5 font-semibold hover:bg-red-600/80 hover:border-red-600 transition"
                        >
                          Add to cart
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>

        {/* CART SIDEBAR */}
        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">Cart</div>
              <p className="text-xs text-white/65 mt-0.5">
                You can request a quote or pay online (Canada only).
              </p>
            </div>
            <span className="text-xs rounded-full border border-white/15 px-2 py-0.5 text-white/70">
              {cartItems.length} items
            </span>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-sm text-white/70">
              Your cart is empty. Add a few products and send us a quote request
              or start a payment.
            </p>
          ) : (
            <>
              <div className="space-y-2 text-sm max-h-64 overflow-y-auto pr-1">
                {cartItems.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 border-b border-white/10 pb-1"
                  >
                    <div>
                      <div className="font-semibold text-xs md:text-sm">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-white/60">
                        {p.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(p.id)}
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full border border-white/20 text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span>{cart[p.id]}</span>
                      <button
                        onClick={() => addToCart(p.id)}
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full border border-white/20 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={clearCart}
                className="self-end text-[11px] text-white/60 underline mt-1"
              >
                Clear cart
              </button>
            </>
          )}

          <div className="mt-3 text-xs text-white/60 space-y-1">
            <p>
              For Canadian customers, payments are processed in CAD and taxes are
              calculated automatically in Stripe based on your address.
            </p>
            <p>
              For larger projects, requesting a quote is usually the best first
              step.
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={handleSendQuote}
              disabled={sendingQuote || cartItems.length === 0}
              className="group inline-flex items-center justify-center rounded-full border border-red-500/80 px-5 py-2 font-semibold text-sm text-white/90 hover:bg-red-600/90 hover:border-red-600 transition disabled:opacity-60 disabled:pointer-events-none"
            >
              {sendingQuote ? "Sending quote..." : "Send quote request"}
              <ArrowRight
                className="ml-2 h-4 w-4 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                aria-hidden="true"
              />
            </button>

            <button
              onClick={handleStripeCheckout}
              disabled={paying || cartItems.length === 0}
              className="group inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 font-semibold text-sm text-white/90 hover:bg-white/10 transition disabled:opacity-60 disabled:pointer-events-none"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {paying ? "Starting payment..." : "Pay now (Canada only)"}
            </button>
          </div>

          <Link to="/contact" className="text-xs text-white/70 underline mt-2">
            Or contact us directly for a custom project.
          </Link>
        </aside>
      </section>
    </main>
  );
}
