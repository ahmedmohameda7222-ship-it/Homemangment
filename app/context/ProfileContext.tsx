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

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("beitna-profile") as ProfileId | null;
      if (saved && ["moustafa", "doaa", "ahmed", "sherien"].includes(saved)) {
        return saved;
      }
    }
    return null;
  });
  const initialized = true; // Profile is initialized synchronously via lazy useState

  const selectProfile = useCallback((id: ProfileId) => {
    setSelectedProfile(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("beitna-profile", id);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setSelectedProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("beitna-profile");
    }
  }, []);

  const theme = getProfileTheme(selectedProfile);
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
