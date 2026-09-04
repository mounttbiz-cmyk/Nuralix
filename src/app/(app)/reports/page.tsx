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
  Check
} from "lucide-react";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedBriefingId, setSelectedBriefingId] = useState("briefing-current");
  const [companyName, setCompanyName] = useState("Apex Technologies");
  const [founderName, setFounderName] = useState("Alex Morgan");
  const [industryName, setIndustryName] = useState("B2B SaaS");
  const [annualRevenue, setAnnualRevenue] = useState(600000);
  const [teamSize, setTeamSize] = useState(14);
  const [burn, setBurn] = useState(15000);
  const [cash, setCash] = useState(120000);

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
    } catch (e) {
      // ignore
    }
  }, []);

  const monthlyRev = Math.round(annualRevenue / 12);
  const runwayMonths = burn > 0 ? (cash / burn).toFixed(1) : "18+";

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1800);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brass-soft flex items-center justify-center text-brass">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-text">Executive Intelligence Briefings</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
                  C-Suite Telemetry
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Deterministic synthesis prepared for {founderName} & leadership team at {companyName}.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-text text-xs font-semibold hover:border-line-strong btn-tactile"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Summary" : "Copy Digest"}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-text text-xs font-semibold hover:border-line-strong btn-tactile"
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

      {/* Main Layout: Briefing Feed & Historical Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Historical Briefings Archive (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Archive & Cadence</span>
            <span className="text-[10px] text-brass">Weekly Auto-Sync</span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "briefing-current",
                title: "Week 36 Executive Intelligence Briefing",
                period: "Current · Trailing 7 Days",
                sentiment: "Bullish Control",
                status: "Active",
              },
              {
                id: "briefing-prev",
                title: "Week 35 Solvency & Burn Health Review",
                period: "7 days ago",
                sentiment: "Stable",
                status: "Archived",
              },
              {
                id: "briefing-month",
                title: "Monthly Board Operations Synthesis",
                period: "Last month",
                sentiment: "Expanding",
                status: "Archived",
              },
              {
                id: "briefing-q4",
                title: "Quarterly Comprehensive Operating Review",
                period: "Q4 Retrospective",
                sentiment: "Balanced",
                status: "Archived",
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
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-brass-soft text-brass font-bold uppercase shrink-0">
                      {item.sentiment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                    <span>{item.period}</span>
                    <span>{item.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Executive Digest Widget */}
          <div className="p-4 rounded-xl border border-line bg-surface space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brass" />
              <span className="text-xs font-bold text-text">Co-Pilots on this Briefing</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-line">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brass text-white flex items-center justify-center font-bold text-[10px]">
                    A
                  </div>
                  <span className="font-semibold text-text">Astra (CEO AI)</span>
                </div>
                <span className="text-text-muted">Strategic Vision</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-line">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    M
                  </div>
                  <span className="font-semibold text-text">Marcus (CFO AI)</span>
                </div>
                <span className="text-text-muted">Capital & Runway</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Executive Document (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-line bg-surface shadow-theme space-y-6">
          {/* Briefing Header Banner */}
          <div className="border-b border-line pb-4 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
                Confidential · Executive Eyes Only
              </span>
              <span className="text-xs text-text-muted font-mono">
                Generated: Friday, 09:00 AM UTC
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-text tracking-tight font-sans">
              State of the Business: {companyName}
            </h2>
            <p className="text-xs text-text-muted">
              Operating sector: <span className="text-text font-medium">{industryName}</span> · Prepared for <span className="text-text font-medium">{founderName}</span> and leadership.
            </p>
          </div>

          {/* Quick Metrics Barometer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted font-semibold uppercase block">Annualized Run-rate</span>
              <span className="text-sm font-bold font-mono text-text">${annualRevenue.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted font-semibold uppercase block">Cash Reserves</span>
              <span className="text-sm font-bold font-mono text-text">${cash.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted font-semibold uppercase block">Net Runway</span>
              <span className="text-sm font-bold font-mono text-emerald-500">{runwayMonths} Months</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-line">
              <span className="text-[10px] text-text-muted font-semibold uppercase block">Team Efficiency</span>
              <span className="text-sm font-bold font-mono text-brass">${Math.round(annualRevenue / (teamSize || 1)).toLocaleString()} / FTE</span>
            </div>
          </div>

          {/* Core Synthesis Sections */}
          <div className="space-y-5 text-xs leading-relaxed text-text">
            {/* Section 1: Executive Overview */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-brass" />
                1. Executive Overview & Solvency Posture
              </h3>
              <p className="text-text-muted">
                {companyName} enters this operating cycle with a solid capital buffer. Net monthly burn is holding steady at <span className="font-mono text-text font-semibold">${burn.toLocaleString()}</span> against <span className="font-mono text-text font-semibold">${cash.toLocaleString()}</span> in liquid reserves, yielding <span className="font-mono text-text font-semibold">{runwayMonths} months</span> of verified operational runway. Revenue per head remains in the top tier for {industryName} businesses of this scale.
              </p>
            </div>

            {/* Section 2: Key Operational Highlights */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
                2. Operational Wins & Velocity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-500 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Healthy Gross Margin Retention</span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Trailing margin reached 83.2%, outpacing the industry median by 7.2 percentage points.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-500 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Client Delivery SLA at 99.4%</span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Zero SLA breaches recorded across the active client book this cycle.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Priority Bottlenecks & Action Items */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-rust" />
                3. Bottlenecks Under Active Remediation
              </h3>
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-text">Founder Bottleneck in Core Sales & Ops</span>
                    <p className="text-[11px] text-text-muted">
                      Over 60% of high-ticket account agreements still require founder participation to close. Transitioning deal scripts to sales leads.
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rust/15 text-rust font-bold uppercase shrink-0">
                    High Priority
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-text">Discretionary SaaS & Cloud Opex Pruning</span>
                    <p className="text-[11px] text-text-muted">
                      Audit pending for 4 recurring vendor tools flagged as low-utilization by Marcus (CFO AI).
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber/15 text-amber font-bold uppercase shrink-0">
                    Medium
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: 7-Day Leadership Directives */}
            <div className="p-4 rounded-xl bg-brass-soft/50 border border-brass/30 space-y-2">
              <h4 className="font-bold text-xs text-brass uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Immediate 7-Day Leadership Directives</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-text">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass shrink-0" />
                  <span><strong>Sales:</strong> Document objection-handling matrix for junior closers.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass shrink-0" />
                  <span><strong>Finance:</strong> Complete annual contract pre-payment incentive modeling.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass shrink-0" />
                  <span><strong>Executive:</strong> Schedule bi-weekly strategic roadmap review with Astra AI.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
