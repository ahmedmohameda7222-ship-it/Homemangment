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

/* ─── Shared helpers ─── */

const BottomBlend = () => (
  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F7F3EA] to-transparent z-20 pointer-events-none" />
);

const GrainOverlay = () => (
  <div
    className="absolute inset-0 z-[5] opacity-[0.035] pointer-events-none mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }}
  />
);

/* ─── Moustafa — Egyptian Food / Deep Burgundy ─── */

function MoustafaHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-b-[2.5rem] shrink-0 select-none">
      {/* Layer 1: deep burgundy base */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${theme.primary} 0%, #4A1A25 40%, ${theme.accent} 70%, ${theme.secondary} 100%)` }} />

      {/* Layer 2: warm radial glow from top-left */}
      <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full opacity-25" style={{ background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)` }} />

      {/* Layer 3: warm table surface at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
        <svg viewBox="0 0 400 100" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 60 Q 100 30, 200 50 Q 300 70, 400 40 L 400 100 L 0 100 Z" fill="white" />
        </svg>
      </div>

      {/* Layer 4: decorative plate with geometric pattern */}
      <div className="absolute bottom-8 left-[10%] opacity-15">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="50" r="36" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="24" stroke="white" strokeWidth="0.8" fill="none" />
          <circle cx="50" cy="50" r="12" fill="white" opacity="0.3" />
          {/* small food dots */}
          <circle cx="42" cy="42" r="3" fill="white" opacity="0.4" />
          <circle cx="58" cy="44" r="2.5" fill="white" opacity="0.4" />
          <circle cx="50" cy="56" r="3.5" fill="white" opacity="0.4" />
          <circle cx="46" cy="50" r="2" fill="white" opacity="0.4" />
        </svg>
      </div>

      {/* Layer 5: tea glass with handle */}
      <div className="absolute bottom-10 right-[12%] opacity-20">
        <svg width="44" height="64" viewBox="0 0 44 64" fill="none">
          <path d="M12 8h20l-3 38c0 3-3 6-7 6s-7-3-7-6L12 8z" stroke="white" strokeWidth="1.5" fill="white" fillOpacity="0.15" />
          <path d="M32 16c5 0 8 3 8 8s-3 8-8 8" stroke="white" strokeWidth="1.5" fill="none" />
          {/* tea liquid line */}
          <path d="M13 24h18" stroke="white" strokeWidth="0.8" opacity="0.5" />
          {/* steam wisps */}
          <path d="M18 4c2-3 0-6 2-8" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <path d="M26 4c-1-3 1-6 0-8" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </svg>
      </div>

      {/* Layer 6: baladi bread shapes */}
      <div className="absolute bottom-14 left-[35%] opacity-15">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
          <ellipse cx="28" cy="22" rx="22" ry="12" fill="white" />
          <ellipse cx="28" cy="22" rx="14" ry="7" stroke="white" strokeWidth="1" fill="none" />
          <ellipse cx="56" cy="20" rx="20" ry="11" fill="white" opacity="0.6" />
          <ellipse cx="56" cy="20" rx="12" ry="6" stroke="white" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* Layer 7: warm light rays from left */}
      <div className="absolute top-0 left-0 w-40 h-full opacity-[0.06]" style={{ background: `linear-gradient(90deg, white 0%, transparent 100%)` }} />

      {/* Layer 8: floating decorative circle */}
      <div className="absolute top-8 right-[25%] w-16 h-16 rounded-full opacity-10" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />

      <GrainOverlay />
      <BottomBlend />
    </div>
  );
}

/* ─── Doaa — Elegant Cats / True Blue ─── */

function DoaaHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-b-[2.5rem] shrink-0 select-none">
      {/* Layer 1: strong blue base */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(170deg, ${theme.accent} 0%, ${theme.primary} 35%, ${theme.secondary} 75%, ${theme.soft2} 100%)` }} />

      {/* Layer 2: soft daylight glow from top-left (window light) */}
      <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full opacity-20" style={{ background: `radial-gradient(circle, white 0%, transparent 65%)` }} />
      <div className="absolute top-4 left-6 w-48 h-32 opacity-10" style={{ background: `linear-gradient(135deg, white 0%, transparent 60%)` }} />

      {/* Layer 3: window frame suggestion */}
      <div className="absolute top-6 left-8 w-28 h-36 opacity-10">
        <svg width="112" height="144" viewBox="0 0 112 144" fill="none">
          <rect x="2" y="2" width="108" height="140" rx="2" stroke="white" strokeWidth="2" fill="none" />
          <line x1="56" y1="2" x2="56" y2="142" stroke="white" strokeWidth="1.5" />
          <line x1="2" y1="50" x2="110" y2="50" stroke="white" strokeWidth="1.5" />
          <line x1="2" y1="96" x2="110" y2="96" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Layer 4: elegant sitting cat */}
      <div className="absolute bottom-10 right-[15%] opacity-20">
        <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
          {/* body */}
          <ellipse cx="50" cy="58" rx="32" ry="24" fill="white" />
          {/* chest fur */}
          <ellipse cx="50" cy="52" rx="20" ry="14" fill="white" opacity="0.6" />
          {/* head */}
          <circle cx="50" cy="30" r="18" fill="white" />
          {/* ears */}
          <polygon points="34,20 38,6 46,18" fill="white" />
          <polygon points="54,18 62,6 66,20" fill="white" />
          {/* inner ears */}
          <polygon points="37,18 39,10 44,16" fill="white" opacity="0.5" />
          <polygon points="56,16 61,10 63,18" fill="white" opacity="0.5" />
          {/* tail wrapping around */}
          <path d="M78 60 Q 94 52, 90 38 Q 86 24, 76 30" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* paws */}
          <ellipse cx="38" cy="78" rx="7" ry="4" fill="white" />
          <ellipse cx="62" cy="78" rx="7" ry="4" fill="white" />
          {/* face details */}
          <circle cx="44" cy="28" r="2" fill="white" opacity="0.5" />
          <circle cx="56" cy="28" r="2" fill="white" opacity="0.5" />
          <path d="M48 34 Q 50 37, 52 34" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      </div>

      {/* Layer 5: soft cushion/blanket */}
      <div className="absolute bottom-8 right-[10%] opacity-10">
        <svg width="140" height="40" viewBox="0 0 140 40" fill="none">
          <rect x="4" y="8" width="132" height="28" rx="12" fill="white" />
          <rect x="12" y="14" width="116" height="16" rx="8" fill="white" opacity="0.4" />
        </svg>
      </div>

      {/* Layer 6: small flower pot accent */}
      <div className="absolute bottom-12 left-[20%] opacity-15">
        <svg width="32" height="44" viewBox="0 0 32 44" fill="none">
          <rect x="8" y="24" width="16" height="18" rx="2" fill="white" />
          <ellipse cx="16" cy="16" rx="10" ry="14" fill="white" />
          <ellipse cx="12" cy="10" rx="8" ry="12" fill="white" opacity="0.5" />
          <ellipse cx="20" cy="12" rx="8" ry="12" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Layer 7: floating blue bubbles */}
      <div className="absolute top-12 right-[30%] w-10 h-10 rounded-full opacity-10" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />
      <div className="absolute top-20 right-[20%] w-6 h-6 rounded-full opacity-10" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />

      <GrainOverlay />
      <BottomBlend />
    </div>
  );
}

/* ─── Ahmed — Calm Living Room / Olive Green ─── */

function AhmedHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-b-[2.5rem] shrink-0 select-none">
      {/* Layer 1: olive-sage base */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, ${theme.primary} 0%, ${theme.accent} 40%, ${theme.secondary} 80%, ${theme.soft2} 100%)` }} />

      {/* Layer 2: natural sunlight from top-right */}
      <div className="absolute -top-6 -right-6 w-56 h-56 rounded-full opacity-20" style={{ background: `radial-gradient(circle, white 0%, transparent 65%)` }} />
      <div className="absolute top-0 right-0 w-40 h-48 opacity-10" style={{ background: `linear-gradient(225deg, white 0%, transparent 60%)` }} />

      {/* Layer 3: minimal sofa shape */}
      <div className="absolute bottom-10 left-[8%] opacity-15">
        <svg width="160" height="72" viewBox="0 0 160 72" fill="none">
          {/* sofa back */}
          <rect x="8" y="8" width="144" height="32" rx="8" fill="white" />
          {/* sofa seat */}
          <rect x="4" y="36" width="152" height="28" rx="6" fill="white" opacity="0.7" />
          {/* left arm */}
          <rect x="0" y="28" width="16" height="38" rx="6" fill="white" opacity="0.8" />
          {/* right arm */}
          <rect x="144" y="28" width="16" height="38" rx="6" fill="white" opacity="0.8" />
          {/* left cushion */}
          <rect x="20" y="12" width="56" height="24" rx="4" fill="white" opacity="0.3" />
          {/* right cushion */}
          <rect x="84" y="12" width="56" height="24" rx="4" fill="white" opacity="0.3" />
          {/* legs */}
          <rect x="12" y="64" width="8" height="8" rx="2" fill="white" opacity="0.5" />
          <rect x="140" y="64" width="8" height="8" rx="2" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Layer 4: coffee table */}
      <div className="absolute bottom-8 left-[45%] opacity-12">
        <svg width="72" height="36" viewBox="0 0 72 36" fill="none">
          <rect x="4" y="8" width="64" height="6" rx="2" fill="white" />
          <rect x="12" y="14" width="4" height="18" rx="1" fill="white" opacity="0.6" />
          <rect x="56" y="14" width="4" height="18" rx="1" fill="white" opacity="0.6" />
          {/* small cup on table */}
          <rect x="30" y="2" width="10" height="8" rx="2" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Layer 5: plant — tall fiddle-leaf style */}
      <div className="absolute bottom-6 right-[8%] opacity-18">
        <svg width="72" height="96" viewBox="0 0 72 96" fill="none">
          {/* pot */}
          <rect x="22" y="68" width="28" height="24" rx="3" fill="white" />
          <rect x="20" y="64" width="32" height="6" rx="2" fill="white" opacity="0.6" />
          {/* stem */}
          <rect x="34" y="28" width="4" height="38" rx="2" fill="white" opacity="0.7" />
          {/* leaves */}
          <ellipse cx="28" cy="32" rx="14" ry="22" fill="white" opacity="0.8" transform="rotate(-20 28 32)" />
          <ellipse cx="44" cy="26" rx="12" ry="20" fill="white" opacity="0.7" transform="rotate(20 44 26)" />
          <ellipse cx="30" cy="14" rx="10" ry="16" fill="white" opacity="0.6" transform="rotate(-10 30 14)" />
          <ellipse cx="42" cy="18" rx="8" ry="14" fill="white" opacity="0.5" transform="rotate(15 42 18)" />
          <ellipse cx="36" cy="8" rx="6" ry="10" fill="white" opacity="0.4" />
        </svg>
      </div>

      {/* Layer 6: small side plant */}
      <div className="absolute bottom-10 left-[60%] opacity-10">
        <svg width="36" height="52" viewBox="0 0 36 52" fill="none">
          <rect x="10" y="36" width="16" height="14" rx="2" fill="white" />
          <rect x="8" y="34" width="20" height="4" rx="1" fill="white" opacity="0.6" />
          <ellipse cx="18" cy="24" rx="8" ry="14" fill="white" />
          <ellipse cx="12" cy="18" rx="6" ry="12" fill="white" opacity="0.5" />
          <ellipse cx="24" cy="20" rx="6" ry="12" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Layer 7: floating light orbs */}
      <div className="absolute top-10 left-[40%] w-14 h-14 rounded-full opacity-10" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />
      <div className="absolute top-20 left-[55%] w-8 h-8 rounded-full opacity-10" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />

      <GrainOverlay />
      <BottomBlend />
    </div>
  );
}

