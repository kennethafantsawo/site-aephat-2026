"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Share2 } from "lucide-react";
import { type Locale, getDictionary } from "@/lib/i18n";
import { BRAND } from "@/lib/brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MemberAuthModal } from "./MemberAuthModal";

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/vie-aephat`, label: t.nav.vieAephat },
    { href: `/${locale}/sante`, label: t.nav.sante },
    { href: `/${locale}/a-propos`, label: t.nav.about },
  ];

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[60] bg-[#0A2E18] text-white/90 text-[12.5px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 truncate">
            <span className="live-dot" />
            <span className="truncate">
              {locale === "fr"
                ? "Association des Étudiants en Pharmacie du Togo — Lomé"
                : "Association of Pharmacy Students of Togo — Lomé"}
            </span>
          </p>
          <Link href={`/${locale}/partager`} className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#5AC878] transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            {locale === "fr" ? "Partager" : "Share"}
          </Link>
        </div>
      </div>

      <header className={`fixed top-9 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-3"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`glass rounded-2xl px-3 sm:px-4 h-14 flex items-center justify-between gap-2 ${scrolled ? "shadow-xl" : "shadow-lg"}`}>
            <Link href={`/${locale}`} className="flex items-center gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-xl overflow-hidden bg-white grid place-items-center shadow shrink-0 border border-[#E2E8E6]">
                <img src={BRAND.logo} alt="AEPHAT" className="w-7 h-7 object-contain" />
              </span>
              <span className="leading-none min-w-0">
                <span className="font-display font-extrabold tracking-tight text-[#101418] block text-[16px]">
                  AEPHAT
                </span>
                <span className="text-[10.5px] font-semibold text-[#0C6B2D] hidden sm:block truncate">
                  {locale === "fr" ? "Pharmacie — Lomé, Togo" : "Pharmacy — Lomé, Togo"}
                </span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 bg-[#F2F5F3] rounded-full p-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-[13.5px] font-bold rounded-full transition-all ${
                      active ? "bg-[#101418] text-white shadow" : "text-[#3A454E] hover:bg-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitcher locale={locale} />
              {user ? (
                <span className="hidden md:inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#F2F5F3] text-[13px] font-bold text-[#101418]">
                  <span className="w-7 h-7 rounded-full bg-[#1FA34A] text-white grid place-items-center text-xs">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <button onClick={() => setUser(null)} aria-label="Logout"><X className="w-3.5 h-3.5 text-[#5A6570] hover:text-red-600" /></button>
                </span>
              ) : (
                <button onClick={() => setShowLogin(true)} className="btn-primary !py-2.5 !px-4 hidden md:inline-flex text-[13.5px]">
                  {t.nav.login}
                </button>
              )}
              <button
                className="lg:hidden w-10 h-10 grid place-items-center rounded-xl bg-[#101418] text-white"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden mt-2 glass rounded-2xl p-2 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-bold rounded-xl ${pathname === link.href ? "bg-[#101418] text-white" : "text-[#101418] hover:bg-[#F2F5F3]"}`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                  className="btn-primary w-full justify-center mt-1"
                >
                  {t.nav.login}
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {showLogin && (
        <MemberAuthModal locale={locale} onClose={() => setShowLogin(false)} onLogin={(u) => setUser(u)} />
      )}
    </>
  );
}
