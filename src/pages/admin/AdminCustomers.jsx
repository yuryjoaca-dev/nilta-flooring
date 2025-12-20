import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";


function getToken() {
  return localStorage.getItem("adminToken");
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/customers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCustomers(data);
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
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load orders");
    } finally {
      setLoadingOrders(false);
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

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1.3fr]">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Customers</h1>
          <p className="text-sm text-neutral-400">
            View customer contact details, delivery address and order history.
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
          <div className="grid grid-cols-4 text-[11px] uppercase tracking-wide text-neutral-400 border-b border-neutral-800 px-3 py-2">
            <span>Name</span>
            <span>Email</span>
            <span>Orders</span>
            <span>Last purchase</span>
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
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <div className="truncate">{c.name || "–"}</div>
                    <div className="truncate text-neutral-300">
                      {c.email}
                    </div>
                    <div>{c.ordersCount || 0}</div>
                    <div className="text-neutral-400">
                      {c.lastOrderDate
                        ? new Date(c.lastOrderDate).toLocaleDateString()
                        : "–"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-200">
          {selected ? "Customer details" : "Select a customer"}
        </h2>

        {selected && (
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 text-xs space-y-3">
            <div>
              <p className="text-neutral-400 text-[11px] uppercase mb-1">
                Contact
              </p>
              <p className="font-medium text-sm">{selected.name || "–"}</p>
              <p className="text-neutral-300">{selected.email}</p>
              {selected.phone && (
                <p className="text-neutral-300">
                  Phone: {selected.phone}
                </p>
              )}
            </div>

            <div>
              <p className="text-neutral-400 text-[11px] uppercase mb-1">
                Delivery address
              </p>
              {selected.address ? (
                <p className="text-neutral-200">
                  {selected.address.line1}
                  {selected.address.line2
                    ? ", " + selected.address.line2
                    : ""}
                  <br />
                  {[selected.address.city, selected.address.state]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  {selected.address.postalCode}
                  <br />
                  {selected.address.country}
                </p>
              ) : (
                <p className="text-neutral-500">No address on file.</p>
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
                <div className="space-y-2 max-h-64 overflow-auto pr-1">
                  {orders.map((o) => (
                    <div
                      key={o._id}
                      className="border border-neutral-800 rounded-xl p-2"
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
                      {o.total > 0 && (
                        <p className="text-[11px] text-amber-300">
                          Total: ${o.total.toFixed(2)} CAD
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
