import { type Locale, getDictionary } from "@/lib/i18n";
import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { Share2, ArrowUpRight, Globe, AtSign, Briefcase, MessageCircle } from "lucide-react";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="relative overflow-hidden bg-[#0A2E18] text-white mt-10">
      <div className="absolute -top-24 left-1/4 w-[500px] h-[300px] bg-[#1FA34A]/30 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="glass-dark rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#5AC878]">
              <span className="live-dot" /> {locale === "fr" ? "Rejoignez l'association" : "Join the association"}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">
              {locale === "fr" ? "La pharmacie togolaise s'écrit ensemble." : "Togolese pharmacy is written together."}
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/vie-aephat`} className="btn-primary">{t.nav.vieAephat}</Link>
            <Link href={`/${locale}/partager`} className="btn-ghost !bg-white/10 !text-white !border-white/20 hover:!border-white/50">
              <Share2 className="w-4 h-4" />
              {locale === "fr" ? "Partager le site" : "Share the site"}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-11 h-11 rounded-2xl bg-white grid place-items-center overflow-hidden">
                <img src={BRAND.logo} alt="AEPHAT" className="w-9 h-9 object-contain" />
              </span>
              <div>
                <h3 className="font-display text-lg font-extrabold">AEPHAT</h3>
                <p className="text-xs text-white/60">{locale === "fr" ? "Étudiants en Pharmacie du Togo" : "Pharmacy Students of Togo"}</p>
              </div>
            </div>
            <p className="text-sm text-white/65 max-w-md leading-relaxed">
              {locale === "fr"
                ? "Actualités AEPHAT, veille Santé OMS et VIDAL, sondages et vie associative des étudiants en pharmacie."
                : "AEPHAT news, WHO and VIDAL health watch, polls and community life of pharmacy students."}
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: Globe, label: "Facebook" },
                { icon: AtSign, label: "Instagram" },
                { icon: Briefcase, label: "LinkedIn" },
                { icon: MessageCircle, label: "WhatsApp" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-10 h-10 grid place-items-center rounded-xl bg-white/10 border border-white/15 text-white/80 hover:bg-[#1FA34A] hover:text-white hover:border-transparent transition-all">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-white/50 mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li><Link href={`/${locale}`} className="hover:text-[#5AC878] transition-colors">{t.nav.home}</Link></li>
              <li><Link href={`/${locale}/vie-aephat`} className="hover:text-[#5AC878] transition-colors">{t.nav.vieAephat}</Link></li>
              <li><Link href={`/${locale}/sante`} className="hover:text-[#5AC878] transition-colors">{t.nav.sante}</Link></li>
              <li><Link href={`/${locale}/a-propos`} className="hover:text-[#5AC878] transition-colors">{t.nav.about}</Link></li>
              <li><Link href={`/${locale}/partager`} className="inline-flex items-center gap-1 hover:text-[#5AC878] transition-colors"><Share2 className="w-3.5 h-3.5" />{locale === "fr" ? "Partager" : "Share"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-white/50 mb-4">Contact</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              FSS — Université de Lomé<br />Lomé, Togo<br />
              <a href="mailto:contact@aephat.tg" className="text-[#5AC878] font-semibold hover:underline inline-flex items-center gap-1">contact@aephat.tg <ArrowUpRight className="w-3.5 h-3.5" /></a>
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
              <span className="live-dot" /> OMS — VIDAL — FSS
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/45">
          <p>© {new Date().getFullYear()} AEPHAT — Lomé, Togo</p>
          <p>{locale === "fr" ? "Données OMS et VIDAL citées avec sources officielles" : "WHO and VIDAL data cited with official sources"}</p>
        </div>
      </div>
    </footer>
  );
}
