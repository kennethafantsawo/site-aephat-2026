"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import { DynamicHero } from "@/components/DynamicHero";
import { AnimatedStats } from "@/components/AnimatedStats";
import { InteractiveCards } from "@/components/InteractiveCards";
import { HealthTicker } from "@/components/HealthTicker";
import type { SiteImage, Post } from "@/modules/content/types";

export default function HomePage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState<Array<{ url: string; title?: string; titleEn?: string }>>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((p: Post[]) => {
        setPosts(p.filter((post) => post.status === "published").slice(0, 3));
        setLoading(false);
      });
    fetch("/api/site-images")
      .then((r) => r.json())
      .then((images: SiteImage[]) => {
        const hero = images
          .filter((img) => img.category === "hero" && img.isActive)
          .sort((a, b) => a.order - b.order)
          .map((img) => ({ url: img.url, title: img.title, titleEn: img.titleEn }));
        setHeroImages(hero.length > 0 ? hero : [
          { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop" },
        ]);
      });
  }, []);

  const stats = [
    { value: t.home.stats.members, label: t.home.stats.members, icon: "👥" },
    { value: t.home.stats.events, label: t.home.stats.events, icon: "🎉" },
    { value: t.home.stats.projects, label: t.home.stats.projects, icon: "📋" },
    { value: t.home.stats.years, label: t.home.stats.years, icon: "🏆" },
  ];

  return (
    <div>
      <DynamicHero locale={locale} heroImages={heroImages} />
      
      <AnimatedStats stats={stats} />

      <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                {locale === "fr" ? "Notre mission" : "Our mission"}
              </p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                {locale === "fr"
                  ? "Représenter et défendre les étudiants en pharmacie du Togo"
                  : "Represent and defend pharmacy students of Togo"}
              </h2>
              <div className="w-12 h-1 bg-secondary rounded mt-5" />
              <p className="mt-5 text-gray-600 leading-relaxed max-w-lg">
                {locale === "fr"
                  ? "L'AEPHAT rassemble les étudiants en pharmacie autour de projets, d'événements et d'initiatives pour la santé publique au Togo."
                  : "AEPHAT brings together pharmacy students around projects, events, and public health initiatives in Togo."}
              </p>
              <Link
                href={`/${locale}/a-propos`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                {locale === "fr" ? "En savoir plus" : "Learn more"}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📚", title: locale === "fr" ? "Éducation" : "Education", desc: locale === "fr" ? "Formations et ateliers" : "Training and workshops" },
                { icon: "💊", title: locale === "fr" ? "Santé publique" : "Public health", desc: locale === "fr" ? "Campagnes de prévention" : "Prevention campaigns" },
                { icon: "🤝", title: locale === "fr" ? "Entraide" : "Solidarity", desc: locale === "fr" ? "Communauté et mentorat" : "Community and mentoring" },
                { icon: "🏥", title: locale === "fr" ? "Événements" : "Events", desc: locale === "fr" ? "Congrès et colloques" : "Congresses and conferences" },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-3d"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InteractiveCards
        posts={posts}
        locale={locale}
        title={t.home.news}
        titleEn={t.home.news}
        viewAllHref={`/${locale}/vie-aephat`}
        viewAllText={locale === "fr" ? "Tout voir" : "View all"}
        viewAllTextEn={locale === "fr" ? "Voir toutes" : "View all"}
      />

      <HealthTicker locale={locale} />

      <section className="py-16 lg:py-20 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
            {locale === "fr" ? "Nous rejoindre" : "Join us"}
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
            {locale === "fr" ? "Tu étudies la pharmacie au Togo ?" : "Studying pharmacy in Togo?"}
          </h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto leading-relaxed">
            {locale === "fr"
              ? "Rejoins l'AEPHAT : entraide, projets santé publique, congrès, mentorat."
              : "Join AEPHAT: solidarity, public health projects, congress, mentoring."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={`/${locale}/a-propos`}
              className="btn-interactive inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-all shadow-lg hover:shadow-xl"
            >
              {locale === "fr" ? "Découvrir l'association" : "Discover the association"} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
