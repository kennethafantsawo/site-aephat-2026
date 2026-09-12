"use client";

import { useEffect, useState, useRef } from "react";

interface HeroProps {
  locale: string;
  heroImages: Array<{ url: string; title?: string; titleEn?: string }>;
}

export function DynamicHero({ locale, heroImages }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  useEffect(() => {
    if (heroImages.length <= 1) return;
    slideInterval.current = setInterval(nextSlide, 5000);
    return () => { if (slideInterval.current) clearInterval(slideInterval.current); };
  }, [heroImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section
      className="relative h-[600px] lg:h-[700px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-light rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-secondary-light rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.8s" }} />
        </div>
      </div>

      {/* Slides */}
      {heroImages.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={img.url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Floating Badge */}
      {heroImages[currentSlide]?.title && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up">
          <div className="glass px-6 py-3 rounded-full flex items-center gap-3">
            <span className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
            <span className="text-white font-semibold text-sm">
              {locale === "en" && heroImages[currentSlide]?.titleEn
                ? heroImages[currentSlide].titleEn
                : heroImages[currentSlide].title}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-3xl">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
              {locale === "fr" ? "S'informer." : "Inform."}
              <br />
              <span className="text-secondary">{locale === "fr" ? "Agir." : "Act."}</span>
              <br />
              {locale === "fr" ? "Progresser." : "Progress."}
              <br />
              <span className="text-sm opacity-80 block mt-2">— Association des Étudiants en Pharmacie du Togo</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed">
              {locale === "fr"
                ? "Rejoins une communauté d'étudiants passionnés. Ensemble, formons-nous, agissons pour la santé publique, et construisons l'avenir de la pharmacie au Togo."
                : "Join a community of passionate students. Together, let's train, act for public health, and build the future of pharmacy in Togo."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`/${locale}/a-propos`}
                className="btn-interactive inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-all shadow-lg hover:shadow-xl"
              >
                {locale === "fr" ? "Découvrir l'association" : "Discover the association"}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href={`/${locale}/vie-aephat`}
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                {locale === "fr" ? "Actualités" : "News"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-secondary w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev/Next Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        aria-label="Previous slide"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        aria-label="Next slide"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
