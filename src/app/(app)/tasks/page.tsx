"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Tag,
  AlertCircle,
  ChevronDown,
  User,
  Sparkles,
  ArrowRight,
  RotateCw
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  owner: string;
  gap?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in_progress" | "done";
  createdAt?: string;
}

const DEFAULT_INITIAL_TASKS: TaskItem[] = [
  { id: "1", title: "Audit discretionary SaaS tool spend for ₹12,000/mo savings", status: "todo", owner: "Marcus (CFO)", priority: "high", gap: "Cash Runway" },
  { id: "2", title: "Draft enterprise SLA & multi-year contract for top account", status: "in_progress", owner: "Astra (CEO)", priority: "critical", gap: "Client Concentration" },
  { id: "3", title: "Launch secondary customer acquisition sprint on LinkedIn", status: "todo", owner: "Elena (CMO)", priority: "medium", gap: "Channel Concentration" },
  { id: "4", title: "Document sales script & handover discovery calls", status: "done", owner: "Founder", priority: "high", gap: "Founder Dependency" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(DEFAULT_INITIAL_TASKS);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newOwner, setNewOwner] = useState("Founder");
  const [newGap, setNewGap] = useState("Cash Runway");
  const [newPriority, setNewPriority] = useState<TaskItem["priority"]>("high");
  const [newStatus, setNewStatus] = useState<TaskItem["status"]>("todo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from persistent SQLite backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.success && Array.isArray(data.tasks) && data.tasks.length > 0) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to load tasks from database", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update status directly
  const handleUpdateStatus = async (taskId: string, targetStatus: TaskItem["status"]) => {
    // Optimistic update
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: targetStatus }),
      });
    } catch (err) {
      console.error("Failed to persist task status update", err);
    }
  };

  // Cycle status: todo -> in_progress -> done -> todo
  const cycleTaskStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let nextStatus: TaskItem["status"] = "todo";
    if (task.status === "todo") nextStatus = "in_progress";
    else if (task.status === "in_progress") nextStatus = "done";
    else if (task.status === "done") nextStatus = "todo";

    handleUpdateStatus(taskId, nextStatus);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Create Custom Task
  const handleCreateTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const titleClean = newTitle.trim();
    if (!titleClean) return;

    setIsSubmitting(true);

    const tempId = `task_${Date.now()}`;
    const newTaskItem: TaskItem = {
      id: tempId,
      title: titleClean,
      owner: newOwner,
      gap: newGap || "General Execution",
      priority: newPriority,
      status: newStatus,
      createdAt: new Date().toISOString(),
    };

    // Optimistic immediate update so user sees it right away
    setTasks(prev => [newTaskItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle("");
    notify("Task successfully added to execution queue!");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleClean,
          owner: newOwner,
          gap: newGap || "General Execution",
          priority: newPriority,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.task) {
        setTasks(prev => prev.map(t => (t.id === tempId ? data.task : t)));
      }
    } catch (err) {
      console.error("Failed to sync task to database", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-surface border border-jade shadow-2xl text-xs font-semibold text-jade flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-jade" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-jade" />
            <h1 className="text-lg font-bold text-text">Execution & Task Queue</h1>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Concrete action items automatically linked to gap playbooks and decision commitments.
          </p>
        </div>

        <button
          id="btn-add-custom-task"
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-brass text-white text-xs font-semibold shadow-sm hover:brightness-110 btn-tactile inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Kanban / List Hybrid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: "todo", label: "To Do", color: "text-amber-500", items: tasks.filter(t => t.status === "todo") },
          { key: "in_progress", label: "In Progress", color: "text-cyan-400", items: tasks.filter(t => t.status === "in_progress") },
          { key: "done", label: "Completed", color: "text-jade", items: tasks.filter(t => t.status === "done") },
        ].map(col => (
          <div key={col.key} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                {col.label}
              </span>
              <span className="text-xs font-mono text-text-muted bg-surface-2 px-1.5 py-0.2 rounded border border-line">
                {col.items.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {col.items.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-line text-center text-xs text-text-muted">
                  No tasks in {col.label.toLowerCase()}
                </div>
              ) : (
                col.items.map(task => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-line bg-surface shadow-theme space-y-3 transition-all group"
                  >
                    {/* Task Title & Cycle Status Icon */}
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => cycleTaskStatus(task.id)}
                        className="mt-0.5 shrink-0 transition-transform active:scale-90 cursor-pointer"
                        title="Click to cycle status: To Do → In Progress → Completed"
                      >
                        {task.status === "done" ? (
                          <CheckCircle2 className="w-4 h-4 text-jade" />
                        ) : task.status === "in_progress" ? (
                          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                        ) : (
                          <Circle className="w-4 h-4 text-line-strong hover:text-amber-400" />
                        )}
                      </button>

                      <span
                        className={`text-xs font-semibold leading-snug flex-1 ${
                          task.status === "done" ? "line-through text-text-muted" : "text-text"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {/* Direct Status Selector Controls */}
                    <div className="p-1 rounded-lg bg-surface-2/70 border border-line/60 flex items-center gap-1 text-[10px]">
                      <span className="text-text-muted px-1 font-mono">Status:</span>
                      {(
                        [
                          { key: "todo", label: "To Do" },
                          { key: "in_progress", label: "In Progress" },
                          { key: "done", label: "Completed" },
                        ] as const
                      ).map(s => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => handleUpdateStatus(task.id, s.key)}
                          className={`flex-1 py-1 rounded font-semibold text-center transition-all cursor-pointer ${
                            task.status === s.key
                              ? s.key === "in_progress"
                                ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shadow-xs"
                                : s.key === "done"
                                ? "bg-jade/20 text-jade border border-jade/30 shadow-xs"
                                : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs"
                              : "text-text-muted hover:text-text hover:bg-surface"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-[10.5px] text-text-muted pt-1 border-t border-line/60">
                      <span className="text-brass font-medium flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{task.owner}</span>
                      </span>
                      <span className="truncate max-w-[130px] font-mono text-[10px]">{task.gap}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD CUSTOM TASK MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-surface border border-line shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brass" />
                <h2 className="text-sm font-bold text-text">Add Custom Execution Task</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-text-muted hover:text-text px-2 py-1 rounded bg-surface-2 cursor-pointer font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-text block mb-1">Task Title / Action Item</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Audit discretionary software subscriptions..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-text block mb-1">Owner / Assignee</label>
                  <select
                    value={newOwner}
                    onChange={e => setNewOwner(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Astra (CEO)">Astra (CEO AI)</option>
                    <option value="Marcus (CFO)">Marcus (CFO AI)</option>
                    <option value="Elena (CMO)">Elena (CMO AI)</option>
                    <option value="Vikram (Sales AI)">Vikram (Sales AI)</option>
                    <option value="Operations AI">Operations AI</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-text block mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass font-medium"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-text block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-text block mb-1">Strategic Gap / Category</label>
                  <input
                    type="text"
                    value={newGap}
                    onChange={e => setNewGap(e.target.value)}
                    placeholder="e.g. Cash Runway"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-text-muted hover:text-text text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => handleCreateTask()}
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-4 py-2 rounded-lg bg-brass text-white font-bold text-xs hover:brightness-110 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Creating…" : "Add Task to Queue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
