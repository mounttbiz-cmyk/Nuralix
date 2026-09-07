"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitBranch,
  Workflow,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Mail,
  Users,
  Database,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Check,
  Pause,
  ChevronDown
} from "lucide-react";

interface WorkflowStep {
  id: string;
  type: "trigger" | "ai_analysis" | "condition" | "action" | "delay" | "integration";
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  status: "idle" | "running" | "completed";
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  category: "sales" | "finance" | "operations" | "customer";
  status: "active" | "paused";
  executionsCount: number;
  successRate: string;
  lastRun: string;
  steps: WorkflowStep[];
}

const DEFAULT_WORKFLOWS: WorkflowItem[] = [
  {
    id: "wf_lead_qualification",
    name: "Enterprise Inbound Lead Auto-Qualification & CRM Sync",
    description: "New lead → analyze ICP fit → assign AE → send personalized deck → wait 2 days → follow up → update CRM.",
    category: "sales",
    status: "active",
    executionsCount: 142,
    successRate: "98.6%",
    lastRun: "12m ago",
    steps: [
      {
        id: "step_1",
        type: "trigger",
        title: "Trigger: Inbound Webhook",
        subtitle: "New lead captured on website or demo request form",
        icon: "⚡",
        color: "border-amber-400/40 bg-amber-400/10 text-amber-400",
        status: "completed",
      },
      {
        id: "step_2",
        type: "ai_analysis",
        title: "AI Analysis: Elena (Marketing AI)",
        subtitle: "Extract domain telemetry, calculate ICP score & budget threshold",
        icon: "🤖",
        color: "border-purple-400/40 bg-purple-400/10 text-purple-400",
        status: "completed",
      },
      {
        id: "step_3",
        type: "condition",
        title: "Condition Check: Deal Value > ₹5,00,000",
        subtitle: "Route enterprise deals to executive AE vs automated self-serve",
        icon: "🔍",
        color: "border-blue-400/40 bg-blue-400/10 text-blue-400",
        status: "completed",
      },
      {
        id: "step_4",
        type: "action",
        title: "Action: Vikram (Sales AI)",
        subtitle: "Assign Senior AE, seed task in /tasks, and prepare custom pitch",
        icon: "👤",
        color: "border-brass/40 bg-brass/10 text-brass",
        status: "completed",
      },
      {
        id: "step_5",
        type: "integration",
        title: "Integration: Google Workspace (Gmail)",
        subtitle: "Send founder-signed introductory executive briefing via Gmail",
        icon: "📨",
        color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
        status: "completed",
      },
      {
        id: "step_6",
        type: "delay",
        title: "Delay: Wait 48 Hours",
        subtitle: "Monitor inbox reply telemetry & calendar booking link clicks",
        icon: "⏳",
        color: "border-line text-text-muted bg-surface-2",
        status: "running",
      },
      {
        id: "step_7",
        type: "action",
        title: "Follow-Up & CRM Stage Update",
        subtitle: "If no reply: dispatch follow-up reminder & update HubSpot CRM",
        icon: "🔄",
        color: "border-cyan-400/40 bg-cyan-400/10 text-cyan-400",
        status: "idle",
      },
    ],
  },
  {
    id: "wf_solvency_guard",
    name: "CFO Solvency Alarm & Unapproved Expense Escalation",
    description: "Net burn spike detected (>15% MoM) → audit ledger → flag discretionary tools → alert leadership.",
    category: "finance",
    status: "active",
    executionsCount: 18,
    successRate: "100%",
    lastRun: "2h ago",
    steps: [
      {
        id: "sg_1",
        type: "trigger",
        title: "Trigger: Net Burn > ₹2,00,000 / month",
        subtitle: "Daily automated telemetry scan across banking & QuickBooks",
        icon: "📊",
        color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
        status: "completed",
      },
      {
        id: "sg_2",
        type: "ai_analysis",
        title: "AI Analysis: Marcus (CFO AI)",
        subtitle: "Calculate runway contraction and pinpoint top 3 expense outliers",
        icon: "🤖",
        color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
        status: "completed",
      },
      {
        id: "sg_3",
        type: "action",
        title: "Action: Dispatch Slack Alert & Create Task",
        subtitle: "Notify #finance-boardroom and assign expense freeze in /tasks",
        icon: "🚨",
        color: "border-rust/40 bg-rust/10 text-rust",
        status: "completed",
      },
    ],
  },
  {
    id: "wf_sla_escalation",
    name: "Customer Delivery SLA & Churn Prevention Escalation",
    description: "Ticket turnaround > 24 hours → David (Ops AI) audits roadblock → re-assign priority queue.",
    category: "operations",
    status: "paused",
    executionsCount: 54,
    successRate: "94.2%",
    lastRun: "Yesterday",
    steps: [
      {
        id: "sla_1",
        type: "trigger",
        title: "Trigger: Support SLA Breach Threat",
        subtitle: "Client inquiry unattended past 18 hours in communication queue",
        icon: "⏱️",
        color: "border-amber-400/40 bg-amber-400/10 text-amber-400",
        status: "idle",
      },
      {
        id: "sla_2",
        type: "action",
        title: "Action: Auto-Draft Solution via Knowledge Hub",
        subtitle: "Synthesize response from company SOPs and alert account manager",
        icon: "📚",
        color: "border-blue-400/40 bg-blue-400/10 text-blue-400",
        status: "idle",
      },
    ],
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(DEFAULT_WORKFLOWS);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("wf_lead_qualification");
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const toggleStatus = (id: string) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w
      )
    );
  };

  const handleTestRun = () => {
    setIsSimulatingRun(true);
    setTestResult(null);
    setTimeout(() => {
      setIsSimulatingRun(false);
      setTestResult("Workflow executed successfully! 7 nodes validated without exceptions.");
      setTimeout(() => setTestResult(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <GitBranch className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text">Visual Workflow Builder</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
              Autonomous Operations
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Connect AI executives, decision triggers, tools, and third-party integrations into autonomous operational loops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestRun}
            disabled={isSimulatingRun}
            className="px-3.5 py-2 rounded-lg bg-surface-2 hover:bg-surface border border-line hover:border-line-strong text-xs font-semibold text-text btn-tactile inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-jade" />
            <span>{isSimulatingRun ? "Executing Simulation…" : "Test Run Workflow"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const name = prompt("Enter workflow name:", "Custom Inbound Escalation Flow");
              if (!name) return;
              const newWf: WorkflowItem = {
                id: `wf_${Date.now()}`,
                name,
                description: "Custom operational pipeline generated by user.",
                category: "operations",
                status: "active",
                executionsCount: 0,
                successRate: "100%",
                lastRun: "Just now",
                steps: [
                  {
                    id: "step_custom_1",
                    type: "trigger",
                    title: "Trigger: Webhook or Event",
                    subtitle: "Triggered on new event",
                    icon: "⚡",
                    color: "border-amber-400/40 bg-amber-400/10 text-amber-400",
                    status: "completed",
                  },
                  {
                    id: "step_custom_2",
                    type: "ai_analysis",
                    title: "AI Analysis Node",
                    subtitle: "Analyze with executive AI",
                    icon: "🤖",
                    color: "border-brass/40 bg-brass/10 text-brass",
                    status: "idle",
                  },
                ],
              };
              setWorkflows(prev => [newWf, ...prev]);
              setSelectedWorkflowId(newWf.id);
            }}
            className="px-4 py-2 rounded-lg bg-brass text-white text-xs font-bold shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-xl bg-jade/10 border border-jade/30 text-xs text-jade flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Workflows Selector / Management Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {workflows.map(wf => {
          const isSelected = wf.id === selectedWorkflowId;
          return (
            <div
              key={wf.id}
              onClick={() => setSelectedWorkflowId(wf.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer btn-tactile flex flex-col justify-between ${
                isSelected
                  ? "bg-surface-2 border-brass ring-1 ring-brass/30 shadow-sm"
                  : "bg-surface border border-line hover:border-line-strong"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                    {wf.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        toggleStatus(wf.id);
                      }}
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase cursor-pointer border ${
                        wf.status === "active"
                          ? "bg-jade/10 border-jade/30 text-jade"
                          : "bg-surface-2 border-line text-text-muted"
                      }`}
                    >
                      {wf.status === "active" ? "● Active" : "○ Paused"}
                    </span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-text line-clamp-1">{wf.name}</h3>
                <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-text-muted font-mono">
                <span>{wf.executionsCount} runs</span>
                <span>{wf.successRate} success</span>
                <span>{wf.lastRun}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Workflow Visual Canvas */}
      <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-brass" />
              <h2 className="text-sm font-bold text-text">{activeWorkflow.name}</h2>
            </div>
            <p className="text-xs text-text-muted mt-0.5">{activeWorkflow.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">
              {activeWorkflow.steps.length} sequential nodes
            </span>
          </div>
        </div>

        {/* Visual Node Sequence Canvas */}
        <div className="space-y-4 max-w-3xl mx-auto py-2">
          {activeWorkflow.steps.map((step, idx) => {
            const isLast = idx === activeWorkflow.steps.length - 1;
            return (
              <React.Fragment key={step.id}>
                {/* Node Card */}
                <div className="p-4 rounded-xl border border-line bg-surface-2/60 hover:bg-surface-2 transition-all shadow-xs flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center text-base shrink-0 shadow-inner ${step.color}`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text">{step.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface border border-line text-text-muted uppercase font-mono">
                          Node {idx + 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {step.status === "completed" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-jade font-semibold bg-jade/10 px-2 py-0.5 rounded-full border border-jade/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    )}
                    {step.status === "running" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>In Queue</span>
                      </span>
                    )}
                    {step.status === "idle" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-text-muted font-semibold bg-surface px-2 py-0.5 rounded-full border border-line">
                        <span>Standby</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Downward Connector Arrow */}
                {!isLast && (
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-6 bg-line relative flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-brass/80 shadow-xs" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-text-muted flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>Autonomous operational loop connected to Executive AI team & /tasks.</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tasks"
              className="px-3 py-1.5 rounded-lg bg-surface-2 border border-line hover:border-line-strong text-text font-semibold btn-tactile inline-flex items-center gap-1"
            >
              <span>View Generated Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/integrations"
              className="px-3 py-1.5 rounded-lg bg-brass text-white font-semibold btn-tactile hover:brightness-110 inline-flex items-center gap-1"
            >
              <span>Connect Integrations</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
