"use client";

import React, { useState } from "react";
import Link from "next/link";
import { defaultScenarioTemplates } from "@/config/seeds/defaultScenarios";
import {
  Compass,
  Play,
  CheckCircle2,
  Sliders,
  ArrowRight,
  RefreshCw,
  Sparkles,
  GitBranch,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Zap,
  RotateCcw
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";

interface ScenarioOption {
  id: string;
  name: string;
  subtitle: string;
  hiringCount: number;
  monthlyCost: number;
  projectedRevenueIncrease: number;
  runwayImpactMonths: number;
  riskScore: "Low" | "Medium" | "High";
  roiPercent: number;
  isRecommended?: boolean;
}

const SCENARIOS: ScenarioOption[] = [
  {
    id: "opt_a",
    name: "Option A: Hire 5 Full-Time Engineers",
    subtitle: "Accelerate product roadmap with dedicated domestic in-house team.",
    hiringCount: 5,
    monthlyCost: 650000,
    projectedRevenueIncrease: 1200000,
    runwayImpactMonths: -3.2,
    riskScore: "High",
    roiPercent: 184,
  },
  {
    id: "opt_b",
    name: "Option B: Lean AI Workflows + 2 Senior Leads (Recommended)",
    subtitle: "Automate delivery pipelines with Nuralix Workflows & hire 2 architects.",
    hiringCount: 2,
    monthlyCost: 320000,
    projectedRevenueIncrease: 1050000,
    runwayImpactMonths: -1.1,
    riskScore: "Low",
    roiPercent: 328,
    isRecommended: true,
  },
  {
    id: "opt_c",
    name: "Option C: Contract Agency Staffing",
    subtitle: "Flexible 6-month contract agency support with zero long-term severance.",
    hiringCount: 4,
    monthlyCost: 480000,
    projectedRevenueIncrease: 750000,
    runwayImpactMonths: -2.0,
    riskScore: "Medium",
    roiPercent: 156,
  },
];

export default function SimulatorPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("opt_b");
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasExecutedPlan, setHasExecutedPlan] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // Custom simulation adjustments
  const [salary, setSalary] = useState(1500000);
  const [rampMonths, setRampMonths] = useState(4);

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[1];

  const handleRun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleExecutePlan = () => {
    setHasExecutedPlan(true);
    setExecutionMessage(
      `Plan Executed! Created 4 tasks in /tasks and scheduled workflow '${activeScenario.name}' for operational tracking.`
    );
    setTimeout(() => {
      setExecutionMessage(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text">Strategic Decision Simulator</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
              Monte Carlo Engine
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Closed-loop business simulation: Understand → Simulate → Compare Outcomes → AI Recommendation → Execute Plan.
          </p>
        </div>

        {/* Execution Status Badge */}
        {hasExecutedPlan && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-jade/10 border border-jade/30 text-jade text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Execution Active in Operations</span>
          </div>
        )}
      </div>

      {executionMessage && (
        <div className="p-3.5 rounded-xl bg-jade/10 border border-jade/30 text-xs text-jade flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{executionMessage}</span>
          </div>
          <Link href="/tasks" className="underline font-bold text-text hover:text-jade">
            Go to Tasks →
          </Link>
        </div>
      )}

      {/* 5-Stage Closed Loop Breadcrumb Indicator */}
      <div className="p-3.5 rounded-xl border border-line bg-surface flex items-center justify-between gap-2 overflow-x-auto text-[11px] shadow-xs">
        {[
          { num: "1", title: "Understand Context", active: true },
          { num: "2", title: "Simulate Options", active: true },
          { num: "3", title: "Compare Outcomes", active: true },
          { num: "4", title: "AI Recommendation", active: true },
          { num: "5", title: "Execute Plan", active: hasExecutedPlan },
        ].map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 shrink-0">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step.active ? "bg-brass text-white" : "bg-surface-2 border border-line text-text-muted"
              }`}
            >
              {step.num}
            </div>
            <span className={`font-semibold ${step.active ? "text-text" : "text-text-muted"}`}>
              {step.title}
            </span>
            {idx < 4 && <span className="text-text-muted">→</span>}
          </div>
        ))}
      </div>

      {/* Scenario Builder & Compare Outcomes (3 Options) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text uppercase tracking-wider">
            Compare Scenario Outcomes: "What happens if we scale our engineering capacity?"
          </h2>
          <span className="text-xs text-text-muted">1,000 Monte Carlo Iterations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCENARIOS.map(sc => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between btn-tactile ${
                  isSelected
                    ? "bg-surface-2 border-brass ring-1 ring-brass/40 shadow-sm"
                    : "bg-surface border-line hover:border-line-strong"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {sc.isRecommended ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-jade/10 border border-jade/30 text-jade font-bold uppercase">
                        ★ AI Recommendation
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted uppercase font-semibold">
                        Alternative
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase border ${
                        sc.riskScore === "Low"
                          ? "text-jade border-jade/30 bg-jade/10"
                          : sc.riskScore === "Medium"
                          ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                          : "text-rust border-rust/30 bg-rust/10"
                      }`}
                    >
                      {sc.riskScore} Risk
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-text">{sc.name}</h3>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                      {sc.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-[11px]">
                    <div>
                      <span className="text-text-muted block text-[10px]">Monthly Cost</span>
                      <span className="font-bold text-text font-mono">
                        ₹{sc.monthlyCost.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Expected Revenue</span>
                      <span className="font-bold text-jade font-mono">
                        +₹{sc.projectedRevenueIncrease.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Runway Shift</span>
                      <span className="font-bold text-rust font-mono">{sc.runwayImpactMonths} mo</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Expected ROI</span>
                      <span className="font-bold text-brass font-mono">{sc.roiPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-line flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium">
                    {isSelected ? "Active Scenario" : "Click to Select"}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "bg-brass border-brass text-white" : "border-line"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendation & Closed-Loop Execution Bar */}
      <div className="p-6 rounded-2xl border border-brass/40 bg-surface shadow-xl space-y-4 ring-1 ring-brass/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brass/10 border border-brass/30 flex items-center justify-center text-xl shrink-0 shadow-inner">
              👑
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text">Astra (CEO AI) & Marcus (CFO AI) Consensus</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-jade/10 text-jade border border-jade/20 font-bold uppercase">
                  Optimal Capital Efficiency
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
                "Option B delivers <strong>328% expected ROI</strong> with minimal liquidity drawdown (-1.1 months). By pairing 2 senior architects with autonomous delivery workflows, Apex Technologies preserves cash reserves while achieving 88% of Option A's revenue velocity."
              </p>
            </div>
          </div>

          {/* The KILLER Nuralix Loop Execution Button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={handleExecutePlan}
              className="px-6 py-3 rounded-xl bg-brass text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all btn-tactile inline-flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Execute Plan ({activeScenario.name.split(":")[0]})</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-text-muted">
          <span>Clicking 'Execute Plan' converts this simulation into scheduled operational workflows & tasks.</span>
          <div className="flex items-center gap-3">
            <Link href="/workflows" className="text-brass hover:underline font-semibold flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              <span>View Visual Workflows</span>
            </Link>
            <Link href="/tasks" className="text-brass hover:underline font-semibold flex items-center gap-1">
              <span>View Tasks & Execution →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
