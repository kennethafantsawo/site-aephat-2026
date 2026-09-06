"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/modules/content/types";
import type { SiteImage } from "@/modules/content/types";

export default function HomePage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<Array<{ url: string; title?: string; titleEn?: string }>>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((p) => {
        setPosts(p.filter((post: Post) => post.status === "published").slice(0, 3));
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

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl animate-fade-in-up">
            {heroImages[currentSlide]?.title && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-sm font-semibold text-white">
                  {locale === "en" && heroImages[currentSlide]?.titleEn
                    ? heroImages[currentSlide].titleEn
                    : heroImages[currentSlide].title}
                </span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {locale === "fr" ? "S'informer." : "Inform."}
              <br />
              <span className="text-secondary">{locale === "fr" ? "Agir." : "Act."}</span>
              <br />
              {locale === "fr" ? "Progresser." : "Progress."}
            </h1>

            <p className="mt-5 text-lg text-white/70 max-w-lg leading-relaxed">
              {t.home.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/a-propos`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white text-sm font-semibold rounded-lg hover:bg-secondary-dark transition-colors cursor-pointer"
              >
                {t.home.cta}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/vie-aephat`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              >
                {locale === "fr" ? "Actualités" : "News"}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                i === currentSlide ? "bg-secondary" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: t.home.stats.members },
              { value: "15+", label: t.home.stats.events },
              { value: "10+", label: t.home.stats.projects },
              { value: "5+", label: t.home.stats.years },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl lg:text-4xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                {locale === "fr" ? "Notre mission" : "Our mission"}
              </p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                {locale === "fr"
                  ? "Représenter et défendre les étudiants en pharmacie du Togo"
                  : "Represent and defend pharmacy students of Togo"}
              </h2>
              <div className="w-12 h-1 bg-secondary rounded mt-5" />
              <p className="mt-5 text-gray-500 leading-relaxed max-w-lg">
                {locale === "fr"
                  ? "L'AEPHAT rassemble les étudiants en pharmacie autour de projets, d'événements et d'initiatives pour la santé publique au Togo."
                  : "AEPHAT brings together pharmacy students around projects, events, and public health initiatives in Togo."}
              </p>
              <Link
                href={`/${locale}/a-propos`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
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
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                {locale === "fr" ? "Actualités" : "News"}
              </p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">{t.home.news}</h2>
            </div>
            <Link
              href={`/${locale}/vie-aephat`}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              {locale === "fr" ? "Tout voir" : "View all"} →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">{t.common.loading}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} locale={locale} />
              ))}
            </div>
          )}

          <div className="mt-6 md:hidden text-center">
            <Link
              href={`/${locale}/vie-aephat`}
              className="text-primary font-semibold text-sm hover:underline cursor-pointer"
            >
              {locale === "fr" ? "Voir toutes les actualités →" : "View all news →"}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
            {locale === "fr" ? "Nous rejoindre" : "Join us"}
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
            {locale === "fr" ? "Tu étudies la pharmacie au Togo ?" : "Studying pharmacy in Togo?"}
          </h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            {locale === "fr"
              ? "Rejoins l'AEPHAT : entraide, projets santé publique, congrès, mentorat."
              : "Join AEPHAT: solidarity, public health projects, congress, mentoring."}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href={`/${locale}/a-propos`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white text-sm font-semibold rounded-lg hover:bg-secondary-dark transition-colors cursor-pointer"
            >
              {locale === "fr" ? "Découvrir l'association" : "Discover the association"} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
