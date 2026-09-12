"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { HealthSource } from "@/modules/content/types";

export default function AdminHealthPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [items, setItems] = useState<HealthSource[]>([]);
  const [catalog, setCatalog] = useState<{ title: string; url: string; sourceName: string; summary: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<{ title: string; summary: string; imageUrl?: string; sourceUrl: string; sourceName: string } | null>(null);

  const reload = () => fetch("/api/health").then((r) => r.json()).then((h) => { setItems(h); setLoading(false); });
  useEffect(() => {
    reload();
    fetch("/api/health?catalog=1").then((r) => r.json()).then(setCatalog).catch(() => {});
  }, []);

  const run = async (body: object, key: string) => {
    setBusy(key);
    const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    await reload();
    return data;
  };

  const importFeeds = async () => {
    const d = await run({ action: "import_feeds", importedBy: "u1" }, "rss");
    alert(d.imported > 0 ? `✅ ${d.imported} article(s) RSS importé(s)` : "Aucun nouvel article RSS");
  };
  const importCatalog = async () => {
    const d = await run({ action: "import_catalog", importedBy: "u1" }, "catalog");
    alert(d.imported > 0 ? `✅ ${d.imported} fiche(s) OMS/VIDAL importée(s)` : "Catalogue déjà importé");
  };
  const scrape = async () => {
    if (!url.trim()) return;
    setBusy("scrape");
    const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "scrape_url", url }) });
    const d = await res.json();
    setBusy("");
    if (d.ok) setPreview(d.preview);
    else alert(d.error || "Échec du scraping");
  };
  const savePreview = async (approved: boolean) => {
    if (!preview) return;
    await run({ action: "create", title: preview.title, summary: preview.summary, imageUrl: preview.imageUrl, sourceUrl: preview.sourceUrl, sourceName: preview.sourceName, sourceType: preview.sourceName.includes("VIDAL") ? "VIDAL" : "OMS", category: "prevention", importMode: "scrape", isApproved: approved }, "save");
    setPreview(null); setUrl("");
  };
  const approve = (id: string) => run({ action: "approve", id }, `ok-${id}`);
  const del = async (id: string) => { if (confirm("Supprimer ?")) run({ action: "delete", id }, `del-${id}`); };

  if (loading) return <p className="text-sm text-gray-500">{t.common.loading}</p>;

  return (
    <div className="max-w-6xl mx-auto grid gap-5">
      <div className="card-soft overflow-hidden">
        <div className="mesh-bg grain p-6">
          <h1 className="font-display text-white text-2xl font-extrabold">🛡️ {locale === "fr" ? "Veille Santé OMS & VIDAL" : "WHO & VIDAL watch"}</h1>
          <p className="text-white/60 text-[13px] mt-1">{items.length} fiches • {items.filter((i) => i.isApproved).length} publiées • {items.filter((i) => !i.isApproved).length} en attente</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={importFeeds} disabled={!!busy} className="btn-gold text-[13px] !py-2.5">{busy === "rss" ? "⏳ RSS..." : "📡 Importer flux RSS"}</button>
            <button onClick={importCatalog} disabled={!!busy} className="btn-ghost !bg-white/10 !text-white !border-white/25 text-[13px] !py-2.5">{busy === "catalog" ? "⏳ Catalogue..." : "📚 Importer catalogue OMS/VIDAL"}</button>
          </div>
        </div>
        <div className="p-4 border-t border-[#E3E9E1] grid md:grid-cols-[1fr_auto] gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="🔗 Coller une URL OMS ou VIDAL à scraper... (ex: https://www.who.int/fr/...)" className="bg-[#F6F7F4] border border-[#E3E9E1] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#1A5632]" />
          <button onClick={scrape} disabled={busy === "scrape"} className="btn-primary !py-2.5 text-[13px]">{busy === "scrape" ? "⏳ Scraping..." : "🔍 Scraper l'URL"}</button>
        </div>
        {preview && (
          <div className="m-4 rounded-2xl border border-[#D4A843] bg-[#FFFBEB] p-4">
            <p className="text-[12px] font-extrabold text-[#8a6d1b] uppercase tracking-widest">Aperçu du scraping — {preview.sourceName}</p>
            <h3 className="font-extrabold mt-1">{preview.title}</h3>
            <p className="text-[13px] text-[#5B6B5F] mt-1">{preview.summary}</p>
            <p className="text-[12px] text-[#5B6B5F] mt-1 truncate">{preview.sourceUrl}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => savePreview(true)} className="btn-primary !py-2 text-[13px]">✅ Enregistrer & publier</button>
              <button onClick={() => savePreview(false)} className="btn-ghost !py-2 text-[13px]">📥 Brouillon (à valider)</button>
              <button onClick={() => setPreview(null)} className="text-[13px] font-bold text-[#5B6B5F]">Annuler</button>
            </div>
          </div>
        )}
      </div>

      <div className="card-soft p-4">
        <h2 className="font-display font-extrabold text-[15px]">📚 Catalogue officiel (1 clic)</h2>
        <div className="grid sm:grid-cols-2 gap-2 mt-3">
          {catalog.map((c) => (
            <div key={c.url} className="rounded-2xl border border-[#E3E9E1] bg-[#F6F7F4] p-3 flex gap-2 items-start">
              <span className={`text-[11px] font-extrabold rounded-full px-2 py-1 shrink-0 ${c.sourceName.includes("VIDAL") ? "bg-[#FFF3D6] text-[#8a6d1b]" : "bg-[#E3F2E8] text-[#0B4d26]"}`}>{c.sourceName}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold leading-snug">{c.title}</p>
                <a href={c.url} target="_blank" rel="noreferrer" className="text-[12px] text-[#1A5632] font-bold hover:underline">Ouvrir ↗</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F6F7F4] border-b border-[#E3E9E1]">
              <tr>
                <th className="text-left px-4 py-3 font-extrabold text-[#5B6B5F] text-[12px]">Titre</th>
                <th className="text-left px-4 py-3 font-extrabold text-[#5B6B5F] text-[12px]">Source</th>
                <th className="text-left px-4 py-3 font-extrabold text-[#5B6B5F] text-[12px]">Mode</th>
                <th className="text-left px-4 py-3 font-extrabold text-[#5B6B5F] text-[12px]">Statut</th>
                <th className="text-right px-4 py-3 font-extrabold text-[#5B6B5F] text-[12px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF2EC]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F6F7F4]/60">
                  <td className="px-4 py-3 font-bold text-[#0B1F14] max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3"><span className="text-[11px] font-extrabold bg-[#EAF4ED] text-[#1A5632] rounded-full px-2.5 py-1">{item.sourceName}</span></td>
                  <td className="px-4 py-3 text-[12px] text-[#5B6B5F] font-bold">{item.importMode || "—"}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] font-extrabold rounded-full px-2.5 py-1 ${item.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{item.isApproved ? "● Publié" : "○ À valider"}</span></td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {!item.isApproved && <button onClick={() => approve(item.id)} className="text-[12px] font-extrabold text-green-700 hover:underline">Approuver</button>}
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-[12px] font-extrabold text-[#1A5632] hover:underline">Source</a>
                    <button onClick={() => del(item.id)} className="text-[12px] font-extrabold text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
