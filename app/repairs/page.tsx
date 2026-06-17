"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Wrench, Pencil, Trash2, AlertCircle, CheckCircle2, Clock, ArrowRight, User, Phone, MapPin, DollarSign, Camera,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  PROFILES, ROOMS, REPAIR_STATUS_LABELS, REPAIR_STATUS_COLORS, TASK_PRIORITY_COLORS, formatCurrency, formatDate, getToday, getProfileById,
} from "../lib/constants";
import Header from "../components/Header";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import BottomNav from "../components/BottomNav";
import type { Repair, TaskPriority, RepairStatus, ProfileId } from "../lib/types";

type RepairTab = "all" | "new" | "in-progress" | "fixed" | "closed";

const STATUS_FLOW: RepairStatus[] = [
  "new",
  "need-repair",
  "technician-contacted",
  "in-progress",
  "fixed",
  "paid",
  "closed",
];

export default function RepairsPage() {
  const { selectedProfile } = useProfile();
  const router = useRouter();
  const { data, addRepair, updateRepair, deleteRepair } = useDataStore();

  const [activeTab, setActiveTab] = useState<RepairTab>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const tabs = useMemo(() => {
    const all = data.repairs;
    const open = all.filter((r) => r.status !== "closed" && r.status !== "fixed");
    const inProgress = all.filter((r) => r.status === "in-progress" || r.status === "technician-contacted" || r.status === "need-repair");
    const fixed = all.filter((r) => r.status === "fixed" || r.status === "paid");
    const closed = all.filter((r) => r.status === "closed");
    return [
      { value: "all" as RepairTab, label: "All", count: all.length },
      { value: "new" as RepairTab, label: "Open", count: open.length },
      { value: "in-progress" as RepairTab, label: "In Progress", count: inProgress.length },
      { value: "fixed" as RepairTab, label: "Fixed", count: fixed.length },
      { value: "closed" as RepairTab, label: "Closed", count: closed.length },
    ];
  }, [data.repairs]);

  const filteredRepairs = useMemo(() => {
    switch (activeTab) {
      case "new":
        return data.repairs.filter((r) => r.status !== "closed" && r.status !== "fixed" && r.status !== "paid");
      case "in-progress":
        return data.repairs.filter((r) => r.status === "in-progress" || r.status === "technician-contacted" || r.status === "need-repair");
      case "fixed":
        return data.repairs.filter((r) => r.status === "fixed" || r.status === "paid");
      case "closed":
        return data.repairs.filter((r) => r.status === "closed");
      default:
        return data.repairs;
    }
  }, [data.repairs, activeTab]);

  const sortedRepairs = useMemo(() => {
    return [...filteredRepairs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredRepairs]);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header
        title="Repairs & Maintenance"
        subtitle="Track home repairs and issues"
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

        {/* Repairs List */}
        <section>
          {sortedRepairs.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title={`No ${activeTab} repairs`}
              description="Report issues and track repairs for your home."
              action={activeTab !== "closed" ? { label: "Report Problem", onClick: () => setIsAddOpen(true) } : undefined}
            />
          ) : (
            <div className="space-y-3 stagger-children">
              {sortedRepairs.map((repair) => {
                const statusColor = REPAIR_STATUS_COLORS[repair.status] || "#6B6B80";
                const statusLabel = REPAIR_STATUS_LABELS[repair.status] || repair.status;
                const responsible = getProfileById(repair.responsiblePerson);
                const paidBy = repair.paidBy ? getProfileById(repair.paidBy) : null;
                const currentStatusIndex = STATUS_FLOW.indexOf(repair.status);
                const nextStatus = STATUS_FLOW[currentStatusIndex + 1];

                return (
                  <div
                    key={repair.id}
                    className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: statusColor + "18" }}
                      >
                        <Wrench size={18} style={{ color: statusColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-navy">{repair.itemName}</p>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: statusColor }}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-navy-muted mt-0.5 flex items-center gap-1">
                          <MapPin size={10} />
                          {repair.room}
                          <span className="mx-1">·</span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: TASK_PRIORITY_COLORS[repair.priority] || "#6B6B80" }}
                          >
                            {repair.priority}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => setEditingRepair(repair)}
                          className="w-7 h-7 rounded-lg bg-warm-gray/50 flex items-center justify-center hover:bg-warm-gray transition-colors"
                        >
                          <Pencil size={12} className="text-navy-muted" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(repair.id)}
                          className="w-7 h-7 rounded-lg bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors"
                        >
                          <Trash2 size={12} className="text-rose" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-navy leading-relaxed bg-warm-gray/30 rounded-xl p-3">
                      {repair.problemDescription}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-navy-muted">
                      {repair.expectedCost && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={10} />
                          Est: {formatCurrency(repair.expectedCost)}
                        </span>
                      )}
                      {repair.actualCost && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={10} />
                          Actual: {formatCurrency(repair.actualCost)}
                        </span>
                      )}
                      {repair.technicianName && (
                        <span className="flex items-center gap-1">
                          <User size={10} />
                          {repair.technicianName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {responsible && (
                          <span className="text-xs text-navy-muted">Responsible: <span style={{ color: responsible.color }}>{responsible.name}</span></span>
                        )}
                        {paidBy && (
                          <span className="text-xs text-navy-muted">Paid by: <span style={{ color: paidBy.color }}>{paidBy.name}</span></span>
                        )}
                      </div>
                      {nextStatus && (
                        <button
                          onClick={() => updateRepair(repair.id, { status: nextStatus })}
                          className="px-3 py-1.5 rounded-lg bg-olive/10 text-olive text-xs font-medium hover:bg-olive/20 transition-colors flex items-center gap-1"
                        >
                          Advance <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav />

      {/* Add Repair Modal */}
      <RepairModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(repair) => { addRepair(repair, selectedProfile); setIsAddOpen(false); }}
        defaultResponsible={selectedProfile}
        title="Report Problem"
      />

      {/* Edit Repair Modal */}
      {editingRepair && (
        <RepairModal
          isOpen={!!editingRepair}
          onClose={() => setEditingRepair(null)}
          onSubmit={(repair) => { updateRepair(editingRepair.id, repair); setEditingRepair(null); }}
          defaultValues={editingRepair}
          title="Edit Repair"
        />
      )}

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Repair?">
        <p className="text-sm text-navy-muted mb-4">Are you sure you want to delete this repair record?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors">Cancel</button>
          <button onClick={() => { if (deleteConfirm) deleteRepair(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

interface RepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (repair: Omit<Repair, "id" | "createdAt" | "status" | "photos">) => void;
  defaultValues?: Repair | null;
  defaultResponsible?: ProfileId;
  title: string;
}

function RepairModal({ isOpen, onClose, onSubmit, defaultValues, defaultResponsible, title }: RepairModalProps) {
  const [itemName, setItemName] = useState(defaultValues?.itemName || "");
  const [room, setRoom] = useState(defaultValues?.room || ROOMS[0]);
  const [problemDescription, setProblemDescription] = useState(defaultValues?.problemDescription || "");
  const [priority, setPriority] = useState<TaskPriority>(defaultValues?.priority || "medium");
  const [expectedCost, setExpectedCost] = useState(defaultValues?.expectedCost ? String(defaultValues.expectedCost) : "");
  const [responsiblePerson, setResponsiblePerson] = useState<ProfileId>(defaultValues?.responsiblePerson || defaultResponsible || "moustafa");
  const [technicianName, setTechnicianName] = useState(defaultValues?.technicianName || "");
  const [technicianPhone, setTechnicianPhone] = useState(defaultValues?.technicianPhone || "");
  const [notes, setNotes] = useState(defaultValues?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !problemDescription) return;
    onSubmit({
      itemName,
      room,
      problemDescription,
      priority,
      expectedCost: expectedCost ? Number(expectedCost) : undefined,
      responsiblePerson,
      technicianName: technicianName || undefined,
      technicianPhone: technicianPhone || undefined,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Item Name</label>
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. Washing Machine" required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Room</label>
            <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              {ROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Problem Description</label>
          <textarea value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} placeholder="Describe the problem..." required rows={3} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Expected Cost</label>
            <input type="number" value={expectedCost} onChange={(e) => setExpectedCost(e.target.value)} placeholder="0.00" step="0.01" min="0" className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Responsible</label>
            <select value={responsiblePerson} onChange={(e) => setResponsiblePerson(e.target.value as ProfileId)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Technician Name</label>
            <input type="text" value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} placeholder="Optional" className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Technician Phone</label>
            <input type="text" value={technicianPhone} onChange={(e) => setTechnicianPhone(e.target.value)} placeholder="Optional" className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Warranty info, model number, etc." rows={2} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30 resize-none" />
        </div>
        <button type="submit" className="w-full py-3.5 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light transition-colors">{title}</button>
      </form>
    </Modal>
  );
}
