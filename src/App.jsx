import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import Residential from "./pages/Residential.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Commercial from "./pages/Commercial.jsx";
import Materials from "./pages/Materials.jsx";
import Store from "./pages/Store.jsx";
import TermsAndConditions from "./pages/Terms&Conditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import CookieConsent from "./pages/CookieConsent";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import { API_BASE } from "./config/api";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
        <CookieConsent />
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
        {!isAdminRoute && <Header />}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/residential" element={<Residential />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/store" element={<Store />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />

            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}
