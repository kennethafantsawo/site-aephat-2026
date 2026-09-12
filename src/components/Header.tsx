"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/vie-aephat`, label: t.nav.vieAephat },
    { href: `/${locale}/sante`, label: t.nav.sante },
    { href: `/${locale}/a-propos`, label: t.nav.about },
  ];

  const handleLogout = () => setUser(null);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        {/* Animated border line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 cursor-pointer group">
              <img src={BRAND.logo} alt="AEPHAT" className="h-8 w-auto drop-shadow-sm" />
              <div className="flex flex-col">
                <span className="text-[17px] font-bold tracking-tight text-primary-dark leading-none">
                  AEPHAT
                </span>
                <span className="text-[10px] font-medium text-secondary leading-none mt-0.5 hidden sm:block">
                  Étudiants en Pharmacie du Togo
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer relative overflow-hidden ${
                      active
                        ? "text-primary"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitcher locale={locale} />
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {t.nav.login}
                </button>
              )}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 pt-2 border-t border-gray-100 space-y-1 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="px-3 py-2.5">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-xs text-red-500 cursor-pointer">{t.nav.logout}</button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                  className="w-full px-3 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  {t.nav.login}
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {showLogin && (
        <MemberAuthModal
          locale={locale}
          onClose={() => setShowLogin(false)}
          onLogin={(u) => setUser(u)}
        />
      )}
    </>
  );
}
