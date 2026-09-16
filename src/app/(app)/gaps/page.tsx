"use client";

import React, { useState, useEffect } from "react";
import { defaultGapRules } from "@/config/seeds/defaultRules";
import {
  AlertTriangle,
  CheckCircle2,
  Play,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  UserCheck,
  Clock,
  Target,
  Check,
  ChevronDown,
  Filter,
  Layers,
  Activity
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";
import Link from "next/link";

export type GapStatus = "detected" | "prioritized" | "in_progress" | "under_verification" | "resolved";

export interface ExtendedGapItem {
  id: string;
  key: string;
  title: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  effort: string;
  whyItMatters: string;
  evidenceTemplate: string;
  targetMetric: string;
  actualMetric: string;
  deviation: string;
  deviationPercent: number;
  status: GapStatus;
  assignedOwner: string;
  assignedRole: string;
  completedSteps: number[];
  resolvedAt?: string;
  solutionPlaybook: {
    summary: string;
    successMetric: string;
    firstAction: string;
    steps: {
      title: string;
      detail: string;
      ownerRole?: string;
      days: number;
    }[];
  };
}

const INITIAL_EXTENDED_GAPS: ExtendedGapItem[] = [
  {
    ...defaultGapRules[0],
    targetMetric: "Runway ≥ 12.0 Months",
    actualMetric: "7.2 Months",
    deviation: "-40.0% Deficit",
    deviationPercent: -40,
    status: "in_progress",
    assignedOwner: "Marcus",
    assignedRole: "CFO AI",
    completedSteps: [0],
    evidenceTemplate: "Current cash reserve of ₹12,00,000 against net monthly burn of ₹1,50,000 gives 7.2 months runway.",
  },
  {
    ...defaultGapRules[1],
    targetMetric: "Top Client ≤ 20.0%",
    actualMetric: "36.5% of Revenue",
    deviation: "+82.5% Concentration",
    deviationPercent: 82.5,
    status: "detected",
    assignedOwner: "Astra",
    assignedRole: "CEO AI",
    completedSteps: [],
    evidenceTemplate: "Top client represents 36.5% of trailing enterprise revenue against the 20% safe diversification benchmark.",
  },
  {
    ...defaultGapRules[2],
    targetMetric: "Primary Channel ≤ 45.0%",
    actualMetric: "68.0% via Meta Ads",
    deviation: "+51.1% Vulnerability",
    deviationPercent: 51.1,
    status: "prioritized",
    assignedOwner: "Elena",
    assignedRole: "Marketing AI",
    completedSteps: [],
    evidenceTemplate: "Meta advertising accounts for 68.0% of customer acquisition, creating critical channel risk.",
  },
  {
    id: "rule_gross_margin",
    key: "gross_margin",
    title: "Gross profit margin slippage (<75%)",
    category: "Financial",
    severity: "high",
    effort: "project",
    targetMetric: "Gross Margin ≥ 80.0%",
    actualMetric: "71.4%",
    deviation: "-10.8% Margin Leakage",
    deviationPercent: -10.8,
    status: "detected",
    assignedOwner: "David",
    assignedRole: "Operations AI",
    completedSteps: [],
    whyItMatters: "Gross margin dilution below 75% erodes cash retention, ballooning forward net burn and delaying break-even milestones.",
    evidenceTemplate: "Cost of goods and cloud vendor pass-throughs currently total 28.6% of billed revenue.",
    solutionPlaybook: {
      summary: "Audit third-party cloud hosting usage and contractor rate cards to eliminate gross margin leakage.",
      successMetric: "Restore gross profit margin to 80% within 45 days",
      firstAction: "Review vendor invoices and cloud infrastructure spend",
      steps: [
        { title: "Audit AWS/Azure reserved instances and unallocated compute", detail: "Downsize idle dev environments and enforce 1-year reserved savings plans.", ownerRole: "Operations", days: 4 },
        { title: "Renegotiate contractor delivery rates", detail: "Standardize contractor master service agreements with performance SLA gates.", ownerRole: "CFO", days: 10 },
        { title: "Institute milestone billing sign-off", detail: "Prevent scope creep by requiring written client approvals for out-of-scope work.", ownerRole: "Sales", days: 14 }
      ]
    }
  },
  {
    id: "rule_churn_spike",
    key: "churn_spike",
    title: "Quarterly account logo churn (>6.0%)",
    category: "Operations",
    severity: "critical",
    effort: "project",
    targetMetric: "Annual Churn ≤ 5.0%",
    actualMetric: "8.6% Annualized",
    deviation: "+72.0% Churn Exposure",
    deviationPercent: 72,
    status: "under_verification",
    assignedOwner: "Vikram",
    assignedRole: "Sales AI",
    completedSteps: [0, 1],
    whyItMatters: "High churn creates a leaky bucket where new acquisition spend is consumed just replacing departed accounts.",
    evidenceTemplate: "Over the last 90 days, 3 enterprise accounts cancelled services citing onboarding lag.",
    solutionPlaybook: {
      summary: "Deploy an executive churn prevention playbook with high-touch 30-day onboarding milestones.",
      successMetric: "Reduce quarterly logo churn below 4.5%",
      firstAction: "Review cancellation audit logs and customer tickets",
      steps: [
        { title: "Implement 14-day customer time-to-value check-in", detail: "Assign dedicated implementation specialist to unblock customer setup.", ownerRole: "Operations", days: 3 },
        { title: "Launch executive satisfaction telemetry", detail: "Track weekly product usage alerts to detect disengaged accounts early.", ownerRole: "Product", days: 7 },
        { title: "Establish proactive renewal outreach", detail: "Engage clients 90 days prior to contract expiration with usage ROI summaries.", ownerRole: "Sales", days: 21 }
      ]
    }
  }
];

const AVAILABLE_OWNERS = [
  { name: "Founder", role: "Executive Lead", avatar: "👤" },
  { name: "Astra", role: "CEO AI", avatar: "👑" },
  { name: "Marcus", role: "CFO AI", avatar: "📊" },
  { name: "Elena", role: "Marketing AI", avatar: "🎯" },
  { name: "Vikram", role: "Sales AI", avatar: "⚡" },
  { name: "David", role: "Operations AI", avatar: "⚙️" },
  { name: "Sarah", role: "HR & Talent AI", avatar: "🤝" },
];

export default function GapsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [gaps, setGaps] = useState<ExtendedGapItem[]>(INITIAL_EXTENDED_GAPS);
  const [activeGapId, setActiveGapId] = useState<string>(INITIAL_EXTENDED_GAPS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Sync with live business profile data if present
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem("nuralix_business_profile");
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        const cash = Number(saved.cash || saved.cashOnHand) || 1200000;
        const burn = Number(saved.burn || saved.monthlyBurn) || 150000;
        const actualRunway = burn > 0 ? (cash / burn).toFixed(1) : "18+";

        setGaps(prev =>
          prev.map(g => {
            if (g.key === "cash_runway") {
              const numRunway = Number(actualRunway);
              const dev = ((numRunway - 12) / 12) * 100;
              return {
                ...g,
                actualMetric: `${actualRunway} Months`,
                deviation: `${dev.toFixed(1)}% Deficit`,
                deviationPercent: dev,
                evidenceTemplate: `Current cash reserve of ₹${cash.toLocaleString("en-IN")} against net monthly burn of ₹${burn.toLocaleString("en-IN")} gives ${actualRunway} months runway.`,
              };
            }
            return g;
          })
        );
      }
    } catch {
      // ignore
    }
  }, []);

  const activeGap = gaps.find(g => g.id === activeGapId) || gaps[0];

  const handleStatusChange = (gapId: string, newStatus: GapStatus) => {
    setGaps(prev =>
      prev.map(g => {
        if (g.id === gapId) {
          return {
            ...g,
            status: newStatus,
            resolvedAt: newStatus === "resolved" ? new Date().toISOString() : undefined,
          };
        }
        return g;
      })
    );
  };

  const handleOwnerChange = (gapId: string, ownerName: string, ownerRole: string) => {
    setGaps(prev =>
      prev.map(g => {
        if (g.id === gapId) {
          return { ...g, assignedOwner: ownerName, assignedRole: ownerRole };
        }
        return g;
      })
    );
  };

  const handleToggleStep = (gapId: string, stepIndex: number) => {
    setGaps(prev =>
      prev.map(g => {
        if (g.id === gapId) {
          const exists = g.completedSteps.includes(stepIndex);
          const nextSteps = exists
            ? g.completedSteps.filter(s => s !== stepIndex)
            : [...g.completedSteps, stepIndex];

          // If all steps completed, automatically transition to under_verification
          let nextStatus = g.status;
          if (nextSteps.length === g.solutionPlaybook.steps.length && g.status === "in_progress") {
            nextStatus = "under_verification";
          }

          return { ...g, completedSteps: nextSteps, status: nextStatus };
        }
        return g;
      })
    );
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanMessage("Scanning live business ledger & benchmark telemetry…");

    setTimeout(() => {
      setIsScanning(false);
      setScanMessage("Target Gap Scan complete: 5 operational deviations verified and prioritized.");
      setTimeout(() => setScanMessage(null), 3500);
    }, 1400);
  };

  const handleVerifyResolution = (gapId: string) => {
    handleStatusChange(gapId, "resolved");
    setScanMessage(`Resolution Verified: "${activeGap.title}" target satisfied! Gap closed.`);
    setTimeout(() => setScanMessage(null), 4000);
  };

  // Filter logic
  const filteredGaps = gaps.filter(g => {
    const matchesCategory = selectedCategory === "all" || g.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatusFilter === "all"
        ? true
        : selectedStatusFilter === "active"
        ? g.status !== "resolved"
        : g.status === selectedStatusFilter;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: GapStatus) => {
    switch (status) {
      case "detected":
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber/15 text-amber border border-amber/30">
            Detected
          </span>
        );
      case "prioritized":
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Prioritized
          </span>
        );
      case "in_progress":
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            In Progress
          </span>
        );
      case "under_verification":
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
            Verification
          </span>
        );
      case "resolved":
        return (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-jade/15 text-jade border border-jade/30 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Resolved
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rust/10 border border-rust/30 flex items-center justify-center text-rust">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-text">Gap Register & Closed-Loop Resolution</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase font-mono">
                  Autonomous Watch
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                AI continuously detects target deviations, assigns owners, and tracks corrective playbooks to verified closure.
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={isScanning}
            onClick={handleTriggerScan}
            className="px-3.5 py-1.5 rounded-xl bg-surface-2 border border-line text-xs font-bold text-text hover:border-brass/40 flex items-center gap-1.5 btn-tactile cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brass ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning Gaps…" : "Run AI Gap Scan"}</span>
          </button>

          <Link
            href="/simulator"
            className="px-3.5 py-1.5 rounded-xl bg-brass text-white text-xs font-bold shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simulate Fixes</span>
          </Link>
        </div>
      </div>

      {/* Alert Banner if present */}
      {scanMessage && (
        <div className="p-3.5 rounded-xl bg-brass-soft/40 border border-brass/40 flex items-center gap-2 text-xs font-semibold text-text animate-fade-in">
          <Sparkles className="w-4 h-4 text-brass shrink-0" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Multi-Filter Bar: Status + Category */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-2/40 border border-line">
        {/* Status Lifecycle Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Status:
          </span>
          {[
            { id: "all", label: "All Gaps" },
            { id: "active", label: "Active" },
            { id: "in_progress", label: "In Progress" },
            { id: "resolved", label: "Resolved" },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedStatusFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all btn-tactile cursor-pointer ${
                selectedStatusFilter === f.id
                  ? "bg-brass text-white shadow-xs"
                  : "bg-surface border border-line text-text-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider mr-1">
            Sector:
          </span>
          {["all", "financial", "risk", "marketing", "operations"].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border transition-all btn-tactile cursor-pointer ${
                selectedCategory === cat
                  ? "bg-surface-2 border-brass text-brass font-bold"
                  : "bg-surface border-line text-text-muted hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Pane Register Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Gaps (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-wider px-1">
            <span>Identified Bottlenecks ({filteredGaps.length})</span>
            <span className="text-[10px] text-brass">Prioritized by Impact</span>
          </div>

          <div className="space-y-2.5">
            {filteredGaps.map(gap => {
              const isActive = gap.id === activeGap.id;
              const isResolved = gap.status === "resolved";

              return (
                <div
                  key={gap.id}
                  onClick={() => setActiveGapId(gap.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer btn-tactile space-y-2 ${
                    isActive
                      ? "bg-surface border-brass shadow-theme ring-1 ring-brass/30"
                      : "bg-surface-2/60 border-line hover:border-line-strong hover:bg-surface-2/90"
                  } ${isResolved ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-text leading-snug">
                      {gap.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {getStatusBadge(gap.status)}
                    </div>
                  </div>

                  {/* Target vs Actual Deviation Pill */}
                  <div className="p-2 rounded-lg bg-surface-2/90 border border-line text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Target className="w-3 h-3 text-brass" />
                      <span className="truncate">{gap.actualMetric}</span>
                    </div>
                    <span
                      className={`font-mono font-bold text-[10px] px-1.5 py-0.2 rounded ${
                        gap.deviationPercent < 0
                          ? "bg-rust/15 text-rust"
                          : "bg-amber/15 text-amber"
                      }`}
                    >
                      {gap.deviation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-line/50">
                    <span className="text-brass font-semibold">{gap.category}</span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-text-muted" />
                      <span>{gap.assignedOwner} ({gap.assignedRole})</span>
                    </span>
                    <span>{gap.completedSteps.length}/{gap.solutionPlaybook.steps.length} Steps</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail & Resolution Workbench (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-theme space-y-5">
          {/* Active Gap Header & Status Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brass-soft text-brass">
                {activeGap.category}
              </span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                  activeGap.severity === "critical"
                    ? "bg-rust/15 text-rust border border-rust/30"
                    : "bg-amber/15 text-amber border border-amber/30"
                }`}
              >
                {activeGap.severity} Severity
              </span>
              <ProvenanceBadge type="from_data" />
            </div>

            {/* Lifecycle Status Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-text-muted uppercase">Lifecycle:</span>
              <select
                value={activeGap.status}
                onChange={e => handleStatusChange(activeGap.id, e.target.value as GapStatus)}
                className="px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-xs font-semibold text-text focus:outline-none focus:ring-1 focus:ring-brass cursor-pointer capitalize"
              >
                <option value="detected">Detected</option>
                <option value="prioritized">Prioritized</option>
                <option value="in_progress">In Progress</option>
                <option value="under_verification">Under Verification</option>
                <option value="resolved">Resolved / Closed</option>
              </select>
            </div>
          </div>

          {/* Gap Title & Deviation Metrics Banner */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-text">{activeGap.title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-2/60 border border-line">
                <span className="text-[10px] font-semibold text-text-muted block uppercase">Benchmark Target</span>
                <span className="text-xs font-bold text-text font-mono mt-0.5 block">{activeGap.targetMetric}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-line">
                <span className="text-[10px] font-semibold text-text-muted block uppercase">Current Actual</span>
                <span className="text-xs font-bold text-rust font-mono mt-0.5 block">{activeGap.actualMetric}</span>
              </div>
              <div className="p-3 rounded-xl bg-rust/10 border border-rust/30">
                <span className="text-[10px] font-semibold text-rust block uppercase">Detected Deviation</span>
                <span className="text-xs font-bold text-rust font-mono mt-0.5 block">{activeGap.deviation}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-line text-xs font-mono text-text">
              <strong>Telemetry Evidence:</strong> {activeGap.evidenceTemplate}
            </div>
          </div>

          {/* Why It Matters (Strategic Implication) */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-brass uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brass" />
              Strategic Business Impact
            </span>
            <p className="surface-document text-xs sm:text-sm text-text leading-relaxed p-3.5 rounded-xl bg-surface-2/40 border border-line">
              {activeGap.whyItMatters}
            </p>
          </div>

          {/* Assigned Owner Section */}
          <div className="p-3.5 rounded-xl bg-surface-2/50 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brass-soft border border-brass/30 flex items-center justify-center text-sm">
                👤
              </div>
              <div>
                <span className="text-xs font-bold text-text block">
                  Assigned Owner: {activeGap.assignedOwner} ({activeGap.assignedRole})
                </span>
                <span className="text-[10px] text-text-muted">Responsible for executing resolution milestones</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted font-medium">Reassign:</span>
              <select
                value={activeGap.assignedOwner}
                onChange={e => {
                  const found = AVAILABLE_OWNERS.find(o => o.name === e.target.value);
                  if (found) {
                    handleOwnerChange(activeGap.id, found.name, found.role);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-surface border border-line text-xs font-semibold text-text focus:outline-none focus:ring-1 focus:ring-brass cursor-pointer"
              >
                {AVAILABLE_OWNERS.map(o => (
                  <option key={o.name} value={o.name}>
                    {o.name} ({o.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Solution Playbook with Interactive Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-line">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-jade" />
                Corrective Action Playbook
              </span>
              <span className="text-xs text-jade font-semibold">
                Target: {activeGap.solutionPlaybook.successMetric}
              </span>
            </div>

            <p className="text-xs text-text-muted">
              {activeGap.solutionPlaybook.summary}
            </p>

            {/* Checklist of Steps */}
            <div className="space-y-2">
              {activeGap.solutionPlaybook.steps.map((step, idx) => {
                const isStepCompleted = activeGap.completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleStep(activeGap.id, idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                      isStepCompleted
                        ? "bg-jade/10 border-jade/30 text-text"
                        : "bg-surface-2/60 border border-line hover:border-line-strong"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isStepCompleted
                          ? "bg-jade border-jade text-white"
                          : "border-line bg-surface text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text flex items-center justify-between">
                        <span className={isStepCompleted ? "line-through text-text-muted" : "text-text"}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">{step.days} days</span>
                      </div>
                      <p className="text-text-muted mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resolution Closure Actions Bar */}
          <div className="pt-4 border-t border-line flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {activeGap.status !== "resolved" ? (
                <button
                  type="button"
                  onClick={() => handleVerifyResolution(activeGap.id)}
                  className="px-4 py-2 rounded-xl bg-jade text-white text-xs font-bold shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Resolution & Close Gap</span>
                </button>
              ) : (
                <span className="text-xs text-jade font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-jade/15 border border-jade/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gap Successfully Resolved</span>
                </span>
              )}

              <Link
                href="/simulator"
                className="px-3.5 py-2 rounded-xl bg-surface-2 border border-line text-xs font-semibold text-text hover:bg-surface btn-tactile inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-brass" />
                <span>Simulate Fix</span>
              </Link>
            </div>

            <Link
              href={`/chat?query=${encodeURIComponent(`How should we resolve "${activeGap.title}"?`)}`}
              className="text-xs text-brass hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Executive AI</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
