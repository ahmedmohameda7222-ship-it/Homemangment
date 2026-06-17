"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Home } from "lucide-react";
import { useProfile } from "./context/ProfileContext";
import FamilyTreeLanding from "./components/FamilyTreeLanding";
import { getProfileTheme } from "./lib/profile-themes";
import type { ProfileId } from "./lib/types";

const PROFILE_ORDER: ProfileId[] = ["moustafa", "doaa", "ahmed", "sherien"];

export default function HomePage() {
  const { selectedProfile, initialized, selectProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (initialized && selectedProfile) {
      router.push("/dashboard");
    }
  }, [initialized, selectedProfile, router]);

  const handleSelectProfile = (id: ProfileId) => {
    selectProfile(id);
    router.push("/dashboard");
  };

  const handleEnterBeitna = () => {
    const profileSection = document.getElementById("profile-selection");
    profileSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!initialized) {
    return (
      <div className="min-h-full bg-linen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-linen">
      <FamilyTreeLanding onEnter={handleEnterBeitna} />

      <section id="profile-selection" className="min-h-full bg-linen flex flex-col scroll-mt-0">
        {/* Home Photo Area */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-olive/20 via-linen/40 to-linen" />
          <div className="absolute inset-0 bg-gradient-to-br from-olive/30 via-champagne/20 to-sky/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cream/80 backdrop-blur-sm border border-champagne/40 flex items-center justify-center mb-4 shadow-lg">
              <Home size={32} className="text-olive" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">Beitna Manager</h1>
            <p className="mt-2 text-navy-muted text-base sm:text-lg font-medium">Your family home, organized.</p>
          </div>
        </div>

        {/* Profile Selection */}
        <div className="flex-1 px-5 pb-8 -mt-4">
          <div className="max-w-md mx-auto">
            <p className="text-sm text-navy-muted font-medium mb-4 text-center">Select your profile</p>

            <div className="grid grid-cols-2 gap-3 stagger-children">
              {PROFILE_ORDER.map((id) => {
                const theme = getProfileTheme(id);
                if (!theme) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectProfile(id)}
                    className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-cream border border-warm-gray/60 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 active:scale-[0.97] overflow-hidden"
                  >
                    {/* Colored top accent line */}
                    <div
                      className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: theme.primary }}
                    />
                    {/* Subtle left glow on hover */}
                    <div
                      className="absolute -left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-cream shadow-md transition-transform duration-300 group-hover:scale-110 relative z-10"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {theme.displayName[0]}
                    </div>
                    <div className="text-center relative z-10">
                      <p
                        className="text-base font-semibold transition-colors"
                        style={{ color: theme.textAccent }}
                      >
                        {theme.displayName}
                      </p>
                      <p className="text-xs text-navy-muted mt-0.5">{theme.nickname}</p>
                      <p className="text-[10px] text-navy-muted/60 uppercase tracking-wider mt-1">{theme.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-navy-muted/50">
              <Users size={14} />
              <span className="text-xs">4 family members</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
