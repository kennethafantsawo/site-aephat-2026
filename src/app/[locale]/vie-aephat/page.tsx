"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/i18n";
import { SocialPostCard } from "@/components/SocialPostCard";
import { StoriesBar } from "@/components/StoriesBar";
import type { Post } from "@/modules/content/types";

type Tab = "pour-toi" | "medias" | "evenements" | "sondages";

export default function VieAephatPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pour-toi");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((p: Post[]) => { setPosts(p.filter((x) => x.status === "published")); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...posts];
    if (tab === "medias") list = list.filter((p) => p.imageUrl || (p.images && p.images.length));
    if (tab === "evenements") list = list.filter((p) => p.category === "evenement");
    if (tab === "sondages") list = list.filter((p) => p.pollId);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => `${p.title} ${p.titleEn || ""} ${p.content} ${(p.tags || []).join(" ")}`.toLowerCase().includes(q));
    }
    return list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [posts, tab, query]);

  const trending = useMemo(() => [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 4), [posts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête social */}
      <div className="card-soft overflow-hidden mb-5">
        <div className="mesh-bg grain relative p-6 sm:p-8">
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-[#F3DFA0]"><span className="live-dot" /> {locale === "fr" ? "Fil communautaire" : "Community feed"}</p>
              <h1 className="font-display text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">{t.vieAephat.title}</h1>
              <p className="text-white/65 text-sm mt-2 max-w-xl">{t.vieAephat.description}</p>
            </div>
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-4">
              <div className="text-center"><p className="font-display font-extrabold text-[#0B1F14] text-xl leading-none">{posts.length}</p><p className="text-[11px] font-bold text-[#5B6B5F]">{locale === "fr" ? "posts" : "posts"}</p></div>
              <div className="w-px h-9 bg-[#0B1F14]/10" />
              <div className="text-center"><p className="font-display font-extrabold text-[#0B1F14] text-xl leading-none">{posts.reduce((s, p) => s + (p.likes || 0), 0)}</p><p className="text-[11px] font-bold text-[#5B6B5F]">❤️</p></div>
              <div className="w-px h-9 bg-[#0B1F14]/10" />
              <div className="text-center"><p className="font-display font-extrabold text-[#0B1F14] text-xl leading-none">{posts.filter((p) => p.pollId).length}</p><p className="text-[11px] font-bold text-[#5B6B5F]">📊</p></div>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5 border-t border-[#E3E9E1]">
          <StoriesBar locale={locale} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Colonne fil */}
        <div>
          <div className="card-soft p-3 flex flex-col sm:flex-row gap-2 sm:items-center mb-4">
            <div className="flex gap-1.5 bg-[#EFF2EC] rounded-full p-1 overflow-x-auto">
              {([
                { k: "pour-toi", label: locale === "fr" ? "✨ Pour toi" : "✨ For you" },
                { k: "medias", label: locale === "fr" ? "📸 Médias" : "📸 Media" },
                { k: "evenements", label: locale === "fr" ? "🎉 Événements" : "🎉 Events" },
                { k: "sondages", label: locale === "fr" ? "📊 Sondages" : "📊 Polls" },
              ] as { k: Tab; label: string }[]).map((x) => (
                <button key={x.k} onClick={() => setTab(x.k)} className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-extrabold transition-all ${tab === x.k ? "bg-[#0B1F14] text-white shadow" : "text-[#33463a] hover:bg-white"}`}>{x.label}</button>
              ))}
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={locale === "fr" ? "🔍 Rechercher un post, #tag..." : "🔍 Search a post, #tag..."} className="flex-1 bg-[#F6F7F4] border border-[#E3E9E1] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#1A5632] focus:ring-2 focus:ring-[#1A5632]/15" />
          </div>

          {loading ? (
            <div className="grid gap-4">{[0, 1, 2].map((i) => <div key={i} className="card-soft p-6 animate-pulse"><div className="h-4 bg-[#EFF2EC] rounded w-1/3 mb-3" /><div className="h-40 bg-[#EFF2EC] rounded-2xl" /></div>)}</div>
          ) : filtered.length === 0 ? (
            <div className="card-soft p-14 text-center">
              <p className="text-5xl">📭</p>
              <p className="font-bold mt-3">{t.vieAephat.empty}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((post, i) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 5) * 80}ms` }}>
                  <SocialPostCard post={post} locale={locale} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar tendances */}
        <aside className="grid gap-4 lg:sticky lg:top-32">
          <div className="card-soft p-5">
            <h3 className="font-display font-extrabold">🔥 {locale === "fr" ? "Tendances AEPHAT" : "AEPHAT Trending"}</h3>
            <div className="mt-3 grid gap-2.5">
              {trending.map((p, i) => (
                <div key={p.id} className="flex gap-3 items-start rounded-2xl bg-[#F6F7F4] border border-[#E3E9E1] p-3">
                  <span className="font-display font-extrabold text-[#1A5632]">0{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-snug line-clamp-2">{locale === "en" && p.titleEn ? p.titleEn : p.title}</p>
                    <p className="text-[12px] text-[#5B6B5F] font-semibold mt-1">❤️ {p.likes || 0} • 💬 {p.commentCount || 0}</p>
                  </div>
                </div>
              ))}
              {trending.length === 0 && <p className="text-[13px] text-[#5B6B5F]">—</p>}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1F14] to-[#1A5632] text-white p-5">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#F3DFA0]">🛡️ {locale === "fr" ? "Veille santé" : "Health watch"}</p>
            <p className="font-display font-extrabold text-lg mt-1.5 leading-snug">{locale === "fr" ? "Alertes OMS & fiches VIDAL vérifiées." : "Verified WHO alerts & VIDAL sheets."}</p>
            <Link href={`/${locale}/sante`} className="btn-gold mt-4 text-sm !py-2.5">{locale === "fr" ? "Ouvrir Santé →" : "Open Health →"}</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
