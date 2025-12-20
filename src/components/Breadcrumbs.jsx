// src/components/Breadcrumbs.jsx
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  // items: [{label, to}] ordonate
  return (
    <nav className="text-sm text-white/70" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {isLast ? (
                <span className="text-white/90">{it.label}</span>
              ) : (
                <Link className="hover:text-red-400" to={it.to}>{it.label}</Link>
              )}
              {!isLast && <span className="opacity-60">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
