import type { ProfileId, ProfileTheme } from "./types";

export const profileThemes: Record<ProfileId, ProfileTheme> = {
  moustafa: { id: "moustafa", displayName: "Moustafa", nickname: "Pappy", role: "Father", themeName: "Deep Burgundy / Nebety", greeting: "Welcome back, ya Pappy.", subtitle: "Everything at home is ready for you.", heroImage: "/profile-banners/moustafa-hero.jpg.png", heroObjectPosition: "center center", primary: "#7A2E3A", primaryHover: "#65242F", secondary: "#C590A6", accent: "#8C4A57", soft: "#F7EFF1", soft2: "#EADBDC", textAccent: "#7A2E3A", heroType: "egyptian-food" },
  doaa: { id: "doaa", displayName: "Doaa", nickname: "Mamy", role: "Mother", themeName: "True Blue", greeting: "Welcome back, ya Mamy.", subtitle: "A peaceful home is a happy home.", heroImage: "/profile-banners/doaa-hero.jpg.png", heroObjectPosition: "center center", primary: "#2F6FDB", primaryHover: "#1F57B8", secondary: "#6FA0F0", accent: "#0F4FB8", soft: "#ECF3FF", soft2: "#DCE9FF", textAccent: "#0F4FB8", heroType: "cats" },
  ahmed: { id: "ahmed", displayName: "Ahmed", nickname: "Ahmed", role: "Son", themeName: "Olive Green", greeting: "Welcome back, Ahmed.", subtitle: "Let's keep Beitna organized.", heroImage: "/profile-banners/ahmed-hero.jpg.png", heroObjectPosition: "center center", primary: "#667A53", primaryHover: "#536342", secondary: "#B7C5A9", accent: "#7E9370", soft: "#F2F6EE", soft2: "#DFE8D6", textAccent: "#3F5134", heroType: "living-room" },
  sherien: { id: "sherien", displayName: "Sherien", nickname: "shar2ozii", role: "Daughter", themeName: "Theme 3 / Strong Turquoise Ocean", greeting: "Welcome back, Sherien.", subtitle: "Here's your calm home overview.", heroImage: "/profile-banners/sherien-hero.jpg.png", heroObjectPosition: "center center", primary: "#0178CD", primaryHover: "#005FA8", secondary: "#01DEE3", accent: "#01D2E7", soft: "#EAF8FF", soft2: "#DDF7FA", sky: "#60B5F3", horizon: "#75B4EB", mist: "#AFC3E0", textAccent: "#064E8A", heroType: "ocean-coastal-home" },
};

export function getProfileTheme(profileId?: string | null): ProfileTheme {
  if (profileId === "moustafa" || profileId === "doaa" || profileId === "ahmed" || profileId === "sherien") return profileThemes[profileId];
  return profileThemes.ahmed;
}

export function getProfileThemeCSS(theme: ProfileTheme | null | undefined): React.CSSProperties {
  const safeTheme = theme ?? profileThemes.ahmed;
  return {
    "--app-background": "#F8F6F2",
    "--surface": "#FFFFFF",
    "--surface-soft": "#F2EEE8",
    "--border-soft": "#E3DDD4",
    "--text-primary": "#2F2A26",
    "--text-secondary": "#7B746D",
    "--success": "#7A9B76",
    "--warning": "#C59B52",
    "--danger": "#B35C4B",
    "--profile-primary": safeTheme.primary,
    "--profile-primary-hover": safeTheme.primaryHover,
    "--profile-secondary": safeTheme.secondary,
    "--profile-accent": safeTheme.accent,
    "--profile-soft": safeTheme.soft,
    "--profile-soft-2": safeTheme.soft2,
    "--profile-text-accent": safeTheme.textAccent,
    "--profile-sky": safeTheme.sky ?? safeTheme.secondary,
    "--profile-horizon": safeTheme.horizon ?? safeTheme.secondary,
    "--profile-mist": safeTheme.mist ?? safeTheme.soft2,
  } as React.CSSProperties;
}
