"use client";

import { LogOut } from "lucide-react";
import { getProfileTheme } from "../lib/profile-themes";
import type { ProfileId } from "../lib/types";

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

        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/12" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-linen via-linen/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linen rounded-t-[55%] translate-y-8" />

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
