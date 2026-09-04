"use client";

import React, { useState } from "react";
import { CheckSquare, Plus, CheckCircle2, Circle, Clock, Tag } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Audit discretionary SaaS tool spend for ₹12,000/mo savings", status: "todo", owner: "Marcus (CFO)", priority: "high", gap: "Cash Runway" },
    { id: "2", title: "Draft enterprise SLA & multi-year contract for top account", status: "in_progress", owner: "Astra (CEO)", priority: "critical", gap: "Client Concentration" },
    { id: "3", title: "Launch secondary customer acquisition sprint on LinkedIn", status: "todo", owner: "Elena (CMO)", priority: "medium", gap: "Channel Concentration" },
    { id: "4", title: "Document sales script & handover discovery calls", status: "done", owner: "Founder", priority: "high", gap: "Founder Dependency" },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
      )
    );
  };

  return (
    <div className="space-y-6">
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
          type="button"
          className="px-3.5 py-1.5 rounded-lg bg-brass text-white text-xs font-semibold shadow-sm hover:brightness-110 btn-tactile inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Kanban / List Hybrid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: "todo", label: "To Do", items: tasks.filter(t => t.status === "todo") },
          { key: "in_progress", label: "In Progress", items: tasks.filter(t => t.status === "in_progress") },
          { key: "done", label: "Completed", items: tasks.filter(t => t.status === "done") },
        ].map(col => (
          <div key={col.key} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                {col.label}
              </span>
              <span className="text-xs font-mono text-text-muted bg-surface-2 px-1.5 py-0.2 rounded border border-line">
                {col.items.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {col.items.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="p-3.5 rounded-xl border border-line bg-surface shadow-theme space-y-2.5 cursor-pointer btn-tactile group"
                >
                  <div className="flex items-start gap-2">
                    <button type="button" className="mt-0.5 text-text-muted group-hover:text-brass">
                      {task.status === "done" ? (
                        <CheckCircle2 className="w-4 h-4 text-jade" />
                      ) : (
                        <Circle className="w-4 h-4 text-line-strong" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-semibold leading-snug ${
                        task.status === "done" ? "line-through text-text-muted" : "text-text"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] text-text-muted pt-1 border-t border-line/60">
                    <span className="text-brass font-medium">{task.owner}</span>
                    <span className="truncate max-w-[120px]">{task.gap}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
