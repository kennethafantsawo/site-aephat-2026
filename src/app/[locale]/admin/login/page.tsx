"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import { BRAND } from "@/lib/brand";

export default function AdminLoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ check: true }) })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace(`/${locale}/admin`);
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace(`/${locale}/admin`);
      } else {
        setError(locale === "fr" ? "Mot de passe incorrect" : "Invalid password");
        setPassword("");
      }
    } catch {
      setError(locale === "fr" ? "Erreur de connexion" : "Connection error");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <img src={BRAND.logoPath} alt="AEPHAT" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900">{t.admin.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {locale === "fr" ? "Connexion administrateur" : "Administrator login"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === "fr" ? "Mot de passe" : "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? t.common.loading : t.auth.loginBtn}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <a
              href={`/${locale}`}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              ← {locale === "fr" ? "Retour au site" : "Back to site"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
