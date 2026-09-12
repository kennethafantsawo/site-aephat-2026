import { type Locale, getDictionary } from "@/lib/i18n";
import { BRAND } from "@/lib/brand";
import Link from "next/link";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={BRAND.logo} alt="AEPHAT" className="h-8 w-auto brightness-0 invert" />
              <div>
                <h3 className="text-base font-bold">AEPHAT</h3>
                <p className="text-xs text-gray-400">Étudiants en Pharmacie du Togo</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {locale === "fr"
                ? "S'informer. Agir. Progresser. L'AEPHAT rassemble les étudiants en pharmacie du Togo."
                : "Inform. Act. Progress. AEPHAT brings together pharmacy students of Togo."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors cursor-pointer">{t.nav.home}</Link></li>
              <li><Link href={`/${locale}/vie-aephat`} className="hover:text-white transition-colors cursor-pointer">{t.nav.vieAephat}</Link></li>
              <li><Link href={`/${locale}/sante`} className="hover:text-white transition-colors cursor-pointer">{t.nav.sante}</Link></li>
              <li><Link href={`/${locale}/a-propos`} className="hover:text-white transition-colors cursor-pointer">{t.nav.about}</Link></li>
              <li><Link href={`/${locale}/partager`} className="hover:text-white transition-colors cursor-pointer">
                {locale === "fr" ? "📤 Partager le site" : "📤 Share site"}
              </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Faculté des Sciences de la Santé<br />
              Université de Lomé, Togo<br />
              <a href="mailto:contact@aephat.tg" className="underline underline-offset-2 hover:text-white cursor-pointer">contact@aephat.tg</a>
            </p>
            <div className="mt-4 flex gap-2">
              {["FB", "IG", "X", "LI"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 grid place-items-center border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-[10px] font-bold cursor-pointer"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} AEPHAT &middot; Lomé, Togo</p>
          <p>{locale === "fr" ? "Fait avec rigueur à la Faculté des Sciences de la Santé" : "Crafted with rigor at the Faculty of Health Sciences"}</p>
        </div>
      </div>
    </footer>
  );
}
