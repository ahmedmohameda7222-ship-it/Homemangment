"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useProfile } from "./ProfileContext";
import type { AppLanguage } from "../lib/i18n-runtime";
import { translateText } from "../lib/i18n-runtime";
import { watchDomTranslations } from "../lib/dom-translate";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (text: string | undefined | null) => string;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const GLOBAL_LANGUAGE_KEY = "beitna-language-default";

function getProfileLanguageKey(profileId: string | null | undefined) {
  return profileId ? `beitna-language-${profileId}` : GLOBAL_LANGUAGE_KEY;
}

function readLanguage(profileId: string | null | undefined): AppLanguage {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(getProfileLanguageKey(profileId));
  return saved === "ar" ? "ar" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { selectedProfile } = useProfile();
  const [language, setLanguageState] = useState<AppLanguage>("en");

  useEffect(() => {
    setLanguageState(readLanguage(selectedProfile));
  }, [selectedProfile]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language === "ar" ? "ar-EG" : "en";
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.dir = language === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", language === "ar");
    return watchDomTranslations(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem(getProfileLanguageKey(selectedProfile), nextLanguage);
    }
  }, [selectedProfile]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ar" ? "en" : "ar");
  }, [language, setLanguage]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t: (text) => translateText(text, language),
    isArabic: language === "ar",
  }), [language, setLanguage, toggleLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
