"use client";

import { useRouter } from "next/navigation";
import {
  Receipt, ShoppingCart, Wrench, CheckSquare, BarChart3, Tv, Settings, LogOut, ChevronRight,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import { PROFILES, getCurrentMonth, formatCurrency } from "../lib/constants";
import { getProfileTheme } from "../lib/profile-themes";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MORE_LINKS = [
  { label: "Bills", href: "/bills", icon: Receipt },
  { label: "Shopping", href: "/shopping", icon: ShoppingCart },
  { label: "Home Items", href: "/items", icon: Tv },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function FamilyPage() {
  const { selectedProfile, clearProfile } = useProfile();
  const router = useRouter();
  const { data } = useDataStore();
  const month = getCurrentMonth();
  const activeTheme = getProfileTheme(selectedProfile);

  if (!selectedProfile) {
    router.push("/profiles");
    return null;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header title="Family" subtitle="Manage your home together" showBack={false} />

      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: activeTheme.textAccent }}>Family Members</h2>
          <div className="space-y-2 stagger-children">
            {PROFILES.map((profile) => {
              const tasks = data.tasks.filter((t) => t.assignedTo === profile.id && t.status !== "done").length;
              const expenses = data.expenses.filter((e) => e.paidBy === profile.id && e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0);
              const repairs = data.repairs.filter((r) => r.responsiblePerson === profile.id || r.paidBy === profile.id).length;
              const shopping = data.shoppingItems.filter((s) => s.assignedBuyer === profile.id && !s.bought).length;
              const isActive = selectedProfile === profile.id;
              const theme = getProfileTheme(profile.id);

              return (
                <button
                  key={profile.id}
                  onClick={() => router.push(`/family/${profile.id}`)}
                  className="w-full flex items-center gap-3 p-4 bg-cream rounded-2xl border text-left transition-all hover:bg-cream-dark profile-focus"
                  style={{ borderColor: isActive ? activeTheme.primary + "45" : activeTheme.primary + "18" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-cream shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {profile.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy">{profile.name}</p>
                      {isActive && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: activeTheme.soft, color: activeTheme.primary }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy-muted">{profile.nickname} · {profile.role}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {tasks > 0 && <span className="text-[10px] flex items-center gap-1" style={{ color: activeTheme.primary }}><CheckSquare size={10} /> {tasks} tasks</span>}
                      <span className="text-[10px] flex items-center gap-1" style={{ color: activeTheme.primary }}><Receipt size={10} /> {formatCurrency(expenses)}</span>
                      {repairs > 0 && <span className="text-[10px] flex items-center gap-1" style={{ color: activeTheme.primary }}><Wrench size={10} /> {repairs} repairs</span>}
                      {shopping > 0 && <span className="text-[10px] flex items-center gap-1" style={{ color: activeTheme.primary }}><ShoppingCart size={10} /> {shopping} items</span>}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-navy-muted shrink-0" />
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: activeTheme.textAccent }}>More</h2>
          <div className="space-y-2">
            {MORE_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="w-full flex items-center gap-3 p-4 bg-cream rounded-2xl border text-left hover:bg-cream-dark transition-colors active:scale-[0.98] profile-focus"
                  style={{ borderColor: activeTheme.primary + "18" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: activeTheme.soft, color: activeTheme.primary }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy">{link.label}</p>
                  </div>
                  <ChevronRight size={18} className="text-navy-muted shrink-0" />
                </button>
              );
            })}
          </div>
        </section>

        <button
          onClick={() => {
            clearProfile();
            router.push("/profiles");
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cream border font-medium hover:bg-cream-dark transition-colors profile-focus"
          style={{ borderColor: activeTheme.primary + "22", color: activeTheme.primary }}
        >
          <LogOut size={16} />
          Switch Profile
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
