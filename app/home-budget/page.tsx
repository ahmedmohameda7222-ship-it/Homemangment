"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, Minus, Plus, Receipt, Wallet } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import { canManageHomeBudget, getHomeBudgetTotals } from "../lib/home-budget";
import { formatCurrency, formatDate, getProfileById, getToday } from "../lib/constants";
import Header from "../components/Header";
import Modal from "../components/Modal";
import BottomNav from "../components/BottomNav";
import type { HomeBudgetTransactionType } from "../lib/types";

type LedgerItem = {
  id: string;
  kind: "transaction" | "expense";
  type: "add" | "remove" | "expense";
  amount: number;
  description: string;
  date: string;
  personName?: string;
  paymentMethod?: string;
  createdAt: string;
};

export default function HomeBudgetPage() {
  const router = useRouter();
  const { selectedProfile } = useProfile();
  const { data, loaded, addHomeBudgetTransaction } = useDataStore();
  const [modalType, setModalType] = useState<HomeBudgetTransactionType | null>(null);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  const canManage = canManageHomeBudget(selectedProfile);
  const budgetTotals = getHomeBudgetTotals(data.homeBudgetTransactions, data.expenses);

  const ledger = useMemo<LedgerItem[]>(() => {
    const budgetTransactions: LedgerItem[] = (data.homeBudgetTransactions || []).map((item) => ({
      id: item.id,
      kind: "transaction",
      type: item.type,
      amount: item.amount,
      description: item.description,
      date: item.date,
      personName: getProfileById(item.performedBy)?.name,
      createdAt: item.createdAt,
    }));

    const budgetExpenses: LedgerItem[] = data.expenses
      .filter((expense) => (expense.paidFrom ?? "personal") === "home-budget")
      .map((expense) => ({
        id: expense.id,
        kind: "expense",
        type: "expense",
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        personName: getProfileById(expense.paidBy)?.name,
        paymentMethod: expense.paymentMethod,
        createdAt: expense.createdAt,
      }));

    return [...budgetTransactions, ...budgetExpenses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data.homeBudgetTransactions, data.expenses]);

  if (!loaded) {
    return (
      <div className="min-h-full bg-linen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-linen pb-28">
      <Header
        title="Home Budget"
        subtitle="Shared money for home expenses"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => canManage && setModalType("add")}
              disabled={!canManage}
              className="h-9 w-9 rounded-xl bg-olive text-cream flex items-center justify-center transition-colors hover:bg-olive-light disabled:opacity-40 disabled:hover:bg-olive"
              title="Add money"
            >
              <Plus size={17} />
            </button>
            <button
              onClick={() => canManage && setModalType("remove")}
              disabled={!canManage}
              className="h-9 w-9 rounded-xl bg-rose text-cream flex items-center justify-center transition-colors hover:bg-rose-light disabled:opacity-40 disabled:hover:bg-rose"
              title="Remove money"
            >
              <Minus size={17} />
            </button>
          </div>
        }
      />

      <main className="max-w-md mx-auto px-5 pt-5 space-y-6">
        <section className="rounded-[1.75rem] bg-cream border border-warm-gray/60 p-5 shadow-[0_16px_38px_rgba(26,26,46,0.06)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-2xl bg-olive/15 text-olive flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">Current Balance</p>
              <p className="text-3xl font-bold text-navy">{formatCurrency(budgetTotals.balance)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Total Added" value={formatCurrency(budgetTotals.totalAdded)} tone="in" />
            <MiniStat label="Used / Removed" value={formatCurrency(budgetTotals.totalUsed)} tone="out" />
          </div>

          {!canManage && (
            <div className="mt-4 rounded-2xl bg-warm-gray-light border border-warm-gray/60 px-4 py-3 text-xs text-navy-muted leading-relaxed">
              Only Moustafa, Doaa, and Sherien can add or remove Home Budget money. You can still view the balance and history.
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wider">Home Budget History</h2>
            <button onClick={() => router.push("/money")} className="text-xs font-semibold text-olive">
              Add expense
            </button>
          </div>

          {ledger.length === 0 ? (
            <div className="rounded-2xl bg-cream border border-warm-gray/60 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-olive/10 text-olive">
                <Wallet size={24} />
              </div>
              <h3 className="text-base font-semibold text-navy">No Home Budget activity yet</h3>
              <p className="mt-1 text-sm text-navy-muted leading-relaxed">
                Add money to the Home Budget, or mark an expense as paid from Home Budget.
              </p>
            </div>
          ) : (
            <div className="space-y-2 stagger-children">
              {ledger.map((item) => (
                <LedgerRow key={`${item.kind}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />

      <BudgetModal
        type={modalType}
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        onSubmit={(values) => {
          if (!modalType || !selectedProfile) return;
          addHomeBudgetTransaction({ ...values, type: modalType, performedBy: selectedProfile }, selectedProfile);
          setModalType(null);
        }}
      />
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "in" | "out" }) {
  const isIn = tone === "in";
  return (
    <div className="rounded-2xl bg-linen border border-warm-gray/60 p-3">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${isIn ? "bg-olive/10 text-olive" : "bg-rose/10 text-rose"}`}>
        {isIn ? <ArrowUpCircle size={17} /> : <ArrowDownCircle size={17} />}
      </div>
      <p className="text-[10px] uppercase tracking-wider text-navy-muted font-semibold">{label}</p>
      <p className="text-sm font-bold text-navy mt-0.5">{value}</p>
    </div>
  );
}

function LedgerRow({ item }: { item: LedgerItem }) {
  const isPositive = item.type === "add";
  const isExpense = item.type === "expense";
  const amountPrefix = isPositive ? "+" : "-";

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-cream border border-warm-gray/60 p-4">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isPositive ? "bg-olive/10 text-olive" : "bg-rose/10 text-rose"}`}>
        {isPositive ? <ArrowUpCircle size={18} /> : isExpense ? <Receipt size={18} /> : <ArrowDownCircle size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy truncate">{item.description}</p>
        <p className="text-xs text-navy-muted">
          {isExpense ? "Expense" : isPositive ? "Added" : "Removed"} · {item.personName || "Family"} · {formatDate(item.date)}
        </p>
      </div>
      <p className={`text-sm font-bold shrink-0 ${isPositive ? "text-olive" : "text-rose"}`}>
        {amountPrefix}{formatCurrency(item.amount)}
      </p>
    </div>
  );
}

function BudgetModal({
  type,
  isOpen,
  onClose,
  onSubmit,
}: {
  type: HomeBudgetTransactionType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { amount: number; description: string; date: string; notes?: string }) => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getToday());
  const [notes, setNotes] = useState("");

  const title = type === "remove" ? "Remove from Home Budget" : "Add to Home Budget";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount || !description) return;
    onSubmit({ amount: Number(amount), description, date, notes: notes || undefined });
    setAmount("");
    setDescription("");
    setDate(getToday());
    setNotes("");
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
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === "remove" ? "Why was money removed?" : "Who added money or why?"}
            required
            className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30"
          />
        </div>
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
          className={`w-full py-3.5 rounded-xl text-cream font-semibold transition-colors ${type === "remove" ? "bg-rose hover:bg-rose-light" : "bg-olive hover:bg-olive-light"}`}
        >
          {title}
        </button>
      </form>
    </Modal>
  );
}
