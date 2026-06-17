import type { Expense, HomeBudgetTransaction, ProfileId } from "./types";

export const HOME_BUDGET_MANAGERS: ProfileId[] = ["moustafa", "doaa", "sherien"];

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
