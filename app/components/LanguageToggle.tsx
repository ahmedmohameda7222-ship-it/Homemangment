"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";
import { getProfileTheme } from "../lib/profile-themes";

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, toggleLanguage } = useLanguage();
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
  const nextLabel = language === "ar" ? "EN" : "عربي";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl border bg-cream font-semibold transition-opacity hover:opacity-85 profile-focus"
      style={{
        borderColor: theme.primary + "28",
        color: theme.primary,
        minWidth: compact ? 42 : 68,
        height: compact ? 36 : 40,
        paddingInline: compact ? 8 : 12,
        fontSize: compact ? 11 : 12,
      }}
      title="Language"
      aria-label="Toggle language"
    >
      {!compact && <Languages size={15} />}
      <span>{nextLabel}</span>
    </button>
  );
}
