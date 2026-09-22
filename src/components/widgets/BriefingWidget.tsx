"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ContainerTile } from "../ui/ContainerTile";
import { StatusBadge } from "../ui/Badge";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useBusinessDataSync } from "@/lib/upload/events";

interface BriefingWidgetProps {
  companyName?: string;
  ceoName?: string;
}

export function BriefingWidget({
  companyName: propCompanyName = "Your Enterprise",
  ceoName = "Astra",
}: BriefingWidgetProps) {
  const [companyName, setCompanyName] = useState(propCompanyName);
  const [founderName, setFounderName] = useState("Founder");
  const [industryLabel, setIndustryLabel] = useState("Technology");
  const [monthlyRev, setMonthlyRev] = useState(500000);
  const [burn, setBurn] = useState(150000);
  const [cash, setCash] = useState(1200000);
  const [isUploaded, setIsUploaded] = useState(false);

  const applyProfile = (p: any) => {
    if (!p) return;
    if (p.name) setCompanyName(p.name);
    if (p.founderName) setFounderName(p.founderName);
    if (p.industryLabel) setIndustryLabel(p.industryLabel);
    else if (p.industry) setIndustryLabel(p.industry);
    if (p.revenue !== undefined) setMonthlyRev(Number(p.revenue));
    else if (p.monthlyRevenue !== undefined) setMonthlyRev(Number(p.monthlyRevenue));
    if (p.burn !== undefined) setBurn(Number(p.burn));
    else if (p.monthlyBurn !== undefined) setBurn(Number(p.monthlyBurn));
    if (p.cash !== undefined) setCash(Number(p.cash));
    else if (p.cashOnHand !== undefined) setCash(Number(p.cashOnHand));
    if (p.isUploadedData) setIsUploaded(true);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bizzpal_business_profile");
      if (saved) {
        applyProfile(JSON.parse(saved));
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
          <div className="flex items-center justify-between pb-3 border-b border-line/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/40 flex items-center justify-center text-gold shadow-sm shadow-[0_4px_12px_-4px_var(--gold-glow)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-text uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <span>Executive AI Briefing</span>
                  <StatusBadge label="Autonomous" tone="ai" />
                </h2>
                <span className="text-[10px] text-text-muted">
                  Synthesized by {ceoName} (Chief Executive AI)
                </span>
              </div>
            </div>
            <StatusBadge label="Live Feed" tone="live" pulse />
          </div>

          {/* Structured Intelligence Cards — fade + slide in as they mount */}
          <div className="py-3 space-y-2.5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-colors space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">📈</span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Revenue & Growth Trajectory
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed pl-5">
                Monthly operating revenue for <strong className="text-text font-bold">{companyName}</strong> is stable at <strong className="text-text font-bold">₹{monthlyRev.toLocaleString("en-IN")}</strong> with healthy top-quartile gross margins for {industryLabel}.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-colors space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">🛡️</span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  Capital Reserves & Buffer
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed pl-5">
                Net burn at <strong className="text-text font-bold">₹{burn.toLocaleString("en-IN")}</strong> against <strong className="text-text font-bold">₹{cash.toLocaleString("en-IN")}</strong> in bank reserves maintains a secure <strong className="text-emerald-400 font-bold">{runwayMonths} month</strong> runway buffer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.19, ease: [0.22, 1, 0.36, 1] }}
              className="p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">⚡</span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Strategic Directive (Immediate)
                </span>
              </div>
              <p className="text-xs text-text leading-relaxed pl-5 font-medium">
                Dilute top-client concentration below 25% by advancing secondary deal pipelines within the next 60 days.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-gold hover:brightness-110 font-semibold text-xs btn-tactile cursor-pointer group"
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
