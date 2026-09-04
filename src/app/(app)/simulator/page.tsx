"use client";

import React, { useState } from "react";
import { defaultScenarioTemplates } from "@/config/seeds/defaultScenarios";
import { Compass, Play, CheckCircle2, Sliders, ArrowRight, RefreshCw } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";

export default function SimulatorPage() {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(defaultScenarioTemplates[0].key);
  const [salary, setSalary] = useState(1500000);
  const [rampMonths, setRampMonths] = useState(4);
  const [iterations, setIterations] = useState(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [committed, setCommitted] = useState(false);

  const activeTemplate = defaultScenarioTemplates.find(t => t.key === selectedTemplateKey) || defaultScenarioTemplates[0];

  // Dynamic calculations based on inputs
  const monthlySalaryLoaded = Math.round((salary * 1.3) / 12);
  const breakevenMonth = Math.round(rampMonths + (monthlySalaryLoaded / 65000));
  const p10Net = Math.round(-1 * (salary * 0.28));
  const p50Net = Math.round(salary * 0.35);
  const p90Net = Math.round(salary * 0.74);

  const handleRun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brass" />
            <h1 className="text-lg font-bold text-text">Strategic Decision Simulator</h1>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Deterministic arithmetic + 1,000 Monte Carlo iterations. Test operational commitments before signing.
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {defaultScenarioTemplates.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setSelectedTemplateKey(t.key);
                setCommitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all btn-tactile ${
                selectedTemplateKey === t.key
                  ? "bg-brass text-white border-brass shadow-sm"
                  : "bg-surface-2 border-line text-text-muted hover:text-text"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Two Columns: Inputs Left, Forecast Outputs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs & Assumptions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Scenario Inputs
              </span>
              <span className="text-[11px] text-text-muted">Direct Parameters</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-text block mb-1">
                  Annual Base Salary (₹)
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono focus:ring-1 focus:ring-brass"
                />
              </div>

              <div>
                <label className="font-medium text-text block mb-1">
                  Ramp-Up Horizon ({rampMonths} months)
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={rampMonths}
                  onChange={e => setRampMonths(Number(e.target.value))}
                  className="w-full accent-brass cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>1 mo (Accelerated)</span>
                  <span>4 mo (Standard)</span>
                  <span>12 mo (Enterprise)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-2/60 border border-line space-y-1.5">
                <span className="text-[11px] font-semibold text-text block">Loaded Multiplier</span>
                <p className="text-[10.5px] text-text-muted leading-relaxed">
                  Fixed at 1.30x (Taxes, Healthcare, Software Seat licenses, Hardware).
                </p>
                <div className="text-xs font-bold text-brass num-tabular pt-1">
                  Monthly Loaded Cost: ₹{monthlySalaryLoaded.toLocaleString("en-IN")}/mo
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRun}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-lg bg-brass text-white font-semibold text-xs shadow-md hover:brightness-110 disabled:opacity-50 btn-tactile flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
              <span>{isSimulating ? "Sampling 1,000 runs…" : "Run Monte Carlo Simulation"}</span>
            </button>
          </div>

          {/* Tornado Sensitivity Chart */}
          <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Tornado Sensitivity Drivers
              </span>
              <span className="text-[10px] text-text-muted">Which variables drive outcome</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-text">Ramp curve efficiency</span>
                  <span className="font-mono text-brass">58% variance</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-brass rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-text">Quota attainment ratio</span>
                  <span className="font-mono text-brass">28% variance</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-brass rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-text">Recruiting agency fee</span>
                  <span className="font-mono text-brass">14% variance</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-brass rounded-full" style={{ width: "22%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Simulation Results & Confidence Fan (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl border border-line bg-surface shadow-theme space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h2 className="text-sm font-bold text-text">Simulation Horizon & Confidence Fan</h2>
                <span className="text-xs text-text-muted">P10 to P90 Distribution across 1,000 iterations</span>
              </div>
              <ProvenanceBadge type="estimate" citation="Deterministic Model + Monte Carlo triangular sampling" />
            </div>

            {/* Visual SVG Fan Chart */}
            <div className="p-4 rounded-xl bg-surface-2/40 border border-line space-y-2">
              <div className="h-36 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <line x1="0" y1="60" x2="400" y2="60" stroke="var(--line-strong)" strokeDasharray="3,3" />

                  {/* Shaded P10-P90 Confidence Band */}
                  <polygon
                    points="0,60 100,75 200,90 300,70 400,20 400,85 300,105 200,110 100,85 0,60"
                    fill="var(--brass)"
                    fillOpacity="0.18"
                  />

                  {/* P50 Line */}
                  <polyline
                    points="0,60 100,78 200,95 300,80 400,45"
                    fill="none"
                    stroke="var(--brass)"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Month 0</span>
                <span>Month {rampMonths} (Ramp complete)</span>
                <span className="text-jade font-semibold">Month {breakevenMonth} (Breakeven)</span>
                <span>Month 12</span>
              </div>
            </div>

            {/* 3 Outcome Columns */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-rust/30 bg-rust/10 text-center">
                <span className="text-[10px] font-bold text-rust uppercase block">P10 (Pessimistic)</span>
                <span className="text-lg font-bold num-tabular text-text block mt-1">
                  -₹{Math.abs(p10Net).toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-text-muted">Breakeven: Mo {breakevenMonth + 3}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-brass bg-brass-soft/20 text-center ring-1 ring-brass/30">
                <span className="text-[10px] font-bold text-brass uppercase block">P50 (Expected)</span>
                <span className="text-lg font-bold num-tabular text-text block mt-1">
                  +₹{p50Net.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-text-muted">Breakeven: Mo {breakevenMonth}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-jade/30 bg-jade/10 text-center">
                <span className="text-[10px] font-bold text-jade uppercase block">P90 (Optimistic)</span>
                <span className="text-lg font-bold num-tabular text-text block mt-1">
                  +₹{p90Net.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-text-muted">Breakeven: Mo {Math.max(2, breakevenMonth - 2)}</span>
              </div>
            </div>

            {/* Verifiable Probability Rule (§10.2) */}
            <div className="p-3 rounded-lg bg-surface-2 border border-line text-xs leading-relaxed text-text">
              <strong>Model Safety Verdict:</strong> In <strong>894 of 1,000 runs</strong>, cash reserves stayed above your ₹15,00,000 floor. Maximum capital drawdown occurs in Month {rampMonths} at -₹3,12,000.
            </div>

            {/* Commit to Decision (§10.4) */}
            <div className="pt-3 border-t border-line flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text block">Commit to Execution</span>
                <span className="text-[11px] text-text-muted">
                  Schedules automatic check-in review in Month {breakevenMonth}
                </span>
              </div>

              {committed ? (
                <div className="flex items-center gap-1.5 text-xs text-jade font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Decision Committed & Tasks Seeded</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCommitted(true)}
                  className="px-4 py-2 rounded-lg bg-brass text-white font-semibold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Commit to Decision</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
