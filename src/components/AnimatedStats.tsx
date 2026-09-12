"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
  icon?: string;
}

interface AnimatedStatsProps {
  stats: StatItem[];
  className?: string;
}

export function AnimatedStats({ stats, className }: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [counted, setCounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !counted) {
      const timer = setTimeout(() => setCounted(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, counted]);

  return (
    <section className={`bg-white border-b border-gray-100 relative overflow-hidden ${className || ""}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Background Pattern */}
        <div className="absolute top-4 right-4 opacity-5">
          <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="group relative"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute -inset-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative p-6 rounded-xl">
                <div className="text-4xl lg:text-5xl font-extrabold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {counted ? stat.value : "0+"}
                </div>
                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                {stat.icon && (
                  <div className="text-2xl mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {stat.icon}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
