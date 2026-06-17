"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Receipt,
  Wrench,
  CheckSquare,
  ShoppingCart,
  Plus,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import { getProfileTheme } from "../lib/profile-themes";
import {
  formatCurrency,
  getDaysUntil,
  getCurrentMonth,
  isOverdue,
} from "../lib/constants";
import BottomNav from "../components/BottomNav";
import SummaryCard from "../components/SummaryCard";
import QuickActionButton from "../components/QuickActionButton";
import ActivityItem from "../components/ActivityItem";
import HeroBanner from "../components/HeroBanner";

export default function DashboardPage() {
  const { selectedProfile, initialized, clearProfile } = useProfile();
  const router = useRouter();
  const [currentDate] = useState(() => new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }));
  const { data, loaded } = useDataStore();

  const theme = getProfileTheme(selectedProfile);

  useEffect(() => {
    if (!initialized) return;
    if (!selectedProfile) {
      router.push("/");
    }
  }, [selectedProfile, initialized, router]);

  if (!initialized || !loaded) {
    return (
      <div className="min-h-full bg-linen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  const month = getCurrentMonth();

  const monthlyExpenses = data.expenses.filter((e) => e.date.startsWith(month));
  const totalSpending = monthlyExpenses.reduce((s, e) => s + e.amount, 0);

  const upcomingBills = data.bills.filter(
    (b) => !b.paid && getDaysUntil(b.dueDate) >= 0 && getDaysUntil(b.dueDate) <= 7
  );
  const overdueBills = data.bills.filter((b) => !b.paid && isOverdue(b.dueDate));

  const openRepairs = data.repairs.filter((r) => r.status !== "closed" && r.status !== "fixed");
  const myRepairs = openRepairs.filter(
    (r) => r.responsiblePerson === selectedProfile || r.paidBy === selectedProfile
  );

  const myTasks = data.tasks.filter((t) => t.assignedTo === selectedProfile && t.status !== "done");
  const lateTasks = myTasks.filter((t) => t.dueDate && isOverdue(t.dueDate));

  const myShopping = data.shoppingItems.filter((s) => s.assignedBuyer === selectedProfile && !s.bought);

  const recentActivity = data.activityLog.slice(0, 8);

  const handleSwitchProfile = () => {
    clearProfile();
    router.push("/");
  };

  const primaryColor = theme?.primary ?? "#465431";
  const softColor = theme?.soft ?? "#F7F3EA";
  const textAccent = theme?.textAccent ?? "#1A1A2E";

  return (
    <div className="min-h-full bg-linen pb-28">
      <HeroBanner profileId={selectedProfile} onSwitchProfile={handleSwitchProfile} />

      <header className="relative z-10 px-5 -mt-12 pb-3">
        <div className="max-w-3xl mx-auto rounded-[1.75rem] bg-cream/95 border border-white/80 shadow-[0_18px_44px_rgba(26,26,46,0.09)] backdrop-blur p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold text-cream ring-4 ring-white shadow-lg shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {theme?.displayName?.[0] ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-navy-muted font-medium">{currentDate}</p>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight" style={{ color: textAccent }}>
                {theme?.greeting ?? "Welcome back."}
              </h1>
              <p className="text-sm sm:text-base text-navy-muted mt-1">{theme?.subtitle ?? "Everything at home is ready for you."}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 space-y-7">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>
            Today&apos;s Home Summary
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <SummaryCard
              title="This Month"
              value={formatCurrency(totalSpending)}
              subtitle={`${monthlyExpenses.length} expenses`}
              icon={<DollarSign size={21} />}
              color={primaryColor}
              href="/money"
            />
            <SummaryCard
              title="Bills Due"
              value={`${upcomingBills.length + overdueBills.length}`}
              subtitle={overdueBills.length > 0 ? `${overdueBills.length} overdue` : "Up to date"}
              icon={<Receipt size={21} />}
              color={overdueBills.length > 0 ? "#C47B7B" : primaryColor}
              href="/bills"
            />
            <SummaryCard
              title="Open Repairs"
              value={String(openRepairs.length)}
              subtitle={myRepairs.length > 0 ? `${myRepairs.length} yours` : "All handled"}
              icon={<Wrench size={21} />}
              color={openRepairs.length > 0 ? "#C4A47B" : primaryColor}
              href="/repairs"
            />
            <SummaryCard
              title="My Tasks"
              value={String(myTasks.length)}
              subtitle={lateTasks.length > 0 ? `${lateTasks.length} late` : "On track"}
              icon={<CheckSquare size={21} />}
              color={lateTasks.length > 0 ? "#C47B7B" : primaryColor}
              href="/tasks"
            />
          </div>
        </section>

        {(myTasks.length > 0 || myShopping.length > 0 || myRepairs.length > 0) && (
          <section className="animate-fade-in-up">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>
              My Responsibilities
            </h2>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 sm:p-5 space-y-3 shadow-[0_10px_30px_rgba(26,26,46,0.04)]">
              {myTasks.length > 0 && (
                <ResponsibilityRow
                  icon={<CheckSquare size={16} />}
                  color={primaryColor}
                  title={`${myTasks.length} task${myTasks.length > 1 ? "s" : ""} assigned`}
                  subtitle={`${myTasks.slice(0, 2).map((t) => t.name).join(", ")}${myTasks.length > 2 ? ` +${myTasks.length - 2} more` : ""}`}
                  onClick={() => router.push("/tasks")}
                />
              )}
              {myShopping.length > 0 && (
                <ResponsibilityRow
                  icon={<ShoppingCart size={16} />}
                  color={primaryColor}
                  title={`${myShopping.length} shopping item${myShopping.length > 1 ? "s" : ""}`}
                  subtitle="Need to buy"
                  onClick={() => router.push("/shopping")}
                />
              )}
              {myRepairs.length > 0 && (
                <ResponsibilityRow
                  icon={<Wrench size={16} />}
                  color="#C47B7B"
                  title={`${myRepairs.length} repair${myRepairs.length > 1 ? "s" : ""} to handle`}
                  subtitle={`${myRepairs.slice(0, 2).map((r) => r.itemName).join(", ")}${myRepairs.length > 2 ? ` +${myRepairs.length - 2} more` : ""}`}
                  onClick={() => router.push("/repairs")}
                />
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <QuickActionButton label="Add Expense" icon={<Plus size={21} />} href="/money" color={primaryColor} />
            <QuickActionButton label="Add Task" icon={<Plus size={21} />} href="/tasks" color={primaryColor} />
            <QuickActionButton label="Report Problem" icon={<Plus size={21} />} href="/repairs" color={primaryColor} />
            <QuickActionButton label="Add Shopping" icon={<Plus size={21} />} href="/shopping" color={primaryColor} />
          </div>
        </section>

        {recentActivity.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>
              Recent Home Activity
            </h2>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 sm:p-5 shadow-[0_10px_30px_rgba(26,26,46,0.04)]">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        )}

        {recentActivity.length === 0 && (
          <section className="bg-cream rounded-2xl border border-warm-gray/60 p-6 text-center shadow-[0_10px_30px_rgba(26,26,46,0.04)]">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: softColor }}>
              <Calendar size={24} style={{ color: primaryColor }} />
            </div>
            <h3 className="text-base font-semibold text-navy mb-1">Your home is fresh</h3>
            <p className="text-sm text-navy-muted leading-relaxed">
              Start by adding an expense, a task, or a shopping item. Everything will appear here.
            </p>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function ResponsibilityRow({
  icon,
  color,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "15", color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy">{title}</p>
        <p className="text-xs text-navy-muted truncate">{subtitle}</p>
      </div>
      <button onClick={onClick} className="hover:opacity-70 transition-opacity" style={{ color }}>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
