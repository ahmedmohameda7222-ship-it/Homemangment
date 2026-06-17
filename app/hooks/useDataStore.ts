"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  Expense, Bill, Task, Repair, HomeItem, ShoppingItem, ActivityLog,
  ProfileId, TaskStatus, RepairStatus,
} from "../lib/types";
import { generateId, getToday, getCurrentMonth } from "../lib/constants";

const STORAGE_KEY = "beitna-data";

interface AppData {
  expenses: Expense[];
  bills: Bill[];
  tasks: Task[];
  repairs: Repair[];
  homeItems: HomeItem[];
  shoppingItems: ShoppingItem[];
  activityLog: ActivityLog[];
}

function getInitialData(): AppData {
  if (typeof window === "undefined") return { expenses: [], bills: [], tasks: [], repairs: [], homeItems: [], shoppingItems: [], activityLog: [] };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  return { expenses: [], bills: [], tasks: [], repairs: [], homeItems: [], shoppingItems: [], activityLog: [] };
}

function saveData(data: AppData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function addActivity(data: AppData, actionType: string, description: string, performedBy: ProfileId, relatedType?: string, relatedId?: string): AppData {
  const entry: ActivityLog = {
    id: generateId(),
    actionType,
    description,
    performedBy,
    relatedType,
    relatedId,
    createdAt: new Date().toISOString(),
  };
  return { ...data, activityLog: [entry, ...data.activityLog].slice(0, 100) };
}

export function useDataStore() {
  const [data, setData] = useState<AppData>(getInitialData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(getInitialData());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveData(data);
  }, [data, loaded]);

  const addExpense = useCallback((expense: Omit<Expense, "id" | "createdAt" | "receiptUrl">, by: ProfileId) => {
    const item: Expense = { ...expense, id: generateId(), receiptUrl: undefined, createdAt: new Date().toISOString() };
    setData(prev => addActivity({ ...prev, expenses: [item, ...prev.expenses] }, "expense", `Added expense: ${expense.description} (${expense.amount} EGP)`, by, "expense", item.id));
    return item;
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  }, []);

  const addBill = useCallback((bill: Omit<Bill, "id" | "createdAt" | "paid" | "paidBy" | "paymentDate" | "paymentProofUrl">, by: ProfileId) => {
    const item: Bill = { ...bill, id: generateId(), createdAt: new Date().toISOString(), paid: false, paidBy: undefined, paymentDate: undefined, paymentProofUrl: undefined };
    setData(prev => addActivity({ ...prev, bills: [item, ...prev.bills] }, "bill", `Added bill: ${bill.name}`, by, "bill", item.id));
    return item;
  }, []);

  const updateBill = useCallback((id: string, updates: Partial<Bill>) => {
    setData(prev => ({ ...prev, bills: prev.bills.map(b => b.id === id ? { ...b, ...updates } : b) }));
  }, []);

  const deleteBill = useCallback((id: string) => {
    setData(prev => ({ ...prev, bills: prev.bills.filter(b => b.id !== id) }));
  }, []);

  const payBill = useCallback((id: string, paidBy: ProfileId, paymentDate: string) => {
    setData(prev => {
      const bill = prev.bills.find(b => b.id === id);
      const updated = { ...prev, bills: prev.bills.map(b => b.id === id ? { ...b, paid: true, paidBy, paymentDate } : b) };
      if (bill) return addActivity(updated, "bill", `Paid bill: ${bill.name} (${bill.amount} EGP)`, paidBy, "bill", id);
      return updated;
    });
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "status">, by: ProfileId) => {
    const item: Task = { ...task, id: generateId(), status: "pending", createdAt: new Date().toISOString() };
    setData(prev => addActivity({ ...prev, tasks: [item, ...prev.tasks] }, "task", `Added task: ${task.name}`, by, "task", item.id));
    return item;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  const markTaskDone = useCallback((id: string, by: ProfileId) => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === id);
      const updated = { ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, status: "done" as TaskStatus } : t) };
      if (task) return addActivity(updated, "task", `Completed task: ${task.name}`, by, "task", id);
      return updated;
    });
  }, []);

  const addRepair = useCallback((repair: Omit<Repair, "id" | "createdAt" | "status" | "photos">, by: ProfileId) => {
    const item: Repair = { ...repair, id: generateId(), status: "new", photos: [], createdAt: new Date().toISOString() };
    setData(prev => addActivity({ ...prev, repairs: [item, ...prev.repairs] }, "repair", `Reported repair: ${repair.itemName}`, by, "repair", item.id));
    return item;
  }, []);

  const updateRepair = useCallback((id: string, updates: Partial<Repair>) => {
    setData(prev => ({ ...prev, repairs: prev.repairs.map(r => r.id === id ? { ...r, ...updates } : r) }));
  }, []);

  const deleteRepair = useCallback((id: string) => {
    setData(prev => ({ ...prev, repairs: prev.repairs.filter(r => r.id !== id) }));
  }, []);

  const addHomeItem = useCallback((item: Omit<HomeItem, "id" | "createdAt" | "totalRepairCost">, by: ProfileId) => {
    const full: HomeItem = { ...item, id: generateId(), totalRepairCost: 0, createdAt: new Date().toISOString() };
    setData(prev => addActivity({ ...prev, homeItems: [full, ...prev.homeItems] }, "item", `Added home item: ${item.name}`, by, "item", full.id));
    return full;
  }, []);

  const updateHomeItem = useCallback((id: string, updates: Partial<HomeItem>) => {
    setData(prev => ({ ...prev, homeItems: prev.homeItems.map(i => i.id === id ? { ...i, ...updates } : i) }));
  }, []);

  const deleteHomeItem = useCallback((id: string) => {
    setData(prev => ({ ...prev, homeItems: prev.homeItems.filter(i => i.id !== id) }));
  }, []);

  const addShoppingItem = useCallback((item: Omit<ShoppingItem, "id" | "createdAt" | "bought">, by: ProfileId) => {
    const full: ShoppingItem = { ...item, id: generateId(), bought: false, createdAt: new Date().toISOString() };
    setData(prev => addActivity({ ...prev, shoppingItems: [full, ...prev.shoppingItems] }, "shopping", `Added shopping item: ${item.name}`, by, "shopping", full.id));
    return full;
  }, []);

  const updateShoppingItem = useCallback((id: string, updates: Partial<ShoppingItem>) => {
    setData(prev => ({ ...prev, shoppingItems: prev.shoppingItems.map(i => i.id === id ? { ...i, ...updates } : i) }));
  }, []);

  const deleteShoppingItem = useCallback((id: string) => {
    setData(prev => ({ ...prev, shoppingItems: prev.shoppingItems.filter(i => i.id !== id) }));
  }, []);

  const markShoppingBought = useCallback((id: string, by: ProfileId) => {
    setData(prev => {
      const item = prev.shoppingItems.find(i => i.id === id);
      const updated = { ...prev, shoppingItems: prev.shoppingItems.map(i => i.id === id ? { ...i, bought: true } : i) };
      if (item) return addActivity(updated, "shopping", `Bought: ${item.name}`, by, "shopping", id);
      return updated;
    });
  }, []);

  const getMonthlyExpenses = useCallback((month: string) => {
    return data.expenses.filter(e => e.date.startsWith(month));
  }, [data.expenses]);

  const getPersonExpenses = useCallback((profileId: ProfileId, month: string) => {
    return data.expenses.filter(e => e.paidBy === profileId && e.date.startsWith(month));
  }, [data.expenses]);

  const getPersonBills = useCallback((profileId: ProfileId, month: string) => {
    return data.bills.filter(b => b.paidBy === profileId && b.paymentDate?.startsWith(month));
  }, [data.bills]);

  const getPersonRepairs = useCallback((profileId: ProfileId) => {
    return data.repairs.filter(r => r.paidBy === profileId || r.responsiblePerson === profileId);
  }, [data.repairs]);

  const getPersonTasks = useCallback((profileId: ProfileId) => {
    return data.tasks.filter(t => t.assignedTo === profileId);
  }, [data.tasks]);

  const getPersonShopping = useCallback((profileId: ProfileId) => {
    return data.shoppingItems.filter(s => s.assignedBuyer === profileId && !s.bought);
  }, [data.shoppingItems]);

  const getPaymentSummary = useCallback((month: string) => {
    const profiles: ProfileId[] = ["moustafa", "doaa", "ahmed", "sherien"];
    return profiles.map(pid => {
      const totalExpenses = data.expenses.filter(e => e.paidBy === pid && e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0);
      const totalBills = data.bills.filter(b => b.paidBy === pid && b.paymentDate?.startsWith(month)).reduce((s, b) => s + b.amount, 0);
      const totalRepairs = data.repairs.filter(r => r.paidBy === pid && r.createdAt.startsWith(month)).reduce((s, r) => s + (r.actualCost || 0), 0);
      return { profileId: pid, totalExpenses, totalBills, totalRepairs, total: totalExpenses + totalBills + totalRepairs };
    });
  }, [data]);

  return {
    data,
    loaded,
    addExpense, updateExpense, deleteExpense,
    addBill, updateBill, deleteBill, payBill,
    addTask, updateTask, deleteTask, markTaskDone,
    addRepair, updateRepair, deleteRepair,
    addHomeItem, updateHomeItem, deleteHomeItem,
    addShoppingItem, updateShoppingItem, deleteShoppingItem, markShoppingBought,
    getMonthlyExpenses, getPersonExpenses, getPersonBills, getPersonRepairs, getPersonTasks, getPersonShopping, getPaymentSummary,
  };
}
