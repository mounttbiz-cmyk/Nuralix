"use client";

import React, { useState } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { ProvenanceBadge } from "../ui/Badge";
import { ShieldCheck, ChevronRight, TrendingUp } from "lucide-react";

interface HealthScoreProps {
  score?: number;
  delta?: number;
}

export function HealthScoreWidget({
  score = 78,
  delta = 4.2,
}: HealthScoreProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const components = [
    { key: "financial", name: "Financial", score: 82, weight: "25%", detail: "Healthy gross margins (78%), runway 7.2 mo." },
    { key: "growth", name: "Growth", score: 68, weight: "20%", detail: "CAC payback at 14.2 mo drags performance." },
    { key: "customer", name: "Customer", score: 84, weight: "20%", detail: "Logo retention 94%, NRR 108%." },
    { key: "operations", name: "Operations", score: 71, weight: "20%", detail: "Founder sales bottleneck, 2 SOPs missing." },
    { key: "team", name: "Team", score: 88, weight: "15%", detail: "High revenue/head ($184k), no key man vacancy." },
  ];

  // SVG circular gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <ContainerTile span={2} id="widget_health_score">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-jade" />
            <h2 className="text-xs font-semibold text-text uppercase tracking-wider">
              Business Health Score
            </h2>
          </div>
          <ProvenanceBadge type="from_data" />
        </div>

        {/* Main Gauge & Metrics */}
        <div className="flex flex-col @sm:flex-row items-center gap-6 py-4">
          {/* Circular SVG Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-surface-2"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-brass transition-all duration-story ease-out-custom"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold num-tabular text-text leading-none">
                {score}
              </span>
              <span className="text-[10px] text-text-muted font-medium mt-0.5">out of 100</span>
            </div>
          </div>

          {/* Context & Delta */}
          <div className="flex-1 space-y-1.5 text-center @sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-jade/10 text-jade border border-jade/20">
              <TrendingUp className="w-3 h-3" />
              <span>+{delta}% vs last month</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Based on active ledger data, unit economics, and 24 operational benchmarks for B2B SaaS.
            </p>
          </div>
        </div>

        {/* Component Breakdown Table (§8.3) */}
        <div className="space-y-1.5 pt-2 border-t border-line">
          <div className="text-[10px] font-semibold uppercase text-text-muted px-1 tracking-wider">
            Category Breakdown
          </div>
          <div className="grid grid-cols-1 @xs:grid-cols-5 gap-1.5">
            {components.map(comp => (
              <button
                key={comp.key}
                type="button"
                onClick={() => setSelectedComponent(selectedComponent === comp.key ? null : comp.key)}
                className={`p-2 rounded-lg border text-left transition-all btn-tactile ${
                  selectedComponent === comp.key
                    ? "border-brass bg-brass-soft/20 shadow-sm"
                    : "border-line bg-surface-2/60 hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span className="truncate">{comp.name}</span>
                  <span className="font-mono text-[9px]">{comp.weight}</span>
                </div>
                <div className="text-sm font-bold num-tabular text-text mt-0.5">
                  {comp.score}
                </div>
              </button>
            ))}
          </div>

          {/* Expandable breakdown explanation */}
          {selectedComponent && (
            <div className="mt-2 p-2.5 rounded-lg bg-surface-2 border border-line text-xs text-text animate-fade-in flex items-center justify-between">
              <span>
                <strong>{components.find(c => c.key === selectedComponent)?.name}:</strong>{" "}
                {components.find(c => c.key === selectedComponent)?.detail}
              </span>
              <button
                type="button"
                onClick={() => setSelectedComponent(null)}
                className="text-[10px] text-text-muted hover:text-text font-medium ml-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </ContainerTile>
  );
}
