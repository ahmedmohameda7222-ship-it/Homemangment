import type { ProfileId, ProfileTheme } from "./types";

export const profileThemes: Record<ProfileId, ProfileTheme> = {
  moustafa: {
    id: "moustafa",
    displayName: "Moustafa",
    nickname: "Pappy",
    role: "Father",
    greeting: "Welcome back, ya Pappy.",
    subtitle: "Everything at home is ready for you.",
    themeName: "Deep Burgundy / Nebety",
    primary: "#7A2E3A",
    primaryHover: "#65242F",
    secondary: "#C590A6",
    accent: "#8C4A57",
    soft: "#F7EFF1",
    soft2: "#EADBDC",
    textAccent: "#7A2E3A",
    heroType: "egyptian-food",
  },
  doaa: {
    id: "doaa",
    displayName: "Doaa",
    nickname: "Mamy",
    role: "Mother",
    greeting: "Welcome back, ya Mamy.",
    subtitle: "A peaceful home is a happy home.",
    themeName: "True Blue",
    primary: "#2F6FDB",
    primaryHover: "#1F57B8",
    secondary: "#6FA0F0",
    accent: "#0F4FB8",
    soft: "#ECF3FF",
    soft2: "#DCE9FF",
    textAccent: "#0F4FB8",
    heroType: "cats",
  },
  ahmed: {
    id: "ahmed",
    displayName: "Ahmed",
    nickname: "Ahmed",
    role: "Son",
    greeting: "Welcome back, Ahmed.",
    subtitle: "Let\u2019s keep Beitna organized.",
    themeName: "Olive Green",
    primary: "#667A53",
    primaryHover: "#536342",
    secondary: "#B7C5A9",
    accent: "#7E9370",
    soft: "#F2F6EE",
    soft2: "#DFE8D6",
    textAccent: "#3F5134",
    heroType: "living-room",
  },
  sherien: {
    id: "sherien",
    displayName: "Sherien",
    nickname: "Sherien",
    role: "Daughter",
    greeting: "Welcome back, Sherien.",
    subtitle: "Here\u2019s your calm home overview.",
    themeName: "Theme 3 / Strong Turquoise Ocean",
    primary: "#0178CD",
    primaryHover: "#005FA8",
    secondary: "#01DEE3",
    accent: "#01D2E7",
    soft: "#EAF8FF",
    soft2: "#DDF7FA",
    sky: "#60B5F3",
    horizon: "#75B4EB",
    mist: "#AFC3E0",
    textAccent: "#064E8A",
    heroType: "ocean-coastal-home",
  },
} as const;

export function getProfileTheme(id: ProfileId | null): ProfileTheme | null {
  if (!id) return null;
  return profileThemes[id] ?? null;
}

export function getProfileThemeCSS(
  theme: ProfileTheme | null
): React.CSSProperties {
  if (!theme) return {};
  const base: Record<string, string> = {
    "--profile-primary": theme.primary,
    "--profile-primary-hover": theme.primaryHover,
    "--profile-secondary": theme.secondary,
    "--profile-accent": theme.accent,
    "--profile-soft": theme.soft,
    "--profile-soft-2": theme.soft2,
    "--profile-text-accent": theme.textAccent,
  };
  if (theme.sky) base["--profile-sky"] = theme.sky;
  if (theme.horizon) base["--profile-horizon"] = theme.horizon;
  if (theme.mist) base["--profile-mist"] = theme.mist;
  return base as React.CSSProperties;
}
