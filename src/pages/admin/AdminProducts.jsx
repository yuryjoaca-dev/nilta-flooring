// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("adminToken");
}

const CATEGORY_OPTIONS = [
  "Residential",
  "Kitchen",
  "Bathroom",
  "Living Room",
  "Basement",
  "Exterior",
  "Commercial",
  "Tile",
  "Laminate",
  "Hardwood",
  "Other",
];

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    category: "Other",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/admin/login");
        return;
      }

      const data = await res.json().catch(() => []);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      sku: "",
      category: "Other",
      isActive: true,
    });
    setImageFile(null);
    setError("");
  }

  function startEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      sku: product.sku || "",
      category: product.category || "Other",
      isActive: product.isActive ?? true,
    });
    setImageFile(null);
    setError("");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Basic validation
      if (!form.name.trim()) throw new Error("Name is required");
      const priceNum = Number(form.price);
      const stockNum = Number(form.stock);
      if (Number.isNaN(priceNum)) throw new Error("Price must be a number");
      if (Number.isNaN(stockNum)) throw new Error("Stock must be a number");

      const url = editing
        ? `${API_BASE}/api/admin/products/${editing._id}`
        : `${API_BASE}/api/admin/products`;
      const method = editing ? "PUT" : "POST";

      // ✅ Send as multipart/form-data so we can include the image
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description || "");
      fd.append("price", String(priceNum));
      fd.append("stock", String(stockNum));
      fd.append("isActive", String(!!form.isActive));
      fd.append("category", form.category || "Other");

      if (form.sku && form.sku.trim()) {
        fd.append("sku", form.sku.trim());
      }

      if (imageFile) {
        fd.append("image", imageFile); // IMPORTANT: backend uses upload.single("image")
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          // DO NOT set Content-Type here (browser sets it for FormData)
        },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      await fetchProducts();
      startCreate();

      // ✅ Notify Store page to reload
      localStorage.setItem("productsUpdatedAt", String(Date.now()));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;

    try {
      setError("");

      const res = await fetch(`${API_BASE}/api/admin/products/${product._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete product");
      }

      await fetchProducts();
      localStorage.setItem("productsUpdatedAt", String(Date.now()));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete product");
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-neutral-400">
            Manage your store catalog, stock and pricing.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-red-500 hover:text-red-300 transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="md:col-span-1 bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              {editing ? "Edit product" : "New product"}
            </h2>
            {editing && (
              <button
                className="text-xs text-neutral-400 hover:text-neutral-200"
                onClick={startCreate}
                type="button"
              >
                + New
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="block mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">SKU (optional)</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="rounded border-neutral-700 bg-neutral-800"
              />
              <label htmlFor="isActive" className="text-sm">
                Visible in store
              </label>
            </div>

            <div>
              <label className="block mb-1">Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-neutral-400"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Max 5MB. Only one image per save.
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-950 font-medium py-2.5 text-sm transition-colors"
            >
              {saving
                ? editing
                  ? "Saving..."
                  : "Creating..."
                : editing
                ? "Save changes"
                : "Create product"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="md:col-span-2 space-y-3">
          {loading ? (
            <p className="text-sm text-neutral-400">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No products yet. Create your first one.
            </p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      {!product.isActive && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
                          Hidden
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-neutral-400 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-2 text-xs text-neutral-400 flex flex-wrap gap-3">
                      <span>
                        Price: $
                        {product.price?.toFixed?.(2) ?? product.price}
                      </span>
                      <span>Stock: {product.stock}</span>
                      {product.category && <span>Category: {product.category}</span>}
                      {product.sku && <span>SKU: {product.sku}</span>}
                      {product.mainImage && <span>Image: yes</span>}
                      {product.images && product.images.length > 0 && (
                        <span>Images: {product.images.length}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-700 text-sm hover:border-amber-500 hover:text-amber-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="px-3 py-1.5 rounded-lg border border-red-700/80 text-sm text-red-300 hover:bg-red-900/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
