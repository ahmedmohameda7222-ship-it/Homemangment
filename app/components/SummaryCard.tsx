"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
  onClick?: () => void;
}

export default function SummaryCard({ title, value, subtitle, icon, color, href, onClick }: SummaryCardProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleClick = () => {
    if (href) router.push(href);
    else if (onClick) onClick();
  };

  const clickable = href || onClick;

  return (
    <button
      onClick={clickable ? handleClick : undefined}
      className={`flex items-center gap-3 p-4 rounded-2xl bg-cream border border-warm-gray/60 text-left transition-all duration-200 ${clickable ? "hover:bg-cream-dark hover:border-warm-gray active:scale-[0.98]" : ""}`}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "18" }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-navy-muted uppercase tracking-wider">{t(title)}</p>
        <p className="text-lg font-bold text-navy leading-tight">{value}</p>
        {subtitle && <p className="text-xs text-navy-muted mt-0.5">{t(subtitle)}</p>}
      </div>
    </button>
  );
}
