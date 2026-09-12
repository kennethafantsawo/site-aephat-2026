"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import { AnimatedStats } from "@/components/AnimatedStats";
import { SocialPostCard } from "@/components/SocialPostCard";
import type { Post, SiteImage, HealthSource } from "@/modules/content/types";

export default function HomePage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [posts, setPosts] = useState<Post[]>([]);
  const [health, setHealth] = useState<HealthSource[]>([]);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then((p: Post[]) => setPosts(p.filter((x) => x.status === "published").slice(0, 3))).catch(() => {});
    fetch("/api/health").then((r) => r.json()).then((h: HealthSource[]) => setHealth(h.filter((x) => x.isApproved).slice(0, 3))).catch(() => {});
    fetch("/api/site-images").then((r) => r.json()).then((imgs: SiteImage[]) => {
      const hero = imgs.filter((i) => i.category === "hero" && i.isActive).sort((a, b) => a.order - b.order);
      setHeroImages(hero.length ? hero : [{
        id: "fallback", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop",
        alt: "AEPHAT", category: "hero", order: 1, isActive: true, createdAt: "", updatedAt: "",
      }]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (heroImages.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % heroImages.length), 5500);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const stats = [
    { value: "200+", label: t.home.stats.members },
    { value: "15+", label: t.home.stats.events },
    { value: "120+", label: locale === "fr" ? "Veilles OMS/VIDAL" : "WHO/VIDAL briefs" },
    { value: "5+", label: t.home.stats.years },
  ];

  return (
    <div>
      {/* HERO MODERNE */}
      <section className="relative overflow-hidden mesh-bg grain">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20 grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-[12.5px] font-bold rounded-full pl-2 pr-4 py-1.5 backdrop-blur">
              <span className="bg-[#D4A843] text-[#241a02] text-[11px] font-extrabold rounded-full px-2.5 py-1">AEPHAT • LOMÉ</span>
              <span className="flex items-center gap-1.5"><span className="live-dot" /> {locale === "fr" ? "Actualités AEPHAT + Santé OMS/VIDAL" : "AEPHAT News + WHO/VIDAL Health"}</span>
            </div>
            <h1 className="font-display text-white font-extrabold leading-[1.02] tracking-tight text-[42px] sm:text-6xl lg:text-[68px] mt-5">
              {locale === "fr" ? "S'informer." : "Inform."}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3DFA0] via-[#D4A843] to-[#F3DFA0]"> {locale === "fr" ? "Agir." : "Act."}</span>
              <br />{locale === "fr" ? "Progresser." : "Progress."}
            </h1>
            <p className="mt-5 text-white/70 text-[16px] leading-relaxed max-w-xl">
              {locale === "fr"
                ? "Le fil social des étudiants en pharmacie du Togo : publications façon Instagram, débats façon X, communauté façon Facebook — et une veille Santé OMS & VIDAL vérifiée."
                : "The social feed of Togo's pharmacy students: Instagram-style posts, X-style debates, Facebook-style community — plus verified WHO & VIDAL health watch."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/${locale}/vie-aephat`} className="btn-gold">⚡ {locale === "fr" ? "Voir le fil AEPHAT" : "Open AEPHAT feed"}</Link>
              <Link href={`/${locale}/sante`} className="btn-ghost !bg-white/10 !text-white !border-white/25 hover:!border-white/60">🛡️ {locale === "fr" ? "Veille Santé" : "Health watch"}</Link>
            </div>
            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["AK", "MD", "SL", "+9"].map((x) => (
                  <span key={x} className="w-9 h-9 rounded-full border-2 border-[#0B1F14] bg-gradient-to-br from-[#1A5632] to-[#D4A843] text-white text-[11px] font-extrabold grid place-items-center">{x}</span>
                ))}
              </div>
              <p className="text-white/60 text-[13px] font-semibold">{locale === "fr" ? "200+ membres actifs • Bureau vérifié ✓" : "200+ active members • Verified board ✓"}</p>
            </div>
          </div>

          {/* Carte hero / carrousel */}
          <div className="relative animate-fade-in-up delay-200">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#D4A843]/30 to-transparent blur-3xl rounded-[30px]" />
            <div className="relative glass rounded-[26px] overflow-hidden shadow-2xl">
              <div className="relative h-[380px] sm:h-[440px]">
                {heroImages.map((img, i) => (
                  <div key={img.id} className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" style={{ objectPosition: `${img.focalX ?? 50}% ${img.focalY ?? 50}%` }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(11,31,20,${((img.overlayOpacity ?? 55) / 100)}), transparent 60%)` }} />
                  </div>
                ))}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-black/45 text-white text-[12px] font-bold rounded-full px-3 py-1.5 backdrop-blur border border-white/20">
                    <span className="live-dot" /> AEPHAT • LIVE
                  </span>
                  <span className="bg-[#D4A843] text-[#241a02] text-[12px] font-extrabold rounded-full px-3 py-1.5">{slide + 1}/{Math.max(heroImages.length, 1)}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4 flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-[#1A5632] text-white grid place-items-center font-extrabold">Æ</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-extrabold text-[#0B1F14] truncate">{locale === "en" && heroImages[slide]?.titleEn ? heroImages[slide].titleEn : (heroImages[slide]?.title || "AEPHAT • Lomé")}</p>
                    <p className="text-[12px] text-[#5B6B5F] truncate">{heroImages[slide]?.caption || (locale === "fr" ? "Campagnes, congrès, vie étudiante" : "Campaigns, congress, student life")}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setSlide((s) => (s - 1 + heroImages.length) % Math.max(heroImages.length, 1))} className="w-9 h-9 rounded-full bg-[#0B1F14] text-white grid place-items-center hover:scale-105 transition-transform" aria-label="Prev">‹</button>
                    <button onClick={() => setSlide((s) => (s + 1) % Math.max(heroImages.length, 1))} className="w-9 h-9 rounded-full bg-[#D4A843] text-[#241a02] grid place-items-center hover:scale-105 transition-transform" aria-label="Next">›</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 sm:left-6 glass rounded-2xl px-4 py-3 flex items-center gap-3 floaty shadow-xl">
              <span className="text-2xl">💊</span>
              <div><p className="text-[13px] font-extrabold text-[#0B1F14]">OMS • VIDAL</p><p className="text-[11.5px] text-[#5B6B5F] font-semibold">{locale === "fr" ? "Sources citées & vérifiées" : "Cited & verified sources"}</p></div>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur overflow-hidden py-3">
          <div className="marquee-track text-white/80 text-[13px] font-bold uppercase tracking-[0.18em]">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-10 pr-10">
                <span>Actualités AEPHAT ✦ Santé OMS ✦ VIDAL ✦ Sondages ✦ Campagnes ✦ Congrès ✦ Pharmacovigilance ✦ Prévention ✦</span>
                <span>Actualités AEPHAT ✦ Santé OMS ✦ VIDAL ✦ Sondages ✦ Campagnes ✦ Congrès ✦ Pharmacovigilance ✦ Prévention ✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <AnimatedStats stats={stats} />

      {/* MISSIONS BENTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#1A5632]">{locale === "fr" ? "L'association en action" : "The association in action"}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">{locale === "fr" ? "Un campus, un fil, une mission." : "One campus, one feed, one mission."}</h2>
          </div>
          <Link href={`/${locale}/a-propos`} className="btn-ghost text-sm">{locale === "fr" ? "Découvrir le bureau →" : "Meet the board →"}</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "📸", title: locale === "fr" ? "Fil social AEPHAT" : "AEPHAT social feed", desc: locale === "fr" ? "Publications, stories, likes, commentaires et partages façon réseaux sociaux." : "Posts, stories, likes, comments and shares, social-style.", cta: `/${locale}/vie-aephat`, ctaLabel: locale === "fr" ? "Ouvrir le fil" : "Open feed" },
            { icon: "🛡️", title: locale === "fr" ? "Santé OMS & VIDAL" : "WHO & VIDAL Health", desc: locale === "fr" ? "Scraping officiel : alertes, médicaments, vaccination, prévention." : "Official scraping: alerts, medicines, vaccination, prevention.", cta: `/${locale}/sante`, ctaLabel: locale === "fr" ? "Voir la veille" : "See watch" },
            { icon: "📊", title: locale === "fr" ? "Sondages Google Forms" : "Google Forms polls", desc: locale === "fr" ? "Consultations directes, résultats en 1 clic, accès membres vérifiés." : "Direct consultations, 1-click results, verified access.", cta: `/${locale}/vie-aephat`, ctaLabel: locale === "fr" ? "Participer" : "Participate" },
          ].map((c, i) => (
            <div key={c.title} className="card-soft card-hover p-6 animate-fade-in-up" style={{ animationDelay: `${i * 120}ms` }}>
              <span className="w-12 h-12 rounded-2xl bg-[#EFF2EC] grid place-items-center text-2xl">{c.icon}</span>
              <h3 className="font-display font-extrabold text-lg mt-4">{c.title}</h3>
              <p className="text-sm text-[#5B6B5F] mt-1.5 leading-relaxed">{c.desc}</p>
              <Link href={c.cta} className="inline-flex items-center gap-1.5 mt-4 text-sm font-extrabold text-[#1A5632] hover:gap-3 transition-all">{c.ctaLabel} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FIL SOCIAL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold">⚡ {locale === "fr" ? "À la une du fil" : "Feed highlights"}</h2>
          <Link href={`/${locale}/vie-aephat`} className="text-sm font-extrabold text-[#1A5632]">{locale === "fr" ? "Tout voir →" : "View all →"}</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {posts.map((p) => (
            <SocialPostCard key={p.id} post={p} locale={locale} compact />
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-[#5B6B5F]">{t.vieAephat.empty}</p>
          )}
        </div>
      </section>

      {/* SANTE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card-soft overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B1F14] to-[#1A5632] text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#F3DFA0]">OMS • VIDAL</p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold">{locale === "fr" ? "Veille Santé vérifiée" : "Verified Health watch"}</h2>
            </div>
            <Link href={`/${locale}/sante`} className="btn-gold text-sm">{locale === "fr" ? "Ouvrir la page Santé" : "Open Health page"}</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4 p-6">
            {health.map((h) => (
              <a key={h.id} href={h.sourceUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#E3E9E1] p-5 card-hover bg-white block">
                <span className={`text-[11px] font-extrabold rounded-full px-2.5 py-1 ${h.sourceType === "VIDAL" ? "bg-[#FFF3D6] text-[#8a6d1b]" : "bg-[#E3F2E8] text-[#1A5632]"}`}>{h.sourceName}</span>
                <h3 className="font-bold text-[15px] mt-3 line-clamp-2">{locale === "en" && h.titleEn ? h.titleEn : h.title}</h3>
                <p className="text-[13px] text-[#5B6B5F] mt-1.5 line-clamp-3">{locale === "en" && h.summaryEn ? h.summaryEn : h.summary}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-extrabold text-[#1A5632]">{locale === "fr" ? "Lire la source →" : "Read source →"}</span>
              </a>
            ))}
            {health.length === 0 && <p className="text-sm text-[#5B6B5F]">{t.sante.empty}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
