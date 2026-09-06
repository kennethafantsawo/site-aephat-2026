"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { HealthSource } from "@/modules/content/types";

export default function SantePage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [items, setItems] = useState<HealthSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((h) => {
        setItems(h.filter((i: HealthSource) => i.isApproved));
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500">{t.common.loading}</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          {locale === "fr" ? "Sources vérifiées" : "Verified sources"}
        </p>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
          {t.sante.title}
        </h1>
        <div className="w-12 h-1 bg-primary rounded mt-4" />
        <p className="mt-4 text-gray-500 max-w-xl">{t.sante.description}</p>

        {items.length === 0 ? (
          <p className="text-gray-400 py-16 text-center">{t.sante.empty}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const title = locale === "en" && item.titleEn ? item.titleEn : item.title;
              const summary = locale === "en" && item.summaryEn ? item.summaryEn : item.summary;
              return (
                <article
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {item.sourceName}
                    </span>
                    <span className="text-xs text-gray-300">•</span>
                    <time className="text-xs text-gray-400">
                      {new Date(item.publishedDate).toLocaleDateString(
                        locale === "fr" ? "fr-FR" : "en-US"
                      )}
                    </time>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">{summary}</p>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
                  >
                    {locale === "fr" ? "Source" : "Source"} →
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
