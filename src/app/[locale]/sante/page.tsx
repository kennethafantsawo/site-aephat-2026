"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { HealthSource } from "@/modules/content/types";

type SrcTab = "all" | "OMS" | "VIDAL";
type CatTab = "all" | "alerte" | "prevention" | "medicament" | "vaccination" | "pharmacovigilance" | "recherche";

const CAT_META: { k: CatTab; fr: string; emoji: string }[] = [
  { k: "all", fr: "Tout", emoji: "✨" },
  { k: "alerte", fr: "Alertes", emoji: "🚨" },
  { k: "prevention", fr: "Prévention", emoji: "🛡️" },
  { k: "medicament", fr: "Médicaments", emoji: "💊" },
  { k: "vaccination", fr: "Vaccination", emoji: "💉" },
  { k: "pharmacovigilance", fr: "Pharmacovigilance", emoji: "🔬" },
  { k: "recherche", fr: "Recherche", emoji: "📚" },
];

export default function SantePage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [items, setItems] = useState<HealthSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState<SrcTab>("all");
  const [cat, setCat] = useState<CatTab>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((h: HealthSource[]) => { setItems(h.filter((i) => i.isApproved)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...items];
    if (src !== "all") list = list.filter((i) => (i.sourceType || i.sourceName) === src || i.sourceName.includes(src));
    if (cat !== "all") list = list.filter((i) => i.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => `${i.title} ${i.summary} ${i.sourceName}`.toLowerCase().includes(q));
    }
    return list.sort((a, b) => +new Date(b.publishedDate) - +new Date(a.publishedDate));
  }, [items, src, cat, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card-soft overflow-hidden mb-5">
        <div className="bg-gradient-to-br from-[#0B1F14] via-[#123B24] to-[#1A5632] relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#D4A843]/25 blur-[90px] rounded-full" />
          <div className="relative flex flex-wrap justify-between gap-5 items-center">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-[#F3DFA0]"><span className="live-dot" /> {locale === "fr" ? "Sources officielles citées" : "Cited official sources"}</p>
              <h1 className="font-display text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">{t.sante.title}</h1>
              <p className="text-white/65 text-sm mt-2">{t.sante.description}</p>
              <div className="flex gap-2 mt-4">
                {(["all", "OMS", "VIDAL"] as SrcTab[]).map((s) => (
                  <button key={s} onClick={() => setSrc(s)} className={`px-5 py-2.5 rounded-full text-[13px] font-extrabold transition-all ${src === s ? "bg-[#D4A843] text-[#241a02] shadow-lg" : "bg-white/10 text-white border border-white/20 hover:bg-white/20"}`}>
                    {s === "all" ? (locale === "fr" ? "Toutes sources" : "All sources") : s === "OMS" ? "🏛️ OMS" : "💊 VIDAL"}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-4 grid grid-cols-3 gap-4 text-center min-w-[240px]">
              <div><p className="font-display font-extrabold text-xl">{items.filter((i) => (i.sourceType || "").includes("OMS") || i.sourceName.includes("OMS")).length}</p><p className="text-[11px] font-bold text-[#5B6B5F]">OMS</p></div>
              <div><p className="font-display font-extrabold text-xl">{items.filter((i) => (i.sourceType || "").includes("VIDAL") || i.sourceName.includes("VIDAL")).length}</p><p className="text-[11px] font-bold text-[#5B6B5F]">VIDAL</p></div>
              <div><p className="font-display font-extrabold text-xl">{items.length}</p><p className="text-[11px] font-bold text-[#5B6B5F]">✓</p></div>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center border-t border-[#E3E9E1]">
          <div className="flex gap-1.5 overflow-x-auto bg-[#EFF2EC] rounded-full p-1">
            {CAT_META.map((c) => (
              <button key={c.k} onClick={() => setCat(c.k)} className={`whitespace-nowrap px-3.5 py-2 rounded-full text-[12.5px] font-extrabold transition-all ${cat === c.k ? "bg-[#0B1F14] text-white shadow" : "text-[#33463a] hover:bg-white"}`}>{c.emoji} {c.fr}</button>
            ))}
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={locale === "fr" ? "🔍 Rechercher paludisme, vaccin, antibiotique..." : "🔍 Search malaria, vaccine, antibiotic..."} className="flex-1 bg-[#F6F7F4] border border-[#E3E9E1] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#1A5632]" />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="card-soft p-6 animate-pulse"><div className="h-32 bg-[#EFF2EC] rounded-2xl mb-4" /><div className="h-4 bg-[#EFF2EC] rounded w-2/3" /></div>)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-soft p-14 text-center"><p className="text-5xl">🛡️</p><p className="font-bold mt-3">{t.sante.empty}</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const title = locale === "en" && item.titleEn ? item.titleEn : item.title;
            const summary = locale === "en" && item.summaryEn ? item.summaryEn : item.summary;
            const isVidal = (item.sourceType || item.sourceName).includes("VIDAL");
            return (
              <article key={item.id} className="card-soft card-hover overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}>
                {item.imageUrl && (
                  <div className="h-40 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[11px] font-extrabold rounded-full px-3 py-1.5 backdrop-blur bg-black/55 text-white border border-white/25">⏱️ {item.readTimeMinutes || 3} min</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-extrabold rounded-full px-2.5 py-1 ${isVidal ? "bg-[#FFF3D6] text-[#8a6d1b]" : "bg-[#E3F2E8] text-[#0B4d26]"}`}>
                      {isVidal ? "💊 VIDAL" : "🏛️ OMS"}
                    </span>
                    {item.category && <span className="text-[11px] font-bold text-[#5B6B5F] bg-[#EFF2EC] rounded-full px-2.5 py-1">{CAT_META.find((c) => c.k === item.category)?.emoji} {item.category}</span>}
                    <time className="text-[11.5px] text-[#5B6B5F] ml-auto">{new Date(item.publishedDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { day: "2-digit", month: "short", year: "numeric" })}</time>
                  </div>
                  <h3 className="font-display font-extrabold text-[16px] leading-snug mt-3 line-clamp-2">{title}</h3>
                  <p className="text-[13.5px] text-[#5B6B5F] leading-relaxed mt-2 line-clamp-3 flex-1">{summary}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EFF2EC]">
                    <span className="text-[11.5px] font-bold text-[#1A5632]">✓ {locale === "fr" ? "Vérifié AEPHAT" : "AEPHAT verified"}</span>
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[13px] font-extrabold text-[#0B1F14] bg-[#F3DFA0] hover:bg-[#D4A843] rounded-full px-4 py-2 transition-all">
                      {locale === "fr" ? "Source officielle ↗" : "Official source ↗"}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="text-center text-[12px] text-[#5B6B5F] mt-8 max-w-2xl mx-auto">
        {locale === "fr"
          ? "Contenus issus des sites officiels de l'OMS et de VIDAL, cités avec liens sources. L'AEPHAT ne remplace pas un avis médical : consultez un pharmacien ou un médecin."
          : "Content from official WHO and VIDAL websites, cited with source links. AEPHAT is not a substitute for medical advice: consult a pharmacist or physician."}
      </p>
    </div>
  );
}
