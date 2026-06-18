"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  DollarSign,
  Trash2,
  Search,
  Receipt,
  ShoppingBasket,
  Wrench,
  Home,
  Pill,
  Car,
  Users,
  Heart,
  ChefHat,
  Bath,
  MoreHorizontal,
  Tv,
  Lock,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useLanguage } from "../context/LanguageContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  getCurrentMonth,
  formatCurrency,
  formatDate,
  getToday,
  getCategoryById,
} from "../lib/constants";
import { getProfileTheme } from "../lib/profile-themes";
import Header from "../components/Header";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import BottomNav from "../components/BottomNav";
import type { Expense, ProfileId } from "../lib/types";

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  groceries: <ShoppingBasket size={16} />,
  bills: <Receipt size={16} />,
  maintenance: <Wrench size={16} />,
  "home-supplies": <Home size={16} />,
  appliances: <Tv size={16} />,
  medicine: <Pill size={16} />,
  transportation: <Car size={16} />,
  guests: <Users size={16} />,
  "personal-care": <Heart size={16} />,
  kitchen: <ChefHat size={16} />,
  bathroom: <Bath size={16} />,
  other: <MoreHorizontal size={16} />,
};

function getExpensePinKey(profileId: ProfileId) {
  return `beitna-expense-pin-${profileId}`;
}

function getExpenseUnlockKey(profileId: ProfileId) {
  return `beitna-expense-unlocked-${profileId}`;
}

type ExpenseDraft = Omit<Expense, "id" | "createdAt" | "receiptUrl" | "paidBy" | "paidFrom">;

