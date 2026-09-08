"use client";

import React, { useState, useEffect } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { ProvenanceBadge } from "../ui/Badge";
import { TrendingUp, TrendingDown, HelpCircle, MessageSquare, DollarSign, Clock, Users, Percent, Sparkles } from "lucide-react";
import Link from "next/link";

interface KpiItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  sentiment: "positive" | "negative";
  basis: string;
  color: string;
  gradientId: string;
  icon: React.ReactNode;
  points: string;
  areaPoints: string;
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
      color: "#00D9FF",
      gradientId: "grad-mrr",
      icon: <DollarSign className="w-4 h-4 text-cyan-400" />,
      points: "0,20 15,16 30,17 45,9 60,7 75,3",
      areaPoints: "0,20 15,16 30,17 45,9 60,7 75,3 75,25 0,25",
      provenance: "from_data",
    },
    {
      id: "runway",
      label: "Estimated Cash Runway",
      value: `${runwayMonths} mo`,
      delta: "+0.8 mo",
      direction: "up",
      sentiment: Number(runwayMonths) >= 6 ? "positive" : "negative",
      basis: "liquid capital",
      color: "#F59E0B",
      gradientId: "grad-runway",
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      points: "0,19 15,18 30,14 45,13 60,9 75,5",
      areaPoints: "0,19 15,18 30,14 45,13 60,9 75,5 75,25 0,25",
      provenance: "from_data",
    },
    {
      id: "rev_head",
      label: "Annual Revenue / Head",
      value: `₹${revPerHead.toLocaleString("en-IN")}`,
      delta: "+8.2%",
      direction: "up",
      sentiment: "positive",
      basis: `${teamSize} team members`,
      color: "#8B5CF6",
      gradientId: "grad-revhead",
      icon: <Users className="w-4 h-4 text-violet-400" />,
      points: "0,18 15,15 30,16 45,10 60,8 75,4",
      areaPoints: "0,18 15,15 30,16 45,10 60,8 75,4 75,25 0,25",
      provenance: "from_data",
    },
    {
      id: "gross_margin",
      label: "Gross Margin Efficiency",
      value: "82.4%",
      delta: "+2.3%",
      direction: "up",
      sentiment: "positive",
      basis: "top 10% quartile",
      color: "#10B981",
      gradientId: "grad-margin",
      icon: <Percent className="w-4 h-4 text-emerald-400" />,
      points: "0,17 15,14 30,15 45,11 60,7 75,3",
      areaPoints: "0,17 15,14 30,15 45,11 60,7 75,3 75,25 0,25",
      provenance: "benchmark",
    },
  ];

  return (
    <ContainerTile span={4} id="widget_kpi_board">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                Core Performance Indicators
              </h2>
              <p className="text-[11px] text-text-muted">
                Continuous telemetry tailored for {industryLabel} in Indian Rupees (₹)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2/80 text-text-muted border border-line font-mono">
              Live Stream
            </span>
          </div>
        </div>

        {/* 4-column KPI cards grid */}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-3.5">
          {kpis.map(kpi => (
            <div
              key={kpi.id}
              className="p-4 rounded-xl bg-surface-2/50 border border-line hover:border-line-strong flex flex-col justify-between space-y-3 transition-all duration-200 group relative overflow-hidden"
            >
              {/* Top ambient color glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none -mr-8 -mt-8"
                style={{ backgroundColor: kpi.color }}
              />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-surface/80 border border-line">
                    {kpi.icon}
                  </div>
                  <span className="text-xs text-text-muted font-medium truncate max-w-[130px]">
                    {kpi.label}
                  </span>
                </div>
                <ProvenanceBadge type={kpi.provenance} />
              </div>

              {/* Value and SVG Sparkline with Gradient Fill */}
              <div className="flex items-end justify-between pt-1 relative z-10">
                <div className="text-2xl sm:text-3xl font-extrabold num-tabular text-slate-900 dark:text-white tracking-tight font-mono">
                  {kpi.value}
                </div>

                {/* SVG Sparkline */}
                <svg className="w-20 h-7 shrink-0 overflow-visible" viewBox="0 0 75 25">
                  <defs>
                    <linearGradient id={kpi.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={kpi.color} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={kpi.color} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={kpi.areaPoints}
                    fill={`url(#${kpi.gradientId})`}
                  />
                  <polyline
                    points={kpi.points}
                    fill="none"
                    stroke={kpi.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Delta & Basis with 'Discuss with AI' */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] relative z-10">
                <div
                  className={`inline-flex items-center gap-1 font-semibold num-tabular ${
                    kpi.sentiment === "positive" ? "text-jade" : "text-rust"
                  }`}
                >
                  {kpi.direction === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{kpi.delta}</span>
                  <span className="text-text-muted font-normal ml-0.5">{kpi.basis}</span>
                </div>

                <Link
                  href="/chat"
                  title="Ask Copilot about this metric"
                  className="p-1 rounded-lg text-text-muted hover:text-cyan-400 hover:bg-white/[0.06] transition-colors btn-tactile cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContainerTile>
  );
}
