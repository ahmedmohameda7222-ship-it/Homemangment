"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign, Receipt, Wrench, CheckSquare, ShoppingCart,
  Plus, Calendar, ArrowRight, LogOut
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import { getProfileTheme } from "../lib/profile-themes";
import {
  formatCurrency, getDaysUntil, getCurrentMonth, isOverdue,
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

  // Summary calculations
  const monthlyExpenses = data.expenses.filter(e => e.date.startsWith(month));
  const totalSpending = monthlyExpenses.reduce((s, e) => s + e.amount, 0);

  const upcomingBills = data.bills.filter(b => !b.paid && getDaysUntil(b.dueDate) >= 0 && getDaysUntil(b.dueDate) <= 7);
  const overdueBills = data.bills.filter(b => !b.paid && isOverdue(b.dueDate));

  const openRepairs = data.repairs.filter(r => r.status !== "closed" && r.status !== "fixed");
  const myRepairs = openRepairs.filter(r => r.responsiblePerson === selectedProfile || r.paidBy === selectedProfile);

  const myTasks = data.tasks.filter(t => t.assignedTo === selectedProfile && t.status !== "done");
  const lateTasks = myTasks.filter(t => t.dueDate && isOverdue(t.dueDate));

  const myShopping = data.shoppingItems.filter(s => s.assignedBuyer === selectedProfile && !s.bought);

  const recentActivity = data.activityLog.slice(0, 8);

  const handleLogout = () => {
    clearProfile();
    router.push("/");
  };

  const primaryColor = theme?.primary ?? "#465431";
  const softColor = theme?.soft ?? "#F7F3EA";

  return (
    <div className="min-h-full bg-linen pb-24">
      {/* Hero Banner */}
      <HeroBanner profileId={selectedProfile} />

      {/* Welcome Header */}
      <header className="px-5 pt-4 pb-2">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-cream ring-2 ring-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {theme?.displayName?.[0] ?? "?"}
              </div>
              <div>
                <p className="text-xs text-navy-muted font-medium">{currentDate}</p>
                <p className="text-lg font-bold leading-tight" style={{ color: theme?.textAccent ?? "#1A1A2E" }}>
                  {theme?.greeting ?? "Welcome back."}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-xl bg-cream border border-warm-gray/60 flex items-center justify-center hover:bg-cream-dark transition-colors"
              title="Switch profile"
            >
              <LogOut size={16} className="text-navy-muted" />
            </button>
          </div>
          <p className="text-sm text-navy-muted mt-1">{theme?.subtitle ?? "Everything at home is ready for you."}</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 space-y-6">
        {/* Today's Summary */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: theme?.textAccent ?? "#1A1A2E" }}
          >
            Today&apos;s Home Summary
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              title="This Month"
              value={formatCurrency(totalSpending)}
              subtitle={`${monthlyExpenses.length} expenses`}
              icon={<DollarSign size={20} />}
              color={primaryColor}
              href="/money"
            />
            <SummaryCard
              title="Bills Due"
              value={`${upcomingBills.length + overdueBills.length}`}
              subtitle={overdueBills.length > 0 ? `${overdueBills.length} overdue` : "Up to date"}
              icon={<Receipt size={20} />}
              color={overdueBills.length > 0 ? "#C47B7B" : primaryColor}
              href="/bills"
            />
            <SummaryCard
              title="Open Repairs"
              value={String(openRepairs.length)}
              subtitle={myRepairs.length > 0 ? `${myRepairs.length} yours` : "All handled"}
              icon={<Wrench size={20} />}
              color={openRepairs.length > 0 ? "#C4A47B" : primaryColor}
              href="/repairs"
            />
            <SummaryCard
              title="My Tasks"
              value={String(myTasks.length)}
              subtitle={lateTasks.length > 0 ? `${lateTasks.length} late` : "On track"}
              icon={<CheckSquare size={20} />}
              color={lateTasks.length > 0 ? "#C47B7B" : primaryColor}
              href="/tasks"
            />
          </div>
        </section>

        {/* My Responsibilities */}
        {(myTasks.length > 0 || myShopping.length > 0 || myRepairs.length > 0) && (
          <section className="animate-fade-in-up">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: theme?.textAccent ?? "#1A1A2E" }}
            >
              My Responsibilities
            </h2>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-3">
              {myTasks.length > 0 && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: primaryColor + "15" }}
                  >
                    <CheckSquare size={16} style={{ color: primaryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{myTasks.length} task{myTasks.length > 1 ? "s" : ""} assigned</p>
                    <p className="text-xs text-navy-muted">
                      {myTasks.slice(0, 2).map(t => t.name).join(", ")}
                      {myTasks.length > 2 && ` +${myTasks.length - 2} more`}
                    </p>
                  </div>
                  <button onClick={() => router.push("/tasks")} className="hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
              {myShopping.length > 0 && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: primaryColor + "15" }}
                  >
                    <ShoppingCart size={16} style={{ color: primaryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{myShopping.length} shopping item{myShopping.length > 1 ? "s" : ""}</p>
                    <p className="text-xs text-navy-muted">Need to buy</p>
                  </div>
                  <button onClick={() => router.push("/shopping")} className="hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
              {myRepairs.length > 0 && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#C47B7B15" }}
                  >
                    <Wrench size={16} className="text-rose" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{myRepairs.length} repair{myRepairs.length > 1 ? "s" : ""} to handle</p>
                    <p className="text-xs text-navy-muted">
                      {myRepairs.slice(0, 2).map(r => r.itemName).join(", ")}
                      {myRepairs.length > 2 && ` +${myRepairs.length - 2} more`}
                    </p>
                  </div>
                  <button onClick={() => router.push("/repairs")} className="hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: theme?.textAccent ?? "#1A1A2E" }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <QuickActionButton
              label="Add Expense"
              icon={<Plus size={20} />}
              href="/money"
              color={primaryColor}
            />
            <QuickActionButton
              label="Add Task"
              icon={<Plus size={20} />}
              href="/tasks"
              color={primaryColor}
            />
            <QuickActionButton
              label="Report Problem"
              icon={<Plus size={20} />}
              href="/repairs"
              color={primaryColor}
            />
            <QuickActionButton
              label="Add Shopping"
              icon={<Plus size={20} />}
              href="/shopping"
              color={primaryColor}
            />
          </div>
        </section>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: theme?.textAccent ?? "#1A1A2E" }}
            >
              Recent Home Activity
            </h2>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State for First Time */}
        {recentActivity.length === 0 && (
          <section className="bg-cream rounded-2xl border border-warm-gray/60 p-6 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: softColor }}>
              <Calendar size={24} style={{ color: primaryColor }} />
            </div>
            <h3 className="text-base font-semibold text-navy mb-1">Your home is fresh</h3>
            <p className="text-sm text-navy-muted leading-relaxed">
              Start by adding an expense, a task, or a shopping item. Everything will appear here.
            </p>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
