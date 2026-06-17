"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  Expense,
  Bill,
  Task,
  Repair,
  HomeItem,
  ShoppingItem,
  ActivityLog,
  HomeBudgetTransaction,
  HomeBudgetSettings,
  ProfileId,
  TaskStatus,
} from "../lib/types";
import { generateId } from "../lib/constants";
import { DEFAULT_HOME_BUDGET_SETTINGS } from "../lib/home-budget";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

const STORAGE_KEY = "beitna-data";

type SupabaseClient = NonNullable<ReturnType<typeof getSupabaseClient>>;

interface AppData {
  expenses: Expense[];
  bills: Bill[];
  tasks: Task[];
  repairs: Repair[];
  homeItems: HomeItem[];
  shoppingItems: ShoppingItem[];
  activityLog: ActivityLog[];
  homeBudgetTransactions: HomeBudgetTransaction[];
  homeBudgetSettings: HomeBudgetSettings;
}

const EMPTY_DATA: AppData = {
  expenses: [],
  bills: [],
  tasks: [],
  repairs: [],
  homeItems: [],
  shoppingItems: [],
  activityLog: [],
  homeBudgetTransactions: [],
  homeBudgetSettings: DEFAULT_HOME_BUDGET_SETTINGS,
};

function normalizeData(data: Partial<AppData> | null | undefined): AppData {
  return {
    ...EMPTY_DATA,
    ...(data || {}),
    expenses: (data?.expenses || []).map((expense) => ({ ...expense, paidFrom: expense.paidFrom ?? "personal" })),
    homeBudgetTransactions: data?.homeBudgetTransactions || [],
    homeBudgetSettings: {
      ...DEFAULT_HOME_BUDGET_SETTINGS,
      ...(data?.homeBudgetSettings || {}),
    },
  };
}

function getInitialLocalData(): AppData {
  if (typeof window === "undefined") return EMPTY_DATA;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_DATA;

  try {
    return normalizeData(JSON.parse(raw));
  } catch {
    return EMPTY_DATA;
  }
}

function saveLocalData(data: AppData) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function mapExpense(row: any): Expense {
  return { id: row.id, amount: Number(row.amount), categoryId: row.category_id, description: row.description, date: row.date, paidBy: row.paid_by, paymentMethod: row.payment_method, paidFrom: row.paid_from ?? "personal", receiptUrl: row.receipt_url ?? undefined, notes: row.notes ?? undefined, createdAt: row.created_at };
}

function expenseToRow(expense: Omit<Expense, "id" | "createdAt" | "receiptUrl"> | Partial<Expense>) {
  return { amount: expense.amount, category_id: expense.categoryId, description: expense.description, date: expense.date, paid_by: expense.paidBy, payment_method: expense.paymentMethod, paid_from: expense.paidFrom ?? "personal", notes: expense.notes ?? null, receipt_url: "receiptUrl" in expense ? expense.receiptUrl ?? null : undefined };
}

function mapBudgetTransaction(row: any): HomeBudgetTransaction {
  return { id: row.id, type: row.type, amount: Number(row.amount), description: row.description, date: row.date, performedBy: row.performed_by, notes: row.notes ?? undefined, createdAt: row.created_at };
}

function budgetTransactionToRow(transaction: Omit<HomeBudgetTransaction, "id" | "createdAt"> | Partial<HomeBudgetTransaction>) {
  return { type: transaction.type, amount: transaction.amount, description: transaction.description, date: transaction.date, performed_by: transaction.performedBy, notes: transaction.notes ?? null };
}

function mapHomeBudgetSettings(row: any): HomeBudgetSettings {
  return { id: "default", standardMonthlyBudget: Number(row?.standard_monthly_budget ?? DEFAULT_HOME_BUDGET_SETTINGS.standardMonthlyBudget), minimumBalance: Number(row?.minimum_balance ?? DEFAULT_HOME_BUDGET_SETTINGS.minimumBalance), updatedBy: row?.updated_by ?? undefined, updatedAt: row?.updated_at ?? undefined };
}

