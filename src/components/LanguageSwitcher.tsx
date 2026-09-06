"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const getLocalizedPath = (targetLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
      <Link
        href={getLocalizedPath("fr")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          locale === "fr" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        FR
      </Link>
      <Link
        href={getLocalizedPath("en")}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          locale === "en" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
