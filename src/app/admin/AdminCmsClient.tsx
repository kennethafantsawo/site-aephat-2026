"use client";

import dynamic from "next/dynamic";

// Decap CMS manipule window/document : rendu navigateur uniquement.
const DecapStudio = dynamic(() => import("./DecapStudio"), {
  ssr: false,
  loading: () => (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ fontWeight: 700 }}>Chargement de l'administration…</p>
    </main>
  ),
});

export default function AdminCmsClient() {
  return <DecapStudio />;
}
