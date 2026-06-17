"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, DollarSign, Pencil, Trash2, Search, Filter, Receipt, ShoppingBasket, Wrench, Home, Pill, Car, Users, Heart, ChefHat, Bath, MoreHorizontal, Tv,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  EXPENSE_CATEGORIES, PROFILES, PAYMENT_METHODS, getCurrentMonth, formatCurrency, formatDate, getToday, generateId, getCategoryById, getProfileById,
} from "../lib/constants";
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

export default function MoneyPage() {
  const { selectedProfile } = useProfile();
  const router = useRouter();
  const { data, addExpense, updateExpense, deleteExpense } = useDataStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [personFilter, setPersonFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const month = getCurrentMonth();

  const filteredExpenses = useMemo(() => {
    return data.expenses
      .filter((e) => {
        if (categoryFilter !== "all" && e.categoryId !== categoryFilter) return false;
        if (personFilter !== "all" && e.paidBy !== personFilter) return false;
        if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.expenses, categoryFilter, personFilter, search]);

  const monthlyExpenses = data.expenses.filter((e) => e.date.startsWith(month));
  const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    monthlyExpenses.forEach((e) => {
      map.set(e.categoryId, (map.get(e.categoryId) || 0) + e.amount);
    });
    return Array.from(map.entries())
      .map(([id, amount]) => ({ id, amount, category: getCategoryById(id) }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyExpenses]);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header
        title="Money & Expenses"
        subtitle={monthlyExpenses.length > 0 ? `${monthlyExpenses.length} expenses this month` : "Track your spending"}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-9 h-9 rounded-xl bg-olive text-cream flex items-center justify-center hover:bg-olive-light transition-colors"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="max-w-md mx-auto px-5 space-y-6">
        {/* Monthly Total */}
        <section className="pt-4">
          <div className="bg-cream rounded-2xl border border-warm-gray/60 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-olive/15 flex items-center justify-center">
                <DollarSign size={22} className="text-olive" />
              </div>
              <div>
                <p className="text-xs font-medium text-navy-muted uppercase tracking-wider">This Month</p>
                <p className="text-2xl font-bold text-navy">{formatCurrency(monthlyTotal)}</p>
              </div>
            </div>

            {categoryBreakdown.length > 0 && (
              <div className="space-y-2">
                {categoryBreakdown.slice(0, 4).map((cb) => (
                  <div key={cb.id} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (cb.category?.color || "#6B6B80") + "18" }}
                    >
                      <span style={{ color: cb.category?.color || "#6B6B80" }}>
                        {CATEGORY_ICON_MAP[cb.id] || <MoreHorizontal size={14} />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-navy font-medium">{cb.category?.name || cb.id}</span>
                        <span className="text-sm text-navy font-semibold">{formatCurrency(cb.amount)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-warm-gray mt-1">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${monthlyTotal > 0 ? (cb.amount / monthlyTotal) * 100 : 0}%`,
                            backgroundColor: cb.category?.color || "#6B6B80",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Filters */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-cream border border-warm-gray/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-cream border border-warm-gray/60 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              className="bg-cream border border-warm-gray/60 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
            >
              <option value="all">All Members</option>
              {PROFILES.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Expenses List */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">
            All Expenses ({filteredExpenses.length})
          </h2>
          {filteredExpenses.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No expenses yet"
              description="Start tracking your family spending by adding your first expense."
              action={{ label: "Add Expense", onClick: () => setIsAddOpen(true) }}
            />
          ) : (
            <div className="space-y-2 stagger-children">
              {filteredExpenses.map((expense) => {
                const category = getCategoryById(expense.categoryId);
                const paidBy = getProfileById(expense.paidBy);
                return (
                  <button
                    key={expense.id}
                    onClick={() => setEditingExpense(expense)}
                    className="w-full flex items-center gap-3 p-4 bg-cream rounded-2xl border border-warm-gray/60 text-left hover:bg-cream-dark transition-colors active:scale-[0.98]"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (category?.color || "#6B6B80") + "18" }}
                    >
                      <span style={{ color: category?.color || "#6B6B80" }}>
                        {CATEGORY_ICON_MAP[expense.categoryId] || <MoreHorizontal size={16} />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{expense.description}</p>
                      <p className="text-xs text-navy-muted">
                        {category?.name} · {paidBy?.name} · {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-navy">{formatCurrency(expense.amount)}</p>
                      <p className="text-[10px] text-navy-muted">{expense.paymentMethod}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(expense.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors shrink-0"
                    >
                      <Trash2 size={14} className="text-rose" />
                    </button>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav />

      {/* Add Expense Modal */}
      <ExpenseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(expense) => {
          addExpense(expense, selectedProfile);
          setIsAddOpen(false);
        }}
        defaultPaidBy={selectedProfile}
        title="Add Expense"
      />

      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSubmit={(expense) => {
            updateExpense(editingExpense.id, expense);
            setEditingExpense(null);
          }}
          defaultValues={editingExpense}
          title="Edit Expense"
        />
      )}

      {/* Delete Confirm */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Expense?"
      >
        <p className="text-sm text-navy-muted mb-4">
          Are you sure you want to delete this expense? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (deleteConfirm) deleteExpense(deleteConfirm);
              setDeleteConfirm(null);
            }}
            className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, "id" | "createdAt">) => void;
  defaultValues?: Expense | null;
  defaultPaidBy?: ProfileId;
  title: string;
}

function ExpenseModal({ isOpen, onClose, onSubmit, defaultValues, defaultPaidBy, title }: ExpenseModalProps) {
  const [amount, setAmount] = useState(defaultValues?.amount ? String(defaultValues.amount) : "");
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId || EXPENSE_CATEGORIES[0].id);
  const [description, setDescription] = useState(defaultValues?.description || "");
  const [date, setDate] = useState(defaultValues?.date || getToday());
  const [paidBy, setPaidBy] = useState<ProfileId>(defaultValues?.paidBy || defaultPaidBy || "moustafa");
  const [paymentMethod, setPaymentMethod] = useState(defaultValues?.paymentMethod || PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState(defaultValues?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onSubmit({
      amount: Number(amount),
      categoryId,
      description,
      date,
      paidBy,
      paymentMethod,
      notes: notes || undefined,
      receiptUrl: undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-olive/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            required
            className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Paid By</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value as ProfileId)}
              className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
            >
              {PROFILES.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra details..."
            rows={3}
            className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30 resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light transition-colors"
        >
          {title}
        </button>
      </form>
    </Modal>
  );
}
