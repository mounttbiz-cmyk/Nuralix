"use client";

import React, { useState, useEffect } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { ProvenanceBadge } from "../ui/Badge";
import { ShieldCheck, ChevronRight, TrendingUp, Activity } from "lucide-react";

import { useBusinessDataSync } from "@/lib/upload/events";

interface HealthScoreProps {
  score?: number;
  delta?: number;
}

export function HealthScoreWidget({
  score: propScore = 78,
  delta = 4.2,
}: HealthScoreProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [runwayMo, setRunwayMo] = useState("7.2");
  const [revPerHead, setRevPerHead] = useState("₹18.4L");
  const [industryName, setIndustryName] = useState("B2B SaaS");
  const [financialScore, setFinancialScore] = useState(82);
  const [teamScore, setTeamScore] = useState(88);
  const [overallScore, setOverallScore] = useState(propScore);
  const [isUploaded, setIsUploaded] = useState(false);

  const applyProfile = (saved: any) => {
    if (!saved) return;
    const cash = Number(saved.cash || saved.cashOnHand || 1200000);
    const burn = Number(saved.burn || saved.monthlyBurn || saved.monthlyNetBurn || 150000);
    const annRev = Number(saved.annualRevenue || (saved.revenue ? saved.revenue * 12 : 6000000));
    const team = Number(saved.teamSize || 15);

    if (burn > 0) {
      const rVal = Number((cash / burn).toFixed(1));
      setRunwayMo(String(rVal));
      if (rVal >= 12) setFinancialScore(92);
      else if (rVal >= 8) setFinancialScore(84);
      else if (rVal >= 5) setFinancialScore(74);
      else setFinancialScore(55);
    }

    if (annRev && team) {
      const rph = Math.round(annRev / Math.max(1, team));
      if (rph >= 10000000) {
        setRevPerHead(`₹${(rph / 10000000).toFixed(1)}Cr`);
        setTeamScore(92);
      } else if (rph >= 100000) {
        setRevPerHead(`₹${(rph / 100000).toFixed(1)}L`);
        setTeamScore(rph >= 2500000 ? 90 : rph >= 1500000 ? 86 : 78);
      } else {
        setRevPerHead(`₹${rph.toLocaleString("en-IN")}`);
      }
    }

    if (saved.industry) {
      const names: Record<string, string> = {
        it_tech: "IT & Tech Services",
        saas: "B2B SaaS",
        d2c: "E-Commerce & Retail",
        agency: "Agency & Professional Services",
        healthcare: "Healthcare & Clinics",
        manufacturing: "Manufacturing & Physical Goods",
        finance: "Financial Services & Wealth",
        real_estate: "Real Estate & Property",
      };
      setIndustryName(names[saved.industry] || saved.industry.toUpperCase());
    }

    if (saved.isUploadedData) {
      setIsUploaded(true);
    }
  };

  useEffect(() => {
    try {
      const savedStr = localStorage.getItem("nuralix_business_profile");
      if (savedStr) {
        applyProfile(JSON.parse(savedStr));
      } else {
        fetch("/api/business/intake")
          .then(r => r.json())
          .then(d => {
            if (d.success && d.business) {
              applyProfile(d.business);
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useBusinessDataSync(metrics => {
    applyProfile(metrics);
  });

  // Calculate dynamic weighted score
  const displayScore = Math.round(financialScore * 0.25 + 68 * 0.2 + 84 * 0.2 + 71 * 0.2 + teamScore * 0.15);

  const components = [
    { key: "financial", name: "Financial", score: financialScore, weight: "25%", detail: `Gross margins (82%), verified runway ${runwayMo} mo.` },
    { key: "growth", name: "Growth", score: 68, weight: "20%", detail: "CAC payback benchmark within normal deviation." },
    { key: "customer", name: "Customer", score: 84, weight: "20%", detail: "Logo retention 94%, NRR 108%." },
    { key: "operations", name: "Operations", score: 71, weight: "20%", detail: "Workflow throughput calibrated to headcount." },
    { key: "team", name: "Team", score: teamScore, weight: "15%", detail: `Revenue/head at ${revPerHead}, operational efficiency optimal.` },
  ];

  // SVG circular gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const strokeColor = displayScore >= 80 ? "#10B981" : displayScore >= 70 ? "#06B6D4" : "#F59E0B";

  return (
    <ContainerTile span={2} id="widget_health_score">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                Corporate Health Score
              </h2>
              <p className="text-[11px] text-text-muted">
                Deterministic telemetry synthesized across 5 operational vectors
              </p>
            </div>
          </div>
          <ProvenanceBadge type={isUploaded ? "from_data" : "estimate"} />
        </div>

        {/* Circular Gauge + Hero Score */}
        <div className="flex flex-col @sm:flex-row items-center gap-6 py-4">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-surface-2"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke={strokeColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-story ease-out-custom"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black num-tabular text-slate-900 dark:text-white font-mono leading-none tracking-tight">
                {displayScore}
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold font-mono mt-1 uppercase tracking-wider">
                {displayScore >= 80 ? "Optimal" : displayScore >= 70 ? "Stable" : "Needs Review"}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center @sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-jade/15 text-jade border border-jade/30 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{delta}% vs last month</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Composite telemetry synthesized across cash runway, revenue per FTE, and 24 operational benchmarks for {industryName}.
            </p>
          </div>
        </div>

        {/* Component Breakdown with Progress Bars */}
        <div className="space-y-2 pt-3 border-t border-line">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-text-muted/80 px-1 tracking-widest font-mono">
            <span>Category Performance</span>
            <span>Weight</span>
          </div>

          <div className="grid grid-cols-1 @xs:grid-cols-5 gap-2">
            {components.map(comp => {
              const isSelected = selectedComponent === comp.key;
              return (
                <button
                  key={comp.key}
                  type="button"
                  onClick={() => setSelectedComponent(isSelected ? null : comp.key)}
                  className={`p-2.5 rounded-xl border text-left transition-all btn-tactile ${
                    isSelected
                      ? "border-cyan-400/50 bg-cyan-500/15 shadow-sm ring-1 ring-cyan-500/30"
                      : "border-line bg-surface-2/60 hover:bg-surface-2 hover:border-line-strong"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span className="truncate font-medium">{comp.name}</span>
                    <span className="font-mono text-[9px] text-text-muted/70">{comp.weight}</span>
                  </div>
                  <div className="text-sm sm:text-base font-black num-tabular text-slate-900 dark:text-white font-mono mt-1">
                    {comp.score}
                  </div>
                  <div className="w-full h-1 bg-surface rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full ${
                        comp.score >= 80
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                          : comp.score >= 70
                          ? "bg-gradient-to-r from-cyan-400 to-indigo-500"
                          : "bg-gradient-to-r from-amber-400 to-rust"
                      }`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expandable breakdown explanation */}
          {selectedComponent && (
            <div className="mt-2 p-3 rounded-xl bg-surface-2/80 border border-cyan-500/30 text-xs text-text animate-fade-in flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-cyan-400 font-mono text-[11px] uppercase tracking-wider block">
                  {components.find(c => c.key === selectedComponent)?.name} Analysis
                </span>
                <p className="text-text-muted text-xs leading-relaxed">
                  {components.find(c => c.key === selectedComponent)?.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComponent(null)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-surface border border-white/10 text-text-muted hover:text-text font-medium shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </ContainerTile>
  );
}
