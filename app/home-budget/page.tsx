"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, Minus, Plus, Receipt, Settings2, Wallet } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import { canManageHomeBudget, getHomeBudgetGauge, getHomeBudgetTotals } from "../lib/home-budget";
import { formatCurrency, formatDate, getProfileById, getToday } from "../lib/constants";
import { getProfileTheme } from "../lib/profile-themes";
import Header from "../components/Header";
import Modal from "../components/Modal";
import BottomNav from "../components/BottomNav";
import type { HomeBudgetSettings, HomeBudgetTransactionType } from "../lib/types";

type LedgerItem = { id: string; type: "add" | "remove" | "expense"; amount: number; description: string; date: string; personName?: string; createdAt: string };

export default function HomeBudgetPage() {
  const router = useRouter();
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
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

  if (!loaded) return <div className="min-h-full bg-linen flex items-center justify-center"><div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${theme.primary}33`, borderTopColor: theme.primary }} /></div>;

  return (
    <div className="min-h-full bg-linen pb-28">
      <Header
        title="Home Budget"
        subtitle="Shared money for home expenses"
        action={<div className="flex gap-2">
          <IconButton color={theme.primary} soft={theme.soft} onClick={() => setSettingsOpen(true)} disabled={!canManage} title="Settings"><Settings2 size={17} /></IconButton>
          <IconButton color={theme.primary} soft={theme.soft} onClick={() => setModalType("add")} disabled={!canManage} title="Add"><Plus size={17} /></IconButton>
          <IconButton color={theme.primary} soft={theme.soft} onClick={() => setModalType("remove")} disabled={!canManage} title="Take"><Minus size={17} /></IconButton>
        </div>}
      />

      <main className="max-w-md mx-auto px-5 pt-5 space-y-6">
        <section className="rounded-[1.75rem] bg-cream border p-5 shadow-[0_16px_38px_rgba(26,26,46,0.06)]" style={{ borderColor: theme.primary + "24" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.soft, color: theme.primary }}><Wallet size={24} /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">Current Balance</p>
              <p className="text-3xl font-bold" style={{ color: theme.textAccent }}>{formatCurrency(totals.balance)}</p>
              <p className="text-xs font-semibold" style={{ color: gauge.statusColor }}>{gauge.statusLabel}</p>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: theme.soft2 }}><div className="h-full rounded-full" style={{ width: `${Math.round(gauge.progress * 100)}%`, backgroundColor: gauge.statusColor }} /></div>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Total Added" value={formatCurrency(totals.totalAdded)} color={theme.primary} soft={theme.soft} icon={<ArrowUpCircle size={17} />} />
            <MiniStat label="Used / Spent" value={formatCurrency(totals.totalUsed)} color={theme.primary} soft={theme.soft} icon={<ArrowDownCircle size={17} />} />
          </div>
        </section>

        <section className="rounded-2xl bg-cream border p-4" style={{ borderColor: theme.primary + "22" }}>
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.textAccent }}>Budget Settings</h2><p className="mt-1 text-xs text-navy-muted">Set the standard budget and the warning level.</p></div>
            <button onClick={() => setSettingsOpen(true)} disabled={!canManage} className="h-9 w-9 rounded-xl flex items-center justify-center disabled:opacity-40 profile-focus" style={{ backgroundColor: theme.soft, color: theme.primary }}><Settings2 size={17} /></button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniStat label="Monthly Standard" value={formatCurrency(data.homeBudgetSettings.standardMonthlyBudget)} color={theme.primary} soft={theme.soft} icon={<ArrowUpCircle size={17} />} />
            <MiniStat label="Minimum Level" value={formatCurrency(data.homeBudgetSettings.minimumBalance)} color={theme.primary} soft={theme.soft} icon={<ArrowDownCircle size={17} />} />
          </div>
          {!canManage && <p className="mt-3 text-xs text-navy-muted">Only Moustafa, Doaa, and Sherien can edit these settings.</p>}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.textAccent }}>Home Budget History</h2><button onClick={() => router.push("/money")} className="text-xs font-semibold profile-focus rounded-lg" style={{ color: theme.primary }}>Add expense</button></div>
          {ledger.length === 0 ? <EmptyBudget color={theme.primary} soft={theme.soft} /> : <div className="space-y-2 stagger-children">{ledger.map((item) => <LedgerRow key={`${item.type}-${item.id}`} item={item} color={theme.primary} soft={theme.soft} />)}</div>}
        </section>
      </main>

      <BottomNav />

      <MoneyModal type={modalType} isOpen={!!modalType} onClose={() => setModalType(null)} onSubmit={(values) => { if (!modalType || !selectedProfile) return; addHomeBudgetTransaction({ ...values, type: modalType, performedBy: selectedProfile }, selectedProfile); setModalType(null); }} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} settings={data.homeBudgetSettings} onSubmit={(values) => { if (!selectedProfile) return; updateHomeBudgetSettings(values, selectedProfile); setSettingsOpen(false); }} />
    </div>
  );
}

function IconButton({ children, onClick, disabled, title, color, soft }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title: string; color: string; soft: string }) {
  return <button onClick={onClick} disabled={disabled} title={title} className="h-9 w-9 rounded-xl border flex items-center justify-center hover:opacity-85 disabled:opacity-40 profile-focus" style={{ backgroundColor: soft, borderColor: color + "25", color }}>{children}</button>;
}

function MiniStat({ label, value, color, soft, icon }: { label: string; value: string; color: string; soft: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border p-3" style={{ backgroundColor: soft, borderColor: color + "18" }}><div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: color + "12", color }}>{icon}</div><p className="text-[10px] uppercase tracking-wider text-navy-muted font-semibold">{label}</p><p className="text-sm font-bold mt-0.5" style={{ color }}>{value}</p></div>;
}

function EmptyBudget({ color, soft }: { color: string; soft: string }) {
  return <div className="rounded-2xl bg-cream border p-6 text-center" style={{ borderColor: color + "22" }}><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: soft, color }}><Wallet size={24} /></div><h3 className="text-base font-semibold text-navy">No Home Budget activity yet</h3><p className="mt-1 text-sm text-navy-muted leading-relaxed">Add money to the Home Budget, or mark an expense as paid from Home Budget.</p></div>;
}

function LedgerRow({ item, color, soft }: { item: LedgerItem; color: string; soft: string }) {
  const isPositive = item.type === "add";
  const isExpense = item.type === "expense";
  return <div className="flex items-center gap-3 rounded-2xl bg-cream border p-4" style={{ borderColor: color + "20" }}><div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: soft, color }}>{isPositive ? <ArrowUpCircle size={18} /> : isExpense ? <Receipt size={18} /> : <ArrowDownCircle size={18} />}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy truncate">{item.description}</p><p className="text-xs text-navy-muted">{isExpense ? "Expense" : isPositive ? "Added" : "Taken"} · {item.personName || "Family"} · {formatDate(item.date)}</p></div><p className="text-sm font-bold shrink-0" style={{ color }}>{isPositive ? "+" : "-"}{formatCurrency(item.amount)}</p></div>;
}

function MoneyModal({ type, isOpen, onClose, onSubmit }: { type: HomeBudgetTransactionType | null; isOpen: boolean; onClose: () => void; onSubmit: (values: { amount: number; description: string; date: string; notes?: string }) => void }) {
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getToday());
  const title = type === "add" ? "Add to Home Budget" : "Take from Home Budget";
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); if (!amount || !description) return; onSubmit({ amount: Number(amount), description, date }); setAmount(""); setDescription(""); setDate(getToday()); };
  return <Modal isOpen={isOpen} onClose={onClose} title={title}><form onSubmit={handleSubmit} className="space-y-4"><NumberField label="Amount" value={amount} onChange={setAmount} required /><TextField label="Description" value={description} onChange={setDescription} required /><div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "22" }} /></div><button type="submit" className="w-full py-3.5 rounded-xl text-cream font-semibold hover:opacity-90 transition-opacity profile-focus" style={{ backgroundColor: theme.primary }}>{title}</button></form></Modal>;
}

function SettingsModal({ isOpen, onClose, settings, onSubmit }: { isOpen: boolean; onClose: () => void; settings: HomeBudgetSettings; onSubmit: (values: Partial<HomeBudgetSettings>) => void }) {
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
  const [standard, setStandard] = useState(String(settings.standardMonthlyBudget || ""));
  const [minimum, setMinimum] = useState(String(settings.minimumBalance || 200));
  useEffect(() => { if (isOpen) { setStandard(String(settings.standardMonthlyBudget || "")); setMinimum(String(settings.minimumBalance || 200)); } }, [isOpen, settings.standardMonthlyBudget, settings.minimumBalance]);
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); onSubmit({ standardMonthlyBudget: Number(standard || 0), minimumBalance: Number(minimum || 0) }); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Home Budget Settings"><form onSubmit={handleSubmit} className="space-y-4"><NumberField label="Standard monthly budget" value={standard} onChange={setStandard} placeholder="Example: 5000" /><NumberField label="Minimum warning level" value={minimum} onChange={setMinimum} placeholder="Example: 200" /><p className="text-xs text-navy-muted leading-relaxed">The dashboard circle turns amber near the minimum level and red when it reaches or goes below it.</p><button type="submit" className="w-full py-3.5 rounded-xl text-cream font-semibold hover:opacity-90 transition-opacity profile-focus" style={{ backgroundColor: theme.primary }}>Save settings</button></form></Modal>;
}

function NumberField({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{label}</label><input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "0.00"} step="0.01" min="0" required={required} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy text-lg font-semibold focus:outline-none profile-focus" style={{ borderColor: theme.primary + "22" }} /></div>;
}

function TextField({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
  return <div><label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{label}</label><input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "22" }} /></div>;
}
