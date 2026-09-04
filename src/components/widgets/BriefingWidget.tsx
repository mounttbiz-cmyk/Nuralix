"use client";

import React from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BriefingWidgetProps {
  companyName?: string;
  ceoName?: string;
}

export function BriefingWidget({
  companyName = "Apex Analytics",
  ceoName = "Astra",
}: BriefingWidgetProps) {
  const briefingLines = [
    "Revenues climbed 6.4% over the last 30 days to reach $48,200 MRR, led by expansion in your mid-market accounts.",
    "However, cash burn rose by $1,800 due to annual tooling renewals, nudging runway down slightly to 7.2 months.",
    "Customer acquisition cost increased to $380, largely driven by ad saturation in your primary search channel.",
    "Your highest-priority decision today: Top client concentration sits at 38%. We recommend scheduling renewal negotiations or testing the price adjustment scenario.",
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

          {/* Document Surface Serif Prose (§3 & §8.3) */}
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
            className="inline-flex items-center gap-1.5 text-brass hover:underline font-medium text-xs btn-tactile"
          >
            <span>Review client concentration gap</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href="/simulator"
            className="text-text-muted hover:text-text text-xs"
          >
            Open Simulator
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
