import fr from "./dictionaries/fr.json";
import en from "./dictionaries/en.json";

const dictionaries = { fr, en } as const;

export type Locale = keyof typeof dictionaries;

export const locales: Locale[] = ["fr", "en"];
export const defaultLocale: Locale = "fr";

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locale in dictionaries;
}
