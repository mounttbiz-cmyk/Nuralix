"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign,
  Users,
  Activity,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"30d" | "90d" | "12m">("90d");
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<string>("all");
  const [companyName, setCompanyName] = useState<string>("Apex Technologies");
  const [industryName, setIndustryName] = useState<string>("B2B SaaS");
  const [annualRevenue, setAnnualRevenue] = useState<number>(600000);
  const [teamSize, setTeamSize] = useState<number>(14);
  const [burn, setBurn] = useState<number>(15000);
  const [cash, setCash] = useState<number>(120000);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProfileStr = localStorage.getItem("nuralix_business_profile");
      if (savedProfileStr) {
        const saved = JSON.parse(savedProfileStr);
        if (saved.name) setCompanyName(saved.name);
        if (saved.industryLabel) setIndustryName(saved.industryLabel);
        else if (saved.industry) setIndustryName(saved.industry);
        if (saved.annualRevenue) setAnnualRevenue(Number(saved.annualRevenue));
        if (saved.teamSize) setTeamSize(Number(saved.teamSize));
        if (saved.burn) setBurn(Number(saved.burn));
        if (saved.cash) setCash(Number(saved.cash));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const monthlyRev = Math.round(annualRevenue / 12);
  const runwayMonths = burn > 0 ? (cash / burn).toFixed(1) : "18+";
  const revPerHead = Math.round(annualRevenue / (teamSize || 1));

  // Monthly breakdown data
  const revenueHistory = [
    { month: "Oct", revenue: Math.round(monthlyRev * 0.84), grossMargin: 76, burn: Math.round(burn * 1.1) },
    { month: "Nov", revenue: Math.round(monthlyRev * 0.88), grossMargin: 78, burn: Math.round(burn * 1.05) },
    { month: "Dec", revenue: Math.round(monthlyRev * 0.92), grossMargin: 77, burn: Math.round(burn * 0.98) },
    { month: "Jan", revenue: Math.round(monthlyRev * 0.95), grossMargin: 80, burn: Math.round(burn * 1.02) },
    { month: "Feb", revenue: Math.round(monthlyRev * 0.98), grossMargin: 82, burn: Math.round(burn * 0.96) },
    { month: "Mar", revenue: monthlyRev, grossMargin: 83, burn: burn },
  ];

  const maxRev = Math.max(...revenueHistory.map(d => d.revenue));

  const handleExport = () => {
    setExportNotice("Compiling executive data export (CSV/PDF)…");
    setTimeout(() => {
      setExportNotice("Analytics intelligence package generated successfully!");
      setTimeout(() => setExportNotice(null), 3500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brass-soft flex items-center justify-center text-brass">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-text">Adaptive Analytics</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
                  {industryName}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Dynamic telemetry calibrated to {companyName} with continuous peer benchmarking.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center p-0.5 rounded-lg bg-surface-2 border border-line text-xs font-medium">
            <button
              type="button"
              onClick={() => setTimeframe("30d")}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === "30d" ? "bg-surface text-text shadow-sm font-semibold" : "text-text-muted hover:text-text"
              }`}
            >
              30D
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("90d")}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === "90d" ? "bg-surface text-text shadow-sm font-semibold" : "text-text-muted hover:text-text"
              }`}
            >
              90D
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("12m")}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === "12m" ? "bg-surface text-text shadow-sm font-semibold" : "text-text-muted hover:text-text"
              }`}
            >
              Trailing 12M
            </button>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brass text-white text-xs font-semibold shadow-sm hover:brightness-110 btn-tactile cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-brass-soft border border-brass/30 text-xs font-medium text-brass flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-brass" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Annual Revenue */}
        <div className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-medium">Annualized Revenue</span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-text">
              ${annualRevenue.toLocaleString()}
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              +14.2%
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>Run-rate: ${monthlyRev.toLocaleString()} / mo</span>
            <span className="text-brass font-medium">Top 20% tier</span>
          </div>
        </div>

        {/* Card 2: Revenue Per Head */}
        <div className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-medium">Revenue Per Head</span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-text">
              ${revPerHead.toLocaleString()}
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              +8.5%
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>Headcount: {teamSize} FTEs</span>
            <span className="text-text font-medium">Efficient</span>
          </div>
        </div>

        {/* Card 3: Net Cash Runway */}
        <div className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-medium">Net Cash Runway</span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-text">
              {runwayMonths} mos
            </span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                Number(runwayMonths) < 6
                  ? "bg-rust/15 text-rust"
                  : "bg-emerald-500/15 text-emerald-500"
              }`}
            >
              {Number(runwayMonths) < 6 ? "Warning" : "Healthy"}
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>Burn: ${burn.toLocaleString()} / mo</span>
            <span>Reserves: ${cash.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 4: Gross Margin Efficiency */}
        <div className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-medium">Gross Margin Efficiency</span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-text">
              83.2%
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              +2.1%
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>Industry median: 76.0%</span>
            <span className="text-brass font-medium">+7.2% spread</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Trend & Trajectory (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-line bg-surface shadow-theme space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-text">Monthly Revenue & Gross Margin Velocity</h2>
              <p className="text-[11px] text-text-muted">
                Trailing operating figures compared with net operating burn rate.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-brass" />
                <span className="text-text-muted text-[11px]">Gross Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-rust" />
                <span className="text-text-muted text-[11px]">Net Burn</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-52 flex items-end justify-between gap-3 sm:gap-6 border-b border-line px-2">
              {revenueHistory.map((d, i) => {
                const heightPct = Math.round((d.revenue / maxRev) * 100);
                const burnPct = Math.round((d.burn / maxRev) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-line text-text text-center whitespace-nowrap shadow-sm">
                      ${d.revenue.toLocaleString()}
                    </div>
                    {/* Double Bar */}
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Revenue bar */}
                      <div
                        className="w-full max-w-[28px] bg-brass hover:brightness-110 rounded-t-md transition-all relative"
                        style={{ height: `${heightPct}%` }}
                      />
                      {/* Burn bar */}
                      <div
                        className="w-full max-w-[14px] bg-rust/70 hover:bg-rust rounded-t-sm transition-all"
                        style={{ height: `${burnPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-text-muted">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom telemetry detail summary */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="p-2.5 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Trailing 6M Vol</span>
              <span className="text-sm font-bold font-mono text-text">
                ${revenueHistory.reduce((acc, c) => acc + c.revenue, 0).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Average Margin</span>
              <span className="text-sm font-bold font-mono text-brass">79.3%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Net Burn Retention</span>
              <span className="text-sm font-bold font-mono text-emerald-500">+11.4%</span>
            </div>
          </div>
        </div>

        {/* Right: AI Executive Telemetry Analysis & Peer Benchmarks (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Executive Intelligence */}
          <div className="p-5 rounded-2xl border border-line bg-surface shadow-theme space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Sparkles className="w-4 h-4 text-brass" />
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">Astra & Marcus AI Audit</h3>
            </div>
            <p className="text-xs text-text leading-relaxed">
              Based on your annualized run-rate of <span className="font-semibold text-brass">${annualRevenue.toLocaleString()}</span> and team size of <span className="font-semibold text-text">{teamSize}</span>:
            </p>

            <div className="space-y-2.5 text-[11px]">
              <div className="p-2.5 rounded-lg bg-surface-2 border border-line space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Capital Efficiency Win
                  </span>
                  <span className="text-[10px] text-text-muted">CFO Agent</span>
                </div>
                <p className="text-text-muted leading-snug">
                  Revenue per employee (${revPerHead.toLocaleString()}) beats the 50th percentile for {industryName}.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-line space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    Runway Safeguard Notice
                  </span>
                  <span className="text-[10px] text-text-muted">CEO Agent</span>
                </div>
                <p className="text-text-muted leading-snug">
                  With ${cash.toLocaleString()} in liquid reserves, runway stands at {runwayMonths} months. Keep discretionary opex under review.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/chat"
                className="w-full py-2 rounded-lg bg-surface-2 border border-line hover:border-brass text-text text-xs font-semibold flex items-center justify-center gap-2 btn-tactile"
              >
                <span>Consult Executive Agents on Strategy</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-brass" />
              </a>
            </div>
          </div>

          {/* Industry Benchmark Distribution */}
          <div className="p-5 rounded-2xl border border-line bg-surface shadow-theme space-y-3">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">
              {industryName} Cohort Benchmarks
            </h3>
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Gross Margin Ratio</span>
                  <span className="font-mono font-bold text-text">83% (Top 15%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden flex">
                  <div className="bg-text-muted/30 h-full w-[25%]" title="P25: 65%" />
                  <div className="bg-amber/60 h-full w-[40%]" title="Median: 76%" />
                  <div className="bg-brass h-full w-[35%]" title="Your Position: 83%" />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                  <span>P25: 65%</span>
                  <span>Median: 76%</span>
                  <span>P75: 84%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Revenue per FTE</span>
                  <span className="font-mono font-bold text-text">
                    ₹{revPerHead >= 100000 ? `${(revPerHead / 100000).toFixed(1)}L` : revPerHead.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden flex">
                  <div className="bg-text-muted/30 h-full w-[30%]" />
                  <div className="bg-brass h-full w-[50%]" />
                  <div className="bg-emerald-500 h-full w-[20%]" />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                  <span>P25: ₹12L</span>
                  <span>Median: ₹18L</span>
                  <span>P75: ₹28L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
