// src/pages/admin/AdminLayout.jsx
import React, { useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AdminLogin from "./AdminLogin.jsx";
import AdminProducts from "./AdminProducts.jsx";
import AdminGallery from "./AdminGallery.jsx";
import AdminCustomers from "./AdminCustomers.jsx";
import AdminInventory from "./AdminInventory.jsx";

function getToken() {
  return localStorage.getItem("adminToken");
}

function AdminShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* DESKTOP: left sidebar only (no header, no footer) */}
      <aside className="hidden md:flex w-60 flex-col border-r border-neutral-900 bg-neutral-950/95">
        {/* logo / title */}
        <div className="px-4 py-4 border-b border-neutral-900 flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-300 font-semibold text-lg">
            N
          </div>
          <div>
            <p className="text-sm font-semibold">Nilta Admin</p>
            <p className="text-[11px] text-neutral-400">
              Control panel
            </p>
          </div>
        </div>

        {/* admin nav */}
        <nav className="flex-1 px-3 py-4 space-y-4 text-sm overflow-y-auto">
          <SidebarSection label="Admin">
            <AdminNavLink to="/admin/products" label="Store manager" />
            <AdminNavLink to="/admin/gallery" label="Gallery photos" />
            <AdminNavLink to="/admin/customers" label="Customers" />
            <AdminNavLink to="/admin/inventory" label="Inventory table" />
          </SidebarSection>

          <SidebarSection label="Public site">
            <SiteLink href="/" label="Home" />
            <SiteLink href="/store" label="Store" />
            <SiteLink href="/residential" label="Residential" />
            <SiteLink href="/commercial" label="Commercial" />
            <SiteLink href="/contact" label="Contact" />
          </SidebarSection>
        </nav>
      </aside>

      {/* MOBILE: floating hamburger (top-left) */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 h-10 w-10 rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur flex items-center justify-center"
      >
        <span className="sr-only">Open admin menu</span>
        <div className="space-y-1.5">
          <span className="block w-5 h-[2px] bg-neutral-200 rounded-full" />
          <span className="block w-4 h-[2px] bg-neutral-200 rounded-full ml-1" />
          <span className="block w-5 h-[2px] bg-neutral-200 rounded-full" />
        </div>
      </button>

      {/* MOBILE: slide-out menu WITH admin nav + site links */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeMenu}
          />
          {/* panel */}
          <div className="absolute top-0 left-0 h-full w-72 bg-neutral-950 border-r border-neutral-900 shadow-2xl flex flex-col">
            <div className="px-4 py-4 border-b border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-2xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-300 text-sm font-semibold">
                  N
                </div>
                <div>
                  <p className="text-sm font-semibold">Nilta Admin</p>
                  <p className="text-[11px] text-neutral-400">
                    Control panel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="h-8 w-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-300"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto px-3 py-4 space-y-4 text-sm">
              {/* Admin section */}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">
                  Admin
                </p>
                <MobileNavLink to="/admin/products" onClick={closeMenu}>
                  Store manager
                </MobileNavLink>
                <MobileNavLink to="/admin/gallery" onClick={closeMenu}>
                  Gallery photos
                </MobileNavLink>
                <MobileNavLink to="/admin/customers" onClick={closeMenu}>
                  Customers
                </MobileNavLink>
                <MobileNavLink to="/admin/inventory" onClick={closeMenu}>
                  Inventory table
                </MobileNavLink>
              </div>

              {/* Public site section */}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">
                  Public site
                </p>
                <MobileSiteLink href="/" onClick={closeMenu}>
                  Home
                </MobileSiteLink>
                <MobileSiteLink href="/store" onClick={closeMenu}>
                  Store
                </MobileSiteLink>
                <MobileSiteLink href="/residential" onClick={closeMenu}>
                  Residential
                </MobileSiteLink>
                <MobileSiteLink href="/commercial" onClick={closeMenu}>
                  Commercial
                </MobileSiteLink>
                <MobileSiteLink href="/contact" onClick={closeMenu}>
                  Contact
                </MobileSiteLink>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-neutral-900 text-[11px] text-neutral-500">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  navigate("/");
                }}
                className="text-neutral-300 underline underline-offset-2"
              >
                Back to site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT (no header/footer here) */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

/* Reusable bits */

function SidebarSection({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500 px-2 mb-1">
        {label}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function AdminNavLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-xl transition ${isActive
          ? "bg-amber-500/10 text-amber-200 border border-amber-500/40"
          : "text-neutral-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
        }`
      }
    >
      <span>{label}</span>
      <span className="text-[10px] text-neutral-500">↗</span>
    </NavLink>
  );
}

function SiteLink({ href, label }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 text-sm"
    >
      <span>{label}</span>
      <span className="text-[10px] text-neutral-500">↗</span>
    </a>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg mb-1 ${isActive
          ? "bg-amber-500/10 text-amber-200 border border-amber-500/40"
          : "text-neutral-200 border border-neutral-800/60 bg-neutral-900/60"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MobileSiteLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-3 py-2 rounded-lg mb-1 text-neutral-200 border border-neutral-800/60 bg-neutral-900/60"
    >
      {children}
    </a>
  );
}

function ProtectedAdminRoute({ element }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return element;
}

/* Routes */

export default function AdminLayout() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="products"
        element={
          <ProtectedAdminRoute
            element={
              <AdminShell>
                <AdminProducts />
              </AdminShell>
            }
          />
        }
      />
      <Route
        path="gallery"
        element={
          <ProtectedAdminRoute
            element={
              <AdminShell>
                <AdminGallery />
              </AdminShell>
            }
          />
        }
      />
      <Route
        path="customers"
        element={
          <ProtectedAdminRoute
            element={
              <AdminShell>
                <AdminCustomers />
              </AdminShell>
            }
          />
        }
      />
      <Route
        path="inventory"
        element={
          <ProtectedAdminRoute
            element={
              <AdminShell>
                <AdminInventory />
              </AdminShell>
            }
          />
        }
      />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}