"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, Receipt, Wrench, ShoppingCart, Users, ArrowRight, Calendar,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  PROFILES, EXPENSE_CATEGORIES, getCurrentMonth, getPreviousMonth, getMonthLabel, formatCurrency, getProfileById, getCategoryById, getDaysUntil, isOverdue,
} from "../lib/constants";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function ReportsPage() {
  const { selectedProfile } = useProfile();
  const router = useRouter();
  const { data, getPaymentSummary } = useDataStore();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const monthLabel = getMonthLabel(selectedMonth);
  const prevMonth = getPreviousMonth(selectedMonth);
  const prevMonthLabel = getMonthLabel(prevMonth);

  const monthlyExpenses = data.expenses.filter((e) => e.date.startsWith(selectedMonth));
  const totalSpending = monthlyExpenses.reduce((s, e) => s + e.amount, 0);

  const prevMonthlyExpenses = data.expenses.filter((e) => e.date.startsWith(prevMonth));
  const prevTotalSpending = prevMonthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const comparison = prevTotalSpending > 0 ? ((totalSpending - prevTotalSpending) / prevTotalSpending) * 100 : 0;

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    monthlyExpenses.forEach((e) => {
      map.set(e.categoryId, (map.get(e.categoryId) || 0) + e.amount);
    });
    return Array.from(map.entries())
      .map(([id, amount]) => ({ id, amount, category: getCategoryById(id) }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyExpenses]);

  const topExpense = monthlyExpenses.length > 0
    ? monthlyExpenses.reduce((max, e) => e.amount > max.amount ? e : max, monthlyExpenses[0])
    : null;

  const monthlyBills = data.bills.filter((b) => b.dueDate.startsWith(selectedMonth));
  const paidBills = monthlyBills.filter((b) => b.paid).length;
  const totalBills = monthlyBills.length;
  const billsAmount = monthlyBills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);

  const monthlyRepairs = data.repairs.filter((r) => r.createdAt.startsWith(selectedMonth));
  const repairsCompleted = monthlyRepairs.filter((r) => r.status === "fixed" || r.status === "closed" || r.status === "paid").length;
  const repairsTotalCost = monthlyRepairs.reduce((s, r) => s + (r.actualCost || 0), 0);

  const shoppingNeeded = data.shoppingItems.filter((s) => !s.bought);
  const shoppingTotal = shoppingNeeded.reduce((s, i) => s + (i.estimatedPrice || 0), 0);

  const openRepairs = data.repairs.filter((r) => r.status !== "closed" && r.status !== "fixed");
  const overdueBills = data.bills.filter((b) => !b.paid && isOverdue(b.dueDate));
  const upcomingBills = data.bills.filter((b) => !b.paid && getDaysUntil(b.dueDate) >= 0 && getDaysUntil(b.dueDate) <= 7);

  const paymentSummary = getPaymentSummary(selectedMonth);

  const mostRepairedItem = useMemo(() => {
    const itemCounts = new Map<string, number>();
    data.repairs.forEach((r) => {
      itemCounts.set(r.itemName, (itemCounts.get(r.itemName) || 0) + 1);
    });
    return Array.from(itemCounts.entries()).sort((a, b) => b[1] - a[1])[0] || null;
  }, [data.repairs]);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  const months = [getPreviousMonth(getPreviousMonth(selectedMonth)), getPreviousMonth(selectedMonth), selectedMonth];

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header title="Reports" subtitle="Your home at a glance" showBack={false} />

      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        {/* Month Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedMonth === m
                  ? "bg-olive text-cream"
                  : "bg-cream text-navy-muted border border-warm-gray/60"
              }`}
            >
              {getMonthLabel(m)}
            </button>
          ))}
        </div>

        {/* Monthly Spending Card */}
        <section className="bg-cream rounded-2xl border border-warm-gray/60 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-olive/15 flex items-center justify-center">
              <DollarSign size={22} className="text-olive" />
            </div>
            <div>
              <p className="text-xs font-medium text-navy-muted uppercase tracking-wider">{monthLabel} Spending</p>
              <p className="text-2xl font-bold text-navy">{formatCurrency(totalSpending)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {comparison !== 0 && (
              <span className={`text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 ${
                comparison > 0 ? "bg-rose/10 text-rose" : "bg-sage/10 text-sage"
              }`}>
                {comparison > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(comparison).toFixed(1)}% vs {prevMonthLabel}
              </span>
            )}
            <span className="text-xs text-navy-muted">{monthlyExpenses.length} expenses</span>
          </div>
          {topExpense && (
            <div className="mt-3 pt-3 border-t border-warm-gray/40">
              <p className="text-xs text-navy-muted">Top expense:</p>
              <p className="text-sm font-semibold text-navy">{topExpense.description} — {formatCurrency(topExpense.amount)}</p>
            </div>
          )}
        </section>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Category Breakdown</h2>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-3">
              {categoryBreakdown.map((cb) => (
                <div key={cb.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-navy font-medium">{cb.category?.name || cb.id}</span>
                    <span className="text-sm text-navy font-semibold">{formatCurrency(cb.amount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-warm-gray">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${totalSpending > 0 ? (cb.amount / totalSpending) * 100 : 0}%`,
                        backgroundColor: cb.category?.color || "#6B6B80",
                      }}
                    />
                  </div>
                  <p className="text-xs text-navy-muted mt-0.5">
                    {totalSpending > 0 ? ((cb.amount / totalSpending) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Who Paid What */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Who Paid What</h2>
          <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-3">
            {paymentSummary.map((ps) => {
              const profile = getProfileById(ps.profileId);
              const totalAll = paymentSummary.reduce((s, p) => s + p.total, 0);
              return (
                <div key={ps.profileId} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-cream shrink-0"
                    style={{ backgroundColor: profile?.color || "#6B6B80" }}
                  >
                    {profile?.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-navy">{profile?.name}</span>
                      <span className="text-sm font-semibold text-navy">{formatCurrency(ps.total)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-warm-gray mt-1">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${totalAll > 0 ? (ps.total / totalAll) * 100 : 0}%`,
                          backgroundColor: profile?.color || "#6B6B80",
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-navy-muted mt-0.5">
                      {formatCurrency(ps.totalExpenses)} expenses · {formatCurrency(ps.totalBills)} bills · {formatCurrency(ps.totalRepairs)} repairs
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Summary Grid */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Home Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt size={16} className="text-sky" />
                <span className="text-xs text-navy-muted font-medium">Bills</span>
              </div>
              <p className="text-lg font-bold text-navy">{paidBills}/{totalBills} Paid</p>
              <p className="text-xs text-navy-muted">{formatCurrency(billsAmount)} total</p>
              {overdueBills.length > 0 && (
                <p className="text-xs text-rose mt-1">{overdueBills.length} overdue</p>
              )}
              {upcomingBills.length > 0 && (
                <p className="text-xs text-champagne-dark mt-1">{upcomingBills.length} due soon</p>
              )}
            </div>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wrench size={16} className="text-amber" />
                <span className="text-xs text-navy-muted font-medium">Repairs</span>
              </div>
              <p className="text-lg font-bold text-navy">{repairsCompleted} Done</p>
              <p className="text-xs text-navy-muted">{formatCurrency(repairsTotalCost)} total</p>
              {openRepairs.length > 0 && (
                <p className="text-xs text-rose mt-1">{openRepairs.length} open</p>
              )}
            </div>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart size={16} className="text-champagne" />
                <span className="text-xs text-navy-muted font-medium">Shopping</span>
              </div>
              <p className="text-lg font-bold text-navy">{shoppingNeeded.length} Items</p>
              <p className="text-xs text-navy-muted">{formatCurrency(shoppingTotal)} needed</p>
            </div>
            <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-sage" />
                <span className="text-xs text-navy-muted font-medium">Tasks</span>
              </div>
              <p className="text-lg font-bold text-navy">{data.tasks.filter((t) => t.status !== "done").length} Open</p>
              <p className="text-xs text-navy-muted">{data.tasks.filter((t) => t.status === "done").length} completed</p>
            </div>
          </div>
        </section>

        {/* Insights */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Insights</h2>
          <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-2">
            {categoryBreakdown.length > 0 && (
              <p className="text-sm text-navy">
                <span className="font-semibold">{categoryBreakdown[0].category?.name}</span> is the highest spending category this month.
              </p>
            )}
            {mostRepairedItem && (
              <p className="text-sm text-navy">
                <span className="font-semibold">{mostRepairedItem[0]}</span> has the most repair history ({mostRepairedItem[1]} repairs).
              </p>
            )}
            {overdueBills.length > 0 && (
              <p className="text-sm text-rose">
                <span className="font-semibold">{overdueBills.length} bill{overdueBills.length > 1 ? "s are" : " is"}</span> overdue and need payment.
              </p>
            )}
            {openRepairs.length > 0 && (
              <p className="text-sm text-navy">
                <span className="font-semibold">{openRepairs.length} repair{openRepairs.length > 1 ? "s" : ""}</span> still need attention.
              </p>
            )}
            {shoppingNeeded.length > 0 && (
              <p className="text-sm text-navy">
                <span className="font-semibold">{shoppingNeeded.length} shopping item{shoppingNeeded.length > 1 ? "s" : ""}</span> are still needed.
              </p>
            )}
            {data.tasks.filter((t) => t.status !== "done" && t.dueDate && isOverdue(t.dueDate)).length > 0 && (
              <p className="text-sm text-rose">
                <span className="font-semibold">{data.tasks.filter((t) => t.status !== "done" && t.dueDate && isOverdue(t.dueDate)).length} task(s)</span> are overdue.
              </p>
            )}
            {categoryBreakdown.length === 0 && overdueBills.length === 0 && openRepairs.length === 0 && shoppingNeeded.length === 0 && data.tasks.filter((t) => t.status !== "done").length === 0 && (
              <p className="text-sm text-navy-muted">Your home is well organized. Add some data to see insights here.</p>
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
