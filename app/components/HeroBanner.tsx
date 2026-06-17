"use client";

import { LogOut } from "lucide-react";
import { getProfileTheme } from "../lib/profile-themes";
import type { ProfileId } from "../lib/types";

type ProfileThemeValue = NonNullable<ReturnType<typeof getProfileTheme>>;

interface HeroBannerProps {
  profileId: ProfileId;
  onSwitchProfile?: () => void;
}

export default function HeroBanner({ profileId, onSwitchProfile }: HeroBannerProps) {
  const theme = getProfileTheme(profileId);
  if (!theme) return null;

  const scene = {
    "egyptian-food": <EgyptianFoodScene theme={theme} />,
    cats: <CatsScene theme={theme} />,
    "living-room": <LivingRoomScene theme={theme} />,
    "ocean-coastal-home": <OceanScene theme={theme} />,
  }[theme.heroType];

  return (
    <section className="relative overflow-hidden rounded-b-[2.25rem] bg-cream shadow-[0_20px_50px_rgba(26,26,46,0.10)]">
      <div className="relative h-[238px] sm:h-[288px] lg:h-[320px] isolate">
        <div className="absolute inset-0" style={{ background: getHeroBackground(theme) }} />
        <div className="absolute inset-0 opacity-[0.32] mix-blend-screen" style={{ background: "radial-gradient(circle at 18% 8%, rgba(255,255,255,0.85), transparent 30%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.65), transparent 34%)" }} />
        <div className="absolute inset-0">{scene}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/16" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-linen via-linen/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linen rounded-t-[55%] translate-y-8" />

        <div className="absolute left-5 top-5 sm:left-8 sm:top-7 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/85">Beitna Manager</p>
          <h1 className="mt-1 max-w-[280px] text-2xl sm:text-3xl font-bold leading-tight">{getHeroTitle(theme.heroType)}</h1>
          <p className="mt-2 max-w-[300px] text-xs sm:text-sm text-white/88 leading-relaxed">{getHeroSubtitle(theme.heroType)}</p>
        </div>

        {onSwitchProfile && (
          <button
            onClick={onSwitchProfile}
            className="absolute right-5 top-5 sm:right-8 sm:top-7 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/88 text-navy shadow-[0_8px_24px_rgba(0,0,0,0.14)] backdrop-blur transition hover:bg-white active:scale-95"
            title="Switch profile"
          >
            <LogOut size={19} style={{ color: theme.primary }} />
          </button>
        )}
      </div>
    </section>
  );
}

function getHeroBackground(theme: ProfileThemeValue) {
  switch (theme.heroType) {
    case "egyptian-food":
      return `linear-gradient(135deg, #24110D 0%, ${theme.primary} 36%, #B86B34 72%, #F2D7AD 100%)`;
    case "cats":
      return `linear-gradient(135deg, #F8FBFF 0%, ${theme.soft2} 28%, ${theme.secondary} 64%, ${theme.primary} 100%)`;
    case "living-room":
      return `linear-gradient(135deg, #F7F1E5 0%, ${theme.soft} 38%, ${theme.secondary} 72%, ${theme.primary} 100%)`;
    case "ocean-coastal-home":
      return `linear-gradient(135deg, ${theme.sky ?? "#60B5F3"} 0%, ${theme.secondary} 38%, ${theme.primary} 76%, #023B71 100%)`;
  }
}

