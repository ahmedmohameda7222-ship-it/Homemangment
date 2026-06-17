"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ProfileId } from "../lib/types";
import { getProfileTheme, getProfileThemeCSS } from "../lib/profile-themes";

interface ProfileContextType {
  selectedProfile: ProfileId | null;
  selectProfile: (id: ProfileId) => void;
  clearProfile: () => void;
  initialized: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);
const VALID_PROFILE_IDS: ProfileId[] = ["moustafa", "doaa", "ahmed", "sherien"];
export const PROFILE_SWITCH_REDIRECT_KEY = "beitna-profile-switch-redirect";

function normalizeSavedProfile(value: string | null): ProfileId | null {
  if (!value) return null;
  if (value === "sherieen") return "sherien";
  return VALID_PROFILE_IDS.includes(value as ProfileId) ? (value as ProfileId) : null;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId | null>(() => {
    if (typeof window === "undefined") return null;

    const normalized = normalizeSavedProfile(localStorage.getItem("beitna-profile"));
    if (normalized) {
      localStorage.setItem("beitna-profile", normalized);
    }
    return normalized;
  });
  const initialized = true;

  const selectProfile = useCallback((id: ProfileId) => {
    setSelectedProfile(id);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(PROFILE_SWITCH_REDIRECT_KEY, "0");
      localStorage.setItem("beitna-profile", id);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setSelectedProfile(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(PROFILE_SWITCH_REDIRECT_KEY, "1");
      localStorage.setItem("beitna-profile", "");
    }
  }, []);

  const theme = selectedProfile ? getProfileTheme(selectedProfile) : null;
  const cssVars = getProfileThemeCSS(theme);

  return (
    <ProfileContext.Provider value={{ selectedProfile, selectProfile, clearProfile, initialized }}>
      <div className="min-h-full" style={cssVars}>
        {children}
      </div>
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
