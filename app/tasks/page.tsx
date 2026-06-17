"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, CheckSquare, CheckCircle2, Clock, AlertCircle, Pencil, Trash2, Calendar,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  PROFILES, TASK_PRIORITY_COLORS, TASK_STATUS_LABELS, getToday, getDaysUntil, isOverdue, formatDate, getProfileById,
} from "../lib/constants";
import Header from "../components/Header";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import BottomNav from "../components/BottomNav";
import type { Task, TaskPriority, TaskStatus, ProfileId } from "../lib/types";

type TaskTab = "all" | "pending" | "done" | "mine" | "late";

export default function TasksPage() {
  const { selectedProfile } = useProfile();
  const router = useRouter();
  const { data, addTask, updateTask, deleteTask, markTaskDone } = useDataStore();

  const [activeTab, setActiveTab] = useState<TaskTab>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const tabs = useMemo(() => {
    const all = data.tasks;
    const pending = all.filter((t) => t.status !== "done");
    const done = all.filter((t) => t.status === "done");
    const mine = all.filter((t) => t.assignedTo === selectedProfile && t.status !== "done");
    const late = all.filter((t) => t.status !== "done" && t.dueDate && isOverdue(t.dueDate));
    return [
      { value: "all" as TaskTab, label: "All", count: all.length },
      { value: "pending" as TaskTab, label: "Pending", count: pending.length },
      { value: "done" as TaskTab, label: "Done", count: done.length },
      { value: "mine" as TaskTab, label: "My Tasks", count: mine.length },
      { value: "late" as TaskTab, label: "Late", count: late.length },
    ];
  }, [data.tasks, selectedProfile]);

  const filteredTasks = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return data.tasks.filter((t) => t.status !== "done");
      case "done":
        return data.tasks.filter((t) => t.status === "done");
      case "mine":
        return data.tasks.filter((t) => t.assignedTo === selectedProfile && t.status !== "done");
      case "late":
        return data.tasks.filter((t) => t.status !== "done" && t.dueDate && isOverdue(t.dueDate));
      default:
        return data.tasks;
    }
  }, [data.tasks, activeTab, selectedProfile]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (a.status === "done" && b.status !== "done") return 1;
      if (a.status !== "done" && b.status === "done") return -1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return 0;
    });
  }, [filteredTasks]);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header
        title="Tasks"
        subtitle="Manage household tasks"
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

        {/* Tasks List */}
        <section>
          {sortedTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title={`No ${activeTab} tasks`}
              description="Add tasks to keep your home organized."
              action={activeTab !== "done" ? { label: "Add Task", onClick: () => setIsAddOpen(true) } : undefined}
            />
          ) : (
            <div className="space-y-2 stagger-children">
              {sortedTasks.map((task) => {
                const isLate = task.dueDate && isOverdue(task.dueDate) && task.status !== "done";
                const isMine = task.assignedTo === selectedProfile;
                const assignee = getProfileById(task.assignedTo);
                const daysLeft = task.dueDate ? getDaysUntil(task.dueDate) : null;
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 bg-cream rounded-2xl border ${
                      isLate ? "border-rose/40" : isMine ? "border-olive/30" : "border-warm-gray/60"
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (task.status !== "done") markTaskDone(task.id, selectedProfile);
                      }}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        task.status === "done"
                          ? "bg-sage border-sage"
                          : "border-warm-gray hover:border-olive"
                      }`}
                    >
                      {task.status === "done" && <CheckCircle2 size={16} className="text-cream" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${task.status === "done" ? "text-navy-muted line-through" : "text-navy"}`}>
                          {task.name}
                        </p>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                          style={{ backgroundColor: TASK_PRIORITY_COLORS[task.priority] || "#6B6B80" }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-navy-muted mt-0.5 flex items-center gap-1">
                        {task.dueDate && (
                          <>
                            <Calendar size={10} />
                            {formatDate(task.dueDate)}
                            {daysLeft !== null && daysLeft >= 0 && task.status !== "done" && (
                              <span className="text-sky">{daysLeft === 0 ? " · Due today" : ` · ${daysLeft} days left`}</span>
                            )}
                            {isLate && <span className="text-rose"> · Overdue</span>}
                          </>
                        )}
                        {assignee && (
                          <span style={{ color: assignee.color }}> · {assignee.name}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="w-7 h-7 rounded-lg bg-warm-gray/50 flex items-center justify-center hover:bg-warm-gray transition-colors"
                      >
                        <Pencil size={12} className="text-navy-muted" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(task.id)}
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

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(task) => { addTask(task, selectedProfile); setIsAddOpen(false); }}
        defaultAssignedTo={selectedProfile}
        title="Add Task"
      />

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(task) => { updateTask(editingTask.id, task); setEditingTask(null); }}
          defaultValues={editingTask}
          title="Edit Task"
        />
      )}

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Task?">
        <p className="text-sm text-navy-muted mb-4">Are you sure you want to delete this task?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors">Cancel</button>
          <button onClick={() => { if (deleteConfirm) deleteTask(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  defaultValues?: Task | null;
  defaultAssignedTo?: ProfileId;
  title: string;
}

function TaskModal({ isOpen, onClose, onSubmit, defaultValues, defaultAssignedTo, title }: TaskModalProps) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [assignedTo, setAssignedTo] = useState<ProfileId>(defaultValues?.assignedTo || defaultAssignedTo || "moustafa");
  const [dueDate, setDueDate] = useState(defaultValues?.dueDate || getToday());
  const [priority, setPriority] = useState<TaskPriority>(defaultValues?.priority || "medium");
  const [notes, setNotes] = useState(defaultValues?.notes || "");
  const [relatedType, setRelatedType] = useState(defaultValues?.relatedType || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit({
      name,
      assignedTo,
      dueDate,
      priority,
      notes: notes || undefined,
      relatedType: (relatedType || undefined) as Task["relatedType"] | undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Task Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pay internet bill" required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Assigned To</label>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value as ProfileId)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              {PROFILES.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Related To</label>
            <select value={relatedType} onChange={(e) => setRelatedType(e.target.value)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              <option value="">None</option>
              <option value="bill">Bill</option>
              <option value="repair">Repair</option>
              <option value="shopping">Shopping</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any extra details..." rows={3} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30 resize-none" />
        </div>
        <button type="submit" className="w-full py-3.5 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light transition-colors">{title}</button>
      </form>
    </Modal>
  );
}
