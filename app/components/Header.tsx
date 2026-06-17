"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, showBack = true, backHref, action }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-linen/80 backdrop-blur-md border-b border-warm-gray/40">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => backHref ? router.push(backHref) : router.back()}
            className="w-9 h-9 rounded-xl bg-cream border border-warm-gray/60 flex items-center justify-center hover:bg-cream-dark transition-colors shrink-0"
          >
            <ArrowLeft size={18} className="text-navy" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-navy truncate">{title}</h1>
          {subtitle && <p className="text-xs text-navy-muted -mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
