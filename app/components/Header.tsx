"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { getProfileTheme } from "../lib/profile-themes";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, showBack = true, backHref, action }: HeaderProps) {
  const router = useRouter();
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);

  const handleBack = () => {
    router.push(backHref ?? "/profiles");
  };

  return (
    <header className="sticky top-0 z-40 bg-linen/82 backdrop-blur-md border-b" style={{ borderColor: theme.primary + "24" }}>
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-xl bg-cream border flex items-center justify-center hover:bg-cream-dark transition-colors shrink-0 profile-focus"
            style={{ borderColor: theme.primary + "25" }}
            aria-label="Back to profiles"
            title="Back to profiles"
          >
            <ArrowLeft size={18} style={{ color: theme.primary }} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate" style={{ color: theme.textAccent }}>{title}</h1>
          {subtitle && <p className="text-xs text-navy-muted -mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