function getHeroTitle(heroType: ProfileThemeValue["heroType"]) {
  switch (heroType) {
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

function getHeroSubtitle(heroType: ProfileThemeValue["heroType"]) {
  switch (heroType) {
    case "egyptian-food":
      return "Baladi bread, tea, and a mature warm family mood.";
    case "cats":
      return "Elegant cats, soft daylight, and a true-blue calm mood.";
    case "living-room":
      return "A clean premium living room with olive accents and soft light.";
    case "ocean-coastal-home":
      return "Bright waves, coastal home details, and fresh blue energy.";
  }
}

function EgyptianFoodScene({ theme }: { theme: ProfileThemeValue }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="foodGlow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFE3B2" stopOpacity="0.88" />
          <stop offset="54%" stopColor="#B87438" stopOpacity="0.34" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tableCloth" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4B151B" />
          <stop offset="0.52" stopColor="#8C2F38" />
          <stop offset="1" stopColor="#D7A66E" />
        </linearGradient>
      </defs>
      <rect width="1200" height="360" fill="url(#foodGlow)" />
      <path d="M0 245C190 210 340 238 525 218C720 196 910 206 1200 175V360H0Z" fill="url(#tableCloth)" opacity="0.92" />
      <path d="M0 280C210 240 390 272 565 245C820 205 1005 218 1200 190" stroke="#F4D8A8" strokeOpacity="0.38" strokeWidth="5" />

      <g opacity="0.88" filter="drop-shadow(0 18px 28px rgba(0,0,0,0.28))">
        <ellipse cx="705" cy="245" rx="150" ry="48" fill="#4B1915" opacity="0.32" />
        <ellipse cx="700" cy="225" rx="142" ry="54" fill="#B46435" />
        <ellipse cx="700" cy="218" rx="112" ry="36" fill="#74311D" />
        <circle cx="655" cy="211" r="13" fill="#D88D4A" />
        <circle cx="690" cy="224" r="15" fill="#BF6F36" />
        <circle cx="735" cy="208" r="11" fill="#E0A15A" />
        <path d="M640 205C695 238 748 205 775 225" stroke="#5BA158" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
      </g>

      <g opacity="0.95" filter="drop-shadow(0 16px 24px rgba(0,0,0,0.24))">
        <ellipse cx="980" cy="198" rx="124" ry="34" fill="#5E2A1B" opacity="0.28" />
        <ellipse cx="980" cy="178" rx="116" ry="38" fill="#EAC990" />
        <ellipse cx="940" cy="172" rx="62" ry="23" fill="#F6D9A1" />
        <ellipse cx="1002" cy="165" rx="70" ry="25" fill="#D9A868" />
        <ellipse cx="1038" cy="188" rx="66" ry="24" fill="#F0C987" />
      </g>

      <g opacity="0.92" filter="drop-shadow(0 16px 26px rgba(0,0,0,0.28))">
        <ellipse cx="470" cy="245" rx="110" ry="36" fill="#4B1915" opacity="0.25" />
        <ellipse cx="465" cy="228" rx="98" ry="42" fill="#F1E5CB" />
        <ellipse cx="465" cy="222" rx="70" ry="25" fill="#F6D46F" />
        <path d="M410 216C448 235 488 208 525 220" stroke="#689E4E" strokeWidth="8" strokeLinecap="round" opacity="0.88" />
      </g>

      <g opacity="0.9" filter="drop-shadow(0 16px 20px rgba(0,0,0,0.22))">
        <ellipse cx="305" cy="236" rx="100" ry="33" fill="#4B1915" opacity="0.22" />
        <ellipse cx="305" cy="220" rx="88" ry="32" fill="#E9DCC5" />
        <circle cx="250" cy="212" r="13" fill="#A76635" />
        <circle cx="264" cy="220" r="13" fill="#8F4E2B" />
        <circle cx="278" cy="228" r="13" fill="#A76635" />
        <circle cx="292" cy="212" r="13" fill="#8F4E2B" />
        <circle cx="306" cy="220" r="13" fill="#A76635" />
        <circle cx="320" cy="228" r="13" fill="#8F4E2B" />
        <circle cx="334" cy="212" r="13" fill="#A76635" />
      </g>

      <g opacity="0.92" filter="drop-shadow(0 14px 20px rgba(0,0,0,0.32))">
        <path d="M112 105H202L186 255C184 278 166 292 145 292C124 292 107 278 103 255L88 105H112Z" fill="#6D1E21" />
        <path d="M100 125H190L181 205H109Z" fill="#C86B35" opacity="0.85" />
        <path d="M202 142C245 144 257 193 217 214" stroke="#FFD8A0" strokeWidth="11" strokeLinecap="round" fill="none" opacity="0.8" />
        <ellipse cx="145" cy="105" rx="58" ry="13" fill="#FFD9A7" opacity="0.72" />
      </g>

      <g opacity="0.26">
        <path d="M78 72C132 39 205 48 252 92" stroke="#FFE7BD" strokeWidth="4" strokeLinecap="round" />
        <path d="M848 86C930 38 1026 54 1085 118" stroke="#FFE7BD" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function CatsScene({ theme }: { theme: ProfileThemeValue }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="catBlanket" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={theme.soft} />
          <stop offset="0.45" stopColor={theme.secondary} stopOpacity="0.72" />
          <stop offset="1" stopColor={theme.primary} stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="catLight" cx="30%" cy="10%" r="62%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="360" fill="url(#catLight)" />
      <path d="M0 240C180 215 320 256 500 226C710 190 930 226 1200 178V360H0Z" fill="url(#catBlanket)" opacity="0.72" />
      <path d="M0 278C250 236 430 286 658 240C860 200 1048 212 1200 188" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="8" />

      <g opacity="0.58">
        <rect x="86" y="40" width="210" height="150" rx="24" fill="#FFFFFF" opacity="0.55" />
        <path d="M110 76H274M110 112H274M110 148H274" stroke={theme.primary} strokeOpacity="0.25" strokeWidth="5" strokeLinecap="round" />
        <circle cx="170" cy="200" r="22" fill={theme.primary} opacity="0.18" />
        <circle cx="210" cy="195" r="18" fill={theme.secondary} opacity="0.28" />
      </g>

      <g opacity="0.92" filter="drop-shadow(0 18px 28px rgba(15,79,184,0.24))">
        <ellipse cx="710" cy="246" rx="190" ry="50" fill="#1F57B8" opacity="0.16" />
        <ellipse cx="704" cy="207" rx="108" ry="82" fill="#F5F1E8" />
        <circle cx="642" cy="147" r="56" fill="#F8F3EA" />
        <path d="M604 118L620 63L650 111Z" fill="#F8F3EA" />
        <path d="M680 116L713 72L707 131Z" fill="#F8F3EA" />
        <circle cx="623" cy="151" r="8" fill={theme.primary} />
        <circle cx="661" cy="151" r="8" fill={theme.primary} />
        <path d="M640 163C648 170 654 170 662 163" stroke="#9D765F" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M690 205C762 186 808 214 816 252" stroke="#F8F3EA" strokeWidth="24" strokeLinecap="round" fill="none" />
      </g>

      <g opacity="0.94" filter="drop-shadow(0 14px 20px rgba(15,79,184,0.20))">
        <ellipse cx="525" cy="254" rx="112" ry="36" fill="#1F57B8" opacity="0.12" />
        <ellipse cx="520" cy="224" rx="78" ry="52" fill="#EFE8DD" />
        <circle cx="476" cy="178" r="36" fill="#F2ECE3" />
        <path d="M452 158L462 120L485 158Z" fill="#F2ECE3" />
        <path d="M498 158L520 124L518 164Z" fill="#F2ECE3" />
        <circle cx="463" cy="181" r="6" fill={theme.primary} />
        <circle cx="488" cy="181" r="6" fill={theme.primary} />
        <path d="M472 194C479 199 485 199 492 194" stroke="#9D765F" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      <g opacity="0.55">
        <circle cx="1060" cy="80" r="19" fill={theme.soft} />
        <circle cx="1100" cy="92" r="24" fill={theme.secondary} opacity="0.42" />
        <circle cx="1024" cy="102" r="15" fill="#FFFFFF" opacity="0.65" />
        <path d="M980 145C1030 116 1090 128 1134 164" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}

function LivingRoomScene({ theme }: { theme: ProfileThemeValue }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="roomSun" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF6E5" />
          <stop offset="0.55" stopColor={theme.soft} />
          <stop offset="1" stopColor={theme.secondary} />
        </linearGradient>
      </defs>
      <rect width="1200" height="360" fill="url(#roomSun)" />
      <path d="M0 228C220 198 330 255 540 215C760 172 950 205 1200 160V360H0Z" fill="#FFFFFF" opacity="0.34" />
      <g opacity="0.38">
        <path d="M790 0L650 225" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
        <path d="M890 0L690 235" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        <path d="M1020 0L740 242" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      </g>

      <g filter="drop-shadow(0 20px 26px rgba(63,81,52,0.20))">
        <rect x="548" y="170" width="420" height="92" rx="32" fill="#F3E8D6" />
        <rect x="600" y="130" width="288" height="95" rx="28" fill="#FBF3E7" />
        <rect x="626" y="154" width="84" height="46" rx="14" fill={theme.soft2} />
        <rect x="724" y="148" width="78" height="50" rx="14" fill={theme.secondary} opacity="0.6" />
        <rect x="816" y="152" width="82" height="46" rx="14" fill="#E8D6B4" />
        <rect x="590" y="246" width="340" height="26" rx="12" fill="#D6C29B" />
      </g>

      <g filter="drop-shadow(0 14px 22px rgba(63,81,52,0.25))">
        <ellipse cx="380" cy="282" rx="150" ry="26" fill={theme.primary} opacity="0.14" />
        <rect x="310" y="238" width="140" height="20" rx="10" fill="#C79C68" />
        <rect x="334" y="258" width="10" height="42" rx="5" fill="#8C6B43" />
        <rect x="416" y="258" width="10" height="42" rx="5" fill="#8C6B43" />
        <ellipse cx="384" cy="222" rx="44" ry="18" fill={theme.primary} opacity="0.46" />
        <rect x="366" y="205" width="38" height="24" rx="6" fill="#FFFFFF" opacity="0.9" />
      </g>

      <g filter="drop-shadow(0 18px 26px rgba(63,81,52,0.22))">
        <rect x="185" y="226" width="58" height="76" rx="12" fill="#DCCBA6" />
        <path d="M215 228C183 186 167 130 191 80C217 116 232 169 215 228Z" fill={theme.primary} opacity="0.78" />
        <path d="M220 228C257 186 278 128 260 82C230 118 208 171 220 228Z" fill={theme.accent} opacity="0.78" />
      </g>

      <g opacity="0.42">
        <rect x="965" y="50" width="110" height="132" rx="4" fill="#FFFFFF" />
        <rect x="978" y="64" width="84" height="104" rx="2" fill={theme.soft} />
        <path d="M1000 145C1025 112 1040 92 1050 75" stroke={theme.primary} strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

function OceanScene({ theme }: { theme: ProfileThemeValue }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="oceanSky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#8FE8FF" />
          <stop offset="0.5" stopColor={theme.sky ?? "#60B5F3"} />
          <stop offset="1" stopColor={theme.primary} />
        </linearGradient>
        <linearGradient id="oceanWater" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={theme.secondary} />
          <stop offset="0.52" stopColor={theme.accent} />
          <stop offset="1" stopColor={theme.primary} />
        </linearGradient>
      </defs>
      <rect width="1200" height="360" fill="url(#oceanSky)" />
      <circle cx="210" cy="72" r="42" fill="#FFFFFF" opacity="0.55" />
      <path d="M650 120C730 85 808 88 880 134C950 176 1045 142 1200 102V360H650Z" fill="#FFFFFF" opacity="0.22" />
      <path d="M0 205C190 162 344 216 528 182C730 146 955 166 1200 118V360H0Z" fill="url(#oceanWater)" opacity="0.92" />
      <path d="M0 238C210 192 402 247 620 210C840 172 1000 200 1200 158" stroke="#FFFFFF" strokeWidth="9" strokeOpacity="0.65" strokeLinecap="round" />
      <path d="M0 272C240 224 410 294 660 242C890 194 1035 235 1200 194" stroke="#FFFFFF" strokeWidth="7" strokeOpacity="0.48" strokeLinecap="round" />
      <path d="M0 306C240 268 420 330 660 285C870 245 1010 280 1200 250" stroke="#FFFFFF" strokeWidth="5" strokeOpacity="0.42" strokeLinecap="round" />

      <g opacity="0.95" filter="drop-shadow(0 18px 26px rgba(6,78,138,0.24))">
        <rect x="708" y="120" width="235" height="126" rx="10" fill="#FFFFFF" />
        <rect x="735" y="154" width="58" height="72" rx="5" fill={theme.soft} />
        <rect x="812" y="154" width="90" height="58" rx="5" fill={theme.soft2} />
        <path d="M690 124L826 42L966 124Z" fill="#F7FBFF" />
        <path d="M715 124L826 62L940 124" stroke={theme.primary} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="733" y="246" width="238" height="16" rx="8" fill="#CFEFFF" />
        <circle cx="888" cy="91" r="16" fill={theme.accent} opacity="0.55" />
      </g>

      <g opacity="0.82" filter="drop-shadow(0 12px 18px rgba(6,78,138,0.25))">
        <path d="M1002 247C1014 178 1038 118 1080 72" stroke="#7B5A36" strokeWidth="10" strokeLinecap="round" />
        <path d="M1080 72C1025 68 983 88 958 132C1018 128 1062 110 1080 72Z" fill="#1FA58C" />
        <path d="M1080 72C1104 115 1144 144 1200 142C1172 94 1132 73 1080 72Z" fill="#168C83" />
        <path d="M1080 72C1116 53 1154 52 1192 70C1148 88 1110 90 1080 72Z" fill="#25B7A5" />
      </g>

      <g opacity="0.64">
        <path d="M310 98C338 72 378 72 408 98" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M430 118C448 102 474 102 492 118" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M90 140C124 110 170 112 202 142" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
