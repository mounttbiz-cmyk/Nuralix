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
  ChevronDown,
  ShieldAlert,
  Search,
  BrainCircuit,
  UserCheck,
  RefreshCw,
  Activity,
  Terminal,
  FileCheck,
  X
} from "lucide-react";

interface PipelineStage {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  stageName: "Trigger (Event)" | "Retrieve Relevant Data" | "AI Reasoning & Rules" | "Action / Approval" | "Update Records" | "Monitor Outcome";
  title: string;
  subtitle: string;
  telemetryData: string;
  icon: string;
  status: "idle" | "running" | "completed" | "requires_approval";
  badgeColor: string;
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  category: "sales" | "finance" | "retention" | "operations";
  status: "active" | "paused";
  executionsCount: number;
  successRate: string;
  lastRun: string;
  stages: PipelineStage[];
}

const DEFAULT_WORKFLOWS: WorkflowItem[] = [
  {
    id: "wf_lead_qualification",
    name: "Enterprise Inbound Lead Auto-Qualification & Executive Dispatch",
    description: "Inbound demo request → retrieve company firmographics → Elena & Vikram AI score ICP → route enterprise deals with human AE signoff → update CRM → monitor reply SLA.",
    category: "sales",
    status: "active",
    executionsCount: 184,
    successRate: "99.1%",
    lastRun: "8m ago",
    stages: [
      {
        stepNumber: 1,
        stageName: "Trigger (Event)",
        title: "Inbound Webhook Received",
        subtitle: "Enterprise demo request submitted on pricing page",
        telemetryData: "Payload: { domain: 'techcorp.io', teamSize: '120', requestedTier: 'Enterprise' }",
        icon: "⚡",
        status: "completed",
        badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      },
      {
        stepNumber: 2,
        stageName: "Retrieve Relevant Data",
        title: "Firmographic & Revenue Enrichment",
        subtitle: "Query Clearbit & LinkedIn telemetry for ARR estimate & tech stack",
        telemetryData: "Matched: Series B ARR ₹35Cr+, 140 FTE, Using Segment + HubSpot",
        icon: "🔍",
        status: "completed",
        badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      },
      {
        stepNumber: 3,
        stageName: "AI Reasoning & Rules",
        title: "ICP Scoring & Deal Structuring",
        subtitle: "Elena (Marketing AI) & Claude 3.5 evaluate fit score & suggested ACV",
        telemetryData: "Score: 94/100 (Tier 1 ICP). Recommended contract ACV: ₹8,50,000/yr",
        icon: "🧠",
        status: "completed",
        badgeColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      },
      {
        stepNumber: 4,
        stageName: "Action / Approval",
        title: "AE Assignment & Custom Deck Dispatch",
        subtitle: "Assign Senior AE Vikram & send personalized executive briefing",
        telemetryData: "Assigned: Rahul S. (Sr AE). Executive email personalized with benchmark deck.",
        icon: "👤",
        status: "completed",
        badgeColor: "text-brass bg-brass/10 border-brass/20",
      },
      {
        stepNumber: 5,
        stageName: "Update Records",
        title: "CRM Stage & Task Sync",
        subtitle: "Sync new opportunity to HubSpot CRM & seed follow-up in /tasks",
        telemetryData: "HubSpot Deal #4092 created. Task: 'Execute Demo with VP of Product' logged.",
        icon: "📂",
        status: "completed",
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        stepNumber: 6,
        stageName: "Monitor Outcome",
        title: "SLA Response Tracking",
        subtitle: "Monitor 24-hour reply telemetry and calendar booking completion",
        telemetryData: "Calendar link viewed 2x. Awaiting 48h checkpoint.",
        icon: "📊",
        status: "running",
        badgeColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      },
    ],
  },
  {
    id: "wf_solvency_guard",
    name: "CFO Solvency Alarm & Discretionary Burn Freeze",
    description: "Net burn spike (>12% MoM) → retrieve banking & ledger feeds → Marcus (CFO AI) root cause audit → founder 1-click approval → freeze unapproved vendors → monitor runway recovery.",
    category: "finance",
    status: "active",
    executionsCount: 29,
    successRate: "100%",
    lastRun: "1h ago",
    stages: [
      {
        stepNumber: 1,
        stageName: "Trigger (Event)",
        title: "Daily Burn Deviation Alert",
        subtitle: "Monthly run-rate projected burn exceeded ₹2,50,000 threshold",
        telemetryData: "Projected burn: ₹2,68,000 (+14.2% MoM drift). Runway delta: -1.4 months",
        icon: "🚨",
        status: "completed",
        badgeColor: "text-rust bg-rust/10 border-rust/20",
      },
      {
        stepNumber: 2,
        stageName: "Retrieve Relevant Data",
        title: "Pull Discretionary SaaS & Cloud Ledger",
        subtitle: "Extract all vendor line items & compare with 90-day usage logs",
        telemetryData: "Scanned 28 vendor transactions. Identified 3 inactive tools costing ₹65,000/mo.",
        icon: "📊",
        status: "completed",
        badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      },
      {
        stepNumber: 3,
        stageName: "AI Reasoning & Rules",
        title: "DeepSeek R1 Solvency Reasoning",
        subtitle: "Simulate cash reserve preservation and draft remediation directive",
        telemetryData: "Directive: Deprecate redundant seats; recover ₹7.8L annualized; preserve 15.2mo runway.",
        icon: "🧠",
        status: "completed",
        badgeColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      },
      {
        stepNumber: 4,
        stageName: "Action / Approval",
        title: "Founder 1-Click Approval Request",
        subtitle: "Route decision to Executive Briefing & Slack #executive-boardroom",
        telemetryData: "Directives dispatched to /reports. Status: Ready for founder signoff.",
        icon: "✍️",
        status: "completed",
        badgeColor: "text-brass bg-brass/10 border-brass/20",
      },
      {
        stepNumber: 5,
        stageName: "Update Records",
        title: "Ledger Flag & Vendor Notification",
        subtitle: "Tag expenses in ledger & queue auto-cancellation notice",
        telemetryData: "Records updated in Quickbooks. Notification scheduled for billing contact.",
        icon: "📂",
        status: "completed",
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        stepNumber: 6,
        stageName: "Monitor Outcome",
        title: "Runway Recovery Telemetry",
        subtitle: "Verify savings reflected in next bank sync and update Solvency Index",
        telemetryData: "Solvency Index benchmark recalculated to 84/100 (+4 pts).",
        icon: "🛡️",
        status: "completed",
        badgeColor: "text-jade bg-jade/10 border-jade/20",
      },
    ],
  },
  {
    id: "wf_payment_rescue",
    name: "Payment Failure & VIP Customer Retention Rescue",
    description: "Stripe invoice failure → retrieve customer lifetime value & usage → evaluate churn risk → dispatch personalized retention outreach → sync ledger → monitor recovery.",
    category: "retention",
    status: "active",
    executionsCount: 68,
    successRate: "97.4%",
    lastRun: "Yesterday",
    stages: [
      {
        stepNumber: 1,
        stageName: "Trigger (Event)",
        title: "Payment Gateway Failure Webhook",
        subtitle: "Stripe webhook: Invoice #INV-8821 payment failed (Card expired)",
        telemetryData: "Amount: ₹1,20,000. Customer: Acme Logistics (Tier-1 VIP).",
        icon: "💳",
        status: "completed",
        badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      },
      {
        stepNumber: 2,
        stageName: "Retrieve Relevant Data",
        title: "Customer Profile & Telemetry Fetch",
        subtitle: "Check customer ARR, historical health score, and key stakeholder",
        telemetryData: "LTV: ₹14,40,000. Account NPS: 9/10. Primary contact: CTO.",
        icon: "🔍",
        status: "completed",
        badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      },
      {
        stepNumber: 3,
        stageName: "AI Reasoning & Rules",
        title: "Risk Assessment & Playbook Selection",
        subtitle: "Determine whether to auto-retry, send soft nudge, or alert AE",
        telemetryData: "VIP tier requires high-touch white-glove billing link with grace period extension.",
        icon: "🧠",
        status: "completed",
        badgeColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      },
      {
        stepNumber: 4,
        stageName: "Action / Approval",
        title: "White-Glove Payment Link Dispatch",
        subtitle: "Send customized WhatsApp & email link with 7-day service extension",
        telemetryData: "Dispatch completed via SendGrid. VIP grace period extended by 7 days.",
        icon: "📨",
        status: "completed",
        badgeColor: "text-brass bg-brass/10 border-brass/20",
      },
      {
        stepNumber: 5,
        stageName: "Update Records",
        title: "Stripe & CRM Status Tagging",
        subtitle: "Update account status to 'Grace Period Active' in CRM & finance sheets",
        telemetryData: "Account flagged in ledger. Account Executive CC'd on resolution thread.",
        icon: "📂",
        status: "completed",
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        stepNumber: 6,
        stageName: "Monitor Outcome",
        title: "Payment Settlement Verification",
        subtitle: "Listen for charge.succeeded webhook and close retention ticket",
        telemetryData: "Awaiting customer settlement. 0 churn recorded in cohort.",
        icon: "🎯",
        status: "completed",
        badgeColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      },
    ],
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(DEFAULT_WORKFLOWS);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("wf_lead_qualification");
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationCurrentStage, setSimulationCurrentStage] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowCategory, setNewWorkflowCategory] = useState<"sales" | "finance" | "operations" | "retention">("sales");

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w
      )
    );
  };

  const handleSimulatePipeline = () => {
    setSimulationActive(true);
    setSimulationCurrentStage(1);
    setExecutionLogs([
      `[00.00s] Initializing Event-to-Outcome Engine for: ${activeWorkflow.name}`,
      `[00.15s] [Stage 1: Trigger] Inbound event verified & cryptographic signature validated.`,
    ]);

    const runStage = (stageNum: number) => {
      setTimeout(() => {
        setSimulationCurrentStage(stageNum);
        if (stageNum === 2) {
          setExecutionLogs(prev => [
            ...prev,
            `[00.42s] [Stage 2: Retrieve Relevant Data] Querying connected integrations & internal telemetry.`,
            `[00.60s] Extracted ${activeWorkflow.stages[1]?.telemetryData || "dataset records"}.`,
          ]);
          runStage(3);
        } else if (stageNum === 3) {
          setExecutionLogs(prev => [
            ...prev,
            `[00.95s] [Stage 3: AI Reasoning & Rules] Executing neural evaluation with auto-routed model.`,
            `[01.20s] Logic check passed: Confidence score 96.2%.`,
          ]);
          runStage(4);
        } else if (stageNum === 4) {
          setExecutionLogs(prev => [
            ...prev,
            `[01.55s] [Stage 4: Action / Approval] Dispatching payload / verifying executive permission.`,
            `[01.80s] Action dispatched successfully.`,
          ]);
          runStage(5);
        } else if (stageNum === 5) {
          setExecutionLogs(prev => [
            ...prev,
            `[02.10s] [Stage 5: Update Records] Persisting state mutations to CRM & business ledger.`,
            `[02.30s] Audit transaction hash committed to local storage & ledger.`,
          ]);
          runStage(6);
        } else if (stageNum === 6) {
          setExecutionLogs(prev => [
            ...prev,
            `[02.65s] [Stage 6: Monitor Outcome] Active telemetry listener registered. Operational loop closed.`,
            `[02.90s] ✓ Entire 6-stage Event-to-Outcome cycle executed with 0 errors.`,
          ]);
          setTimeout(() => {
            setSimulationActive(false);
          }, 1200);
        }
      }, 500);
    };

    runStage(2);
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) return;
    const newWf: WorkflowItem = {
      id: `wf_${Date.now()}`,
      name: newWorkflowName.trim(),
      description: `Autonomous ${newWorkflowCategory} Event-to-Outcome pipeline created by executive team.`,
      category: newWorkflowCategory,
      status: "active",
      executionsCount: 1,
      successRate: "100%",
      lastRun: "Just now",
      stages: [
        {
          stepNumber: 1,
          stageName: "Trigger (Event)",
          title: "Custom Event Ingestion",
          subtitle: "Webhook listener active for incoming operational triggers",
          telemetryData: "Event stream configured with HMAC authentication.",
          icon: "⚡",
          status: "completed",
          badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        },
        {
          stepNumber: 2,
          stageName: "Retrieve Relevant Data",
          title: "Telemetry & State Extraction",
          subtitle: "Pull historical context and user metadata",
          telemetryData: "Context matched against operational database.",
          icon: "🔍",
          status: "completed",
          badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        },
        {
          stepNumber: 3,
          stageName: "AI Reasoning & Rules",
          title: "Adaptive Decision Matrix",
          subtitle: "Auto-routed LLM reasons over business rules",
          telemetryData: "Evaluated rule thresholds and assigned priority.",
          icon: "🧠",
          status: "completed",
          badgeColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        },
        {
          stepNumber: 4,
          stageName: "Action / Approval",
          title: "Execution Dispatch",
          subtitle: "Execute action or queue for executive confirmation",
          telemetryData: "Dispatched to target system API endpoint.",
          icon: "✍️",
          status: "completed",
          badgeColor: "text-brass bg-brass/10 border-brass/20",
        },
        {
          stepNumber: 5,
          stageName: "Update Records",
          title: "Ledger & CRM Sync",
          subtitle: "Commit changes to central source of truth",
          telemetryData: "Record updated and immutable event logged.",
          icon: "📂",
          status: "completed",
          badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        },
        {
          stepNumber: 6,
          stageName: "Monitor Outcome",
          title: "Feedback & SLA Loop",
          subtitle: "Track resolution and trigger follow-up if uncompleted",
          telemetryData: "Listener active with 48-hour SLA timeout.",
          icon: "📊",
          status: "running",
          badgeColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        },
      ],
    };

    setWorkflows(prev => [newWf, ...prev]);
    setSelectedWorkflowId(newWf.id);
    setIsCreateModalOpen(false);
    setNewWorkflowName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <GitBranch className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text">Automation & Workflows</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
              Event-to-Outcome Engine
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Real business systems execute. Connect triggers, data retrieval, multi-model AI reasoning, actions, and record updates into closed autonomous loops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulatePipeline}
            disabled={simulationActive}
            className="px-3.5 py-2 rounded-lg bg-surface-2 hover:bg-surface border border-line hover:border-line-strong text-xs font-semibold text-text btn-tactile inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${simulationActive ? "text-amber-500 animate-spin" : "text-jade"}`} />
            <span>{simulationActive ? `Running Stage ${simulationCurrentStage}/6…` : "Test Run 6-Stage Loop"}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-brass text-white text-xs font-bold shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {/* 6-Stage Event-to-Outcome Flow Architecture Legend */}
      <div className="p-4 rounded-xl bg-surface border border-line">
        <div className="flex items-center justify-between pb-3 border-b border-line/60">
          <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>Nuralix Closed-Loop Architecture: Event to Outcome</span>
          </span>
          <span className="text-[10px] text-text-muted font-mono">100% Deterministic & Auditable</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
          {[
            { num: "1", name: "Trigger (Event)", desc: "Inbound webhook, failure, or KPI breach" },
            { num: "2", name: "Retrieve Data", desc: "Enrich with CRM, banking & telemetry" },
            { num: "3", name: "AI Reasoning", desc: "Multi-model reasoning & rules check" },
            { num: "4", name: "Action / Approval", desc: "Autonomous dispatch or 1-click signoff" },
            { num: "5", name: "Update Records", desc: "Persist mutations to CRM, ERP & ledger" },
            { num: "6", name: "Monitor Outcome", desc: "Track SLA response & close feedback loop" },
          ].map(s => (
            <div key={s.num} className="p-2.5 rounded-lg bg-surface-2 border border-line space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-text">
                <span className="w-4 h-4 rounded-full bg-brass/20 text-brass text-[10px] flex items-center justify-center font-mono font-bold">
                  {s.num}
                </span>
                <span className="line-clamp-1">{s.name}</span>
              </div>
              <p className="text-[10px] text-text-muted line-clamp-2 leading-tight">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflows Selector / Management Grid */}
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
                        toggleWorkflowStatus(wf.id);
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
                <span className="text-emerald-500 font-bold">{wf.successRate} success</span>
                <span>{wf.lastRun}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Workflow: 6-Stage Execution Pipeline Canvas */}
      <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-brass" />
              <h2 className="text-sm font-bold text-text">{activeWorkflow.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-line text-text-muted font-mono uppercase">
                {activeWorkflow.category}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">{activeWorkflow.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-mono">
              6 Event-to-Outcome Stages
            </span>
          </div>
        </div>

        {/* Visual 6-Stage Pipeline List */}
        <div className="space-y-3 max-w-3xl mx-auto py-1">
          {activeWorkflow.stages.map((stage, idx) => {
            const isLast = idx === activeWorkflow.stages.length - 1;
            const isSimulatingThis = simulationActive && simulationCurrentStage === stage.stepNumber;
            const isSimulatedDone = simulationActive && simulationCurrentStage > stage.stepNumber;

            return (
              <React.Fragment key={stage.stepNumber}>
                <div
                  className={`p-4 rounded-xl border transition-all shadow-xs flex items-start justify-between gap-3 ${
                    isSimulatingThis
                      ? "bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30"
                      : isSimulatedDone
                      ? "bg-jade/5 border-jade/30"
                      : "bg-surface-2/60 border-line hover:bg-surface-2"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 shadow-inner ${stage.badgeColor}`}
                    >
                      {stage.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-line text-brass font-bold uppercase font-mono">
                          Stage {stage.stepNumber}: {stage.stageName}
                        </span>
                        <h4 className="text-xs font-bold text-text">{stage.title}</h4>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {stage.subtitle}
                      </p>
                      {/* Telemetry Payload Block */}
                      <div className="mt-1 p-2 rounded-lg bg-surface border border-line/70 font-mono text-[11px] text-text-muted flex items-start gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-brass shrink-0 mt-0.5" />
                        <span className="text-text break-all">{stage.telemetryData}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pt-1">
                    {isSimulatingThis ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-bold bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Simulating…</span>
                      </span>
                    ) : isSimulatedDone || stage.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-jade font-semibold bg-jade/10 px-2 py-0.5 rounded-full border border-jade/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-cyan-500 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        <Activity className="w-3 h-3" />
                        <span>Monitoring</span>
                      </span>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-5 bg-line relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-brass/80 shadow-xs" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Live Simulation Console & Execution Output */}
        {executionLogs.length > 0 && (
          <div className="p-4 rounded-xl bg-surface-2 border border-line font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-line/60 pb-2">
              <span className="text-text font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-brass" />
                Live Execution Logs (Event-to-Outcome Engine)
              </span>
              <button
                type="button"
                onClick={() => setExecutionLogs([])}
                className="text-[10px] text-text-muted hover:text-text cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 text-[11px] max-h-40 overflow-y-auto">
              {executionLogs.map((log, i) => (
                <div key={i} className="text-text-muted flex items-start gap-2">
                  <span className="text-brass">›</span>
                  <span className={log.includes("✓") ? "text-emerald-500 font-bold" : "text-text"}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-text-muted flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>Automated loop integrated with CRM, Banking, /gaps, and Executive Intelligence Briefings.</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/reports"
              className="px-3 py-1.5 rounded-lg bg-surface-2 border border-line hover:border-line-strong text-text font-semibold btn-tactile inline-flex items-center gap-1"
            >
              <span>View Executive Directives</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/integrations"
              className="px-3 py-1.5 rounded-lg bg-brass text-white font-semibold btn-tactile hover:brightness-110 inline-flex items-center gap-1"
            >
              <span>Manage Webhook Feeds</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Create Workflow Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-surface border border-line rounded-2xl shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                <Plus className="w-4 h-4 text-brass" />
                <span>Create Event-to-Outcome Pipeline</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Pipeline Name</label>
                <input
                  type="text"
                  value={newWorkflowName}
                  onChange={e => setNewWorkflowName(e.target.value)}
                  placeholder="e.g. VIP Customer Retention Rescue"
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:border-brass text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Operational Domain</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["sales", "finance", "operations", "retention"] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewWorkflowCategory(cat)}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold uppercase cursor-pointer ${
                        newWorkflowCategory === cat
                          ? "bg-brass text-white border-brass"
                          : "bg-surface-2 border-line text-text-muted hover:text-text"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                <span className="text-[11px] font-bold text-text block">6 Automatic Stages Included:</span>
                <p className="text-[10px] text-text-muted">
                  Trigger ➔ Data Retrieval ➔ Multi-Model AI Reasoning ➔ Action/Approval ➔ Update Records ➔ Monitor Outcome
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-text text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateWorkflow}
                disabled={!newWorkflowName.trim()}
                className="px-4 py-1.5 rounded-lg bg-brass text-white text-xs font-bold shadow-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                Deploy Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
