"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  CheckSquare,
  CheckCircle2,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  PROFILES,
  getToday,
  getDaysUntil,
  isOverdue,
  formatDate,
  getProfileById,
} from "../lib/constants";
import { getProfileTheme } from "../lib/profile-themes";
import Header from "../components/Header";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import BottomNav from "../components/BottomNav";
import type { Task, TaskPriority, ProfileId } from "../lib/types";

type TaskTab = "all" | "pending" | "done" | "mine" | "late";

export default function TasksPage() {
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
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
            className="w-9 h-9 rounded-xl text-cream flex items-center justify-center transition-opacity hover:opacity-90 profile-focus"
            style={{ backgroundColor: theme.primary }}
            aria-label="Add task"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="max-w-md mx-auto px-5 space-y-6">
        <div className="flex gap-2 overflow-x-auto pt-4 pb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 border profile-focus"
                style={isActive
                  ? { backgroundColor: theme.primary, color: "#FFFFFF", borderColor: theme.primary, boxShadow: `0 8px 18px ${theme.primary}22` }
                  : { backgroundColor: "#FFFFFF", color: "var(--text-secondary)", borderColor: theme.primary + "1F" }}
              >
                {tab.label}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={isActive
                    ? { backgroundColor: "rgba(255,255,255,0.18)", color: "#FFFFFF" }
                    : { backgroundColor: theme.soft, color: theme.primary }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

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
                const assigneeTheme = getProfileTheme(task.assignedTo);
                const daysLeft = task.dueDate ? getDaysUntil(task.dueDate) : null;
                const isDone = task.status === "done";

                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4 bg-cream rounded-2xl border"
                    style={{ borderColor: isLate ? "#B35C4B66" : isMine ? theme.primary + "44" : theme.primary + "20" }}
                  >
                    <button
                      onClick={() => {
                        if (!isDone) markTaskDone(task.id, selectedProfile);
                      }}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors profile-focus"
                      style={isDone
                        ? { backgroundColor: theme.primary, borderColor: theme.primary }
                        : { backgroundColor: "#FFFFFF", borderColor: theme.primary + "45" }}
                      aria-label={isDone ? "Task completed" : "Mark task done"}
                    >
                      {isDone && <CheckCircle2 size={16} className="text-cream" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${isDone ? "text-navy-muted line-through" : "text-navy"}`}>
                          {task.name}
                        </p>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: theme.soft, color: theme.primary }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-navy-muted mt-0.5 flex items-center gap-1 flex-wrap">
                        {task.dueDate && (
                          <>
                            <Calendar size={10} />
                            {formatDate(task.dueDate)}
                            {daysLeft !== null && daysLeft >= 0 && !isDone && (
                              <span style={{ color: theme.primary }}>{daysLeft === 0 ? " · Due today" : ` · ${daysLeft} days left`}</span>
                            )}
                            {isLate && <span style={{ color: "#B35C4B" }}> · Overdue</span>}
                          </>
                        )}
                        {assignee && (
                          <span style={{ color: assigneeTheme.primary }}> · {assignee.name}</span>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80 profile-focus"
                        style={{ backgroundColor: theme.soft, color: theme.primary }}
                        aria-label="Edit task"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(task.id)}
                        className="w-7 h-7 rounded-lg bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors profile-focus"
                        aria-label="Delete task"
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

      <TaskModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(task) => { addTask(task, selectedProfile); setIsAddOpen(false); }}
        defaultAssignedTo={selectedProfile}
        title="Add Task"
      />

      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(task) => { updateTask(editingTask.id, task); setEditingTask(null); }}
          defaultValues={editingTask}
          title="Edit Task"
        />
      )}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Task?">
        <p className="text-sm text-navy-muted mb-4">Are you sure you want to delete this task?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 py-3 rounded-xl bg-cream border text-navy font-medium hover:bg-cream-dark transition-colors profile-focus"
            style={{ borderColor: theme.primary + "22" }}
          >
            Cancel
          </button>
          <button
            onClick={() => { if (deleteConfirm) deleteTask(deleteConfirm); setDeleteConfirm(null); }}
            className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors profile-focus"
          >
            Delete
          </button>
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
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);
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
        <Field label="Task Name">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pay internet bill" required className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Assigned To">
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value as ProfileId)} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }}>
              {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Due Date">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Priority">
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Related To">
            <select value={relatedType} onChange={(e) => setRelatedType(e.target.value)} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus" style={{ borderColor: theme.primary + "24" }}>
              <option value="">None</option>
              <option value="bill">Bill</option>
              <option value="repair">Repair</option>
              <option value="shopping">Shopping</option>
              <option value="expense">Expense</option>
            </select>
          </Field>
        </div>
        <Field label="Notes (optional)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any extra details..." rows={3} className="w-full bg-cream border rounded-xl px-4 py-3 text-navy focus:outline-none profile-focus resize-none" style={{ borderColor: theme.primary + "24" }} />
        </Field>
        <button type="submit" className="w-full py-3.5 rounded-xl text-cream font-semibold hover:opacity-90 transition-opacity profile-focus" style={{ backgroundColor: theme.primary }}>{title}</button>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">{label}</label>
      {children}
    </div>
  );
}
