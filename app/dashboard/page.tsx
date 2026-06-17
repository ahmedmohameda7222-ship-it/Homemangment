"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Receipt, Wrench, CheckSquare, ShoppingCart, Plus, Calendar, ArrowRight, Wallet } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useLanguage } from "../context/LanguageContext";
import { useDataStore } from "../hooks/useDataStore";
import { getProfileTheme } from "../lib/profile-themes";
import { getHomeBudgetGauge, getHomeBudgetTotals } from "../lib/home-budget";
import { formatCurrency, getDaysUntil, getCurrentMonth, isOverdue } from "../lib/constants";
import BottomNav from "../components/BottomNav";
import SummaryCard from "../components/SummaryCard";
import QuickActionButton from "../components/QuickActionButton";
import ActivityItem from "../components/ActivityItem";
import HeroBanner from "../components/HeroBanner";
import type { HomeBudgetSettings } from "../lib/types";

export default function DashboardPage() {
  const { selectedProfile, initialized, clearProfile } = useProfile();
  const { t } = useLanguage();
  const router = useRouter();
  const [currentDate] = useState(() => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }));
  const { data, loaded } = useDataStore();
  const theme = getProfileTheme(selectedProfile);

  useEffect(() => {
    if (!initialized) return;
    if (!selectedProfile) router.push("/profiles");
  }, [selectedProfile, initialized, router]);

  if (!initialized || !loaded) {
    return <div className="min-h-full bg-linen flex items-center justify-center"><div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!selectedProfile) {
    router.push("/profiles");
    return null;
  }

  const month = getCurrentMonth();
  const monthlyExpenses = data.expenses.filter((e) => e.date.startsWith(month));
  const totalSpending = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const budgetTotals = getHomeBudgetTotals(data.homeBudgetTransactions, data.expenses);
  const upcomingBills = data.bills.filter((b) => !b.paid && getDaysUntil(b.dueDate) >= 0 && getDaysUntil(b.dueDate) <= 7);
  const overdueBills = data.bills.filter((b) => !b.paid && isOverdue(b.dueDate));
  const openRepairs = data.repairs.filter((r) => r.status !== "closed" && r.status !== "fixed");
  const myRepairs = openRepairs.filter((r) => r.responsiblePerson === selectedProfile || r.paidBy === selectedProfile);
  const myTasks = data.tasks.filter((task) => task.assignedTo === selectedProfile && task.status !== "done");
  const lateTasks = myTasks.filter((task) => task.dueDate && isOverdue(task.dueDate));
  const myShopping = data.shoppingItems.filter((item) => item.assignedBuyer === selectedProfile && !item.bought);
  const recentActivity = data.activityLog.slice(0, 8);

  const handleSwitchProfile = () => {
    clearProfile();
    router.push("/profiles");
  };

  const primaryColor = theme.primary;
  const softColor = theme.soft;
  const textAccent = theme.textAccent;

  return (
    <div className="min-h-full bg-linen pb-28">
      <HeroBanner profileId={selectedProfile} onSwitchProfile={handleSwitchProfile} />

      <header className="relative z-10 px-5 -mt-12 pb-3">
        <div className="max-w-3xl mx-auto rounded-[1.75rem] bg-cream/95 border border-white/80 shadow-[0_18px_44px_rgba(26,26,46,0.09)] backdrop-blur p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold text-cream ring-4 ring-white shadow-lg shrink-0" style={{ backgroundColor: primaryColor }}>
              {theme.displayName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-navy-muted font-medium">{currentDate}</p>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight" style={{ color: textAccent }}>{t(theme.greeting)}</h1>
              <p className="text-sm sm:text-base text-navy-muted mt-1">{t(theme.subtitle)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 space-y-7">
        <HomeBudgetCircle balance={budgetTotals.balance} totalAdded={budgetTotals.totalAdded} totalUsed={budgetTotals.totalUsed} settings={data.homeBudgetSettings} color={primaryColor} onClick={() => router.push("/home-budget")} />

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>{t("Today's Home Summary")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <SummaryCard title="This Month" value={formatCurrency(totalSpending)} subtitle={`${monthlyExpenses.length} ${t("expenses")}`} icon={<DollarSign size={21} />} color={primaryColor} href="/money" />
            <SummaryCard title="Bills Due" value={`${upcomingBills.length + overdueBills.length}`} subtitle={overdueBills.length > 0 ? `${overdueBills.length} ${t("overdue")}` : "Up to date"} icon={<Receipt size={21} />} color={overdueBills.length > 0 ? "#C47B7B" : primaryColor} href="/bills" />
            <SummaryCard title="Open Repairs" value={String(openRepairs.length)} subtitle={myRepairs.length > 0 ? `${myRepairs.length} ${t("yours")}` : "All handled"} icon={<Wrench size={21} />} color={openRepairs.length > 0 ? "#C4A47B" : primaryColor} href="/repairs" />
            <SummaryCard title="My Tasks" value={String(myTasks.length)} subtitle={lateTasks.length > 0 ? `${lateTasks.length} ${t("Late")}` : "On track"} icon={<CheckSquare size={21} />} color={lateTasks.length > 0 ? "#C47B7B" : primaryColor} href="/tasks" />
          </div>
        </section>

        {(myTasks.length > 0 || myShopping.length > 0 || myRepairs.length > 0) && (
          <section className="animate-fade-in-up">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>{t("My Responsibilities")}</h2>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 sm:p-5 space-y-3 shadow-[0_10px_30px_rgba(26,26,46,0.04)]">
              {myTasks.length > 0 && <ResponsibilityRow icon={<CheckSquare size={16} />} color={primaryColor} title={`${myTasks.length} ${t("tasks")}`} subtitle={`${myTasks.slice(0, 2).map((item) => item.name).join(", ")}${myTasks.length > 2 ? ` +${myTasks.length - 2} ${t("More")}` : ""}`} onClick={() => router.push("/tasks")} />}
              {myShopping.length > 0 && <ResponsibilityRow icon={<ShoppingCart size={16} />} color={primaryColor} title={`${myShopping.length} ${t("items")}`} subtitle={t("Shopping")} onClick={() => router.push("/shopping")} />}
              {myRepairs.length > 0 && <ResponsibilityRow icon={<Wrench size={16} />} color="#C47B7B" title={`${myRepairs.length} ${t("repairs")}`} subtitle={`${myRepairs.slice(0, 2).map((item) => item.itemName).join(", ")}${myRepairs.length > 2 ? ` +${myRepairs.length - 2} ${t("More")}` : ""}`} onClick={() => router.push("/repairs")} />}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>{t("Quick Actions")}</h2>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <QuickActionButton label="Add Expense" icon={<Plus size={21} />} href="/money" color={primaryColor} />
            <QuickActionButton label="Home Budget" icon={<Wallet size={21} />} href="/home-budget" color={primaryColor} />
            <QuickActionButton label="Add Task" icon={<Plus size={21} />} href="/tasks" color={primaryColor} />
            <QuickActionButton label="Report Problem" icon={<Plus size={21} />} href="/repairs" color={primaryColor} />
          </div>
        </section>

        {recentActivity.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textAccent }}>{t("Recent Home Activity")}</h2>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 sm:p-5 shadow-[0_10px_30px_rgba(26,26,46,0.04)]">
              {recentActivity.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
            </div>
          </section>
        )}

        {recentActivity.length === 0 && (
          <section className="bg-cream rounded-2xl border border-warm-gray/60 p-6 text-center shadow-[0_10px_30px_rgba(26,26,46,0.04)]">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: softColor }}><Calendar size={24} style={{ color: primaryColor }} /></div>
            <h3 className="text-base font-semibold text-navy mb-1">{t("Your home is fresh")}</h3>
            <p className="text-sm text-navy-muted leading-relaxed">{t("Start by adding an expense, a task, or a shopping item. Everything will appear here.")}</p>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function HomeBudgetCircle({ balance, totalAdded, totalUsed, settings, color, onClick }: { balance: number; totalAdded: number; totalUsed: number; settings: HomeBudgetSettings; color: string; onClick: () => void }) {
  const { t } = useLanguage();
  const gauge = getHomeBudgetGauge(settings, balance, totalAdded);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progressLength = circumference * gauge.progress;
  const amountLabel = formatCurrency(balance).replace(" EGP", "");

  return (
    <section className="flex flex-col items-center justify-center pt-2 pb-1">
      <button onClick={onClick} className="group relative flex aspect-square w-[17.25rem] sm:w-[18.25rem] flex-col items-center justify-center rounded-full bg-cream border border-white shadow-[0_24px_58px_rgba(26,26,46,0.12)] transition-transform active:scale-[0.985] profile-focus overflow-hidden">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 260 260" aria-hidden="true">
          <circle cx="130" cy="130" r={radius} fill="none" stroke="rgba(232,226,216,0.9)" strokeWidth="7" />
          <circle cx="130" cy="130" r={radius} fill="none" stroke={gauge.statusColor} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${progressLength} ${circumference}`} className="transition-all duration-500" />
        </svg>
        <div className="absolute inset-6 rounded-full border border-warm-gray/60" />
        <div className="relative z-10 flex w-[72%] flex-col items-center text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: color + "18", color }}><Wallet size={21} /></div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-navy-muted whitespace-nowrap">{t("Home Budget")}</p>
          <div className="mt-2 flex items-baseline justify-center gap-1.5 whitespace-nowrap text-navy">
            <span className="text-[2.8rem] sm:text-[3.05rem] leading-none font-bold tabular-nums">{amountLabel}</span>
            <span className="text-sm sm:text-base font-bold tracking-wide">EGP</span>
          </div>
          <p className="mt-2 text-xs font-semibold" style={{ color: gauge.statusColor }}>{t(gauge.statusLabel)}</p>
          <p className="mt-1 text-[11px] text-navy-muted">{t("Tap to manage")}</p>
        </div>
      </button>
      <div className="mt-3 grid w-full max-w-[20rem] grid-cols-2 gap-2 text-[11px] text-navy-muted">
        <span className="rounded-2xl bg-cream border border-warm-gray/60 px-3 py-2 text-center">{t("Standard")} {formatCurrency(settings.standardMonthlyBudget)}</span>
        <span className="rounded-2xl bg-cream border border-warm-gray/60 px-3 py-2 text-center">{t("Min")} {formatCurrency(settings.minimumBalance)}</span>
        <span className="rounded-2xl bg-cream border border-warm-gray/60 px-3 py-2 text-center">{t("In")} {formatCurrency(totalAdded)}</span>
        <span className="rounded-2xl bg-cream border border-warm-gray/60 px-3 py-2 text-center">{t("Used")} {formatCurrency(totalUsed)}</span>
      </div>
    </section>
  );
}

function ResponsibilityRow({ icon, color, title, subtitle, onClick }: { icon: React.ReactNode; color: string; title: string; subtitle: string; onClick: () => void }) {
  const { isArabic } = useLanguage();
  return <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "15", color }}>{icon}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-navy">{title}</p><p className="text-xs text-navy-muted truncate">{subtitle}</p></div><button onClick={onClick} className="hover:opacity-70 transition-opacity profile-focus rounded-lg" style={{ color }}><ArrowRight size={18} style={{ transform: isArabic ? "scaleX(-1)" : undefined }} /></button></div>;
}
