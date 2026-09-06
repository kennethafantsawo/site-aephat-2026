"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import { BRAND } from "@/lib/brand";
import type { BureauMember } from "@/modules/content/types";

export default function AProposPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [bureau, setBureau] = useState<BureauMember[]>([]);

  useEffect(() => {
    fetch("/api/bureau").then((r) => r.json()).then((m) => setBureau(m));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          {locale === "fr" ? "À propos" : "About"}
        </p>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
          {t.about.title}
        </h1>
        <div className="w-12 h-1 bg-primary rounded mt-4" />

        <section className="mt-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t.about.mission}</h2>
            <p className="text-gray-500 leading-relaxed max-w-lg">{t.about.missionText}</p>
            <div className="mt-6">
              <a
                href="mailto:contact@aephat.tg"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
              >
                contact@aephat.tg →
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {locale === "fr" ? "Repères" : "At a glance"}
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <div className="text-2xl font-extrabold text-primary">200+</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {locale === "fr" ? "Membres" : "Members"}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary">FSS</div>
                  <div className="text-xs text-gray-500 mt-1">UL</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary">Lomé</div>
                  <div className="text-xs text-gray-500 mt-1">Togo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-200 my-12" />

        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-gray-900">{t.about.bureau}</h2>
            <span className="text-sm text-gray-400">
              {bureau.length} {locale === "fr" ? "membres" : "members"}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bureau.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <img src={BRAND.logoPath} alt="" className="w-6 h-6" />
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary font-medium mt-0.5">
                  {locale === "en" && member.roleEn ? member.roleEn : member.role}
                </p>
                {member.email && (
                  <p className="text-xs text-gray-400 mt-1">{member.email}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">{t.about.social}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Facebook", "X", "Instagram", "LinkedIn"].map((p) => (
              <a
                key={p}
                href="#"
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {p}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
