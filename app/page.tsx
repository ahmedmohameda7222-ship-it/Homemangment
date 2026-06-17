"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Home } from "lucide-react";
import { useProfile } from "./context/ProfileContext";
import { PROFILES } from "./lib/constants";
import type { ProfileId } from "./lib/types";

export default function HomePage() {
  const { selectProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("beitna-profile");
    if (saved) {
      selectProfile(saved as ProfileId);
      router.push("/dashboard");
    }
  }, [selectProfile, router]);

  const handleSelectProfile = (id: ProfileId) => {
    selectProfile(id);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-full bg-linen flex flex-col">
      {/* Home Photo Area */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
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
            {PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSelectProfile(profile.id)}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-cream border border-warm-gray/60 hover:border-champagne/60 hover:shadow-lg hover:shadow-champagne/10 transition-all duration-300 active:scale-[0.97]"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-cream shadow-md transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: profile.color }}
                >
                  {profile.name[0]}
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-navy group-hover:text-olive transition-colors">{profile.name}</p>
                  <p className="text-xs text-navy-muted mt-0.5">{profile.nickname}</p>
                  <p className="text-[10px] text-navy-muted/60 uppercase tracking-wider mt-1">{profile.role}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-navy-muted/50">
            <Users size={14} />
            <span className="text-xs">4 family members</span>
          </div>
        </div>
      </div>
    </div>
  );
}