export default function MoneyPage() {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const router = useRouter();
  const theme = getProfileTheme(selectedProfile);
  const { data, addExpense, updateExpense, deleteExpense } = useDataStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [pinReady, setPinReady] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!selectedProfile) return;
    const savedPin = localStorage.getItem(getExpensePinKey(selectedProfile));
    const unlocked = sessionStorage.getItem(getExpenseUnlockKey(selectedProfile)) === "1";
    setHasPin(Boolean(savedPin));
    setIsUnlocked(!savedPin || unlocked);
    setPinReady(true);
  }, [selectedProfile]);

  if (!selectedProfile) {
    router.push("/profiles");
    return null;
  }

  const month = getCurrentMonth();
  const myExpenses = data.expenses.filter((expense) => expense.paidBy === selectedProfile);
  const monthlyExpenses = myExpenses.filter((expense) => expense.date.startsWith(month));
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpenses = useMemo(() => {
    return myExpenses
      .filter((expense) => {
        if (categoryFilter !== "all" && expense.categoryId !== categoryFilter) return false;
        if (search && !expense.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [myExpenses, categoryFilter, search]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    monthlyExpenses.forEach((expense) => {
      map.set(expense.categoryId, (map.get(expense.categoryId) || 0) + expense.amount);
    });
    return Array.from(map.entries())
      .map(([id, amount]) => ({ id, amount, category: getCategoryById(id) }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyExpenses]);

  const lockExpenses = () => {
    sessionStorage.removeItem(getExpenseUnlockKey(selectedProfile));
    setIsUnlocked(false);
  };

  if (!pinReady) {
    return <div className="min-h-full bg-linen flex items-center justify-center"><div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${theme.primary}33`, borderTopColor: theme.primary }} /></div>;
  }

  if (!isUnlocked) {
    return <ExpensePinGate profileId={selectedProfile} mode={hasPin ? "unlock" : "setup"} onUnlocked={() => { setHasPin(true); setIsUnlocked(true); }} />;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header
        title="Money & Expenses"
        subtitle={monthlyExpenses.length > 0 ? `${monthlyExpenses.length} ${t("expenses")} ${t("This Month")}` : "Track your spending"}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={lockExpenses}
              className="w-9 h-9 rounded-xl bg-cream border flex items-center justify-center hover:opacity-85 transition-opacity profile-focus"
              style={{ borderColor: theme.primary + "28", color: theme.primary }}
              title={t("Lock expenses")}
              aria-label={t("Lock expenses")}
            >
              <Lock size={16} />
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-9 h-9 rounded-xl text-cream flex items-center justify-center hover:opacity-90 transition-opacity profile-focus"
              style={{ backgroundColor: theme.primary }}
              title={t("Add Expense")}
              aria-label={t("Add Expense")}
            >
              <Plus size={18} />
            </button>
          </div>
        }
      />

      <div className="max-w-md mx-auto px-5 space-y-6">
        <section className="pt-4">
          <div className="bg-cream rounded-2xl border p-5" style={{ borderColor: theme.primary + "22" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.soft, color: theme.primary }}>
                <DollarSign size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-navy-muted uppercase tracking-wider">{t("This Month")}</p>
                <p className="text-2xl font-bold" style={{ color: theme.textAccent }}>{formatCurrency(monthlyTotal)}</p>
                <p className="text-xs text-navy-muted">{t("Personal private spending only")}</p>
              </div>
            </div>

            {categoryBreakdown.length > 0 && (
              <div className="space-y-2">
                {categoryBreakdown.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: theme.soft, color: theme.primary }}>
                      {CATEGORY_ICON_MAP[item.id] || <MoreHorizontal size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-navy font-medium truncate">{t(item.category?.name || item.id)}</span>
                        <span className="text-sm text-navy font-semibold">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="h-1.5 rounded-full mt-1" style={{ backgroundColor: theme.soft2 }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${monthlyTotal > 0 ? (item.amount / monthlyTotal) * 100 : 0}%`, backgroundColor: theme.primary }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" />
              <input type="text" placeholder={t("Search expenses...")} value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-cream border rounded-xl pl-9 pr-4 py-2.5 text-sm text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }} />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="bg-cream border rounded-xl px-3 py-2 text-sm text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }}>
              <option value="all">{t("All Categories")}</option>
              {EXPENSE_CATEGORIES.map((category) => <option key={category.id} value={category.id}>{t(category.name)}</option>)}
            </select>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: theme.textAccent }}>
            {t("My Private Expenses")} ({filteredExpenses.length})
          </h2>
          {filteredExpenses.length === 0 ? (
            <EmptyState icon={DollarSign} title="No expenses yet" description="Start tracking your family spending by adding your first expense." action={{ label: "Add Expense", onClick: () => setIsAddOpen(true) }} />
          ) : (
            <div className="space-y-2 stagger-children">
              {filteredExpenses.map((expense) => {
                const category = getCategoryById(expense.categoryId);
                return (
                  <div key={expense.id} className="w-full flex items-center gap-3 p-4 bg-cream rounded-2xl border text-left hover:bg-cream-dark transition-colors" style={{ borderColor: theme.primary + "20" }}>
                    <button onClick={() => setEditingExpense(expense)} className="flex flex-1 items-center gap-3 text-left min-w-0 profile-focus rounded-xl">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: theme.soft, color: theme.primary }}>
                        {CATEGORY_ICON_MAP[expense.categoryId] || <MoreHorizontal size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">{expense.description}</p>
                        <p className="text-xs text-navy-muted">{t(category?.name || "Other")} · {formatDate(expense.date)}</p>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: theme.primary }}>{t("Personal Money")}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-navy">{formatCurrency(expense.amount)}</p>
                        <p className="text-[10px] text-navy-muted">{t(expense.paymentMethod)}</p>
                      </div>
                    </button>
                    <button onClick={() => setDeleteConfirm(expense.id)} className="w-8 h-8 rounded-lg bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors shrink-0 profile-focus" aria-label={t("Delete")}> <Trash2 size={14} className="text-rose" /> </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav />

      <ExpenseModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={(expense) => { addExpense({ ...expense, paidBy: selectedProfile, paidFrom: "personal", receiptUrl: undefined }, selectedProfile); setIsAddOpen(false); }} title="Add Expense" />

      {editingExpense && (
        <ExpenseModal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} onSubmit={(expense) => { updateExpense(editingExpense.id, { ...expense, paidBy: selectedProfile, paidFrom: "personal", receiptUrl: undefined }); setEditingExpense(null); }} defaultValues={editingExpense} title="Edit Expense" />
      )}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Expense?">
        <p className="text-sm text-navy-muted mb-4">{t("Are you sure you want to delete this expense? This cannot be undone.")}</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-cream border text-navy font-medium hover:bg-cream-dark transition-colors profile-focus" style={{ borderColor: theme.primary + "22" }}>{t("Cancel")}</button>
          <button onClick={() => { if (deleteConfirm) deleteExpense(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors profile-focus">{t("Delete")}</button>
        </div>
      </Modal>
    </div>
  );
}

function ExpensePinGate({ profileId, mode, onUnlocked }: { profileId: ProfileId; mode: "setup" | "unlock"; onUnlocked: () => void }) {
  const { t } = useLanguage();
  const theme = getProfileTheme(profileId);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (pin.length < 4) {
      setError(t("PIN must be at least 4 digits"));
      return;
    }
    if (mode === "setup") {
      if (pin !== confirmPin) {
        setError(t("PINs do not match"));
        return;
      }
      localStorage.setItem(getExpensePinKey(profileId), pin);
      sessionStorage.setItem(getExpenseUnlockKey(profileId), "1");
      onUnlocked();
      return;
    }
    const savedPin = localStorage.getItem(getExpensePinKey(profileId));
    if (pin !== savedPin) {
      setError(t("Wrong PIN"));
      return;
    }
    sessionStorage.setItem(getExpenseUnlockKey(profileId), "1");
    onUnlocked();
  };

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header title="Money & Expenses" subtitle={mode === "setup" ? "Create a PIN for private expenses" : "Enter your PIN to view private expenses"} showBack />
      <main className="max-w-md mx-auto px-5 pt-8">
        <section className="rounded-[1.75rem] bg-cream border p-6 shadow-[0_16px_38px_rgba(26,26,46,0.06)]" style={{ borderColor: theme.primary + "24" }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: theme.soft, color: theme.primary }}>
            {mode === "setup" ? <KeyRound size={25} /> : <ShieldCheck size={25} />}
          </div>
          <h1 className="text-xl font-bold text-center" style={{ color: theme.textAccent }}>{mode === "setup" ? t("Set Expense PIN") : t("Private Expenses")}</h1>
          <p className="mt-2 text-sm text-navy-muted text-center leading-relaxed">{mode === "setup" ? t("Create a PIN so only this profile can open its expenses.") : t("Expenses are private for each profile. Enter the PIN to continue.")}</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <PinField value={pin} onChange={setPin} label={mode === "setup" ? "New PIN" : "PIN"} />
            {mode === "setup" && <PinField value={confirmPin} onChange={setConfirmPin} label="Confirm PIN" />}
            {error && <p className="rounded-xl bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>}
            <button type="submit" className="w-full rounded-xl py-3.5 font-semibold text-cream transition-opacity hover:opacity-90 profile-focus" style={{ backgroundColor: theme.primary }}>{mode === "setup" ? t("Save PIN") : t("Unlock")}</button>
          </form>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

function PinField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  return (
    <div>
      <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{t(label)}</label>
      <input type="password" inputMode="numeric" pattern="[0-9]*" value={value} onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 8))} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy text-lg font-semibold tracking-[0.3em] text-center focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }} autoComplete="off" />
    </div>
  );
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseDraft) => void;
  defaultValues?: Expense | null;
  title: string;
}