function settingsToRow(settings: HomeBudgetSettings) {
  return { id: "default", standard_monthly_budget: settings.standardMonthlyBudget, minimum_balance: settings.minimumBalance, updated_by: settings.updatedBy ?? null, updated_at: new Date().toISOString() };
}

function mapBill(row: any): Bill {
  return { id: row.id, name: row.name, amount: Number(row.amount), dueDate: row.due_date, paid: Boolean(row.paid), paidBy: row.paid_by ?? undefined, paymentDate: row.payment_date ?? undefined, paymentProofUrl: row.payment_proof_url ?? undefined, repeatType: row.repeat_type, notes: row.notes ?? undefined, createdAt: row.created_at };
}

function billToRow(bill: Partial<Bill>) {
  return { name: bill.name, amount: bill.amount, due_date: bill.dueDate, paid: bill.paid, paid_by: bill.paidBy ?? null, payment_date: bill.paymentDate ?? null, payment_proof_url: bill.paymentProofUrl ?? null, repeat_type: bill.repeatType, notes: bill.notes ?? null };
}

function mapTask(row: any): Task {
  return { id: row.id, name: row.name, assignedTo: row.assigned_to, dueDate: row.due_date, priority: row.priority, status: row.status, notes: row.notes ?? undefined, relatedType: row.related_type ?? undefined, relatedId: row.related_id ?? undefined, createdAt: row.created_at };
}

function taskToRow(task: Partial<Task>) {
  return { name: task.name, assigned_to: task.assignedTo, due_date: task.dueDate, priority: task.priority, status: task.status, notes: task.notes ?? null, related_type: task.relatedType ?? null, related_id: task.relatedId ?? null };
}

function mapRepair(row: any): Repair {
  return { id: row.id, itemName: row.item_name, room: row.room, problemDescription: row.problem_description, priority: row.priority, status: row.status, expectedCost: row.expected_cost === null ? undefined : Number(row.expected_cost), actualCost: row.actual_cost === null ? undefined : Number(row.actual_cost), paidBy: row.paid_by ?? undefined, responsiblePerson: row.responsible_person, technicianName: row.technician_name ?? undefined, technicianPhone: row.technician_phone ?? undefined, warrantyStatus: row.warranty_status ?? undefined, relatedHomeItemId: row.related_home_item_id ?? undefined, notes: row.notes ?? undefined, photos: Array.isArray(row.photos) ? row.photos : [], createdAt: row.created_at };
}

function repairToRow(repair: Partial<Repair>) {
  return { item_name: repair.itemName, room: repair.room, problem_description: repair.problemDescription, priority: repair.priority, status: repair.status, expected_cost: repair.expectedCost ?? null, actual_cost: repair.actualCost ?? null, paid_by: repair.paidBy ?? null, responsible_person: repair.responsiblePerson, technician_name: repair.technicianName ?? null, technician_phone: repair.technicianPhone ?? null, warranty_status: repair.warrantyStatus ?? null, related_home_item_id: repair.relatedHomeItemId ?? null, notes: repair.notes ?? null, photos: repair.photos ?? [] };
}

function mapHomeItem(row: any): HomeItem {
  return { id: row.id, name: row.name, brand: row.brand ?? undefined, model: row.model ?? undefined, location: row.location, purchaseDate: row.purchase_date ?? undefined, purchasePrice: row.purchase_price === null ? undefined : Number(row.purchase_price), warrantyEndDate: row.warranty_end_date ?? undefined, receiptUrl: row.receipt_url ?? undefined, manualUrl: row.manual_url ?? undefined, lastRepairDate: row.last_repair_date ?? undefined, totalRepairCost: Number(row.total_repair_cost || 0), notes: row.notes ?? undefined, createdAt: row.created_at };
}

