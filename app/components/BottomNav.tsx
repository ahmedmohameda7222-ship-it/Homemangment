"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, DollarSign, CheckSquare, Wrench, MoreHorizontal } from "lucide-react";
import { useProfile } from "../context/ProfileContext";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Money", href: "/money", icon: DollarSign },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Repairs", href: "/repairs", icon: Wrench },
  { label: "More", href: "/family", icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { selectedProfile } = useProfile();
  const router = useRouter();

  if (!selectedProfile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cream border-t border-warm-gray/60 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-olive bg-olive/10"
                  : "text-navy-muted hover:text-navy hover:bg-warm-gray/50"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? "text-olive" : "text-navy-muted"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom bg-cream" />
    </nav>
  );
}
