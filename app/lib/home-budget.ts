import type { Expense, HomeBudgetSettings, HomeBudgetTransaction, ProfileId } from "./types";

export const HOME_BUDGET_MANAGERS: ProfileId[] = ["moustafa", "doaa", "sherien"];
export const DEFAULT_HOME_BUDGET_SETTINGS: HomeBudgetSettings = {
  id: "default",
  standardMonthlyBudget: 0,
  minimumBalance: 200,
};

export function canManageHomeBudget(profileId: ProfileId | null | undefined) {
  return !!profileId && HOME_BUDGET_MANAGERS.includes(profileId);
}

export function getHomeBudgetTotals(transactions: HomeBudgetTransaction[] = [], expenses: Expense[] = []) {
  const totalAdded = transactions
    .filter((item) => item.type === "add")
    .reduce((sum, item) => sum + item.amount, 0);

  const manualRemoved = transactions
    .filter((item) => item.type === "remove")
    .reduce((sum, item) => sum + item.amount, 0);

  const spentFromExpenses = expenses
    .filter((expense) => (expense.paidFrom ?? "personal") === "home-budget")
    .reduce((sum, expense) => sum + expense.amount, 0);

  return {
    totalAdded,
    manualRemoved,
    spentFromExpenses,
    totalUsed: manualRemoved + spentFromExpenses,
    balance: totalAdded - manualRemoved - spentFromExpenses,
  };
}

export function getHomeBudgetGauge(settings: HomeBudgetSettings, balance: number, totalAdded: number) {
  const minimum = Math.max(0, settings.minimumBalance || 0);
  const capacity = Math.max(settings.standardMonthlyBudget || 0, totalAdded, minimum, balance, 1);
  const progress = Math.max(0, Math.min(1, balance / capacity));
  const warningBand = Math.max(minimum, capacity * 0.22);
  const isCritical = balance <= minimum || balance <= 0;
  const isWarning = !isCritical && balance <= warningBand;
  const statusColor = isCritical ? "#B35C4B" : isWarning ? "#C59B52" : "#7A9B76";
  const statusLabel = isCritical ? "Low balance" : isWarning ? "Near minimum" : "Healthy";

  return {
    capacity,
    progress,
    minimum,
    isCritical,
    isWarning,
    statusColor,
    statusLabel,
  };
}