/* ─── Sherien — Strong Turquoise Ocean / Most Important ─── */

function SherienHero({ theme }: { theme: NonNullable<ReturnType<typeof getProfileTheme>> }) {
  return (
    <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-b-[2.5rem] shrink-0 select-none">
      {/* Layer 1: bright ocean gradient — deep blue to turquoise to bright cyan to sky */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.primary} 0%, ${theme.accent} 20%, ${theme.secondary} 45%, ${theme.sky} 70%, ${theme.horizon} 90%, ${theme.soft} 100%)` }} />

      {/* Layer 2: bright sky glow at top */}
      <div className="absolute top-0 left-0 right-0 h-24 opacity-30" style={{ background: `linear-gradient(180deg, white 0%, transparent 100%)` }} />

      {/* Layer 3: sun with radiating glow */}
      <div className="absolute top-6 right-[15%] w-20 h-20 rounded-full opacity-40" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />
      <div className="absolute top-8 right-[calc(15%+8px)] w-12 h-12 rounded-full bg-white/30" />
      <div className="absolute top-10 right-[calc(15%+16px)] w-6 h-6 rounded-full bg-white/50" />

      {/* Layer 4: clouds — soft organic shapes */}
      <div className="absolute top-10 left-[8%] opacity-20">
        <svg width="100" height="36" viewBox="0 0 100 36" fill="none">
          <path d="M8 24 Q 16 8, 28 16 Q 40 4, 52 14 Q 64 8, 76 16 Q 88 12, 92 24 Z" fill="white" />
        </svg>
      </div>
      <div className="absolute top-16 right-[25%] opacity-15">
        <svg width="72" height="28" viewBox="0 0 72 28" fill="none">
          <path d="M6 20 Q 12 8, 22 14 Q 32 4, 42 12 Q 52 8, 62 14 Q 68 12, 66 20 Z" fill="white" />
        </svg>
      </div>
      <div className="absolute top-6 left-[45%] opacity-10">
        <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
          <path d="M4 14 Q 10 4, 18 10 Q 26 2, 34 8 Q 42 6, 44 14 Z" fill="white" />
        </svg>
      </div>

      {/* Layer 5: distant coastal house silhouette */}
      <div className="absolute bottom-20 left-[12%] opacity-15">
        <svg width="80" height="52" viewBox="0 0 80 52" fill="none">
          <polygon points="40,4 72,28 8,28" fill="white" />
          <rect x="12" y="28" width="56" height="22" rx="2" fill="white" />
          <rect x="22" y="34" width="12" height="12" rx="1" fill="white" opacity="0.4" />
          <rect x="46" y="34" width="12" height="12" rx="1" fill="white" opacity="0.4" />
          <rect x="34" y="42" width="12" height="8" rx="1" fill="white" opacity="0.3" />
        </svg>
      </div>

      {/* Layer 6: palm tree silhouettes */}
      <div className="absolute bottom-16 right-[10%] opacity-12">
        <svg width="48" height="72" viewBox="0 0 48 72" fill="none">
          <rect x="22" y="36" width="4" height="36" rx="1" fill="white" />
          <path d="M24 36 Q 8 24, 4 28 Q 12 18, 24 24 Q 36 18, 44 28 Q 40 24, 24 36" fill="white" />
          <path d="M24 28 Q 10 14, 6 20 Q 14 8, 24 16 Q 34 8, 42 20 Q 38 14, 24 28" fill="white" opacity="0.6" />
          <path d="M24 20 Q 14 8, 12 14 Q 18 4, 24 10 Q 30 4, 36 14 Q 34 8, 24 20" fill="white" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute bottom-14 right-[22%] opacity-8">
        <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
          <rect x="14" y="28" width="4" height="24" rx="1" fill="white" />
          <path d="M16 28 Q 6 20, 4 24 Q 10 16, 16 20 Q 22 16, 28 24 Q 26 20, 16 28" fill="white" />
          <path d="M16 22 Q 8 12, 6 18 Q 12 8, 16 14 Q 20 8, 26 18 Q 24 12, 16 22" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Layer 7: seagull silhouettes */}
      <div className="absolute top-14 left-[35%] opacity-15">
        <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
          <path d="M2 8 Q 7 2, 14 6 Q 21 2, 26 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div className="absolute top-20 left-[48%] opacity-10">
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
          <path d="M2 7 Q 5 2, 10 5 Q 15 2, 18 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Layer 8: wave layers — 4 overlapping curved paths */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 72" fill="none" preserveAspectRatio="none" className="w-full h-14 opacity-30">
          <path d="M0 36C 240 72, 480 0, 720 36C 960 72, 1200 0, 1440 36V72H0Z" fill="white" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" className="w-full h-11 opacity-25">
          <path d="M0 28C 360 56, 720 0, 1080 28C 1260 42, 1350 14, 1440 28V56H0Z" fill="white" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className="w-full h-9 opacity-20">
          <path d="M0 22C 180 44, 360 0, 540 22C 720 44, 900 0, 1080 22C 1260 44, 1350 0, 1440 22V44H0Z" fill="white" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none" className="w-full h-7 opacity-15">
          <path d="M0 16C 120 32, 240 0, 360 16C 480 32, 600 0, 720 16C 840 32, 960 0, 1080 16C 1200 32, 1320 0, 1440 16V32H0Z" fill="white" />
        </svg>
      </div>

      {/* Layer 9: sparkling water reflections (small dots) */}
      <div className="absolute bottom-6 left-[20%] w-2 h-2 rounded-full bg-white/30" />
      <div className="absolute bottom-10 left-[30%] w-1.5 h-1.5 rounded-full bg-white/25" />
      <div className="absolute bottom-8 left-[55%] w-2 h-2 rounded-full bg-white/30" />
      <div className="absolute bottom-12 left-[70%] w-1.5 h-1.5 rounded-full bg-white/25" />
      <div className="absolute bottom-6 left-[85%] w-2 h-2 rounded-full bg-white/30" />

      <GrainOverlay />
      <BottomBlend />
    </div>
  );
}
