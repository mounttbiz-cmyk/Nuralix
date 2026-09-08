"use client";

import React, { useState, useEffect } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BriefingWidgetProps {
  companyName?: string;
  ceoName?: string;
}

export function BriefingWidget({
  companyName: propCompanyName = "Apex Technologies",
  ceoName = "Astra",
}: BriefingWidgetProps) {
  const [companyName, setCompanyName] = useState(propCompanyName);
  const [founderName, setFounderName] = useState("Founder");
  const [industryLabel, setIndustryLabel] = useState("Technology");
  const [monthlyRev, setMonthlyRev] = useState(500000);
  const [burn, setBurn] = useState(150000);
  const [cash, setCash] = useState(1200000);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nuralix_business_profile");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.name) setCompanyName(p.name);
        if (p.founderName) setFounderName(p.founderName);
        if (p.industryLabel) setIndustryLabel(p.industryLabel);
        else if (p.industry) setIndustryLabel(p.industry);
        if (p.revenue) setMonthlyRev(Number(p.revenue));
        if (p.burn) setBurn(Number(p.burn));
        if (p.cash) setCash(Number(p.cash));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const runwayMonths = burn > 0 ? (cash / burn).toFixed(1) : "18+";

  const briefingLines = [
    `Monthly operating revenues for ${companyName} are holding at ₹${monthlyRev.toLocaleString("en-IN")}, maintaining solid unit economics in ${industryLabel}.`,
    `Monthly net burn sits at ₹${burn.toLocaleString("en-IN")} against ₹${cash.toLocaleString("en-IN")} liquid bank reserves, preserving ${runwayMonths} months of verified runway.`,
    `Capital efficiency remains in the top quartile. Discretionary software tooling and vendor subscriptions are under active watch by Marcus (CFO AI).`,
    `Priority directive for ${founderName}: Dilute top-client concentration below 25% by advancing secondary deal pipelines in the next 60 days.`,
  ];

  return (
    <ContainerTile span={2} id="widget_daily_briefing">
      <div className="flex flex-col h-full justify-between space-y-4">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <span>Executive AI Briefing</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-300 font-mono font-semibold">
                    Autonomous
                  </span>
                </h2>
                <span className="text-[10px] text-text-muted">
                  Synthesized by {ceoName} (Chief Executive AI)
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2/80 text-text-muted font-mono border border-white/[0.08]">
              Live Feed
            </span>
          </div>

          {/* Structured Intelligence Cards */}
          <div className="py-3 space-y-2.5">
            <div className="p-3 rounded-xl bg-surface-2/40 border border-white/[0.06] hover:border-white/12 transition-colors space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs">📈</span>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Revenue & Growth Trajectory
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed pl-5">
                Monthly operating revenue for <strong className="text-white">{companyName}</strong> is stable at <strong className="text-white">₹{monthlyRev.toLocaleString("en-IN")}</strong> with healthy top-quartile gross margins for {industryLabel}.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/40 border border-white/[0.06] hover:border-white/12 transition-colors space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs">🛡️</span>
                <span className="text-[11px] font-bold text-jade uppercase tracking-wider font-mono">
                  Capital Reserves & Buffer
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed pl-5">
                Net burn at <strong className="text-white">₹{burn.toLocaleString("en-IN")}</strong> against <strong className="text-white">₹{cash.toLocaleString("en-IN")}</strong> in bank reserves maintains a secure <strong className="text-jade">{runwayMonths} month</strong> runway runway buffer.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs">⚡</span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Priority Directive for {founderName}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pl-5 font-medium">
                Dilute top-client concentration below 25% by advancing secondary deal pipelines within the next 60 days.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold text-xs btn-tactile cursor-pointer group"
          >
            <span>Ask Astra to elaborate</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/gaps"
            className="text-text-muted hover:text-text text-xs cursor-pointer"
          >
            Review Gap Playbooks →
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
