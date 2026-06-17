"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, DollarSign, CheckSquare, Wrench, MoreHorizontal, Wallet } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useLanguage } from "../context/LanguageContext";
import { getProfileTheme } from "../lib/profile-themes";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Money", href: "/money", icon: DollarSign },
  { label: "Budget", href: "/home-budget", icon: Wallet },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Repairs", href: "/repairs", icon: Wrench },
  { label: "More", href: "/family", icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const router = useRouter();

  if (!selectedProfile) return null;

  const theme = getProfileTheme(selectedProfile);
  const primaryColor = theme?.primary ?? "#465431";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cream border-t border-warm-gray/60 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 ${isActive ? "" : "text-navy-muted hover:text-navy hover:bg-warm-gray/50"}`}
              style={isActive ? { color: primaryColor, backgroundColor: primaryColor + "12" } : undefined}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] font-medium ${isActive ? "" : "text-navy-muted"}`} style={isActive ? { color: primaryColor } : undefined}>
                {t(item.label)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom bg-cream" />
    </nav>
  );
}
