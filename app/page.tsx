"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Users } from "lucide-react";
import { useProfile } from "./context/ProfileContext";
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

  if (!initialized) {
    return (
      <div className="min-h-full bg-linen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-linen flex flex-col">
      <section className="relative min-h-[330px] overflow-hidden rounded-b-[2.5rem] shadow-[0_20px_50px_rgba(26,26,46,0.10)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#EAF8FF_0%,#DDF7FA_34%,#F7F3EA_68%,#EADBDC_100%)]" />
        <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.95), transparent 34%), radial-gradient(circle at 88% 16%, rgba(1,222,227,0.32), transparent 34%), radial-gradient(circle at 12% 82%, rgba(122,46,58,0.16), transparent 30%)" }} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M0 282C190 240 330 288 520 250C760 202 945 238 1200 190V420H0Z" fill="#FFFFFF" opacity="0.45" />
          <path d="M0 320C210 280 380 335 610 292C825 252 1010 282 1200 245" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="9" strokeLinecap="round" />
          <g filter="drop-shadow(0 22px 34px rgba(26,26,46,0.16))">
            <rect x="462" y="156" width="276" height="142" rx="14" fill="#FFFFFF" />
            <rect x="493" y="194" width="64" height="78" rx="7" fill="#ECF3FF" />
            <rect x="586" y="194" width="92" height="64" rx="7" fill="#DDF7FA" />
            <path d="M430 164L599 72L772 164Z" fill="#F8FBFF" />
            <path d="M456 164L599 92L745 164" stroke="#0178CD" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="680" cy="122" r="17" fill="#01D2E7" opacity="0.55" />
            <rect x="450" y="298" width="310" height="18" rx="9" fill="#CFEFFF" />
          </g>
          <g opacity="0.42">
            <path d="M210 124C248 91 302 93 338 128" stroke="#0178CD" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M842 102C885 63 948 65 992 110" stroke="#7A2E3A" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M904 152C930 128 970 130 998 156" stroke="#667A53" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        </svg>
        <div className="relative z-10 flex min-h-[330px] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="w-20 h-20 rounded-[1.75rem] bg-white/80 backdrop-blur border border-white/80 flex items-center justify-center mb-5 shadow-lg">
            <Home size={38} className="text-[#0178CD]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-navy tracking-tight">Beitna Manager</h1>
          <p className="mt-3 text-navy-muted text-base sm:text-lg font-medium">Your family home, organized.</p>
        </div>
      </section>

      <main className="flex-1 px-5 pb-10 -mt-8 relative z-20">
        <div className="max-w-3xl mx-auto rounded-[2rem] bg-cream/96 border border-white/80 shadow-[0_18px_44px_rgba(26,26,46,0.08)] p-5 sm:p-6">
          <div className="flex items-center justify-center gap-2 text-navy-muted mb-5">
            <Users size={16} />
            <p className="text-sm font-medium">Select your profile</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
            {PROFILE_ORDER.map((id) => {
              const theme = getProfileTheme(id);
              if (!theme) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleSelectProfile(id)}
                  className="group relative overflow-hidden flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-warm-gray/60 hover:shadow-xl transition-all duration-300 active:scale-[0.97]"
                  style={{ "--profile-hover-border": theme.primary } as React.CSSProperties}
                >
                  <div className="absolute inset-x-0 top-0 h-1 opacity-80" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }} />
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-cream shadow-md transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
                  >
                    {theme.displayName[0]}
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold transition-colors" style={{ color: theme.textAccent }}>
                      {theme.displayName}
                    </p>
                    <p className="text-xs text-navy-muted mt-0.5">{theme.nickname}</p>
                    <p className="text-[10px] text-navy-muted/60 uppercase tracking-wider mt-1">{theme.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
