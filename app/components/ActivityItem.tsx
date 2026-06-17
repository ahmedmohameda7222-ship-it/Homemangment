"use client";

import { formatDateTime, getProfileById } from "../lib/constants";
import { getProfileTheme } from "../lib/profile-themes";
import type { ActivityLog } from "../lib/types";

interface ActivityItemProps {
  activity: ActivityLog;
}

const ACTION_COLORS: Record<string, string> = {
  expense: "#8A9A6B",
  bill: "#7BA4C4",
  task: "#C4A47B",
  repair: "#C47B7B",
  shopping: "#D8B86F",
  item: "#6B6B80",
  "home-budget": "#B89A50",
};

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
  const theme = getProfileTheme(activity.performedBy);
  const color = ACTION_COLORS[activity.actionType] || "#6B6B80";
  const icon = ACTION_ICONS[activity.actionType] || "📋";
  const profileColor = theme?.primary ?? profile?.color ?? "#6B6B80";

  return (
    <div className="flex items-start gap-3 py-3 animate-fade-in">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
        style={{ backgroundColor: color + "18" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-navy leading-snug">
          <span className="font-semibold" style={{ color: profileColor }}>
            {profile?.name ?? "Someone"}
          </span>{" "}
          {activity.description}
        </p>
        <p className="text-xs text-navy-muted mt-0.5">{formatDateTime(activity.createdAt)}</p>
      </div>
    </div>
  );
}
