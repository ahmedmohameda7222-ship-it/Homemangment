"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Home } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { getProfileTheme } from "../lib/profile-themes";
import type { ProfileId } from "../lib/types";

const PROFILE_ORDER: ProfileId[] = ["moustafa", "doaa", "ahmed", "sherien"];

export default function ProfilesPage() {
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

  if (!initialized) {
    return (
      <div className="min-h-full bg-linen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-full bg-linen flex flex-col">
      <section className="relative h-56 sm:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-olive/20 via-linen/40 to-linen" />
        <div className="absolute inset-0 bg-gradient-to-br from-olive/30 via-champagne/20 to-sky/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cream/80 backdrop-blur-sm border border-champagne/40 flex items-center justify-center mb-4 shadow-lg">
            <Home size={32} className="text-olive" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">Beitna Manager</h1>
          <p className="mt-2 text-navy-muted text-base sm:text-lg font-medium">Your family home, organized.</p>
        </div>
      </section>

      <section className="flex-1 px-5 pb-8 -mt-4">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-navy-muted font-medium mb-4 text-center">Select your profile</p>

          <div className="grid grid-cols-2 gap-3 stagger-children">
            {PROFILE_ORDER.map((id) => {
              const theme = getProfileTheme(id);
              return (
                <button
                  key={id}
                  onClick={() => handleSelectProfile(id)}
                  className="group relative flex flex-col items-stretch rounded-2xl bg-cream border border-warm-gray/60 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 active:scale-[0.97] overflow-hidden profile-focus"
                >
                  <div className="relative h-20 overflow-hidden">
                    <img
                      src={theme.heroImage}
                      alt="Profile hero preview"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: theme.heroObjectPosition ?? "center center" }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    <div
                      className="absolute right-3 bottom-3 w-3 h-3 rounded-full ring-2 ring-white/90"
                      style={{ backgroundColor: theme.primary }}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3 p-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-cream shadow-md transition-transform duration-300 group-hover:scale-105 relative z-10 ring-4 ring-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {theme.displayName[0]}
                    </div>
                    <div className="text-center relative z-10">
                      <p className="text-base font-semibold transition-colors" style={{ color: theme.textAccent }}>
                        {theme.displayName}
                      </p>
                      <p className="text-xs text-navy-muted mt-0.5">{theme.nickname}</p>
                      <p className="text-[10px] text-navy-muted/60 uppercase tracking-wider mt-1">{theme.role}</p>
                    </div>
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
      </section>
    </main>
  );
}
