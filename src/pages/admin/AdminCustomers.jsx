import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../config/api";

function getToken() {
  return localStorage.getItem("adminToken");
}

function fmtMoney(n) {
  const num = Number(n || 0);
  return `$${num.toFixed(2)} CAD`;
}

function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={loading ? undefined : onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="p-5">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-neutral-300">{message}</p>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-red-700/70 text-red-200 hover:bg-red-900/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-semibold hover:bg-emerald-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCustomer, setConfirmCustomer] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  async function openCustomer(cust) {
    setSelected(cust);
    setOrders([]);
    try {
      setLoadingOrders(true);
      const res = await fetch(
        `${API_BASE}/api/admin/customers/${cust._id}/orders`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  }

  function requestDeleteCustomer(customer) {
    setConfirmCustomer(customer);
    setConfirmOpen(true);
  }

  async function confirmDeleteCustomer() {
    if (!confirmCustomer) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/customers/${confirmCustomer._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete customer");
      }

      setCustomers((prev) =>
        prev.filter((c) => c._id !== confirmCustomer._id)
      );

      if (selected?._id === confirmCustomer._id) {
        setSelected(null);
        setOrders([]);
      }

      setConfirmOpen(false);
      setConfirmCustomer(null);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  const totals = useMemo(() => {
    const paid = orders.reduce(
      (sum, o) => sum + (o?.paymentStatus === "paid" ? Number(o.total || 0) : 0),
      0
    );

    const toPay = orders.reduce(
      (sum, o) => sum + (o?.paymentStatus !== "paid" ? Number(o.total || 0) : 0),
      0
    );

    return { paid, toPay, grand: paid + toPay };
  }, [orders]);

  return (
    <div className="grid gap-6 md:grid-cols-[1.6fr,1.2fr]">
      {/* ✅ Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete customer"
        message={
          confirmCustomer
            ? `Are you sure you want to delete "${confirmCustomer.email}"? This will remove the customer from your admin panel.`
            : "Are you sure?"
        }
        confirmText="Yes,delete"
        cancelText="No"
        onCancel={() => {
          if (deleting) return;
          setConfirmOpen(false);
          setConfirmCustomer(null);
        }}
        onConfirm={confirmDeleteCustomer}
        loading={deleting}
      />

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Customers</h1>
          <p className="text-sm text-neutral-400">
            View customer contact details and order history.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={fetchCustomers}
            className="px-3 py-2 rounded-lg border border-neutral-700 text-xs hover:border-amber-500 hover:text-amber-300 transition"
          >
            Refresh
          </button>
        </div>

        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 text-[11px] uppercase tracking-wide text-neutral-400 border-b border-neutral-800 px-3 py-2">
            <span>Name</span>
            <span>Email</span>
            <span>Orders</span>
            <span>Last purchase</span>
            <span className="text-right">Actions</span>
          </div>

          {loading ? (
            <p className="text-xs text-neutral-400 px-3 py-3">
              Loading customers...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-neutral-400 px-3 py-3">
              No customers found.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-800 text-xs">
              {filtered.map((c) => (
                <li
                  key={c._id}
                  className={`px-3 py-2 cursor-pointer hover:bg-neutral-800/50 ${selected?._id === c._id ? "bg-neutral-800/70" : ""
                    }`}
                  onClick={() => openCustomer(c)}
                >
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="truncate">{c.name || "–"}</div>
                    <div className="truncate text-neutral-300">{c.email}</div>
                    <div>{c.ordersCount || 0}</div>
                    <div className="text-neutral-400">
                      {c.lastOrderDate
                        ? new Date(c.lastOrderDate).toLocaleDateString()
                        : "–"}
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDeleteCustomer(c);
                        }}
                        className="text-[11px] px-2 py-1 rounded-full border border-red-700/70 text-red-300 hover:bg-red-900/40 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-200">
          {selected ? "Customer details" : "Select a customer"}
        </h2>

        {selected && (
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-5 text-xs space-y-4">
            <div>
              <p className="text-neutral-400 text-[11px] uppercase mb-1">
                Contact
              </p>
              <p className="font-medium text-base">{selected.name || "–"}</p>
              <p className="text-neutral-300 break-all">{selected.email}</p>
              {selected.phone && (
                <p className="text-neutral-300 mt-1">Phone: {selected.phone}</p>
              )}
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-3">
              <p className="text-neutral-400 text-[11px] uppercase mb-2">
                Totals
              </p>

              {loadingOrders ? (
                <p className="text-neutral-500">Loading totals...</p>
              ) : (
                <div className="grid grid-cols-1 gap-1 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">To pay (unpaid/quote)</span>
                    <span className="text-amber-300 font-semibold">
                      {fmtMoney(totals.toPay)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">Paid</span>
                    <span className="text-neutral-200 font-semibold">
                      {fmtMoney(totals.paid)}
                    </span>
                  </div>

                  <div className="border-t border-neutral-800 my-1" />

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-200 font-semibold">Total</span>
                    <span className="text-neutral-100 font-semibold">
                      {fmtMoney(totals.grand)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-neutral-400 text-[11px] uppercase mb-1">
                Orders
              </p>

              {loadingOrders ? (
                <p className="text-neutral-500">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-neutral-500">No orders yet.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-auto pr-1">
                  {orders.map((o) => (
                    <div
                      key={o._id}
                      className="border border-neutral-800 rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-neutral-400">
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full border border-neutral-700">
                          {o.paymentStatus === "paid"
                            ? "Paid"
                            : o.status === "quote-request"
                              ? "Quote"
                              : o.paymentStatus || "Unpaid"}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-300 mb-1">
                        Items:{" "}
                        {o.items
                          ?.map((it) => `${it.quantity}× ${it.name}`)
                          .join(", ")}
                      </p>

                      {Number(o.total || 0) > 0 && (
                        <p className="text-[11px] text-amber-300">
                          Total: {fmtMoney(o.total)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
