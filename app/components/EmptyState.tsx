"use client";

import { type LucideIcon } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { getProfileTheme } from "../lib/profile-themes";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: theme.soft }}>
        <Icon size={28} style={{ color: theme.primary }} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: theme.textAccent }}>{title}</h3>
      <p className="text-sm text-navy-muted max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 text-cream text-sm font-medium rounded-xl transition-colors profile-focus"
          style={{ backgroundColor: theme.primary }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
