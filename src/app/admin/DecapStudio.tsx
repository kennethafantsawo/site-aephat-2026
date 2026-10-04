"use client";

import { useEffect, useState } from "react";
import { setupDecapCms } from "./cms-setup";

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
        // Habillage AEPHAT : feuille de style globale + preview.
        try {
          setupDecapCms();
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "/admin/aephat-cms.css";
          document.head.appendChild(link);
        } catch {
          // L'habillage est optionnel : le CMS reste fonctionnel.
        }
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
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, system-ui, sans-serif", background: "linear-gradient(160deg, #071a10 0%, #0A2E18 55%, #0C6B2D 100%)" }}>
        <style>{`@keyframes aephat-spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center", padding: 24 }}>
          <img src="/brand/aez.png" alt="AEPHAT" style={{ width: 72, height: 72, objectFit: "contain", margin: "0 auto", background: "#fff", borderRadius: 18, padding: 6 }} />
          <p style={{ fontWeight: 800, fontSize: 20, color: "#fff", marginTop: 16 }}>AEPHAT</p>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: 13, marginTop: 4 }}>Administration du contenu — Lomé, Togo</p>
          <div style={{ width: 36, height: 36, margin: "20px auto 0", borderRadius: "50%", border: "3px solid rgba(255,255,255,.2)", borderTopColor: "#5AC878", animation: "aephat-spin 0.9s linear infinite" }} />
        </div>
      </main>
    );
  }

  // Decap CMS monte sa propre interface dans le body.
  return null;
}
