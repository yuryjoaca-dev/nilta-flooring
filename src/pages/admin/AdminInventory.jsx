import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000";


function getToken() {
  return localStorage.getItem("adminToken");
}

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  function updateLocal(id, field, value) {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p))
    );
  }

  async function saveRow(p) {
    setSavingId(p._id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${p._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          price: Number(p.price),
          salePrice:
            p.salePrice == null || p.salePrice === ""
              ? undefined
              : Number(p.salePrice),
          stock: Number(p.stock),
          isActive: p.isActive,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((x) => (x._id === updated._id ? updated : x))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to save row");
    } finally {
      setSavingId(null);
    }
  }

  function exportCSV() {
    const header = [
      "Title",
      "Price",
      "Sale price",
      "Stock left",
      "Status",
      "Created date",
    ];
    const rows = products.map((p) => [
      `"${(p.name || "").replace(/"/g, '""')}"`,
      p.price ?? "",
      p.salePrice ?? "",
      p.stock ?? "",
      p.stock > 0 ? "in stock" : "sold out",
      p.createdAt ? new Date(p.createdAt).toISOString() : "",
    ]);
    const csv =
      header.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const filteredSorted = useMemo(() => {
    const q = search.toLowerCase();
    let list = products.filter((p) => {
      return (
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      let va = a[sortBy];
      let vb = b[sortBy];
      if (sortBy === "createdAt") {
        va = va ? new Date(va).getTime() : 0;
        vb = vb ? new Date(vb).getTime() : 0;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [products, search, sortBy, sortDir]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Product inventory</h1>
          <p className="text-sm text-neutral-400">
            Spreadsheet-like overview of pricing, stock and status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs hover:border-amber-500 hover:text-amber-300"
          >
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-medium hover:bg-amber-400"
          >
            Export CSV/Excel
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-auto text-xs">
        <table className="min-w-full border-collapse">
          <thead className="bg-neutral-900/90">
            <tr className="border-b border-neutral-800">
              <Th onClick={() => toggleSort("name")}>Product title</Th>
              <Th onClick={() => toggleSort("price")}>Price</Th>
              <Th onClick={() => toggleSort("salePrice")}>Sale price</Th>
              <Th onClick={() => toggleSort("stock")}>Stock left</Th>
              <Th>Status</Th>
              <Th onClick={() => toggleSort("createdAt")}>Created date</Th>
              <Th>Save</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-3 text-neutral-400 text-center"
                >
                  Loading products...
                </td>
              </tr>
            ) : filteredSorted.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-3 text-neutral-400 text-center"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              filteredSorted.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="px-3 py-2">
                    <div className="max-w-xs truncate">{p.name}</div>
                    <div className="text-[10px] text-neutral-500">
                      {p.category || "Uncategorized"}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={p.price ?? ""}
                      onChange={(e) =>
                        updateLocal(p._id, "price", e.target.value)
                      }
                      className="w-24 rounded bg-neutral-950 border border-neutral-700 px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={p.salePrice ?? ""}
                      onChange={(e) =>
                        updateLocal(p._id, "salePrice", e.target.value)
                      }
                      className="w-24 rounded bg-neutral-950 border border-neutral-700 px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={p.stock ?? ""}
                      onChange={(e) =>
                        updateLocal(p._id, "stock", e.target.value)
                      }
                      className="w-20 rounded bg-neutral-950 border border-neutral-700 px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <label className="inline-flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={p.isActive}
                        onChange={(e) =>
                          updateLocal(p._id, "isActive", e.target.checked)
                        }
                      />
                      <span>
                        {p.stock > 0
                          ? p.isActive
                            ? "In stock"
                            : "Hidden"
                          : "Sold out"}
                      </span>
                    </label>
                  </td>
                  <td className="px-3 py-2 text-neutral-400">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "–"}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => saveRow(p)}
                      disabled={savingId === p._id}
                      className="px-3 py-1 rounded border border-neutral-700 text-[11px] hover:border-amber-500 hover:text-amber-300 disabled:opacity-60"
                    >
                      {savingId === p._id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, onClick }) {
  return (
    <th
      className="px-3 py-2 text-left font-semibold text-[11px] text-neutral-300 cursor-pointer select-none"
      onClick={onClick}
    >
      {children}
    </th>
  );
}
