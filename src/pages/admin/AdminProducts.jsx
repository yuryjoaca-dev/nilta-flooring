// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, Archive, Tag, Eye, EyeOff, Image as ImageIcon, AlertCircle } from "lucide-react";

import { API_BASE } from "../../config/api"; // ajustezi path-ul

function getToken() {
  return localStorage.getItem("adminToken");
}

const CATEGORY_OPTIONS = [
  "Vinyl Plank",
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
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
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

      // Require image when creating new product
      if (!editing && !imageFile) {
        throw new Error("Product image is required");
      }

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

  async function confirmDelete(product) {
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
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete product");
      setDeleteConfirm(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Package className="h-6 w-6 text-neutral-950" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-sm text-neutral-400">
                Manage your store catalog, stock and pricing
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-red-500 hover:text-red-300 transition-colors font-medium"
        >
          Log out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="lg:col-span-1 bg-gradient-to-br from-neutral-900 to-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl sticky top-6 mt-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                {editing ? <Package className="h-4 w-4 text-amber-400" /> : <Package className="h-4 w-4 text-amber-400" />}
              </div>
              <h2 className="text-lg font-bold">
                {editing ? "Edit Product" : "New Product"}
              </h2>
            </div>
            {editing && (
              <button
                className="text-xs px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 hover:border-amber-500 hover:text-amber-300 transition-colors"
                onClick={startCreate}
                type="button"
              >
                + New
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-300">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Oak Laminate Flooring"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition placeholder:text-neutral-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-300">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your product features and benefits..."
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none transition placeholder:text-neutral-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-neutral-300 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Price <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition placeholder:text-neutral-500"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-neutral-300 flex items-center gap-1">
                  <Archive className="h-3 w-3" />
                  Stock <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-300">SKU (optional)</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g., OAK-LAM-001"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition placeholder:text-neutral-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-300 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-2 focus:ring-amber-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium flex items-center gap-2">
                {form.isActive ? (
                  <>
                    <Eye className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Visible in store</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-500">Hidden from store</span>
                  </>
                )}
              </label>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-300 flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Product Image {!editing && <span className="text-red-400">*</span>}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-neutral-950 hover:file:bg-amber-400 file:cursor-pointer cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {!editing ? "Required for new products. " : ""}Max 5MB. JPEG, PNG, or WebP format.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-950 font-bold py-3 text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  {editing ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Package className="h-4 w-4" />
                  {editing ? "Save Changes" : "Create Product"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold">All Products</h3>
              <p className="text-xs text-neutral-400">
                {products.length} {products.length === 1 ? 'product' : 'products'} in your catalog
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
              <div className="h-12 w-12 border-4 border-neutral-700 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-neutral-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
              <div className="h-16 w-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-neutral-600" />
              </div>
              <p className="text-sm text-neutral-400 mb-2">No products yet</p>
              <p className="text-xs text-neutral-500">Create your first product to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-gradient-to-br from-neutral-900 to-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Product Image */}
                    {(product.mainImage || (product.images && product.images[0])) && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
                        <img
                          src={product.mainImage || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        {product.isActive ? (
                          <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">
                            <Eye className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 font-semibold">
                            <EyeOff className="h-3 w-3" />
                            Hidden
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
                        {product.description || "No description"}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/50 border border-neutral-700">
                          <DollarSign className="h-3 w-3 text-amber-400" />
                          <span className="text-neutral-300 font-semibold">
                            ${product.price?.toFixed?.(2) ?? product.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/50 border border-neutral-700">
                          <Archive className="h-3 w-3 text-blue-400" />
                          <span className="text-neutral-300">
                            {product.stock} in stock
                          </span>
                        </div>
                        {product.category && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/50 border border-neutral-700">
                            <Tag className="h-3 w-3 text-purple-400" />
                            <span className="text-neutral-300">{product.category}</span>
                          </div>
                        )}
                        {product.sku && (
                          <div className="px-2.5 py-1 rounded-lg bg-neutral-800/50 border border-neutral-700">
                            <span className="text-neutral-500">SKU: </span>
                            <span className="text-neutral-300 font-mono">{product.sku}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 md:items-end">
                      <button
                        onClick={() => startEdit(product)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm font-medium hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-300 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-lg bg-red-950/40 border border-red-700/80 text-sm font-medium text-red-300 hover:bg-red-900/60 hover:border-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-red-400 mb-2">
                Delete Product
              </h3>
              <p className="text-sm text-neutral-300">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{deleteConfirm.name}"</span>?
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                This action cannot be undone. The product will be permanently
                removed from your store.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-700 text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
