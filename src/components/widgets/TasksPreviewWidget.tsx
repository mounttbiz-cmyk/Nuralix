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
      <div className="flex flex-col h-full justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-line">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-jade" />
              <h2 className="text-xs font-semibold text-text uppercase tracking-wider">
                Execution Queue
              </h2>
            </div>
            <span className="text-[10px] text-text-muted">
              {tasks.filter(t => !t.completed).length} open
            </span>
          </div>

          <div className="divide-y divide-line/60 pt-1">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="py-2.5 flex items-start gap-2.5 cursor-pointer group"
              >
                <button
                  type="button"
                  className="mt-0.5 text-text-muted group-hover:text-brass transition-colors"
                  aria-label={task.completed ? "Mark incomplete" : "Mark completed"}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-jade" />
                  ) : (
                    <Circle className="w-4 h-4 text-line-strong" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-medium ${
                      task.completed ? "line-through text-text-muted" : "text-text"
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                    <span className="text-brass">{task.owner}</span>
                    <span>·</span>
                    <span>{task.due}</span>
                    <span>·</span>
                    <span className="truncate">{task.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-line">
          <Link
            href="/tasks"
            className="flex items-center justify-between text-xs text-brass hover:underline font-medium btn-tactile"
          >
            <span>View Kanban Board & Action Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
