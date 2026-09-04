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
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brass" />
              <h2 className="text-xs font-semibold text-text uppercase tracking-wider">
                Today's Executive Briefing
              </h2>
            </div>
            <span className="text-[10px] text-text-muted font-medium">
              Signed by {ceoName} (CEO AI)
            </span>
          </div>

          {/* Document Surface Serif Prose */}
          <div className="surface-document py-4 space-y-2.5 text-xs sm:text-sm text-text">
            {briefingLines.map((line, idx) => (
              <p
                key={idx}
                className={`leading-relaxed ${
                  idx === briefingLines.length - 1
                    ? "font-semibold text-brass pt-1 border-t border-line/60"
                    : "text-text"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
          <Link
            href="/gaps"
            className="inline-flex items-center gap-1.5 text-brass hover:underline font-medium text-xs btn-tactile cursor-pointer"
          >
            <span>Review active gap playbooks</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href="/simulator"
            className="text-text-muted hover:text-text text-xs cursor-pointer"
          >
            Open Simulator
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
