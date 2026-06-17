"use client";

import { formatDateTime, getProfileById } from "../lib/constants";
import { getProfileTheme } from "../lib/profile-themes";
import { useProfile } from "../context/ProfileContext";
import type { ActivityLog } from "../lib/types";

interface ActivityItemProps {
  activity: ActivityLog;
}

const ACTION_ICONS: Record<string, string> = {
  expense: "💰",
  bill: "📄",
  task: "✅",
  repair: "🔧",
  shopping: "🛒",
  item: "📦",
  "home-budget": "🏦",
};

export default function ActivityItem({ activity }: ActivityItemProps) {
  const profile = getProfileById(activity.performedBy);
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
  const actorTheme = getProfileTheme(activity.performedBy);
  const icon = ACTION_ICONS[activity.actionType] || "📋";

  return (
    <div className="flex items-start gap-3 py-3 animate-fade-in">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
        style={{ backgroundColor: theme.soft }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-navy leading-snug">
          <span className="font-semibold" style={{ color: actorTheme.primary }}>
            {profile?.name ?? "Someone"}
          </span>{" "}
          {activity.description}
        </p>
        <p className="text-xs text-navy-muted mt-0.5">{formatDateTime(activity.createdAt)}</p>
      </div>
    </div>
  );
}
