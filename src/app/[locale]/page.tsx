"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, ShieldCheck, BarChart3, GraduationCap, Pill, Users, CalendarDays } from "lucide-react";
import { type Locale, getDictionary } from "@/lib/i18n";
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

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden mesh-bg grain">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20 grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-[12.5px] font-bold rounded-full pl-2 pr-4 py-1.5 backdrop-blur">
              <span className="bg-[#1FA34A] text-white text-[11px] font-extrabold rounded-full px-2.5 py-1">AEPHAT — LOMÉ</span>
              <span className="flex items-center gap-1.5"><span className="live-dot !bg-[#5AC878]" /> {locale === "fr" ? "Actualités AEPHAT et Santé OMS / VIDAL" : "AEPHAT News and WHO / VIDAL Health"}</span>
            </div>
            <h1 className="font-display text-white font-extrabold leading-[1.04] tracking-tight text-[42px] sm:text-6xl lg:text-[66px] mt-5">
              {locale === "fr" ? "S'informer." : "Inform."}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5AC878] via-[#8FDCA4] to-[#5AC878]">{locale === "fr" ? "Agir." : "Act."}</span>
              <br />{locale === "fr" ? "Progresser." : "Progress."}
            </h1>
            <p className="mt-5 text-white/70 text-[16px] leading-relaxed max-w-xl">
              {locale === "fr"
                ? "L'association des étudiants en pharmacie du Togo : actualités, événements, sondages et veille santé vérifiée OMS et VIDAL."
                : "The association of pharmacy students of Togo: news, events, polls and verified WHO and VIDAL health watch."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/${locale}/vie-aephat`} className="btn-primary">
                <Newspaper className="w-4 h-4" />
                {locale === "fr" ? "Voir les actualités" : "View news"}
              </Link>
              <Link href={`/${locale}/sante`} className="btn-ghost !bg-white/10 !text-white !border-white/25 hover:!border-white/60">
                <ShieldCheck className="w-4 h-4" />
                {locale === "fr" ? "Veille Santé" : "Health watch"}
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in-up delay-200">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#1FA34A]/30 to-transparent blur-3xl rounded-[30px]" />
            <div className="relative glass rounded-[26px] overflow-hidden shadow-2xl">
              <div className="relative h-[380px] sm:h-[440px]">
                {heroImages.map((img, i) => (
                  <div key={img.id} className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" style={{ objectPosition: `${img.focalX ?? 50}% ${img.focalY ?? 50}%` }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(7,26,16,${((img.overlayOpacity ?? 55) / 100)}), transparent 60%)` }} />
                  </div>
                ))}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-black/45 text-white text-[12px] font-bold rounded-full px-3 py-1.5 backdrop-blur border border-white/20">
                    <span className="live-dot !bg-[#5AC878]" /> AEPHAT
                  </span>
                  <span className="bg-white text-[#101418] text-[12px] font-extrabold rounded-full px-3 py-1.5">{slide + 1}/{Math.max(heroImages.length, 1)}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4 flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-[#1FA34A] text-white grid place-items-center shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/aez.png" alt="AEPHAT" className="w-8 h-8 object-contain" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-extrabold text-[#101418] truncate">{locale === "en" && heroImages[slide]?.titleEn ? heroImages[slide].titleEn : (heroImages[slide]?.title || "AEPHAT — Lomé")}</p>
                    <p className="text-[12px] text-[#5A6570] truncate">{heroImages[slide]?.caption || (locale === "fr" ? "Campagnes, congrès, vie étudiante" : "Campaigns, congress, student life")}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => setSlide((s) => (s - 1 + heroImages.length) % Math.max(heroImages.length, 1))} className="w-9 h-9 rounded-full bg-[#101418] text-white grid place-items-center hover:scale-105 transition-transform" aria-label="Previous"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => setSlide((s) => (s + 1) % Math.max(heroImages.length, 1))} className="w-9 h-9 rounded-full bg-[#1FA34A] text-white grid place-items-center hover:scale-105 transition-transform" aria-label="Next"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur overflow-hidden py-3">
          <div className="marquee-track text-white/80 text-[13px] font-bold uppercase tracking-[0.18em]">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-10 pr-10">
                <span>Actualités AEPHAT — Santé OMS — VIDAL — Sondages — Campagnes — Congrès — Pharmacovigilance — Prévention —</span>
                <span>Actualités AEPHAT — Santé OMS — VIDAL — Sondages — Campagnes — Congrès — Pharmacovigilance — Prévention —</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* MISSIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#0C6B2D]">{locale === "fr" ? "L'association en action" : "The association in action"}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">{locale === "fr" ? "Un campus, une mission." : "One campus, one mission."}</h2>
          </div>
          <Link href={`/${locale}/a-propos`} className="btn-ghost text-sm"> {locale === "fr" ? "Découvrir le bureau" : "Meet the board"} <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Newspaper, title: locale === "fr" ? "Actualités AEPHAT" : "AEPHAT News", desc: locale === "fr" ? "Publications, événements et vie associative des étudiants en pharmacie." : "Posts, events and community life of pharmacy students.", cta: `/${locale}/vie-aephat`, ctaLabel: locale === "fr" ? "Ouvrir les actualités" : "Open news" },
            { icon: ShieldCheck, title: locale === "fr" ? "Santé OMS et VIDAL" : "WHO and VIDAL Health", desc: locale === "fr" ? "Alertes, médicaments, vaccination et prévention, sources officielles." : "Alerts, medicines, vaccination and prevention from official sources.", cta: `/${locale}/sante`, ctaLabel: locale === "fr" ? "Voir la veille" : "See watch" },
            { icon: BarChart3, title: locale === "fr" ? "Sondages" : "Polls", desc: locale === "fr" ? "Consultations directes via Google Forms, résultats en un clic." : "Direct consultations via Google Forms, one-click results.", cta: `/${locale}/vie-aephat`, ctaLabel: locale === "fr" ? "Participer" : "Participate" },
          ].map((c, i) => (
            <div key={c.title} className="card-soft card-hover p-6 animate-fade-in-up" style={{ animationDelay: `${i * 120}ms` }}>
              <span className="w-12 h-12 rounded-2xl bg-[#E9F7EE] grid place-items-center"><c.icon className="w-6 h-6 text-[#0C6B2D]" /></span>
              <h3 className="font-display font-extrabold text-lg mt-4">{c.title}</h3>
              <p className="text-sm text-[#5A6570] mt-1.5 leading-relaxed">{c.desc}</p>
              <Link href={c.cta} className="inline-flex items-center gap-1.5 mt-4 text-sm font-extrabold text-[#0C6B2D] hover:gap-3 transition-all">{c.ctaLabel} <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ))}
        </div>

        {/* Chiffres clés sobres */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Users, value: "200+", label: locale === "fr" ? "Membres" : "Members" },
            { icon: GraduationCap, value: "FSS", label: "UL — Lomé" },
            { icon: Pill, value: "OMS", label: "VIDAL" },
            { icon: CalendarDays, value: "2026", label: locale === "fr" ? "En activité" : "Active" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#E2E8E6] bg-[#F2F5F3] p-5 text-center">
              <s.icon className="w-5 h-5 mx-auto text-[#0C6B2D]" />
              <p className="font-display font-extrabold text-2xl mt-2">{s.value}</p>
              <p className="text-[12.5px] font-bold text-[#5A6570]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FIL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold">{locale === "fr" ? "À la une" : "Highlights"}</h2>
          <Link href={`/${locale}/vie-aephat`} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0C6B2D]">{locale === "fr" ? "Tout voir" : "View all"} <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {posts.map((p) => (
            <SocialPostCard key={p.id} post={p} locale={locale} compact />
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-[#5A6570]">{t.vieAephat.empty}</p>
          )}
        </div>
      </section>

      {/* SANTE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card-soft overflow-hidden">
          <div className="bg-gradient-to-r from-[#071a10] to-[#0C6B2D] text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#5AC878]">OMS — VIDAL</p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold">{locale === "fr" ? "Veille Santé vérifiée" : "Verified Health watch"}</h2>
            </div>
            <Link href={`/${locale}/sante`} className="btn-primary !bg-none !bg-white !text-[#0A2E18] !shadow-none text-sm">{locale === "fr" ? "Ouvrir la page Santé" : "Open Health page"} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4 p-6">
            {health.map((h) => (
              <a key={h.id} href={h.sourceUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#E2E8E6] p-5 card-hover bg-white block">
                <span className={`text-[11px] font-extrabold rounded-full px-2.5 py-1 ${h.sourceType === "VIDAL" ? "bg-[#101418] text-white" : "bg-[#E9F7EE] text-[#0C6B2D]"}`}>{h.sourceName}</span>
                <h3 className="font-bold text-[15px] mt-3 line-clamp-2">{locale === "en" && h.titleEn ? h.titleEn : h.title}</h3>
                <p className="text-[13px] text-[#5A6570] mt-1.5 line-clamp-3">{locale === "en" && h.summaryEn ? h.summaryEn : h.summary}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-extrabold text-[#0C6B2D]">{locale === "fr" ? "Lire la source" : "Read source"} <ArrowRight className="w-3.5 h-3.5" /></span>
              </a>
            ))}
            {health.length === 0 && <p className="text-sm text-[#5A6570]">{t.sante.empty}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
