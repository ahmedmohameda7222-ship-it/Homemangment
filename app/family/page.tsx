"use client";

import { useRouter } from "next/navigation";
import {
  Users, Receipt, ShoppingCart, Wrench, CheckSquare, BarChart3, Tv, Settings, LogOut, ArrowRight, ChevronRight, Home,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import { PROFILES, getProfileById, getCurrentMonth, formatCurrency } from "../lib/constants";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MORE_LINKS = [
  { label: "Bills", href: "/bills", icon: Receipt, color: "#7BA4C4" },
  { label: "Shopping", href: "/shopping", icon: ShoppingCart, color: "#D8B86F" },
  { label: "Home Items", href: "/items", icon: Tv, color: "#465431" },
  { label: "Reports", href: "/reports", icon: BarChart3, color: "#8A9A6B" },
  { label: "Settings", href: "/settings", icon: Settings, color: "#6B6B80" },
];

export default function FamilyPage() {
  const { selectedProfile, clearProfile } = useProfile();
  const router = useRouter();
  const { data } = useDataStore();
  const month = getCurrentMonth();

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header title="Family" subtitle="Manage your home together" showBack={false} />

      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        {/* Family Members */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Family Members</h2>
          <div className="space-y-2 stagger-children">
            {PROFILES.map((profile) => {
              const tasks = data.tasks.filter((t) => t.assignedTo === profile.id && t.status !== "done").length;
              const expenses = data.expenses.filter((e) => e.paidBy === profile.id && e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0);
              const repairs = data.repairs.filter((r) => r.responsiblePerson === profile.id || r.paidBy === profile.id).length;
              const shopping = data.shoppingItems.filter((s) => s.assignedBuyer === profile.id && !s.bought).length;
              const isActive = selectedProfile === profile.id;

              return (
                <button
                  key={profile.id}
                  onClick={() => router.push(`/family/${profile.id}`)}
                  className={`w-full flex items-center gap-3 p-4 bg-cream rounded-2xl border text-left transition-all hover:bg-cream-dark ${
                    isActive ? "border-olive/40 shadow-sm" : "border-warm-gray/60"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-cream shrink-0"
                    style={{ backgroundColor: profile.color }}
                  >
                    {profile.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy">{profile.name}</p>
                      {isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-olive/15 text-olive font-medium">Active</span>
                      )}
                    </div>
                    <p className="text-xs text-navy-muted">{profile.nickname} · {profile.role}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {tasks > 0 && (
                        <span className="text-[10px] text-sky flex items-center gap-1">
                          <CheckSquare size={10} /> {tasks} tasks
                        </span>
                      )}
                      <span className="text-[10px] text-sage flex items-center gap-1">
                        <Receipt size={10} /> {formatCurrency(expenses)}
                      </span>
                      {repairs > 0 && (
                        <span className="text-[10px] text-amber flex items-center gap-1">
                          <Wrench size={10} /> {repairs} repairs
                        </span>
                      )}
                      {shopping > 0 && (
                        <span className="text-[10px] text-champagne-dark flex items-center gap-1">
                          <ShoppingCart size={10} /> {shopping} items
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-navy-muted shrink-0" />
                </button>
              );
            })}
          </div>
        </section>

        {/* More Links */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">More</h2>
          <div className="space-y-2">
            {MORE_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="w-full flex items-center gap-3 p-4 bg-cream rounded-2xl border border-warm-gray/60 text-left hover:bg-cream-dark transition-colors active:scale-[0.98]"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: link.color + "18" }}
                  >
                    <Icon size={18} style={{ color: link.color }} />
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

        {/* Switch Profile */}
        <button
          onClick={() => {
            clearProfile();
            router.push("/");
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors"
        >
          <LogOut size={16} />
          Switch Profile
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
