"use client";

import React, { useState } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { CheckSquare, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TaskItem {
  id: string;
  title: string;
  owner: string;
  due: string;
  completed: boolean;
  source: string;
}

export function TasksPreviewWidget() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "t_1",
      title: "Audit discretionary SaaS tool spend for ₹12,000/mo savings",
      owner: "CFO AI (Marcus)",
      due: "Today",
      completed: false,
      source: "Cash Runway Gap",
    },
    {
      id: "t_2",
      title: "Draft enterprise service level agreement for top account",
      owner: "CEO AI (Astra)",
      due: "In 2 days",
      completed: false,
      source: "Concentration Gap",
    },
    {
      id: "t_3",
      title: "Record video walkthrough of sales closing playbook",
      owner: "Founder",
      due: "Friday",
      completed: true,
      source: "Bottleneck Rule",
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <ContainerTile span={2} id="widget_priority_tasks">
      <div className="flex flex-col h-full justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-jade/15 border border-jade/30 flex items-center justify-center text-jade">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  Autonomous Execution Queue
                </h2>
                <span className="text-[10px] text-text-muted">
                  Assigned across AI executives and founder
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold font-mono border border-cyan-500/30">
              {tasks.filter(t => !t.completed).length} Pending
            </span>
          </div>

          <div className="space-y-2.5 pt-3">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  task.completed
                    ? "bg-surface-2/20 border-white/[0.04] opacity-60"
                    : "bg-surface-2/40 border-white/[0.06] hover:border-white/15 hover:bg-surface-2/70"
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-text-muted group-hover:text-cyan-400 transition-colors"
                  aria-label={task.completed ? "Mark incomplete" : "Mark completed"}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-jade" />
                  ) : (
                    <Circle className="w-4 h-4 text-text-muted hover:text-cyan-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-semibold leading-snug transition-colors ${
                      task.completed ? "line-through text-text-muted/60" : "text-text"
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-text-muted mt-1.5 font-mono">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 font-sans font-medium">
                      {task.owner}
                    </span>
                    <span className="text-white/20">·</span>
                    <span className="text-amber-400 font-medium font-sans">{task.due}</span>
                    <span className="text-white/20">·</span>
                    <span className="truncate text-text-muted/80">{task.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.08]">
          <Link
            href="/tasks"
            className="flex items-center justify-between text-xs text-cyan-400 hover:text-cyan-300 font-semibold btn-tactile group"
          >
            <span>View Kanban Board & Action Plans</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
