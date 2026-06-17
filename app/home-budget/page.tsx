"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, Minus, Plus, Receipt, Settings2, Wallet } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import { canManageHomeBudget, getHomeBudgetGauge, getHomeBudgetTotals } from "../lib/home-budget";
import { formatCurrency, formatDate, getProfileById, getToday } from "../lib/constants";
import Header from "../components/Header";
import Modal from "../components/Modal";
import BottomNav from "../components/BottomNav";
import type { HomeBudgetSettings, HomeBudgetTransactionType } from "../lib/types";

type LedgerItem = { id: string; type: "add" | "remove" | "expense"; amount: number; description: string; date: string; personName?: string; createdAt: string };

export default function HomeBudgetPage() {
  const router = useRouter();
  const { selectedProfile } = useProfile();
  const { data, loaded, addHomeBudgetTransaction, updateHomeBudgetSettings } = useDataStore();
  const [modalType, setModalType] = useState<HomeBudgetTransactionType | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const canManage = canManageHomeBudget(selectedProfile);
  const totals = getHomeBudgetTotals(data.homeBudgetTransactions, data.expenses);
  const gauge = getHomeBudgetGauge(data.homeBudgetSettings, totals.balance, totals.totalAdded);

  const ledger = useMemo<LedgerItem[]>(() => {
    const transactions = data.homeBudgetTransactions.map((item) => ({ id: item.id, type: item.type, amount: item.amount, description: item.description, date: item.date, personName: getProfileById(item.performedBy)?.name, createdAt: item.createdAt }));
    const expenses = data.expenses.filter((item) => (item.paidFrom ?? "personal") === "home-budget").map((item) => ({ id: item.id, type: "expense" as const, amount: item.amount, description: item.description, date: item.date, personName: getProfileById(item.paidBy)?.name, createdAt: item.createdAt }));
    return [...transactions, ...expenses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data.homeBudgetTransactions, data.expenses]);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  if (!loaded) return <div className="min-h-full bg-linen flex items-center justify-center"><div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-full bg-linen pb-28">
      <Header
        title="Home Budget"
        subtitle="Shared money for home expenses"
        action={<div className="flex gap-2">
          <IconButton onClick={() => setSettingsOpen(true)} disabled={!canManage} title="Settings"><Settings2 size={17} /></IconButton>
          <IconButton onClick={() => setModalType("add")} disabled={!canManage} title="Add"><Plus size={17} /></IconButton>
          <IconButton onClick={() => setModalType("remove")} disabled={!canManage} title="Take"><Minus size={17} /></IconButton>
        </div>}
      />

      <main className="max-w-md mx-auto px-5 pt-5 space-y-6">
        <section className="rounded-[1.75rem] bg-cream border border-warm-gray/60 p-5 shadow-[0_16px_38px_rgba(26,26,46,0.06)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-olive/15 text-olive flex items-center justify-center"><Wallet size={24} /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">Current Balance</p>
              <p className="text-3xl font-bold text-navy">{formatCurrency(totals.balance)}</p>
              <p className="text-xs font-semibold" style={{ color: gauge.statusColor }}>{gauge.statusLabel}</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-warm-gray overflow-hidden mb-4"><div className="h-full rounded-full" style={{ width: `${Math.round(gauge.progress * 100)}%`, backgroundColor: gauge.statusColor }} /></div>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Total Added" value={formatCurrency(totals.totalAdded)} tone="in" />
            <MiniStat label="Used / Spent" value={formatCurrency(totals.totalUsed)} tone="out" />
          </div>
        </section>

        <section className="rounded-2xl bg-cream border border-warm-gray/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-navy uppercase tracking-wider">Budget Settings</h2><p className="mt-1 text-xs text-navy-muted">Set the standard budget and the red warning level.</p></div>
            <button onClick={() => setSettingsOpen(true)} disabled={!canManage} className="h-9 w-9 rounded-xl bg-olive/10 text-olive flex items-center justify-center disabled:opacity-40"><Settings2 size={17} /></button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniStat label="Monthly Standard" value={formatCurrency(data.homeBudgetSettings.standardMonthlyBudget)} tone="in" />
            <MiniStat label="Minimum Level" value={formatCurrency(data.homeBudgetSettings.minimumBalance)} tone="out" />
          </div>
          {!canManage && <p className="mt-3 text-xs text-navy-muted">Only Moustafa, Doaa, and Sherien can edit these settings.</p>}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold text-navy uppercase tracking-wider">Home Budget History</h2><button onClick={() => router.push("/money")} className="text-xs font-semibold text-olive">Add expense</button></div>
          {ledger.length === 0 ? <EmptyBudget /> : <div className="space-y-2 stagger-children">{ledger.map((item) => <LedgerRow key={`${item.type}-${item.id}`} item={item} />)}</div>}
        </section>
      </main>

      <BottomNav />

      <MoneyModal type={modalType} isOpen={!!modalType} onClose={() => setModalType(null)} onSubmit={(values) => { if (!modalType || !selectedProfile) return; addHomeBudgetTransaction({ ...values, type: modalType, performedBy: selectedProfile }, selectedProfile); setModalType(null); }} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} settings={data.homeBudgetSettings} onSubmit={(values) => { if (!selectedProfile) return; updateHomeBudgetSettings(values, selectedProfile); setSettingsOpen(false); }} />
    </div>
  );
}

