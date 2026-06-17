"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Receipt, CheckCircle2, AlertCircle, Clock, Calendar, Repeat, Pencil, Trash2, User,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  PROFILES, BILL_REPEAT_LABELS, formatCurrency, formatDate, getToday, getDaysUntil, isOverdue, isDueSoon, getProfileById,
} from "../lib/constants";
import Header from "../components/Header";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import BottomNav from "../components/BottomNav";
import type { Bill, ProfileId } from "../lib/types";

type BillTab = "upcoming" | "overdue" | "paid" | "all";

export default function BillsPage() {
  const { selectedProfile } = useProfile();
  const router = useRouter();
  const { data, addBill, updateBill, deleteBill, payBill } = useDataStore();

  const [activeTab, setActiveTab] = useState<BillTab>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const tabs: { value: BillTab; label: string; count: number }[] = useMemo(() => {
    const upcoming = data.bills.filter((b) => !b.paid && !isOverdue(b.dueDate));
    const overdue = data.bills.filter((b) => !b.paid && isOverdue(b.dueDate));
    const paid = data.bills.filter((b) => b.paid);
    return [
      { value: "upcoming", label: "Upcoming", count: upcoming.length },
      { value: "overdue", label: "Overdue", count: overdue.length },
      { value: "paid", label: "Paid", count: paid.length },
      { value: "all", label: "All", count: data.bills.length },
    ];
  }, [data.bills]);

  const filteredBills = useMemo(() => {
    switch (activeTab) {
      case "upcoming":
        return data.bills.filter((b) => !b.paid && !isOverdue(b.dueDate));
      case "overdue":
        return data.bills.filter((b) => !b.paid && isOverdue(b.dueDate));
      case "paid":
        return data.bills.filter((b) => b.paid);
      default:
        return data.bills;
    }
  }, [data.bills, activeTab]);

  const sortedBills = useMemo(() => {
    return [...filteredBills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [filteredBills]);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header
        title="Bills"
        subtitle="Track and pay household bills"
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
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pt-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.value
                  ? "bg-olive text-cream shadow-sm"
                  : "bg-cream text-navy-muted border border-warm-gray/60 hover:bg-cream-dark"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.value ? "bg-cream/20 text-cream" : "bg-warm-gray text-navy-muted"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bills List */}
        <section>
          {sortedBills.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title={`No ${activeTab} bills`}
              description="Add your household bills to track payments and due dates."
              action={activeTab !== "paid" ? { label: "Add Bill", onClick: () => setIsAddOpen(true) } : undefined}
            />
          ) : (
            <div className="space-y-2 stagger-children">
              {sortedBills.map((bill) => {
                const daysUntil = getDaysUntil(bill.dueDate);
                const isUrgent = !bill.paid && isDueSoon(bill.dueDate, 3);
                const isLate = !bill.paid && isOverdue(bill.dueDate);
                const paidBy = bill.paidBy ? getProfileById(bill.paidBy) : null;
                return (
                  <div
                    key={bill.id}
                    className={`flex items-center gap-3 p-4 bg-cream rounded-2xl border ${
                      isLate ? "border-rose/40 bg-rose/5" : isUrgent ? "border-champagne/60" : "border-warm-gray/60"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      bill.paid ? "bg-sage/15" : isLate ? "bg-rose/15" : "bg-sky/15"
                    }`}>
                      {bill.paid ? (
                        <CheckCircle2 size={18} className="text-sage" />
                      ) : isLate ? (
                        <AlertCircle size={18} className="text-rose" />
                      ) : (
                        <Clock size={18} className="text-sky" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-navy">{bill.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          bill.paid
                            ? "bg-sage/15 text-sage"
                            : isLate
                            ? "bg-rose/15 text-rose"
                            : "bg-sky/15 text-sky"
                        }`}>
                          {bill.paid ? "Paid" : isLate ? "Overdue" : daysUntil <= 0 ? "Due Today" : `${daysUntil} days left`}
                        </span>
                      </div>
                      <p className="text-xs text-navy-muted mt-0.5">
                        Due {formatDate(bill.dueDate)} · {BILL_REPEAT_LABELS[bill.repeatType] || bill.repeatType}
                        {paidBy && ` · Paid by ${paidBy.name}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-navy">{formatCurrency(bill.amount)}</p>
                      {!bill.paid && (
                        <button
                          onClick={() => setPayingBill(bill)}
                          className="text-xs text-olive font-medium hover:text-olive-dark mt-0.5"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => setEditingBill(bill)}
                        className="w-7 h-7 rounded-lg bg-warm-gray/50 flex items-center justify-center hover:bg-warm-gray transition-colors"
                      >
                        <Pencil size={12} className="text-navy-muted" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(bill.id)}
                        className="w-7 h-7 rounded-lg bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors"
                      >
                        <Trash2 size={12} className="text-rose" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav />

      {/* Add Bill Modal */}
      <BillModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(bill) => {
          addBill(bill, selectedProfile);
          setIsAddOpen(false);
        }}
        title="Add Bill"
      />

      {/* Edit Bill Modal */}
      {editingBill && (
        <BillModal
          isOpen={!!editingBill}
          onClose={() => setEditingBill(null)}
          onSubmit={(bill) => {
            updateBill(editingBill.id, bill);
            setEditingBill(null);
          }}
          defaultValues={editingBill}
          title="Edit Bill"
        />
      )}

      {/* Pay Bill Modal */}
      {payingBill && (
        <PayBillModal
          bill={payingBill}
          isOpen={!!payingBill}
          onClose={() => setPayingBill(null)}
          onPay={(paidBy, paymentDate) => {
            payBill(payingBill.id, paidBy, paymentDate);
            setPayingBill(null);
          }}
        />
      )}

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Bill?">
        <p className="text-sm text-navy-muted mb-4">Are you sure you want to delete this bill? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors">Cancel</button>
          <button onClick={() => { if (deleteConfirm) deleteBill(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bill: Omit<Bill, "id" | "createdAt" | "paid" | "paidBy" | "paymentDate" | "paymentProofUrl">) => void;
  defaultValues?: Bill | null;
  title: string;
}

function BillModal({ isOpen, onClose, onSubmit, defaultValues, title }: BillModalProps) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [amount, setAmount] = useState(defaultValues?.amount ? String(defaultValues.amount) : "");
  const [dueDate, setDueDate] = useState(defaultValues?.dueDate || getToday());
  const [repeatType, setRepeatType] = useState(defaultValues?.repeatType || "monthly");
  const [notes, setNotes] = useState(defaultValues?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !dueDate) return;
    onSubmit({
      name,
      amount: Number(amount),
      dueDate,
      repeatType: repeatType as Bill["repeatType"],
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Bill Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electricity Bill" required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" min="0" required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Repeat</label>
            <select value={repeatType} onChange={(e) => setRepeatType(e.target.value as Bill["repeatType"])} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              {Object.entries(BILL_REPEAT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Account number, contact info, etc." rows={3} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30 resize-none" />
        </div>
        <button type="submit" className="w-full py-3.5 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light transition-colors">{title}</button>
      </form>
    </Modal>
  );
}

function PayBillModal({ bill, isOpen, onClose, onPay }: { bill: Bill; isOpen: boolean; onClose: () => void; onPay: (paidBy: ProfileId, paymentDate: string) => void }) {
  const [paidBy, setPaidBy] = useState<ProfileId>("moustafa");
  const [paymentDate, setPaymentDate] = useState(getToday());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark Bill as Paid">
      <div className="space-y-4">
        <div className="bg-cream rounded-xl border border-warm-gray/60 p-4">
          <p className="text-sm font-semibold text-navy">{bill.name}</p>
          <p className="text-lg font-bold text-navy mt-1">{formatCurrency(bill.amount)}</p>
          <p className="text-xs text-navy-muted">Due {formatDate(bill.dueDate)}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Paid By</label>
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value as ProfileId)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
            {PROFILES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Payment Date</label>
          <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <button
          onClick={() => onPay(paidBy, paymentDate)}
          className="w-full py-3.5 rounded-xl bg-sage text-cream font-semibold hover:bg-sage-light transition-colors"
        >
          Confirm Payment
        </button>
      </div>
    </Modal>
  );
}
