"use client";

import React from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { ProvenanceBadge } from "../ui/Badge";
import { TrendingUp, TrendingDown, HelpCircle, MessageSquare } from "lucide-react";

interface KpiItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  sentiment: "positive" | "negative";
  basis: string;
  sparkline: number[];
  provenance: "from_data" | "benchmark" | "estimate";
}

export function KpiGridWidget() {
  const kpis: KpiItem[] = [
    {
      id: "mrr",
      label: "Monthly Recurring Revenue",
      value: "$48,200",
      delta: "+6.4%",
      direction: "up",
      sentiment: "positive",
      basis: "vs last month",
      sparkline: [38, 41, 42, 45, 46, 48],
      provenance: "from_data",
    },
    {
      id: "runway",
      label: "Estimated Cash Runway",
      value: "7.2 mo",
      delta: "-0.4 mo",
      direction: "down",
      sentiment: "negative",
      basis: "vs last month",
      sparkline: [9.1, 8.6, 8.2, 7.8, 7.6, 7.2],
      provenance: "from_data",
    },
    {
      id: "nrr",
      label: "Net Revenue Retention",
      value: "108.4%",
      delta: "+2.1%",
      direction: "up",
      sentiment: "positive",
      basis: "vs Q2 average",
      sparkline: [102, 104, 105, 106, 107, 108],
      provenance: "from_data",
    },
    {
      id: "cac_payback",
      label: "CAC Payback Period",
      value: "14.2 mo",
      delta: "+1.3 mo",
      direction: "up",
      sentiment: "negative", // Longer payback is worse
      basis: "vs benchmark median (12 mo)",
      sparkline: [11, 12, 12.5, 13, 13.8, 14.2],
      provenance: "benchmark",
    },
  ];

  return (
    <ContainerTile span={4} id="widget_kpi_board">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <div>
            <h2 className="text-xs font-semibold text-text uppercase tracking-wider">
              Core Performance Indicators
            </h2>
            <p className="text-[11px] text-text-muted">
              Live telemetry matched to B2B SaaS Growth stage benchmarks
            </p>
          </div>
          <span className="text-[11px] text-text-muted">Updated 10m ago</span>
        </div>

        {/* 4-column KPI cards grid */}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-3">
          {kpis.map(kpi => (
            <div
              key={kpi.id}
              className="p-3.5 rounded-lg bg-surface-2/60 border border-line flex flex-col justify-between space-y-2 card-hover"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs text-text-muted font-medium truncate max-w-[140px]">
                  {kpi.label}
                </span>
                <ProvenanceBadge type={kpi.provenance} />
              </div>

              {/* Value and sparkline */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-bold num-tabular text-text tracking-tight">
                  {kpi.value}
                </span>

                {/* SVG Mini Sparkline */}
                <svg className="w-16 h-6 stroke-brass fill-none stroke-[1.75]" viewBox="0 0 60 20">
                  <polyline
                    points="0,18 12,14 24,15 36,9 48,7 60,3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Delta & Basis with 'Why did this move?' (§8.3) */}
              <div className="flex items-center justify-between pt-1 border-t border-line/60 text-[11px]">
                <div
                  className={`inline-flex items-center gap-1 font-semibold num-tabular ${
                    kpi.sentiment === "positive" ? "text-jade" : "text-rust"
                  }`}
                >
                  {kpi.direction === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{kpi.delta}</span>
                  <span className="text-text-muted font-normal ml-0.5">{kpi.basis}</span>
                </div>

                <button
                  type="button"
                  title="Why did this move? Ask AI"
                  className="text-text-muted hover:text-brass p-0.5 rounded btn-tactile"
                >
                  <MessageSquare className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContainerTile>
  );
}