function ExpenseModal({ isOpen, onClose, onSubmit, defaultValues, title }: ExpenseModalProps) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getToday());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setAmount(defaultValues?.amount ? String(defaultValues.amount) : "");
    setCategoryId(defaultValues?.categoryId || EXPENSE_CATEGORIES[0].id);
    setDescription(defaultValues?.description || "");
    setDate(defaultValues?.date || getToday());
    setPaymentMethod(defaultValues?.paymentMethod || PAYMENT_METHODS[0]);
    setNotes(defaultValues?.notes || "");
  }, [defaultValues, isOpen]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount || !description) return;
    onSubmit({ amount: Number(amount), categoryId, description, date, paymentMethod, notes: notes || undefined });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormNumber label="Amount" value={amount} onChange={setAmount} />
        <FormSelect label="Category" value={categoryId} onChange={setCategoryId} options={EXPENSE_CATEGORIES.map((category) => ({ value: category.id, label: t(category.name) }))} />
        <FormText label="Description" value={description} onChange={setDescription} placeholder={t("What was this for?")} />
        <div className="grid grid-cols-2 gap-3">
          <FormDate label="Date" value={date} onChange={setDate} />
          <FormSelect label="Payment Method" value={paymentMethod} onChange={setPaymentMethod} options={PAYMENT_METHODS.map((method) => ({ value: method, label: t(method) }))} />
        </div>
        <div className="rounded-2xl border px-4 py-3 text-sm text-navy-muted" style={{ borderColor: theme.primary + "20", backgroundColor: theme.soft }}>
          {t("Expenses are always saved as personal private spending for this profile.")}
        </div>
        <FormTextarea label="Notes (optional)" value={notes} onChange={setNotes} placeholder={t("Any extra details...")} />
        <button type="submit" className="w-full py-3.5 rounded-xl text-cream font-semibold hover:opacity-90 transition-opacity profile-focus" style={{ backgroundColor: theme.primary }}>{t(title)}</button>
      </form>
    </Modal>
  );
}

function fieldStyle(theme: ReturnType<typeof getProfileTheme>) {
  return { borderColor: theme.primary + "24" };
}

function FormNumber({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{t(label)}</label><input type="number" value={value} onChange={(event) => onChange(event.target.value)} placeholder="0.00" step="0.01" min="0" required className="w-full bg-cream border rounded-xl px-4 py-3 text-navy text-lg font-semibold focus:outline-none profile-focus" style={fieldStyle(theme)} /></div>;
}

function FormText({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{t(label)}</label><input type="text" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={fieldStyle(theme)} /></div>;
}

function FormDate({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{t(label)}</label><input type="date" value={value} onChange={(event) => onChange(event.target.value)} required className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={fieldStyle(theme)} /></div>;
}

function FormSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{t(label)}</label><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={fieldStyle(theme)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}

function FormTextarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{t(label)}</label><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus resize-none" style={fieldStyle(theme)} /></div>;
}
