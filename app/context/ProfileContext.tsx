"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ProfileId } from "../lib/types";

interface ProfileContextType {
  selectedProfile: ProfileId | null;
  selectProfile: (id: ProfileId) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId | null>(null);

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

  return (
    <ProfileContext.Provider value={{ selectedProfile, selectProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
