"use client";

import { getProfileTheme } from "../lib/profile-themes";
import type { ProfileId } from "../lib/types";

interface HeroBannerProps {
  profileId: ProfileId;
}

export default function HeroBanner({ profileId }: HeroBannerProps) {
  const theme = getProfileTheme(profileId);
  if (!theme) return null;

  switch (theme.heroType) {
    case "egyptian-food":
      return <MoustafaHero theme={theme} />;
    case "cats":
      return <DoaaHero theme={theme} />;
    case "living-room":
      return <AhmedHero theme={theme} />;
    case "ocean-coastal-home":
      return <SherienHero theme={theme} />;
    default:
      return null;
  }
}

function MoustafaHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-b-[2rem] shrink-0">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 35%, ${theme.secondary} 70%, ${theme.soft2} 100%)`,
        }}
      />
      {/* Subtle Egyptian pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 25% 75%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 75% 25%, rgba(255,255,255,0.25) 0%, transparent 40%)` }} />
      {/* Decorative shapes */}
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-20" style={{ background: theme.soft }} />
      <div className="absolute top-4 right-8 w-16 h-16 rounded-full opacity-15" style={{ background: theme.soft }} />
      <div className="absolute bottom-8 right-20 w-10 h-10 rounded-full opacity-20" style={{ background: theme.secondary }} />
      {/* Tea glass silhouette */}
      <div className="absolute bottom-10 right-6 opacity-20">
        <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
          <path d="M12 8h24l-4 32c0 4-4 8-8 8s-8-4-8-8L12 8z" fill="white" />
          <path d="M36 16c6 0 10 4 10 10s-4 10-10 10" stroke="white" strokeWidth="3" fill="none" />
        </svg>
      </div>
      {/* Bread / baladi silhouette */}
      <div className="absolute bottom-6 left-6 opacity-20">
        <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
          <ellipse cx="32" cy="20" rx="28" ry="16" fill="white" />
          <ellipse cx="32" cy="20" rx="20" ry="10" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/90 text-xs font-medium tracking-widest uppercase mb-1">Beitna Manager</p>
        <p className="text-white text-xl sm:text-2xl font-bold tracking-tight" style={{ textShadow: `0 2px 10px ${theme.primary}` }}>
          Warmth & tradition
        </p>
      </div>
    </div>
  );
}

function DoaaHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-b-[2rem] shrink-0">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${theme.primary} 0%, ${theme.accent} 40%, ${theme.secondary} 75%, ${theme.soft2} 100%)`,
        }}
      />
      {/* Soft daylight overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0%, transparent 40%)` }} />
      {/* Decorative soft circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15" style={{ background: theme.soft }} />
      <div className="absolute bottom-4 left-10 w-20 h-20 rounded-full opacity-15" style={{ background: theme.soft2 }} />
      <div className="absolute top-8 left-16 w-12 h-12 rounded-full opacity-20" style={{ background: theme.secondary }} />
      {/* Cat silhouette */}
      <div className="absolute bottom-6 right-10 opacity-20">
        <svg width="56" height="48" viewBox="0 0 56 48" fill="none">
          <ellipse cx="28" cy="32" rx="18" ry="14" fill="white" />
          <circle cx="20" cy="20" r="10" fill="white" />
          <polygon points="12,18 16,4 22,16" fill="white" />
          <polygon points="36,18 32,4 26,16" fill="white" />
          <ellipse cx="28" cy="40" rx="8" ry="6" fill="white" />
        </svg>
      </div>
      {/* Flower accent */}
      <div className="absolute top-6 left-6 opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="6" fill="white" />
          <circle cx="20" cy="8" r="5" fill="white" />
          <circle cx="20" cy="32" r="5" fill="white" />
          <circle cx="8" cy="20" r="5" fill="white" />
          <circle cx="32" cy="20" r="5" fill="white" />
        </svg>
      </div>
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/90 text-xs font-medium tracking-widest uppercase mb-1">Beitna Manager</p>
        <p className="text-white text-xl sm:text-2xl font-bold tracking-tight" style={{ textShadow: `0 2px 10px ${theme.primary}` }}>
          Peaceful & loving
        </p>
      </div>
    </div>
  );
}

function AhmedHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-b-[2rem] shrink-0">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${theme.primary} 0%, ${theme.accent} 35%, ${theme.secondary} 70%, ${theme.soft2} 100%)`,
        }}
      />
      {/* Sunlight overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 45%)` }} />
      {/* Minimal furniture shapes */}
      <div className="absolute bottom-0 left-8 right-8 h-16 opacity-15" style={{ background: `linear-gradient(90deg, transparent 0%, white 20%, white 80%, transparent 100%)`, borderRadius: "8px 8px 0 0" }} />
      <div className="absolute bottom-16 left-12 w-8 h-12 opacity-15" style={{ background: "white", borderRadius: "4px 4px 0 0" }} />
      <div className="absolute bottom-16 right-12 w-8 h-10 opacity-15" style={{ background: "white", borderRadius: "4px 4px 0 0" }} />
      {/* Plant silhouette */}
      <div className="absolute bottom-4 right-6 opacity-20">
        <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
          <rect x="20" y="36" width="8" height="18" rx="2" fill="white" />
          <ellipse cx="24" cy="28" rx="10" ry="14" fill="white" />
          <ellipse cx="18" cy="20" rx="8" ry="12" fill="white" />
          <ellipse cx="30" cy="22" rx="8" ry="12" fill="white" />
        </svg>
      </div>
      {/* Decorative circles */}
      <div className="absolute top-6 right-16 w-14 h-14 rounded-full opacity-15" style={{ background: theme.soft }} />
      <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15" style={{ background: theme.soft2 }} />
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/90 text-xs font-medium tracking-widest uppercase mb-1">Beitna Manager</p>
        <p className="text-white text-xl sm:text-2xl font-bold tracking-tight" style={{ textShadow: `0 2px 10px ${theme.primary}` }}>
          Calm & organized
        </p>
      </div>
    </div>
  );
}

function SherienHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-b-[2rem] shrink-0">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(170deg, ${theme.primary} 0%, ${theme.accent} 25%, ${theme.secondary} 55%, ${theme.sky || theme.soft2} 85%, ${theme.soft} 100%)`,
        }}
      />
      {/* Sky / sunlight overlay */}
      <div className="absolute inset-0 opacity-12" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.35) 0%, transparent 40%)` }} />
      {/* Wave layers */}
      <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 24C240 48 480 0 720 24C960 48 1200 0 1440 24V48H0V24Z" fill="white" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-15">
        <svg viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 16C360 32 720 0 1080 16C1260 24 1350 8 1440 16V32H0V16Z" fill="white" />
        </svg>
      </div>
      {/* Sun / palm circle */}
      <div className="absolute top-6 right-10 w-16 h-16 rounded-full opacity-20" style={{ background: "white" }} />
      {/* Coastal house shape */}
      <div className="absolute bottom-8 left-10 opacity-15">
        <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
          <polygon points="28,4 52,24 4,24" fill="white" />
          <rect x="10" y="24" width="36" height="18" rx="2" fill="white" />
          <rect x="18" y="30" width="8" height="10" rx="1" fill="white" fillOpacity="0.5" />
          <rect x="32" y="30" width="8" height="10" rx="1" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
      {/* Decorative circle */}
      <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-15" style={{ background: theme.soft }} />
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/90 text-xs font-medium tracking-widest uppercase mb-1">Beitna Manager</p>
        <p className="text-white text-xl sm:text-2xl font-bold tracking-tight" style={{ textShadow: `0 2px 10px ${theme.primary}` }}>
          Bright & fresh
        </p>
      </div>
    </div>
  );
}
