"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { isContentReadOnly, CMS_URL } from "@/lib/site";

/**
 * Bandeau affiché dans l'admin interne quand les formulaires de contenu
 * sont désactivés (production) : renvoie vers Decap CMS, seule voie
 * d'édition durable (commits GitHub versionnés).
 * Rendu nul en développement (édition locale autorisée).
 */
export function ReadOnlyBanner() {
  if (!isContentReadOnly()) return null;

  return (
    <div className="mb-6 rounded-xl border border-[#D4A843]/50 bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <span className="w-10 h-10 shrink-0 rounded-xl bg-[#101418] text-white grid place-items-center">
        <Lock className="w-4 h-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-extrabold text-[#101418]">
          Édition désactivée en production
        </p>
        <p className="text-[13px] text-[#5A6570] mt-0.5">
          Les écritures directes seraient perdues (hébergement serverless).
          Modifie ce contenu dans le CMS : chaque publication est versionnée
          sur GitHub puis redéployée automatiquement.
        </p>
      </div>
      <Link
        href={CMS_URL}
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0C6B2D] text-white text-[13px] font-bold rounded-full hover:brightness-110 transition-all"
      >
        Ouvrir le CMS
      </Link>
    </div>
  );
}