function IconButton({ children, onClick, disabled, title }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title: string }) {
  return <button onClick={onClick} disabled={disabled} title={title} className="h-9 w-9 rounded-xl bg-cream border border-warm-gray/60 text-navy flex items-center justify-center hover:bg-cream-dark disabled:opacity-40">{children}</button>;
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "in" | "out" }) {
  const isIn = tone === "in";
  return <div className="rounded-2xl bg-linen border border-warm-gray/60 p-3"><div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${isIn ? "bg-olive/10 text-olive" : "bg-rose/10 text-rose"}`}>{isIn ? <ArrowUpCircle size={17} /> : <ArrowDownCircle size={17} />}</div><p className="text-[10px] uppercase tracking-wider text-navy-muted font-semibold">{label}</p><p className="text-sm font-bold text-navy mt-0.5">{value}</p></div>;
}

function EmptyBudget() {
  return <div className="rounded-2xl bg-cream border border-warm-gray/60 p-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-olive/10 text-olive"><Wallet size={24} /></div><h3 className="text-base font-semibold text-navy">No Home Budget activity yet</h3><p className="mt-1 text-sm text-navy-muted leading-relaxed">Add money to the Home Budget, or mark an expense as paid from Home Budget.</p></div>;
}

function LedgerRow({ item }: { item: LedgerItem }) {
  const isPositive = item.type === "add";
  const isExpense = item.type === "expense";
  return <div className="flex items-center gap-3 rounded-2xl bg-cream border border-warm-gray/60 p-4"><div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isPositive ? "bg-olive/10 text-olive" : "bg-rose/10 text-rose"}`}>{isPositive ? <ArrowUpCircle size={18} /> : isExpense ? <Receipt size={18} /> : <ArrowDownCircle size={18} />}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy truncate">{item.description}</p><p className="text-xs text-navy-muted">{isExpense ? "Expense" : isPositive ? "Added" : "Taken"} · {item.personName || "Family"} · {formatDate(item.date)}</p></div><p className={`text-sm font-bold shrink-0 ${isPositive ? "text-olive" : "text-rose"}`}>{isPositive ? "+" : "-"}{formatCurrency(item.amount)}</p></div>;
}

function MoneyModal({ type, isOpen, onClose, onSubmit }: { type: HomeBudgetTransactionType | null; isOpen: boolean; onClose: () => void; onSubmit: (values: { amount: number; description: string; date: string; notes?: string }) => void }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getToday());
  const title = type === "add" ? "Add to Home Budget" : "Take from Home Budget";
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); if (!amount || !description) return; onSubmit({ amount: Number(amount), description, date }); setAmount(""); setDescription(""); setDate(getToday()); };
  return <Modal isOpen={isOpen} onClose={onClose} title={title}><form onSubmit={handleSubmit} className="space-y-4"><NumberField label="Amount" value={amount} onChange={setAmount} required /><TextField label="Description" value={description} onChange={setDescription} required /><div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" /></div><button type="submit" className={`w-full py-3.5 rounded-xl text-cream font-semibold ${type === "add" ? "bg-olive hover:bg-olive-light" : "bg-rose hover:bg-rose-light"}`}>{title}</button></form></Modal>;
}

function SettingsModal({ isOpen, onClose, settings, onSubmit }: { isOpen: boolean; onClose: () => void; settings: HomeBudgetSettings; onSubmit: (values: Partial<HomeBudgetSettings>) => void }) {
  const [standard, setStandard] = useState(String(settings.standardMonthlyBudget || ""));
  const [minimum, setMinimum] = useState(String(settings.minimumBalance || 200));
  useEffect(() => { if (isOpen) { setStandard(String(settings.standardMonthlyBudget || "")); setMinimum(String(settings.minimumBalance || 200)); } }, [isOpen, settings.standardMonthlyBudget, settings.minimumBalance]);
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); onSubmit({ standardMonthlyBudget: Number(standard || 0), minimumBalance: Number(minimum || 0) }); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Home Budget Settings"><form onSubmit={handleSubmit} className="space-y-4"><NumberField label="Standard monthly budget" value={standard} onChange={setStandard} placeholder="Example: 5000" /><NumberField label="Minimum warning level" value={minimum} onChange={setMinimum} placeholder="Example: 200" /><p className="text-xs text-navy-muted leading-relaxed">The dashboard circle turns amber near the minimum level and red when it reaches or goes below it.</p><button type="submit" className="w-full py-3.5 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light">Save settings</button></form></Modal>;
}

function NumberField({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{label}</label><input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "0.00"} step="0.01" min="0" required={required} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-olive/30" /></div>;
}

function TextField({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{label}</label><input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" /></div>;
}
