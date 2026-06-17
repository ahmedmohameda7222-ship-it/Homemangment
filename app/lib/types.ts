export type ProfileId = "moustafa" | "doaa" | "ahmed" | "sherien";

export interface ProfileTheme {
  id: ProfileId;
  displayName: string;
  nickname: string;
  role: string;
  greeting: string;
  subtitle: string;
  themeName: string;
  heroImage: string;
  heroObjectPosition?: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  soft: string;
  soft2: string;
  textAccent: string;
  sky?: string;
  horizon?: string;
  mist?: string;
  heroType: "egyptian-food" | "cats" | "living-room" | "ocean-coastal-home";
}

export interface Profile {
  id: ProfileId;
  name: string;
  nickname: string;
  role: string;
  avatarUrl?: string;
  greeting: string;
  color: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  paidBy: ProfileId;
  paymentMethod: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidBy?: ProfileId;
  paymentDate?: string;
  paymentProofUrl?: string;
  repeatType: "monthly" | "yearly" | "custom" | "one-time";
  notes?: string;
  createdAt: string;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "done" | "late";

export interface Task {
  id: string;
  name: string;
  assignedTo: ProfileId;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  relatedType?: "bill" | "repair" | "shopping" | "expense";
  relatedId?: string;
  createdAt: string;
}

export type RepairStatus =
  | "new"
  | "need-repair"
  | "technician-contacted"
  | "in-progress"
  | "fixed"
  | "paid"
  | "closed";

export interface RepairPhoto {
  id: string;
  repairId: string;
  photoUrl: string;
  createdAt: string;
}

export interface Repair {
  id: string;
  itemName: string;
  room: string;
  problemDescription: string;
  priority: TaskPriority;
  status: RepairStatus;
  expectedCost?: number;
  actualCost?: number;
  paidBy?: ProfileId;
  responsiblePerson: ProfileId;
  technicianName?: string;
  technicianPhone?: string;
  warrantyStatus?: string;
  relatedHomeItemId?: string;
  notes?: string;
  photos: string[];
  createdAt: string;
}

export interface HomeItem {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  location: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyEndDate?: string;
  receiptUrl?: string;
  manualUrl?: string;
  lastRepairDate?: string;
  totalRepairCost: number;
  notes?: string;
  createdAt: string;
}

export type ShoppingCategory =
  | "food"
  | "vegetables-fruits"
  | "meat-chicken-fish"
  | "cleaning-supplies"
  | "bathroom"
  | "kitchen"
  | "pharmacy"
  | "home-tools"
  | "spare-parts"
  | "other";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  estimatedPrice?: number;
  neededByDate?: string;
  assignedBuyer?: ProfileId;
  bought: boolean;
  notes?: string;
  category: ShoppingCategory;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actionType: string;
  description: string;
  performedBy: ProfileId;
  relatedType?: string;
  relatedId?: string;
  createdAt: string;
}

export interface PaymentSummary {
  profileId: ProfileId;
  totalExpenses: number;
  totalBills: number;
  totalRepairs: number;
  total: number;
}

export interface MonthlyReport {
  month: string;
  totalSpending: number;
  categoryBreakdown: { categoryId: string; amount: number; percentage: number }[];
  topExpense: Expense | null;
  billsPaid: number;
  billsTotal: number;
  repairsCompleted: number;
  repairsTotal: number;
  shoppingTotal: number;
  comparisonToLastMonth: number;
}