function homeItemToRow(item: Partial<HomeItem>) {
  return { name: item.name, brand: item.brand ?? null, model: item.model ?? null, location: item.location, purchase_date: item.purchaseDate ?? null, purchase_price: item.purchasePrice ?? null, warranty_end_date: item.warrantyEndDate ?? null, receipt_url: item.receiptUrl ?? null, manual_url: item.manualUrl ?? null, last_repair_date: item.lastRepairDate ?? null, total_repair_cost: item.totalRepairCost, notes: item.notes ?? null };
}

function mapShoppingItem(row: any): ShoppingItem {
  return { id: row.id, name: row.name, quantity: row.quantity, estimatedPrice: row.estimated_price === null ? undefined : Number(row.estimated_price), neededByDate: row.needed_by_date ?? undefined, assignedBuyer: row.assigned_buyer ?? undefined, bought: Boolean(row.bought), notes: row.notes ?? undefined, category: row.category, createdAt: row.created_at };
}

function shoppingItemToRow(item: Partial<ShoppingItem>) {
  return { name: item.name, quantity: item.quantity, estimated_price: item.estimatedPrice ?? null, needed_by_date: item.neededByDate ?? null, assigned_buyer: item.assignedBuyer ?? null, bought: item.bought, notes: item.notes ?? null, category: item.category };
}

function mapActivity(row: any): ActivityLog {
  return { id: row.id, actionType: row.action_type, description: row.description, performedBy: row.performed_by, relatedType: row.related_type ?? undefined, relatedId: row.related_id ?? undefined, createdAt: row.created_at };
}

function activityToRow(activity: Omit<ActivityLog, "id" | "createdAt">) {
  return { action_type: activity.actionType, description: activity.description, performed_by: activity.performedBy, related_type: activity.relatedType ?? null, related_id: activity.relatedId ?? null };
}

async function addRemoteActivity(client: SupabaseClient, actionType: string, description: string, performedBy: ProfileId, relatedType?: string, relatedId?: string) {
  const { data } = await client.from("activity_log").insert(activityToRow({ actionType, description, performedBy, relatedType, relatedId })).select().single();
  return data ? mapActivity(data) : null;
}

function addLocalActivity(data: AppData, actionType: string, description: string, performedBy: ProfileId, relatedType?: string, relatedId?: string): AppData {
  const entry: ActivityLog = { id: generateId(), actionType, description, performedBy, relatedType, relatedId, createdAt: new Date().toISOString() };
  return { ...data, activityLog: [entry, ...data.activityLog].slice(0, 100) };
}

