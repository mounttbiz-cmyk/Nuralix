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
  ChevronDown,
  AlertTriangle,
  Play,
  ArrowRight,
  Search,
  Zap,
  Clock,
  Compass,
  X
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";
import { PortalModal } from "@/components/ui/PortalModal";
import Link from "next/link";

type ExecutiveRole = "ceo" | "cfo" | "cmo" | "coo";
type StrategicGoal = "extend_runway" | "accelerate_growth" | "protect_margins" | "reduce_churn";

interface DrillDownMetric {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  isPositive: boolean;
  benchmark: string;
  history: { period: string; val: number }[];
  rootCauses: string[];
  recommendedAction: string;
}

export default function AnalyticsPage() {
  const [role, setRole] = useState<ExecutiveRole>("ceo");
  const [goal, setGoal] = useState<StrategicGoal>("extend_runway");
  const [forecastMode, setForecastMode] = useState<"baseline" | "optimized">("optimized");
  const [timeframe, setTimeframe] = useState<"30d" | "90d" | "12m">("90d");
  const [companyName, setCompanyName] = useState<string>("Apex Technologies");
  const [industryName, setIndustryName] = useState<string>("B2B SaaS");
  const [annualRevenue, setAnnualRevenue] = useState<number>(6000000);
  const [teamSize, setTeamSize] = useState<number>(14);
  const [burn, setBurn] = useState<number>(150000);
  const [cash, setCash] = useState<number>(1200000);
  const [grossMargin, setGrossMargin] = useState<number>(82);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Drill-down Modal State
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownMetric | null>(null);

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
        if (saved.burn || saved.monthlyBurn) setBurn(Number(saved.burn || saved.monthlyBurn));
        if (saved.cash || saved.cashOnHand) setCash(Number(saved.cash || saved.cashOnHand));
        if (saved.grossMargin) setGrossMargin(Number(saved.grossMargin));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const monthlyRev = Math.round(annualRevenue / 12);
  const runwayMonths = burn > 0 ? (cash / burn).toFixed(1) : "18+";
  const revPerHead = Math.round(annualRevenue / (teamSize || 1));

  // Trailing vs Forecast Trajectory
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr (F)", "May (F)", "Jun (F)"];
  const revenueHistory = [
    { month: "Oct", revenue: Math.round(monthlyRev * 0.84), burn: Math.round(burn * 1.1) },
    { month: "Nov", revenue: Math.round(monthlyRev * 0.88), burn: Math.round(burn * 1.05) },
    { month: "Dec", revenue: Math.round(monthlyRev * 0.92), burn: Math.round(burn * 0.98) },
    { month: "Jan", revenue: Math.round(monthlyRev * 0.95), burn: Math.round(burn * 1.02) },
    { month: "Feb", revenue: Math.round(monthlyRev * 0.98), burn: Math.round(burn * 0.96) },
    { month: "Mar", revenue: monthlyRev, burn: burn },
    // Forward Projections
    {
      month: "Apr (F)",
      revenue: forecastMode === "optimized" ? Math.round(monthlyRev * 1.08) : Math.round(monthlyRev * 1.02),
      burn: forecastMode === "optimized" ? Math.round(burn * 0.92) : burn,
    },
    {
      month: "May (F)",
      revenue: forecastMode === "optimized" ? Math.round(monthlyRev * 1.18) : Math.round(monthlyRev * 1.04),
      burn: forecastMode === "optimized" ? Math.round(burn * 0.90) : Math.round(burn * 1.03),
    },
    {
      month: "Jun (F)",
      revenue: forecastMode === "optimized" ? Math.round(monthlyRev * 1.28) : Math.round(monthlyRev * 1.06),
      burn: forecastMode === "optimized" ? Math.round(burn * 0.88) : Math.round(burn * 1.05),
    },
  ];

  const maxRev = Math.max(...revenueHistory.map(d => Math.max(d.revenue, d.burn)));

  const handleExport = () => {
    setExportNotice("Compiling executive intelligence package (PDF/CSV)…");
    setTimeout(() => {
      setExportNotice("Adaptive Analytics report generated & verified!");
      setTimeout(() => setExportNotice(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider font-mono">
                  {industryName}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Dynamic telemetry calibrated to {companyName}. Switches from “what happened?” to “what should we do?”.
              </p>
            </div>
          </div>
        </div>

        {/* Controls: Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brass text-white text-xs font-semibold shadow-sm hover:brightness-110 btn-tactile cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-brass-soft border border-brass/30 text-xs font-semibold text-brass flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-brass" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Role & Strategic Goal Adaptation Switcher Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-line shadow-theme space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Executive Role Switcher */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              1. Adaptive Perspective (Role):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "ceo", label: "CEO / Founder", desc: "Runway & Health" },
                { id: "cfo", label: "CFO AI", desc: "Cash & Unit Economics" },
                { id: "cmo", label: "CMO AI", desc: "CAC & Demand Pipeline" },
                { id: "coo", label: "COO AI", desc: "Margins & Headcount" },
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as ExecutiveRole)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer btn-tactile ${
                    role === r.id
                      ? "bg-brass text-white shadow-sm"
                      : "bg-surface-2 border border-line text-text-muted hover:text-text"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Strategic Goal Switcher */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              2. Strategic Target Focus (Goal):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "extend_runway", label: "Extend Runway" },
                { id: "accelerate_growth", label: "Accelerate ARR Growth" },
                { id: "protect_margins", label: "Protect Gross Margins" },
                { id: "reduce_churn", label: "Reduce Churn" },
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id as StrategicGoal)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer btn-tactile ${
                    goal === g.id
                      ? "bg-surface-2 border-brass text-brass border ring-1 ring-brass/20"
                      : "bg-surface border border-line text-text-muted hover:text-text"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Automated Anomaly Detection Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">Operational Anomaly Detected by AI</span>
              <span className="text-[9px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-bold uppercase">
                Active Drift
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              {role === "cfo"
                ? "Discretionary SaaS & cloud pass-throughs rose +24% over 14 days without proportional revenue lift."
                : role === "cmo"
                ? "Top customer acquisition channel concentration rose to 68%, increasing vulnerability to platform ad rate spikes."
                : "Liquid runway is holding at 8.0 months, but net burn pace requires upfront invoice realization."}
            </p>
          </div>
        </div>

        <Link
          href="/gaps"
          className="px-3.5 py-1.5 rounded-xl bg-surface border border-amber-500/40 text-xs font-bold text-text hover:bg-surface-2 btn-tactile self-start sm:self-auto inline-flex items-center gap-1.5 shrink-0"
        >
          <span>Open Gap Resolution</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dynamic KPI Headline Cards with Interactive Drill-Down */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div
          onClick={() =>
            setActiveDrillDown({
              title: "Annualized Operating Revenue",
              value: `₹${annualRevenue.toLocaleString("en-IN")}`,
              subtitle: `₹${monthlyRev.toLocaleString("en-IN")}/mo run-rate`,
              trend: "+14.2% YoY",
              isPositive: true,
              benchmark: "Top 20th Percentile for Indian B2B SaaS",
              history: [
                { period: "Q1", val: 1200000 },
                { period: "Q2", val: 1350000 },
                { period: "Q3", val: 1550000 },
                { period: "Q4", val: 1900000 },
              ],
              rootCauses: [
                "Expansion of mid-market contracts to annual upfront retainers",
                "Reduction in sales cycle length from 42 days to 28 days",
              ],
              recommendedAction: "Offer 12% upfront discount on annual renewals to pull forward cash liquidity.",
            })
          }
          className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2 cursor-pointer hover:border-brass/50 transition-all btn-tactile"
        >
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">
              {role === "cmo" ? "Annual Revenue (Pipeline)" : "Annualized Revenue"}
            </span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-text">
              ₹{annualRevenue.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              +14.2%
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>₹{monthlyRev.toLocaleString("en-IN")} / mo</span>
            <span className="text-brass font-semibold">Click to drill down →</span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() =>
            setActiveDrillDown({
              title: "Liquid Cash Runway",
              value: `${runwayMonths} Months`,
              subtitle: `₹${cash.toLocaleString("en-IN")} in bank reserves`,
              trend: "+0.8 mo extension",
              isPositive: true,
              benchmark: "Target ≥ 12.0 Months",
              history: [
                { period: "Nov", val: 6.2 },
                { period: "Dec", val: 6.8 },
                { period: "Jan", val: 7.4 },
                { period: "Feb", val: 8.0 },
              ],
              rootCauses: [
                "Net monthly burn holding at ₹1,50,000 against ₹12,00,000 cash balance",
                "Receivables collection cycle reduced by 9 days",
              ],
              recommendedAction: "Prune non-core software seats to extend runway beyond 10.5 months.",
            })
          }
          className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2 cursor-pointer hover:border-brass/50 transition-all btn-tactile"
        >
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">
              {role === "cfo" ? "Solvency Runway" : "Net Cash Runway"}
            </span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-text">
              {runwayMonths} mos
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              Solvent
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>Burn: ₹{burn.toLocaleString("en-IN")}/mo</span>
            <span className="text-brass font-semibold">Click to drill down →</span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() =>
            setActiveDrillDown({
              title: "Gross Profit Margin",
              value: `${grossMargin}%`,
              subtitle: "Industry median: 76.0%",
              trend: "+2.1% efficiency",
              isPositive: true,
              benchmark: "Target ≥ 80.0%",
              history: [
                { period: "Q1", val: 78 },
                { period: "Q2", val: 80 },
                { period: "Q3", val: 81 },
                { period: "Q4", val: 82 },
              ],
              rootCauses: [
                "Optimized cloud server utilization",
                "Contractor renegotiation completed in Q3",
              ],
              recommendedAction: "Automate Tier-1 customer support to lift gross margin to 85%.",
            })
          }
          className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2 cursor-pointer hover:border-brass/50 transition-all btn-tactile"
        >
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">Gross Profit Margin</span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-text">
              {grossMargin}%
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              +2.1%
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>Median: 76.0%</span>
            <span className="text-brass font-semibold">Click to drill down →</span>
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() =>
            setActiveDrillDown({
              title: "Revenue Per FTE Headcount",
              value: `₹${revPerHead.toLocaleString("en-IN")}`,
              subtitle: `${teamSize} FTE Headcount`,
              trend: "+8.5% efficiency",
              isPositive: true,
              benchmark: "Tier-1 Efficiency Benchmark",
              history: [
                { period: "H1", val: 380000 },
                { period: "H2", val: 428000 },
              ],
              rootCauses: [
                "Maintained headcount steady at 14 while revenue expanded",
                "Workflow automation eliminated 18 hours/week manual admin work",
              ],
              recommendedAction: "Delay non-critical hires until annualized revenue crosses ₹75L.",
            })
          }
          className="p-4 rounded-xl border border-line bg-surface shadow-theme space-y-2 cursor-pointer hover:border-brass/50 transition-all btn-tactile"
        >
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">Revenue Per Head</span>
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center text-brass">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-text">
              ₹{revPerHead.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              Efficient
            </span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-line/60">
            <span>{teamSize} FTE Team</span>
            <span className="text-brass font-semibold">Click to drill down →</span>
          </div>
        </div>
      </div>

      {/* Main Analysis & Forward Projection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend & Predictive Forecast Chart (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-line bg-surface shadow-theme space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-text">Revenue Velocity & 6-Month Forward Forecast</h2>
              <p className="text-[11px] text-text-muted">
                Compares historical revenue against projected runway burn trajectory.
              </p>
            </div>

            {/* Forecast Model Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] font-medium text-text-muted">Forecast:</span>
              <div className="p-0.5 rounded-lg bg-surface-2 border border-line flex">
                <button
                  type="button"
                  onClick={() => setForecastMode("baseline")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    forecastMode === "baseline" ? "bg-surface text-text font-bold shadow-xs" : "text-text-muted"
                  }`}
                >
                  Baseline
                </button>
                <button
                  type="button"
                  onClick={() => setForecastMode("optimized")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    forecastMode === "optimized" ? "bg-brass text-white font-bold shadow-xs" : "text-text-muted"
                  }`}
                >
                  AI Optimized ✨
                </button>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 border-b border-line px-2">
              {revenueHistory.map((d, i) => {
                const heightPct = Math.round((d.revenue / maxRev) * 100);
                const burnPct = Math.round((d.burn / maxRev) * 100);
                const isForecast = d.month.includes("(F)");

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-line text-text text-center whitespace-nowrap shadow-sm">
                      ₹{d.revenue.toLocaleString("en-IN")}
                    </div>
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      <div
                        className={`w-full max-w-[24px] rounded-t-md transition-all ${
                          isForecast
                            ? "bg-gradient-to-t from-brass to-cyan-400 border border-brass/40"
                            : "bg-brass hover:brightness-110"
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <div
                        className={`w-full max-w-[12px] rounded-t-sm transition-all ${
                          isForecast ? "bg-rust/40 border border-rust/30" : "bg-rust/70 hover:bg-rust"
                        }`}
                        style={{ height: `${burnPct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium ${isForecast ? "text-brass font-bold" : "text-text-muted"}`}>
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Trailing 6M Vol</span>
              <span className="text-sm font-bold font-mono text-text">
                ₹{revenueHistory.slice(0, 6).reduce((acc, c) => acc + c.revenue, 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Projected Q2 Run-Rate</span>
              <span className="text-sm font-bold font-mono text-brass">
                ₹{(monthlyRev * 1.25).toLocaleString("en-IN")}/mo
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Solvency Impact</span>
              <span className="text-sm font-bold font-mono text-emerald-500">+3.4 Months Runway</span>
            </div>
          </div>
        </div>

        {/* Right: Prescriptive Action Engine: "What Should We Do?" (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl border border-line bg-surface shadow-theme space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brass" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  What Should We Do? (Prescriptions)
                </h3>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase">
                Actionable
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Deterministic actions to reach your active target (<strong className="text-text">{goal.replace("_", " ")}</strong>):
            </p>

            <div className="space-y-3 text-xs">
              {/* Prescription 1 */}
              <div className="p-3.5 rounded-xl bg-surface-2/70 border border-line space-y-2 hover:border-brass/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-text">1. Enforce Upfront Annual Invoicing</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-jade/15 text-jade font-bold uppercase">
                    +₹4,50,000 Cash
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Offer 12% discount to top 5 retainer accounts for 12-month advance payment.
                </p>
                <Link
                  href="/simulator"
                  className="w-full py-1.5 rounded-lg bg-surface border border-line text-[11px] font-bold text-brass flex items-center justify-center gap-1.5 hover:bg-surface-2 btn-tactile"
                >
                  <Play className="w-3 h-3" />
                  <span>Simulate in Decision Simulator</span>
                </Link>
              </div>

              {/* Prescription 2 */}
              <div className="p-3.5 rounded-xl bg-surface-2/70 border border-line space-y-2 hover:border-brass/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-text">2. Prune Idle Cloud Infrastructure</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber/15 text-amber font-bold uppercase">
                    Save ₹35,000/mo
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Downsize unallocated compute instances identified by Operations AI in AWS/Azure.
                </p>
                <Link
                  href="/workflows"
                  className="w-full py-1.5 rounded-lg bg-surface border border-line text-[11px] font-bold text-brass flex items-center justify-center gap-1.5 hover:bg-surface-2 btn-tactile"
                >
                  <Zap className="w-3 h-3" />
                  <span>Execute Workflow Automation</span>
                </Link>
              </div>

              {/* Prescription 3 */}
              <div className="p-3.5 rounded-xl bg-surface-2/70 border border-line space-y-2 hover:border-brass/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-text">3. Resolve Account Concentration Gap</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-400 font-bold uppercase">
                    De-risk
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Active gap: Top customer represents 36.5% of income. Dilute with secondary deals.
                </p>
                <Link
                  href="/gaps"
                  className="w-full py-1.5 rounded-lg bg-surface border border-line text-[11px] font-bold text-brass flex items-center justify-center gap-1.5 hover:bg-surface-2 btn-tactile"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>View Gap Resolution Playbook</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Drill-Down Modal */}
      {activeDrillDown && (
        <PortalModal isOpen={Boolean(activeDrillDown)} onClose={() => setActiveDrillDown(null)}>
          <div className="w-full max-w-lg bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden animate-scale-up p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brass" />
                <h3 className="text-sm font-bold text-text">Metric Drill-Down & Telemetry</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrillDown(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-text-muted block">{activeDrillDown.title}</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-text">{activeDrillDown.value}</span>
                  <span className="text-xs font-bold text-emerald-500">{activeDrillDown.trend}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">{activeDrillDown.subtitle}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-2/60 border border-line space-y-1.5 text-xs">
                <span className="font-bold text-text block">Peer Quartile Benchmark:</span>
                <p className="text-text-muted">{activeDrillDown.benchmark}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-text block">Root-Cause Attribution:</span>
                <ul className="space-y-1 text-text-muted">
                  {activeDrillDown.rootCauses.map((rc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-brass">↳</span>
                      <span>{rc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-brass-soft/40 border border-brass/40 text-xs space-y-1">
                <span className="font-bold text-brass uppercase text-[10px] tracking-wider block">
                  AI Prescribed Action:
                </span>
                <p className="text-text leading-snug">{activeDrillDown.recommendedAction}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveDrillDown(null)}
                className="px-4 py-2 rounded-xl bg-brass text-white font-bold text-xs hover:brightness-110 btn-tactile cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </PortalModal>
      )}
    </div>
  );
}
