"use client";

import React, { useState } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { ProvenanceBadge } from "../ui/Badge";
import { Compass, Play, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export function SimulatorHighlightWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(1000);

  const runMonteCarlo = () => {
    setIsRunning(true);
    let count = 0;
    const interval = setInterval(() => {
      count += 200;
      setIterations(count);
      if (count >= 1000) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 80);
  };

  return (
    <ContainerTile span={4} id="widget_simulator_highlight">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-2 pb-3 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brass" />
              <h2 className="text-xs font-semibold text-text uppercase tracking-wider">
                Decision Simulator: Hire Senior AE
              </h2>
            </div>
            <p className="text-[11px] text-text-muted">
              Monte Carlo forecast (1,000 runs) · Ramp-up: 4 months · Salary: $120k loaded
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ProvenanceBadge type="estimate" citation="1,000 Monte Carlo iterations across triangular assumptions" />
            <button
              type="button"
              onClick={runMonteCarlo}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-brass text-white shadow-sm hover:brightness-110 disabled:opacity-50 btn-tactile"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunning ? `Simulating (${iterations})…` : "Re-run Model"}</span>
            </button>
          </div>
        </div>

        {/* Fan Chart & Confidence Bands (§10.3) */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-4 items-center">
          {/* Fan Chart Preview */}
          <div className="p-4 rounded-lg bg-surface-2/60 border border-line @lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Cumulative Net Cash Impact (12-Month Horizon)</span>
              <span className="text-[10px] font-mono">P10 — P50 — P90</span>
            </div>

            {/* SVG Visualizing Fan Band */}
            <div className="relative h-28 w-full">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                {/* Zero axis */}
                <line x1="0" y1="45" x2="400" y2="45" stroke="var(--line-strong)" strokeDasharray="3,3" />

                {/* Shaded P10-P90 Confidence Band */}
                <polygon
                  points="0,45 80,55 160,70 240,65 320,40 400,15 400,60 320,85 240,92 160,88 80,68 0,45"
                  fill="var(--brass)"
                  fillOpacity="0.15"
                />

                {/* P50 Expected Median Line */}
                <polyline
                  points="0,45 80,60 160,78 240,75 320,58 400,35"
                  fill="none"
                  stroke="var(--brass)"
                  strokeWidth="2.5"
                />

                {/* Current Baseline trajectory */}
                <polyline
                  points="0,45 80,48 160,52 240,56 320,60 400,64"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>Month 0 (Hire)</span>
              <span>Month 4 (Ramp complete)</span>
              <span className="text-jade font-semibold">Month 7 (Breakeven)</span>
              <span>Month 12</span>
            </div>
          </div>

          {/* Three Outcome Columns (Worst, Expected, Best) (§10.3) */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg border border-line bg-surface-2/40">
              <span className="text-[10px] uppercase font-bold text-rust block">P10 (Pessimistic)</span>
              <span className="text-sm font-bold num-tabular text-text block mt-1">-$28,400</span>
              <span className="text-[10px] text-text-muted">Breakeven: Mo 10</span>
            </div>

            <div className="p-2.5 rounded-lg border border-brass/50 bg-brass-soft/20">
              <span className="text-[10px] uppercase font-bold text-brass block">P50 (Expected)</span>
              <span className="text-sm font-bold num-tabular text-text block mt-1">+$42,000</span>
              <span className="text-[10px] text-text-muted">Breakeven: Mo 7</span>
            </div>

            <div className="p-2.5 rounded-lg border border-jade/30 bg-jade/10">
              <span className="text-[10px] uppercase font-bold text-jade block">P90 (Optimistic)</span>
              <span className="text-sm font-bold num-tabular text-text block mt-1">+$89,200</span>
              <span className="text-[10px] text-text-muted">Breakeven: Mo 5</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-line flex items-center justify-between text-xs">
          <span className="text-text-muted">
            In <strong>842 of 1,000 runs</strong>, cash reserve never fell below your $20k safety floor.
          </span>
          <Link
            href="/simulator"
            className="inline-flex items-center gap-1.5 text-brass hover:underline font-medium btn-tactile"
          >
            <span>Full Scenario Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
