import type { Profile, ProfileId, ExpenseCategory, Expense, Bill, Task, Repair, HomeItem, ShoppingItem, ActivityLog } from "./types";

export const PROFILES: Profile[] = [
  { id: "moustafa", name: "Moustafa", nickname: "Pappy", role: "Father", greeting: "Welcome back, ya Pappy.", color: "#465431" },
  { id: "doaa", name: "Doaa", nickname: "Mamy", role: "Mother", greeting: "Welcome back, ya Mamy.", color: "#C47B7B" },
  { id: "ahmed", name: "Ahmed", nickname: "Ahmed", role: "Son", greeting: "Welcome back, Ahmed.", color: "#7BA4C4" },
  { id: "sherien", name: "Sherien", nickname: "Sherien", role: "Daughter", greeting: "Welcome back, Sherien.", color: "#C4A47B" },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: "groceries", name: "Groceries", icon: "ShoppingBasket", color: "#8A9A6B" },
  { id: "bills", name: "Bills", icon: "Receipt", color: "#7BA4C4" },
  { id: "maintenance", name: "Maintenance", icon: "Wrench", color: "#C4A47B" },
  { id: "home-supplies", name: "Home Supplies", icon: "Home", color: "#6B6B80" },
  { id: "appliances", name: "Appliances", icon: "Tv", color: "#465431" },
  { id: "medicine", name: "Medicine", icon: "Pill", color: "#C47B7B" },
  { id: "transportation", name: "Transportation", icon: "Car", color: "#2D2D44" },
  { id: "guests", name: "Guests", icon: "Users", color: "#D8B86F" },
  { id: "personal-care", name: "Personal Care", icon: "Heart", color: "#8A9A6B" },
  { id: "kitchen", name: "Kitchen", icon: "ChefHat", color: "#C4A47B" },
  { id: "bathroom", name: "Bathroom", icon: "Bath", color: "#7BA4C4" },
  { id: "other", name: "Other", icon: "MoreHorizontal", color: "#6B6B80" },
];

export const SHOPPING_CATEGORIES = [
  { id: "food", name: "Food", icon: "Apple" },
  { id: "vegetables-fruits", name: "Vegetables & Fruits", icon: "Carrot" },
  { id: "meat-chicken-fish", name: "Meat / Chicken / Fish", icon: "Beef" },
  { id: "cleaning-supplies", name: "Cleaning Supplies", icon: "Sparkles" },
  { id: "bathroom", name: "Bathroom", icon: "Bath" },
  { id: "kitchen", name: "Kitchen", icon: "ChefHat" },
  { id: "pharmacy", name: "Pharmacy", icon: "Pill" },
  { id: "home-tools", name: "Home Tools", icon: "Wrench" },
  { id: "spare-parts", name: "Spare Parts", icon: "Cog" },
  { id: "other", name: "Other", icon: "MoreHorizontal" },
];

export const REPAIR_STATUS_LABELS: Record<string, string> = {
  "new": "New",
  "need-repair": "Needs Repair",
  "technician-contacted": "Technician Contacted",
  "in-progress": "In Progress",
  "fixed": "Fixed",
  "paid": "Paid",
  "closed": "Closed",
};

export const REPAIR_STATUS_COLORS: Record<string, string> = {
  "new": "#7BA4C4",
  "need-repair": "#C47B7B",
  "technician-contacted": "#D8B86F",
  "in-progress": "#C4A47B",
  "fixed": "#8A9A6B",
  "paid": "#465431",
  "closed": "#6B6B80",
};

export const TASK_PRIORITY_COLORS: Record<string, string> = {
  low: "#8A9A6B",
  medium: "#D8B86F",
  high: "#C47B7B",
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  done: "Done",
  late: "Late",
};

export const WELCOME_MESSAGES: Record<ProfileId, string[]> = {
  moustafa: ["Welcome back, ya Pappy.", "The house is in your hands today.", "Here's what needs your attention."],
  doaa: ["Welcome back, ya Mamy.", "Everything at home is ready for you.", "Here's today's home summary."],
  ahmed: ["Welcome back, Ahmed.", "Let's keep Beitna organized.", "Here's what's happening at home."],
  sherien: ["Welcome back, Sherien.", "Here's your calm home overview.", "Check your tasks and updates."],
};

export const BILL_REPEAT_LABELS: Record<string, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
  custom: "Custom",
  "one-time": "One-time",
};

export const PAYMENT_METHODS = ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Mobile Payment", "Other"];
export const ROOMS = ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Hallway", "Balcony", "Garden", "Garage", "Other"];
export const LOCATIONS = ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Hallway", "Balcony", "Garden", "Garage", "Storage", "Other"];

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("en-EG")} EGP`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDaysUntil(date: string): number {
  const target = new Date(date); target.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getRandomWelcomeMessage(profileId: ProfileId): string {
  const messages = WELCOME_MESSAGES[profileId];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getMonthLabel(dateStr: string): string {
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getPreviousMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-").map(Number);
  const date = new Date(year, month - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function isOverdue(date: string): boolean {
  return getDaysUntil(date) < 0;
}

export function isDueSoon(date: string, days: number = 3): boolean {
  const d = getDaysUntil(date);
  return d >= 0 && d <= days;
}

export function getProfileById(id: ProfileId): Profile | undefined {
  return PROFILES.find(p => p.id === id);
}

export function getCategoryById(id: string): ExpenseCategory | undefined {
  return EXPENSE_CATEGORIES.find(c => c.id === id);
}
