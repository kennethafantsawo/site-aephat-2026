"use client";

import { useEffect, useState } from "react";

interface HealthTip {
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  icon: string;
}

const healthTips: HealthTip[] = [
  {
    title: "Hygiène des mains",
    titleEn: "Hand hygiene",
    content: "Lavez-vous les mains pendant 30 secondes au minimum avec du savon.",
    contentEn: "Wash your hands for at least 30 seconds with soap.",
    icon: "🧼",
  },
  {
    title: "Prévention du paludisme",
    titleEn: "Malaria prevention",
    content: "Utilisez toujours une moustiquaire imprégnée d'insecticide.",
    contentEn: "Always use an insecticide-treated mosquito net.",
    icon: "🦟",
  },
  {
    title: "Hydratation",
    titleEn: "Hydration",
    content: "Buvez au moins 1,5L d'eau par jour, surtout en saison chaude.",
    contentEn: "Drink at least 1.5L of water per day, especially in hot season.",
    icon: "💧",
  },
  {
    title: "Activité physique",
    titleEn: "Physical activity",
    content: "30 minutes d'activité physique modérée par jour.",
    contentEn: "30 minutes of moderate physical activity per day.",
    icon: "🏃",
  },
];

interface HealthTickerProps {
  locale: string;
}

export function HealthTicker({ locale }: HealthTickerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % healthTips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const tip = healthTips[index];

  return (
    <section className="py-12 bg-gradient-to-r from-primary to-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-dark rounded-2xl p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-transparent" />

          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                {tip.icon}
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-2">
                {locale === "fr" ? "Conseil du jour" : "Tip of the day"}
              </p>
              <h3 className="text-2xl font-extrabold text-white mb-3">
                {locale === "fr" ? tip.title : tip.titleEn}
              </h3>
              <p className="text-white/80 max-w-2xl">
                {locale === "fr" ? tip.content : tip.contentEn}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="flex gap-2">
                {healthTips.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === index ? "bg-secondary w-6" : "bg-white/30"
                    }`}
                    aria-label={`Tip ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
            <div
              className="h-full bg-secondary transition-all duration-6000 ease-linear"
              style={{
                width: `${((index + 1) / healthTips.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
