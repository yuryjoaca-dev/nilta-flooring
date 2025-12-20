// src/components/BreadcrumbLD.jsx
import { Helmet } from "react-helmet-async";

export default function BreadcrumbLD({ items }) {
  // items: [{label, url}] — url absolut sau relativ (ok și relativ pe SPA)
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": it.label,
      "item": it.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
