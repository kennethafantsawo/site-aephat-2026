"use client";

import { useEffect, useState } from "react";

const IDENTITY_SRC = "https://identity.netlify.com/v1/netlify-identity-widget.js";
const DECAP_SRC = "https://unpkg.com/decap-cms@3/dist/decap-cms.js";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(src));
    document.body.appendChild(el);
  });
}

/**
 * Studio Decap CMS : charge les scripts officiels côté client uniquement.
 * - Corrige /admin → /admin/ pour que config.yml se résolve en /admin/config.yml.
 * - Neutralise le padding du header du site (page pleine, sans Header/Footer).
 */
export default function DecapStudio() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (window.location.pathname === "/admin") {
      window.history.replaceState(null, "", "/admin/");
    }
    const prevPadding = document.body.style.paddingTop;
    document.body.style.paddingTop = "0";

    let cancelled = false;
    (async () => {
      try {
        await loadScript(IDENTITY_SRC);
        await loadScript(DECAP_SRC);
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      document.body.style.paddingTop = prevPadding;
    };
  }, []);

  if (status === "error") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>Chargement du CMS impossible</h1>
          <p style={{ marginTop: 8, color: "#5A6570", fontSize: 14 }}>
            Vérifie ta connexion internet (scripts chargés depuis un CDN), puis recharge la page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: "10px 22px", borderRadius: 999, border: 0, background: "#0C6B2D", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Recharger
          </button>
        </div>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 800, fontSize: 18 }}>AEPHAT — Administration du contenu</p>
          <p style={{ marginTop: 8, color: "#5A6570", fontSize: 14 }}>Chargement de Decap CMS…</p>
        </div>
      </main>
    );
  }

  // Decap CMS monte sa propre interface dans le body.
  return null;
}
