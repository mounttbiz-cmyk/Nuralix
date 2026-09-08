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
      <div className="flex flex-col h-full justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                  Priority Gaps & Bottlenecks
                </h2>
                <span className="text-[10px] text-text-muted">
                  AI diagnostic engine continuous watch
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rust/15 text-rust font-semibold font-mono border border-rust/30">
              3 Identified
            </span>
          </div>

          <div className="space-y-2.5 pt-3">
            {topGaps.map(gap => (
              <div
                key={gap.id}
                className="p-3 rounded-xl bg-surface-2/40 border border-line hover:border-line-strong hover:bg-surface-2/70 transition-all space-y-1.5 group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <span className="text-xs font-semibold text-text leading-snug group-hover:text-brass transition-colors">
                    {gap.title}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase font-mono tracking-wide shrink-0 ${
                      gap.severity === "critical"
                        ? "bg-rust/20 text-rust border border-rust/30"
                        : "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {gap.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <span className="font-mono text-text font-medium">{gap.impact}</span>
                  <span className="text-line-strong">·</span>
                  <span className="px-1.5 py-0.2 rounded bg-surface border border-line text-[10px] capitalize font-medium">
                    {gap.effort}
                  </span>
                  <span className="text-line-strong">·</span>
                  <span className="text-cyan-600 dark:text-cyan-400 text-[10px] font-medium">{gap.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.08]">
          <Link
            href="/gaps"
            className="flex items-center justify-between text-xs text-cyan-400 hover:text-cyan-300 font-semibold btn-tactile group"
          >
            <span>Open Gap Register & Solutions Playbooks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </ContainerTile>
  );
}
