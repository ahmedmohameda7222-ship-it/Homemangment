"use client";

import { LogOut } from "lucide-react";
import { getProfileTheme } from "../lib/profile-themes";
import type { ProfileId, ProfileTheme } from "../lib/types";

interface HeroBannerProps {
  profileId: ProfileId;
  onSwitchProfile?: () => void;
}

export default function HeroBanner({ profileId, onSwitchProfile }: HeroBannerProps) {
  const theme = getProfileTheme(profileId);

  return (
    <section className="relative overflow-hidden rounded-b-[2rem] bg-[var(--surface)] shadow-[0_20px_50px_rgba(26,26,46,0.10)]">
      <div className="relative h-[218px] sm:h-[260px] lg:h-[286px] isolate">
        <img
          src={theme.heroImage}
          alt={`${theme.displayName} hero banner`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: theme.heroObjectPosition ?? "center center" }}
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/28 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-linen via-linen/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linen rounded-t-[55%] translate-y-8" />

        <div className="absolute left-5 top-5 sm:left-8 sm:top-7 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
            {theme.nickname} / {theme.role}
          </p>
          <h1 className="mt-1 max-w-[310px] text-2xl sm:text-3xl font-bold leading-tight">
            {getHeroTitle(theme)}
          </h1>
          <p className="mt-2 max-w-[320px] text-xs sm:text-sm text-white/88 leading-relaxed">
            {getHeroSubtitle(theme)}
          </p>
        </div>

        {onSwitchProfile && (
          <button
            onClick={onSwitchProfile}
            className="absolute right-5 top-5 sm:right-8 sm:top-7 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/88 text-navy shadow-[0_8px_24px_rgba(0,0,0,0.14)] backdrop-blur transition hover:bg-white active:scale-95 profile-focus"
            title="Switch profile"
            aria-label="Switch profile"
          >
            <LogOut size={19} style={{ color: theme.primary }} />
          </button>
        )}
      </div>
    </section>
  );
}

function getHeroTitle(theme: ProfileTheme) {
  switch (theme.heroType) {
    case "egyptian-food":
      return "Warm Egyptian home taste";
    case "cats":
      return "Peaceful blue comfort";
    case "living-room":
      return "Calm organized living";
    case "ocean-coastal-home":
      return "Strong turquoise ocean";
  }
}

function getHeroSubtitle(theme: ProfileTheme) {
  switch (theme.heroType) {
    case "egyptian-food":
      return "Rich food, tea, and a mature family mood.";
    case "cats":
      return "Soft cats, clean daylight, and a true-blue calm mood.";
    case "living-room":
      return "A grounded premium home overview with olive accents.";
    case "ocean-coastal-home":
      return "Bright coastal energy with clean turquoise details.";
  }
}
