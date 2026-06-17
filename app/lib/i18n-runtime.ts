import { coreArabic, type AppLanguage } from "./i18n";
import { extraArabic } from "./i18n-extra";

export type { AppLanguage };

const dictionary: Record<string, string> = { ...coreArabic, ...extraArabic };

export function translateText(text: string | undefined | null, language: AppLanguage): string {
  if (!text) return "";
  if (language === "en") return text;
  return dictionary[text] ?? text;
}

export function isArabic(language: AppLanguage) {
  return language === "ar";
}
