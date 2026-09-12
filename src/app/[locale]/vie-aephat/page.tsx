"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Images, CalendarDays, BarChart3, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Inbox } from "lucide-react";
import { type Locale, getDictionary } from "@/lib/i18n";
import { SocialPostCard } from "@/components/SocialPostCard";
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

  const tabs = [
    { k: "pour-toi" as Tab, label: locale === "fr" ? "Pour toi" : "For you", icon: Sparkles },
    { k: "medias" as Tab, label: locale === "fr" ? "Médias" : "Media", icon: Images },
    { k: "evenements" as Tab, label: locale === "fr" ? "Événements" : "Events", icon: CalendarDays },
    { k: "sondages" as Tab, label: locale === "fr" ? "Sondages" : "Polls", icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card-soft overflow-hidden mb-5">
        <div className="mesh-bg grain relative p-6 sm:p-8">
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-[#5AC878]"><span className="live-dot !bg-[#5AC878]" /> {locale === "fr" ? "Fil communautaire" : "Community feed"}</p>
            <h1 className="font-display text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">{t.vieAephat.title}</h1>
            <p className="text-white/65 text-sm mt-2 max-w-xl">{t.vieAephat.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div>
          <div className="card-soft p-3 flex flex-col sm:flex-row gap-2 sm:items-center mb-4">
            <div className="flex gap-1.5 bg-[#F2F5F3] rounded-full p-1 overflow-x-auto">
              {tabs.map((x) => (
                <button key={x.k} onClick={() => setTab(x.k)} className={`whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-extrabold transition-all ${tab === x.k ? "bg-[#101418] text-white shadow" : "text-[#3A454E] hover:bg-white"}`}>
                  <x.icon className="w-3.5 h-3.5" />{x.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6570]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={locale === "fr" ? "Rechercher un post, un tag..." : "Search a post, a tag..."} className="w-full bg-[#F2F5F3] border border-[#E2E8E6] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1FA34A] focus:ring-2 focus:ring-[#1FA34A]/15" />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">{[0, 1, 2].map((i) => <div key={i} className="card-soft p-6 animate-pulse"><div className="h-4 bg-[#EFF3F1] rounded w-1/3 mb-3" /><div className="h-40 bg-[#EFF3F1] rounded-2xl" /></div>)}</div>
          ) : filtered.length === 0 ? (
            <div className="card-soft p-14 text-center">
              <Inbox className="w-10 h-10 mx-auto text-[#5A6570]" />
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

        <aside className="grid gap-4 lg:sticky lg:top-32">
          <div className="card-soft p-5">
            <h3 className="font-display font-extrabold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#0C6B2D]" /> {locale === "fr" ? "Tendances" : "Trending"}</h3>
            <div className="mt-3 grid gap-2.5">
              {trending.map((p, i) => (
                <div key={p.id} className="flex gap-3 items-start rounded-2xl bg-[#F2F5F3] border border-[#E2E8E6] p-3">
                  <span className="font-display font-extrabold text-[#0C6B2D]">0{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-snug line-clamp-2">{locale === "en" && p.titleEn ? p.titleEn : p.title}</p>
                    <p className="text-[12px] text-[#5A6570] font-semibold mt-1">{p.likes || 0} mentions · {p.commentCount || 0} commentaires</p>
                  </div>
                </div>
              ))}
              {trending.length === 0 && <p className="text-[13px] text-[#5A6570]">—</p>}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#071a10] to-[#0C6B2D] text-white p-5">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#5AC878] flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> {locale === "fr" ? "Veille santé" : "Health watch"}</p>
            <p className="font-display font-extrabold text-lg mt-1.5 leading-snug">{locale === "fr" ? "Alertes OMS et fiches VIDAL vérifiées." : "Verified WHO alerts and VIDAL sheets."}</p>
            <Link href={`/${locale}/sante`} className="btn-primary !bg-none !bg-white !text-[#0A2E18] !shadow-none mt-4 text-sm !py-2.5">{locale === "fr" ? "Ouvrir Santé" : "Open Health"} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