async function loadOnlineData(client: SupabaseClient): Promise<AppData> {
  const [expenses, budget, settings, bills, tasks, repairs, homeItems, shoppingItems, activityLog] = await Promise.all([
    client.from("expenses").select("*").order("date", { ascending: false }),
    client.from("home_budget_transactions").select("*").order("created_at", { ascending: false }),
    client.from("home_budget_settings").select("*").eq("id", "default").maybeSingle(),
    client.from("bills").select("*").order("due_date", { ascending: true }),
    client.from("tasks").select("*").order("created_at", { ascending: false }),
    client.from("repairs").select("*").order("created_at", { ascending: false }),
    client.from("home_items").select("*").order("created_at", { ascending: false }),
    client.from("shopping_items").select("*").order("created_at", { ascending: false }),
    client.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  return {
    expenses: (expenses.data || []).map(mapExpense),
    homeBudgetTransactions: (budget.data || []).map(mapBudgetTransaction),
    homeBudgetSettings: settings.data ? mapHomeBudgetSettings(settings.data) : DEFAULT_HOME_BUDGET_SETTINGS,
    bills: (bills.data || []).map(mapBill),
    tasks: (tasks.data || []).map(mapTask),
    repairs: (repairs.data || []).map(mapRepair),
    homeItems: (homeItems.data || []).map(mapHomeItem),
    shoppingItems: (shoppingItems.data || []).map(mapShoppingItem),
    activityLog: (activityLog.data || []).map(mapActivity),
  };
}

export function useDataStore() {
  const online = isSupabaseConfigured();
  const client = getSupabaseClient();
  const [data, setData] = useState<AppData>(online ? EMPTY_DATA : getInitialLocalData);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (online && client) {
      const onlineData = await loadOnlineData(client);
      setData(onlineData);
      setLoaded(true);
      return;
    }
    setData(getInitialLocalData());
    setLoaded(true);
  }, [online, client]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { if (!online && loaded) saveLocalData(data); }, [data, loaded, online]);

  const updateHomeBudgetSettings = useCallback((updates: Partial<HomeBudgetSettings>, by: ProfileId) => {
    const nextSettings: HomeBudgetSettings = {
      ...data.homeBudgetSettings,
      ...updates,
      id: "default",
      standardMonthlyBudget: Number(updates.standardMonthlyBudget ?? data.homeBudgetSettings.standardMonthlyBudget ?? 0),
      minimumBalance: Number(updates.minimumBalance ?? data.homeBudgetSettings.minimumBalance ?? 200),
      updatedBy: by,
      updatedAt: new Date().toISOString(),
    };

    if (online && client) {
      void (async () => {
        await client.from("home_budget_settings").upsert(settingsToRow(nextSettings), { onConflict: "id" });
        const activity = await addRemoteActivity(client, "home-budget", `Updated Home Budget settings`, by, "home-budget-settings", "default");
        setData((prev) => ({ ...prev, homeBudgetSettings: nextSettings, activityLog: activity ? [activity, ...prev.activityLog].slice(0, 100) : prev.activityLog }));
      })();
    }

    setData((prev) => addLocalActivity({ ...prev, homeBudgetSettings: nextSettings }, "home-budget", "Updated Home Budget settings", by, "home-budget-settings", "default"));
    return nextSettings;
  }, [data.homeBudgetSettings, online, client]);

  const addExpense = useCallback((expense: Omit<Expense, "id" | "createdAt" | "receiptUrl">, by: ProfileId) => {
    const sourceLabel = (expense.paidFrom ?? "personal") === "home-budget" ? "Home Budget" : "personal money";
    if (online && client) {
      const fallback: Expense = { ...expense, paidFrom: expense.paidFrom ?? "personal", id: generateId(), receiptUrl: undefined, createdAt: new Date().toISOString() };
      void (async () => {
        const { data: inserted } = await client.from("expenses").insert(expenseToRow(expense)).select().single();
        if (!inserted) return;
        const item = mapExpense(inserted);
        const activity = await addRemoteActivity(client, "expense", `Added expense from ${sourceLabel}: ${expense.description} (${expense.amount} EGP)`, by, "expense", item.id);
        setData((prev) => ({ ...prev, expenses: [item, ...prev.expenses], activityLog: activity ? [activity, ...prev.activityLog].slice(0, 100) : prev.activityLog }));
      })();
      return fallback;
    }
    const item: Expense = { ...expense, paidFrom: expense.paidFrom ?? "personal", id: generateId(), receiptUrl: undefined, createdAt: new Date().toISOString() };
    setData((prev) => addLocalActivity({ ...prev, expenses: [item, ...prev.expenses] }, "expense", `Added expense from ${sourceLabel}: ${expense.description} (${expense.amount} EGP)`, by, "expense", item.id));
    return item;
  }, [online, client]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => { if (online && client) void client.from("expenses").update(expenseToRow(updates)).eq("id", id); setData((prev) => ({ ...prev, expenses: prev.expenses.map((e) => e.id === id ? { ...e, ...updates } : e) })); }, [online, client]);
  const deleteExpense = useCallback((id: string) => { if (online && client) void client.from("expenses").delete().eq("id", id); setData((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) })); }, [online, client]);

  const addHomeBudgetTransaction = useCallback((transaction: Omit<HomeBudgetTransaction, "id" | "createdAt">, by: ProfileId) => {
    const actionText = transaction.type === "add" ? "Added to Home Budget" : "Removed from Home Budget";
    if (online && client) {
      const fallback: HomeBudgetTransaction = { ...transaction, id: generateId(), createdAt: new Date().toISOString() };
      void (async () => {
        const { data: inserted } = await client.from("home_budget_transactions").insert(budgetTransactionToRow(transaction)).select().single();
        if (!inserted) return;
        const item = mapBudgetTransaction(inserted);
        const activity = await addRemoteActivity(client, "home-budget", `${actionText}: ${transaction.description} (${transaction.amount} EGP)`, by, "home-budget", item.id);
        setData((prev) => ({ ...prev, homeBudgetTransactions: [item, ...prev.homeBudgetTransactions], activityLog: activity ? [activity, ...prev.activityLog].slice(0, 100) : prev.activityLog }));
      })();
      return fallback;
    }
    const item: HomeBudgetTransaction = { ...transaction, id: generateId(), createdAt: new Date().toISOString() };
    setData((prev) => addLocalActivity({ ...prev, homeBudgetTransactions: [item, ...prev.homeBudgetTransactions] }, "home-budget", `${actionText}: ${transaction.description} (${transaction.amount} EGP)`, by, "home-budget", item.id));
    return item;
  }, [online, client]);

  const deleteHomeBudgetTransaction = useCallback((id: string) => { if (online && client) void client.from("home_budget_transactions").delete().eq("id", id); setData((prev) => ({ ...prev, homeBudgetTransactions: prev.homeBudgetTransactions.filter((t) => t.id !== id) })); }, [online, client]);

  const addBill = useCallback((bill: Omit<Bill, "id" | "createdAt" | "paid" | "paidBy" | "paymentDate" | "paymentProofUrl">, by: ProfileId) => { const item: Bill = { ...bill, id: generateId(), createdAt: new Date().toISOString(), paid: false, paidBy: undefined, paymentDate: undefined, paymentProofUrl: undefined }; if (online && client) void (async () => { const { data: inserted } = await client.from("bills").insert(billToRow(item)).select().single(); if (inserted) setData((prev) => ({ ...prev, bills: [mapBill(inserted), ...prev.bills] })); await addRemoteActivity(client, "bill", `Added bill: ${bill.name}`, by, "bill", inserted?.id); await refresh(); })(); else setData((prev) => addLocalActivity({ ...prev, bills: [item, ...prev.bills] }, "bill", `Added bill: ${bill.name}`, by, "bill", item.id)); return item; }, [online, client, refresh]);
  const updateBill = useCallback((id: string, updates: Partial<Bill>) => { if (online && client) void client.from("bills").update(billToRow(updates)).eq("id", id); setData((prev) => ({ ...prev, bills: prev.bills.map((b) => b.id === id ? { ...b, ...updates } : b) })); }, [online, client]);
  const deleteBill = useCallback((id: string) => { if (online && client) void client.from("bills").delete().eq("id", id); setData((prev) => ({ ...prev, bills: prev.bills.filter((b) => b.id !== id) })); }, [online, client]);
  const payBill = useCallback((id: string, paidBy: ProfileId, paymentDate: string) => { const updates: Partial<Bill> = { paid: true, paidBy, paymentDate }; updateBill(id, updates); const bill = data.bills.find((b) => b.id === id); if (bill) { if (online && client) void addRemoteActivity(client, "bill", `Paid bill: ${bill.name} (${bill.amount} EGP)`, paidBy, "bill", id).then(() => refresh()); else setData((prev) => addLocalActivity(prev, "bill", `Paid bill: ${bill.name} (${bill.amount} EGP)`, paidBy, "bill", id)); } }, [updateBill, data.bills, online, client, refresh]);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "status">, by: ProfileId) => { const item: Task = { ...task, id: generateId(), status: "pending", createdAt: new Date().toISOString() }; if (online && client) void (async () => { await client.from("tasks").insert(taskToRow(item)); await addRemoteActivity(client, "task", `Added task: ${task.name}`, by, "task", item.id); await refresh(); })(); else setData((prev) => addLocalActivity({ ...prev, tasks: [item, ...prev.tasks] }, "task", `Added task: ${task.name}`, by, "task", item.id)); return item; }, [online, client, refresh]);
  const updateTask = useCallback((id: string, updates: Partial<Task>) => { if (online && client) void client.from("tasks").update(taskToRow(updates)).eq("id", id); setData((prev) => ({ ...prev, tasks: prev.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) })); }, [online, client]);
  const deleteTask = useCallback((id: string) => { if (online && client) void client.from("tasks").delete().eq("id", id); setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) })); }, [online, client]);
  const markTaskDone = useCallback((id: string, by: ProfileId) => { updateTask(id, { status: "done" as TaskStatus }); const task = data.tasks.find((t) => t.id === id); if (task) { if (online && client) void addRemoteActivity(client, "task", `Completed task: ${task.name}`, by, "task", id).then(() => refresh()); else setData((prev) => addLocalActivity(prev, "task", `Completed task: ${task.name}`, by, "task", id)); } }, [updateTask, data.tasks, online, client, refresh]);

  const addRepair = useCallback((repair: Omit<Repair, "id" | "createdAt" | "status" | "photos">, by: ProfileId) => { const item: Repair = { ...repair, id: generateId(), status: "new", photos: [], createdAt: new Date().toISOString() }; if (online && client) void (async () => { await client.from("repairs").insert(repairToRow(item)); await addRemoteActivity(client, "repair", `Reported repair: ${repair.itemName}`, by, "repair", item.id); await refresh(); })(); else setData((prev) => addLocalActivity({ ...prev, repairs: [item, ...prev.repairs] }, "repair", `Reported repair: ${repair.itemName}`, by, "repair", item.id)); return item; }, [online, client, refresh]);
  const updateRepair = useCallback((id: string, updates: Partial<Repair>) => { if (online && client) void client.from("repairs").update(repairToRow(updates)).eq("id", id); setData((prev) => ({ ...prev, repairs: prev.repairs.map((r) => r.id === id ? { ...r, ...updates } : r) })); }, [online, client]);
  const deleteRepair = useCallback((id: string) => { if (online && client) void client.from("repairs").delete().eq("id", id); setData((prev) => ({ ...prev, repairs: prev.repairs.filter((r) => r.id !== id) })); }, [online, client]);

  const addHomeItem = useCallback((item: Omit<HomeItem, "id" | "createdAt" | "totalRepairCost">, by: ProfileId) => { const full: HomeItem = { ...item, id: generateId(), totalRepairCost: 0, createdAt: new Date().toISOString() }; if (online && client) void (async () => { await client.from("home_items").insert(homeItemToRow(full)); await addRemoteActivity(client, "item", `Added home item: ${item.name}`, by, "item", full.id); await refresh(); })(); else setData((prev) => addLocalActivity({ ...prev, homeItems: [full, ...prev.homeItems] }, "item", `Added home item: ${item.name}`, by, "item", full.id)); return full; }, [online, client, refresh]);
  const updateHomeItem = useCallback((id: string, updates: Partial<HomeItem>) => { if (online && client) void client.from("home_items").update(homeItemToRow(updates)).eq("id", id); setData((prev) => ({ ...prev, homeItems: prev.homeItems.map((i) => i.id === id ? { ...i, ...updates } : i) })); }, [online, client]);
  const deleteHomeItem = useCallback((id: string) => { if (online && client) void client.from("home_items").delete().eq("id", id); setData((prev) => ({ ...prev, homeItems: prev.homeItems.filter((i) => i.id !== id) })); }, [online, client]);

  const addShoppingItem = useCallback((item: Omit<ShoppingItem, "id" | "createdAt" | "bought">, by: ProfileId) => { const full: ShoppingItem = { ...item, id: generateId(), bought: false, createdAt: new Date().toISOString() }; if (online && client) void (async () => { await client.from("shopping_items").insert(shoppingItemToRow(full)); await addRemoteActivity(client, "shopping", `Added shopping item: ${item.name}`, by, "shopping", full.id); await refresh(); })(); else setData((prev) => addLocalActivity({ ...prev, shoppingItems: [full, ...prev.shoppingItems] }, "shopping", `Added shopping item: ${item.name}`, by, "shopping", full.id)); return full; }, [online, client, refresh]);
  const updateShoppingItem = useCallback((id: string, updates: Partial<ShoppingItem>) => { if (online && client) void client.from("shopping_items").update(shoppingItemToRow(updates)).eq("id", id); setData((prev) => ({ ...prev, shoppingItems: prev.shoppingItems.map((i) => i.id === id ? { ...i, ...updates } : i) })); }, [online, client]);
  const deleteShoppingItem = useCallback((id: string) => { if (online && client) void client.from("shopping_items").delete().eq("id", id); setData((prev) => ({ ...prev, shoppingItems: prev.shoppingItems.filter((i) => i.id !== id) })); }, [online, client]);
  const markShoppingBought = useCallback((id: string, by: ProfileId) => { updateShoppingItem(id, { bought: true }); const item = data.shoppingItems.find((i) => i.id === id); if (item) { if (online && client) void addRemoteActivity(client, "shopping", `Bought: ${item.name}`, by, "shopping", id).then(() => refresh()); else setData((prev) => addLocalActivity(prev, "shopping", `Bought: ${item.name}`, by, "shopping", id)); } }, [updateShoppingItem, data.shoppingItems, online, client, refresh]);

  const getMonthlyExpenses = useCallback((month: string) => data.expenses.filter((e) => e.date.startsWith(month)), [data.expenses]);
  const getPersonExpenses = useCallback((profileId: ProfileId, month: string) => data.expenses.filter((e) => e.paidBy === profileId && e.date.startsWith(month) && (e.paidFrom ?? "personal") === "personal"), [data.expenses]);
  const getPersonBills = useCallback((profileId: ProfileId, month: string) => data.bills.filter((b) => b.paidBy === profileId && b.paymentDate?.startsWith(month)), [data.bills]);
  const getPersonRepairs = useCallback((profileId: ProfileId) => data.repairs.filter((r) => r.paidBy === profileId || r.responsiblePerson === profileId), [data.repairs]);
  const getPersonTasks = useCallback((profileId: ProfileId) => data.tasks.filter((t) => t.assignedTo === profileId), [data.tasks]);
  const getPersonShopping = useCallback((profileId: ProfileId) => data.shoppingItems.filter((s) => s.assignedBuyer === profileId && !s.bought), [data.shoppingItems]);

  const getPaymentSummary = useCallback((month: string) => {
    const profiles: ProfileId[] = ["moustafa", "doaa", "ahmed", "sherien"];
    return profiles.map((pid) => {
      const totalExpenses = data.expenses.filter((e) => e.paidBy === pid && e.date.startsWith(month) && (e.paidFrom ?? "personal") === "personal").reduce((s, e) => s + e.amount, 0);
      const totalBills = data.bills.filter((b) => b.paidBy === pid && b.paymentDate?.startsWith(month)).reduce((s, b) => s + b.amount, 0);
      const totalRepairs = data.repairs.filter((r) => r.paidBy === pid && r.createdAt.startsWith(month)).reduce((s, r) => s + (r.actualCost || 0), 0);
      return { profileId: pid, totalExpenses, totalBills, totalRepairs, total: totalExpenses + totalBills + totalRepairs };
    });
  }, [data]);

  return { data, loaded, refresh, updateHomeBudgetSettings, addExpense, updateExpense, deleteExpense, addHomeBudgetTransaction, deleteHomeBudgetTransaction, addBill, updateBill, deleteBill, payBill, addTask, updateTask, deleteTask, markTaskDone, addRepair, updateRepair, deleteRepair, addHomeItem, updateHomeItem, deleteHomeItem, addShoppingItem, updateShoppingItem, deleteShoppingItem, markShoppingBought, getMonthlyExpenses, getPersonExpenses, getPersonBills, getPersonRepairs, getPersonTasks, getPersonShopping, getPaymentSummary };
}
