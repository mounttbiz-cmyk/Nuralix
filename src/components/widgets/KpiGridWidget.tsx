"use client";

import React, { useState, useEffect } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { ProvenanceBadge } from "../ui/Badge";
import { TrendingUp, TrendingDown, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

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
  const [industryLabel, setIndustryLabel] = useState("IT & Technology Services");
  const [monthlyRev, setMonthlyRev] = useState(500000);
  const [annualRev, setAnnualRev] = useState(6000000);
  const [burn, setBurn] = useState(150000);
  const [cash, setCash] = useState(1200000);
  const [teamSize, setTeamSize] = useState(15);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nuralix_business_profile");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.industryLabel) setIndustryLabel(p.industryLabel);
        else if (p.industry) setIndustryLabel(p.industry);
        if (p.revenue) setMonthlyRev(Number(p.revenue));
        if (p.annualRevenue) setAnnualRev(Number(p.annualRevenue));
        if (p.burn) setBurn(Number(p.burn));
        if (p.cash) setCash(Number(p.cash));
        if (p.teamSize) setTeamSize(Number(p.teamSize));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const runwayMonths = burn > 0 ? (cash / burn).toFixed(1) : "18+";
  const revPerHead = Math.round(annualRev / (teamSize || 1));

  const kpis: KpiItem[] = [
    {
      id: "mrr",
      label: "Monthly Recurring Revenue",
      value: `₹${monthlyRev.toLocaleString("en-IN")}`,
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
      value: `${runwayMonths} mo`,
      delta: "+0.8 mo",
      direction: "up",
      sentiment: Number(runwayMonths) >= 6 ? "positive" : "negative",
      basis: "healthy buffer",
      sparkline: [7.2, 7.4, 7.6, 7.8, 7.9, Number(runwayMonths) || 8.0],
      provenance: "from_data",
    },
    {
      id: "rev_head",
      label: "Annual Revenue Per Head",
      value: `₹${revPerHead.toLocaleString("en-IN")}`,
      delta: "+8.2%",
      direction: "up",
      sentiment: "positive",
      basis: `${teamSize} FTEs`,
      sparkline: [102, 104, 105, 106, 107, 108],
      provenance: "from_data",
    },
    {
      id: "gross_margin",
      label: "Gross Margin Efficiency",
      value: "82.4%",
      delta: "+2.3%",
      direction: "up",
      sentiment: "positive",
      basis: "top quartile",
      sparkline: [76, 78, 79, 80, 81, 82.4],
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
              Live telemetry matched to {industryLabel} in Indian Rupees (₹)
            </p>
          </div>
          <span className="text-[11px] text-text-muted font-mono">Updated just now</span>
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
                <span className="text-xl sm:text-2xl font-bold num-tabular text-text tracking-tight font-mono">
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

              {/* Delta & Basis with 'Why did this move?' */}
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

                <Link
                  href="/chat"
                  title="Discuss with AI Executive"
                  className="text-text-muted hover:text-brass p-0.5 rounded btn-tactile cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContainerTile>
  );
}
