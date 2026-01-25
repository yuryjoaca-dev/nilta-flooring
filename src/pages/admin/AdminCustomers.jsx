import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  DollarSign,
  Search,
  Trash2,
  RefreshCw,
  AlertCircle,
  User
} from "lucide-react";
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
    <div
      className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {title}
          </h3>
          <p className="text-sm text-neutral-300">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-700 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
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
    <div className="min-h-[80vh] px-4 py-6 max-w-7xl mx-auto">
      {/*  Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete customer"
        message={
          confirmCustomer
            ? `Are you sure you want to delete "${confirmCustomer.email}"? This will remove the customer from your admin panel.`
            : "Are you sure?"
        }
        confirmText="Yes, delete"
        cancelText="Cancel"
        onCancel={() => {
          if (deleting) return;
          setConfirmOpen(false);
          setConfirmCustomer(null);
        }}
        onConfirm={confirmDeleteCustomer}
        loading={deleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Users className="h-6 w-6 text-neutral-950" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-sm text-neutral-400">
              View customer contact details and order history
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr,1.2fr]">
        {/* CUSTOMERS LIST */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-700 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>
            <button
              onClick={fetchCustomers}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-700 text-sm hover:border-amber-500 hover:text-amber-300 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 to-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-12 w-12 border-4 border-neutral-700 border-t-amber-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-neutral-400">Loading customers...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-16 w-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-neutral-600" />
                </div>
                <p className="text-sm text-neutral-400 mb-2">No customers found</p>
                <p className="text-xs text-neutral-500">
                  {search ? "Try a different search term" : "Customers will appear here"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[2fr,2.5fr,1fr,1.5fr,1fr] text-[11px] uppercase tracking-wide font-semibold text-neutral-400 bg-neutral-900/90 border-b border-neutral-800 px-4 py-3">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    Name
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    Email
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="h-3 w-3" />
                    Orders
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    Last purchase
                  </span>
                  <span className="text-right">Actions</span>
                </div>

                <div className="divide-y divide-neutral-800">
                  {filtered.map((c) => (
                    <div
                      key={c._id}
                      className={`grid grid-cols-[2fr,2.5fr,1fr,1.5fr,1fr] gap-3 items-center px-4 py-3.5 cursor-pointer transition-all text-sm ${
                        selected?._id === c._id
                          ? "bg-amber-500/10 border-l-4 border-l-amber-500"
                          : "hover:bg-neutral-800/40"
                      }`}
                      onClick={() => openCustomer(c)}
                    >
                      <div className="truncate font-medium">{c.name || "–"}</div>
                      <div className="truncate text-neutral-300 text-xs">{c.email}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                          {c.ordersCount || 0}
                        </span>
                      </div>
                      <div className="text-neutral-400 text-xs">
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-700/80 text-xs font-medium text-red-300 hover:bg-red-900/60 hover:border-red-600 transition-all"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="space-y-4">
          {!selected ? (
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-900/80 border border-neutral-800 rounded-2xl p-8 text-center shadow-xl">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-800 border border-neutral-700 mb-4">
                <User className="h-8 w-8 text-neutral-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No customer selected</h3>
              <p className="text-sm text-neutral-400">
                Select a customer from the list to view their details and order history
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-5">
              {/* Contact Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-amber-400" />
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-xl">{selected.name || "–"}</p>
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <Mail className="h-4 w-4 text-neutral-500" />
                    <span className="break-all">{selected.email}</span>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Phone className="h-4 w-4 text-neutral-500" />
                      <span>{selected.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-amber-400" />
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Order Totals
                  </h4>
                </div>

                {loadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 border-3 border-neutral-700 border-t-amber-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-neutral-400">To pay (unpaid/quote)</span>
                      <span className="text-amber-400 font-semibold">
                        {fmtMoney(totals.toPay)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-neutral-400">Paid</span>
                      <span className="text-emerald-400 font-semibold">
                        {fmtMoney(totals.paid)}
                      </span>
                    </div>

                    <div className="border-t border-neutral-800 my-2" />

                    <div className="flex items-center justify-between py-2">
                      <span className="font-semibold">Grand Total</span>
                      <span className="text-lg font-bold text-white">
                        {fmtMoney(totals.grand)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-amber-400" />
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Order History
                  </h4>
                </div>

                {loadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 border-3 border-neutral-700 border-t-amber-500 rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 rounded-xl border border-neutral-800 bg-neutral-950/30">
                    <ShoppingBag className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-auto pr-2 -mr-2">
                    {orders.map((o) => (
                      <div
                        key={o._id}
                        className="group border border-neutral-800 rounded-xl p-4 bg-neutral-950/30 hover:bg-neutral-800/30 hover:border-neutral-700 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(o.createdAt).toLocaleString()}
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              o.paymentStatus === "paid"
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                : o.status === "quote-request"
                                ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                                : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                            }`}
                          >
                            {o.paymentStatus === "paid"
                              ? "Paid"
                              : o.status === "quote-request"
                              ? "Quote"
                              : o.paymentStatus || "Unpaid"}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 mb-2 leading-relaxed">
                          {o.items
                            ?.map((it) => `${it.quantity}× ${it.name}`)
                            .join(", ")}
                        </p>

                        {Number(o.total || 0) > 0 && (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-300">
                            <DollarSign className="h-3 w-3" />
                            {fmtMoney(o.total)}
                          </div>
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
    </div>
  );
}
