"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  color?: string;
}

export default function QuickActionButton({ label, icon, onClick, href, color = "#465431" }: QuickActionButtonProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleClick = () => {
    if (href) router.push(href);
    else if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-cream border border-warm-gray/60 hover:bg-cream-dark hover:border-warm-gray transition-all duration-200 active:scale-95"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <span className="text-xs font-medium text-navy text-center leading-tight">{t(label)}</span>
    </button>
  );
}
