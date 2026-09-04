"use client";

import React from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function GapsPreviewWidget() {
  const topGaps = [
    {
      id: "gap_1",
      title: "One customer represents 38% of total revenue",
      severity: "critical",
      category: "Risk",
      impact: "₹1,85,000/mo at risk",
      effort: "project",
    },
    {
      id: "gap_2",
      title: "CAC payback period exceeds 14 months (benchmark: 12)",
      severity: "high",
      category: "Growth",
      impact: "Trapping ₹2,40,000 working capital",
      effort: "quick win",
    },
    {
      id: "gap_3",
      title: "Founder is primary closer for 75% of sales deals",
      severity: "high",
      category: "Operations",
      impact: "Growth capped at founder bandwidth",
      effort: "quick win",
    },
  ];

  return (
    <ContainerTile span={2} id="widget_top_gaps">
      <div className="flex flex-col h-full justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-line">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rust" />
              <h2 className="text-xs font-semibold text-text uppercase tracking-wider">
                Priority Gaps & Bottlenecks
              </h2>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rust/15 text-rust font-semibold">
              3 Requiring Attention
            </span>
          </div>

          <div className="divide-y divide-line/60 pt-1">
            {topGaps.map(gap => (
              <div key={gap.id} className="py-2.5 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-text leading-snug">
                    {gap.title}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${
                      gap.severity === "critical"
                        ? "bg-rust/15 text-rust border border-rust/30"
                        : "bg-amber/15 text-amber border border-amber/30"
                    }`}
                  >
                    {gap.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                  <span>{gap.impact}</span>
                  <span>·</span>
                  <span className="capitalize">{gap.effort}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-line">
          <Link
            href="/gaps"
            className="flex items-center justify-between text-xs text-brass hover:underline font-medium btn-tactile"
          >
            <span>Open Gap Register & Solutions Playbooks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
