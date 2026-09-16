"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  Printer,
  Copy,
  Check,
  Activity,
  ArrowUpRight,
  Zap,
  Target,
  UserCheck,
  XCircle,
  BrainCircuit,
  Layers,
  History,
  Info
} from "lucide-react";

interface LeadershipDecision {
  id: string;
  title: string;
  category: "finance" | "sales" | "operations" | "talent";
  impact: string;
  recommendation: string;
  aiConfidence: number;
  status: "pending" | "approved" | "delegated" | "declined";
  actionTakenAt?: string;
  delegatedTo?: string;
}

const INITIAL_DECISIONS: LeadershipDecision[] = [
  {
    id: "dec-1",
    title: "Approve ₹65,000 Discretionary SaaS Vendor Consolidation",
    category: "finance",
    impact: "+1.2 months runway extension (₹7.8L annualized savings)",
    recommendation: "Deprecate 3 redundant analytics seats and migrate tracking pipelines to internal telemetry.",
    aiConfidence: 96,
    status: "pending",
  },
  {
    id: "dec-2",
    title: "Authorize Immediate Senior AE Hire for Mid-Market Expansion",
    category: "sales",
    impact: "+₹24,00,000 ARR capacity with projected payback in 4.5 months",
    recommendation: "Elena (Marketing AI) reports 42% qualified inbound surplus currently uncontacted within 24h SLA.",
    aiConfidence: 92,
    status: "pending",
  },
  {
    id: "dec-3",
    title: "Trigger Autonomous Client Onboarding Flow for Tier-2 Accounts",
    category: "operations",
    impact: "Reduces onboarding latency from 9.4 days to 1.8 days",
    recommendation: "Free 14 hours/week of founder & PM bandwidth by shifting standard setup to automated playbook.",
    aiConfidence: 94,
    status: "pending",
  },
  {
    id: "dec-4",
    title: "Enforce Upfront Annual Pre-payment Incentive (15% Margin Protected)",
    category: "finance",
    impact: "Injects ₹18,00,000 upfront non-dilutive liquidity into reserves",
    recommendation: "Offer custom annual agreements to top 8 renewal accounts closing this month.",
    aiConfidence: 89,
    status: "approved",
    actionTakenAt: "Today, 10:30 AM",
  },
];

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedBriefingId, setSelectedBriefingId] = useState("briefing-current");
  const [companyName, setCompanyName] = useState("Apex Technologies");
  const [founderName, setFounderName] = useState("Alex Morgan");
  const [industryName, setIndustryName] = useState("B2B Enterprise SaaS");
  const [annualRevenue, setAnnualRevenue] = useState(6000000);
  const [teamSize, setTeamSize] = useState(14);
  const [burn, setBurn] = useState(250000);
  const [cash, setCash] = useState(3800000);

  const [decisions, setDecisions] = useState<LeadershipDecision[]>(INITIAL_DECISIONS);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("nuralix_business_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setCompanyName(parsed.name);
        if (parsed.founderName) setFounderName(parsed.founderName);
        if (parsed.industryLabel) setIndustryName(parsed.industryLabel);
        else if (parsed.industry) setIndustryName(parsed.industry);
        if (parsed.annualRevenue) setAnnualRevenue(Number(parsed.annualRevenue));
        if (parsed.teamSize) setTeamSize(Number(parsed.teamSize));
        if (parsed.burn) setBurn(Number(parsed.burn));
        if (parsed.cash) setCash(Number(parsed.cash));
      }

      const savedDecisions = localStorage.getItem("nuralix_briefing_decisions");
      if (savedDecisions) {
        setDecisions(JSON.parse(savedDecisions));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const monthlyRev = Math.round(annualRevenue / 12);
  const runwayMonths = burn > 0 ? (cash / burn).toFixed(1) : "18+";
  const healthScore = Math.min(94, Math.max(72, Math.round(75 + (cash / (burn || 1)) * 1.5)));

  const handleDecisionAction = (
    id: string,
    action: "pending" | "approved" | "delegated" | "declined",
    delegatedTo?: string
  ) => {
    const updated = decisions.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: action,
          actionTakenAt: action === "pending" ? undefined : "Just now",
          delegatedTo: delegatedTo || (action === "delegated" ? "Astra (CEO AI)" : undefined),
        };
      }
      return d;
    });

    setDecisions(updated);
    try {
      localStorage.setItem("nuralix_briefing_decisions", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    const actionText =
      action === "approved"
        ? "Directive Approved & Queued for Execution"
        : action === "delegated"
        ? `Directive Delegated to ${delegatedTo || "Autonomous AI"}`
        : action === "declined"
        ? "Directive Declined & Archived"
        : "Directive reset to pending";

    setActiveNotification(actionText);
    setTimeout(() => setActiveNotification(null), 3500);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setActiveNotification("Fresh Executive Briefing synthesized across telemetry feeds.");
      setTimeout(() => setActiveNotification(null), 4000);
    }, 1600);
  };

  const handleCopy = () => {
    const text = `Executive Intelligence Briefing for ${companyName}\nHealth Index: ${healthScore}/100 | Runway: ${runwayMonths} Mo | Cash: ₹${cash.toLocaleString()}\nKey Decisions Required: ${
      decisions.filter(d => d.status === "pending").length
    } Pending Action.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-text">Executive Intelligence Briefing</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
                  Decision-Focused Intelligence
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Deterministic synthesis prepared for <span className="text-text font-medium">{founderName}</span> & leadership team at <span className="text-text font-medium">{companyName}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-text text-xs font-semibold hover:border-line-strong btn-tactile cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-jade" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Digest" : "Copy Digest"}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-text text-xs font-semibold hover:border-line-strong btn-tactile cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brass text-white text-xs font-semibold shadow-sm hover:brightness-110 btn-tactile disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? "Synthesizing Briefing…" : "Generate Fresh Briefing"}</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {activeNotification && (
        <div className="p-3.5 rounded-xl bg-brass-soft border border-brass text-xs text-text font-medium flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brass shrink-0" />
            <span>{activeNotification}</span>
          </div>
          <span className="text-[10px] text-text-muted font-mono">Real-time ledger synced</span>
        </div>
      )}

      {/* Main Layout: Briefing Feed & Historical Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cadence Selector & Historical Briefings Archive (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Cadence & Editions</span>
            <span className="text-[10px] text-brass">Real-time Ledger Connected</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "briefing-current",
                title: "Week 37 Executive Intelligence Briefing",
                cadence: "Current · Trailing 7 Days",
                sentiment: "Bullish Control",
                status: "Live Active",
                pendingCount: decisions.filter(d => d.status === "pending").length,
              },
              {
                id: "briefing-monthly",
                title: "Monthly Board Operations Synthesis",
                cadence: "September Cycle",
                sentiment: "Stable Runway",
                status: "Archived",
                pendingCount: 0,
              },
              {
                id: "briefing-prev",
                title: "Week 36 Solvency & Burn Health Review",
                cadence: "7 days ago",
                sentiment: "Target Met",
                status: "Archived",
                pendingCount: 0,
              },
              {
                id: "briefing-q3",
                title: "Quarterly Comprehensive Operating Review",
                cadence: "Q3 Strategic Audit",
                sentiment: "Expansion Ready",
                status: "Archived",
                pendingCount: 0,
              },
            ].map(item => {
              const isSelected = selectedBriefingId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBriefingId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer btn-tactile ${
                    isSelected
                      ? "bg-surface border-brass shadow-theme ring-1 ring-brass/30"
                      : "bg-surface-2/60 border-line hover:border-line-strong"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text line-clamp-1">{item.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-brass-soft text-brass font-bold uppercase shrink-0">
                      {item.sentiment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted mt-2">
                    <span>{item.cadence}</span>
                    {item.pendingCount > 0 ? (
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded">
                        {item.pendingCount} Decisions Due
                      </span>
                    ) : (
                      <span>{item.status}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Synthesis Co-Pilots Card */}
          <div className="p-4 rounded-xl border border-line bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-brass" />
                <span className="text-xs font-bold text-text">Synthesizing Co-Pilots</span>
              </div>
              <span className="text-[10px] text-jade font-mono font-semibold">● Real-time sync</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-line">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brass text-white flex items-center justify-center font-bold text-[10px]">
                    A
                  </div>
                  <div>
                    <span className="font-semibold text-text block">Astra (CEO AI)</span>
                    <span className="text-[10px] text-text-muted">Strategic Priorities & Growth</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-brass">Auto-Routed</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-line">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    M
                  </div>
                  <div>
                    <span className="font-semibold text-text block">Marcus (CFO AI)</span>
                    <span className="text-[10px] text-text-muted">Burn, Runway & Solvency</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-500">DeepSeek R1</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-line">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                    E
                  </div>
                  <div>
                    <span className="font-semibold text-text block">Elena (CMO AI)</span>
                    <span className="text-[10px] text-text-muted">Pipeline, Inbound & CAC</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-purple-400">Claude 3.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Executive Document (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-line bg-surface shadow-theme space-y-7">
          {/* Briefing Header Banner */}
          <div className="border-b border-line pb-4 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
                Confidential · Executive Eyes Only
              </span>
              <span className="text-xs text-text-muted font-mono">
                Telemetry Period: Trailing 7 Days · Synced Live
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-text tracking-tight font-sans">
              State of the Business: {companyName}
            </h2>
            <p className="text-xs text-text-muted">
              Operating Sector: <span className="text-text font-medium">{industryName}</span> · Prepared for <span className="text-text font-medium">{founderName}</span> and C-Suite Leadership.
            </p>
          </div>

          {/* Section 1: Health & Solvency Index Barometer */}
          <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brass" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  1. Health & Solvency Index Barometer
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted font-semibold">Overall Index:</span>
                <span className="text-base font-extrabold font-mono text-brass">{healthScore}/100</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold uppercase">
                  Robust Solvency
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-surface border border-line">
                <span className="text-[10px] text-text-muted font-semibold uppercase block">Annualized Run-Rate</span>
                <span className="text-sm font-bold font-mono text-text">₹{annualRevenue.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-line">
                <span className="text-[10px] text-text-muted font-semibold uppercase block">Verified Cash Reserves</span>
                <span className="text-sm font-bold font-mono text-text">₹{cash.toLocaleString()}</span>
                <span className="text-[10px] text-text-muted font-medium block mt-0.5">Liquid accounts</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-line">
                <span className="text-[10px] text-text-muted font-semibold uppercase block">Net Operating Runway</span>
                <span className="text-sm font-bold font-mono text-emerald-500">{runwayMonths} Months</span>
                <span className="text-[10px] text-emerald-500 font-medium block mt-0.5">Burn ₹{(burn).toLocaleString()}/mo</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-line">
                <span className="text-[10px] text-text-muted font-semibold uppercase block">FTE Capital Efficiency</span>
                <span className="text-sm font-bold font-mono text-brass">
                  ₹{Math.round(annualRevenue / (teamSize || 1)).toLocaleString()} / FTE
                </span>
                <span className="text-[10px] text-text-muted font-medium block mt-0.5">{teamSize} team members</span>
              </div>
            </div>
          </div>

          {/* Section 2: Operational Signals & Major Developments */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-text flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
              2. Operational Signals & Major Developments
            </h3>
            <p className="text-xs text-text-muted">
              Deterministic highlights synthesized from CRM, banking, and customer delivery feeds over the last cycle:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-500 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Gross Margin Expansion (83.8%)</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Margin widened by 240 bps due to automated cloud provisioning rules implemented in Marcus CFO automation workflow.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-500 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Enterprise Conversion SLA 98.9%</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Mid-market sales response time compressed to under 4 hours, driving an 18% improvement in outbound meeting hold rates.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Critical Risks & Strategic Opportunities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Section 3: Critical Risks */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-rust" />
                3. Critical Risks & Vulnerabilities
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Founder Deal-Closing Concentration</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rust/15 text-rust font-bold uppercase">
                      High
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    62% of deals &gt;₹3,00,000 required founder intervention. Sales playbook delegation required.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Unused SaaS Tool Subscriptions</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold uppercase">
                      Medium
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    ₹65,000 monthly burn tied to software with zero user sessions logged in trailing 30 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Strategic Opportunities */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-brass" />
                4. Strategic Upside Opportunities
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Annual Contract Pre-Payment Cash Surge</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-jade/15 text-jade font-bold uppercase">
                      +₹18L Liquid
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Offering 15% incentive on annual contracts unlocks immediate non-dilutive liquidity for 8 pending renewals.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Mid-Market Tier Lead Expansion</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold uppercase">
                      +₹24L ARR
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Surplus qualified enterprise leads can be converted immediately with one dedicated account executive.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Decisions Required (Interactive Directives) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-brass" />
                5. Decisions Required (Leadership Directives)
              </h3>
              <span className="text-xs text-text-muted font-medium">
                {decisions.filter(d => d.status === "pending").length} pending founder action
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Actionable directives generated by Nuralix executive reasoning engine. Approve, delegate to autonomous AI, or decline directly below:
            </p>

            <div className="space-y-3">
              {decisions.map(dec => {
                const isPending = dec.status === "pending";
                return (
                  <div
                    key={dec.id}
                    className={`p-4 rounded-xl border transition-all ${
                      dec.status === "approved"
                        ? "bg-jade/5 border-jade/30"
                        : dec.status === "delegated"
                        ? "bg-brass/5 border-brass/30"
                        : dec.status === "declined"
                        ? "bg-surface-2/40 border-line opacity-60"
                        : "bg-surface-2 border-line hover:border-line-strong"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-text">{dec.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-line text-text-muted uppercase font-mono">
                            {dec.category}
                          </span>
                          <span className="text-[10px] font-semibold text-brass">
                            {dec.aiConfidence}% AI Confidence
                          </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                          {dec.recommendation}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-500 pt-0.5">
                          <Zap className="w-3 h-3 shrink-0" />
                          <span>Impact: {dec.impact}</span>
                        </div>
                      </div>

                      {/* Directive Actions */}
                      <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDecisionAction(dec.id, "approved")}
                              className="px-3 py-1.5 rounded-lg bg-brass text-white text-xs font-bold hover:brightness-110 btn-tactile cursor-pointer shadow-xs inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecisionAction(dec.id, "delegated", "Astra (CEO AI)")}
                              className="px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-text btn-tactile cursor-pointer inline-flex items-center gap-1"
                            >
                              <BrainCircuit className="w-3.5 h-3.5 text-brass" />
                              <span>Delegate AI</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecisionAction(dec.id, "declined")}
                              className="px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs font-semibold text-text-muted hover:text-rust hover:border-rust/40 btn-tactile cursor-pointer inline-flex items-center"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            {dec.status === "approved" && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-jade font-bold bg-jade/10 px-2.5 py-1 rounded-lg border border-jade/30">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approved · In Execution</span>
                              </span>
                            )}
                            {dec.status === "delegated" && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-brass font-bold bg-brass/10 px-2.5 py-1 rounded-lg border border-brass/30">
                                <BrainCircuit className="w-3.5 h-3.5" />
                                <span>Delegated to {dec.delegatedTo}</span>
                              </span>
                            )}
                            {dec.status === "declined" && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-text-muted font-bold bg-surface px-2.5 py-1 rounded-lg border border-line">
                                <span>Declined</span>
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDecisionAction(dec.id, "pending")}
                              className="text-[10px] text-text-muted underline hover:text-text cursor-pointer ml-1"
                            >
                              Reset
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
