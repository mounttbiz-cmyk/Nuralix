"use client";

import React, { useState } from "react";
import { defaultGapRules } from "@/config/seeds/defaultRules";
import { AlertTriangle, CheckCircle2, Play, MessageSquare, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";
import Link from "next/link";

export default function GapsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeGapId, setActiveGapId] = useState<string>(defaultGapRules[0].id);

  const activeGap = defaultGapRules.find(g => g.id === activeGapId) || defaultGapRules[0];

  const filteredRules = selectedCategory === "all"
    ? defaultGapRules
    : defaultGapRules.filter(r => r.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rust" />
            <h1 className="text-lg font-bold text-text">Gap & Solution Register</h1>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Deterministic rules + AI scanning. Concrete operational bottlenecks with step-by-step playbooks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["all", "financial", "risk", "marketing", "operations"].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize border transition-all btn-tactile ${
                selectedCategory === cat
                  ? "bg-brass text-white border-brass font-semibold"
                  : "bg-surface-2 border-line text-text-muted hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Pane Register Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Gaps (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
            Detected Gaps ({filteredRules.length})
          </div>

          <div className="space-y-2">
            {filteredRules.map(gap => {
              const isActive = gap.id === activeGap.id;
              return (
                <div
                  key={gap.id}
                  onClick={() => setActiveGapId(gap.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer btn-tactile ${
                    isActive
                      ? "bg-surface border-brass shadow-theme ring-1 ring-brass/20"
                      : "bg-surface-2/60 border-line hover:border-line-strong"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-text leading-snug">
                      {gap.title}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                        gap.severity === "critical"
                          ? "bg-rust/15 text-rust border border-rust/30"
                          : "bg-amber/15 text-amber border border-amber/30"
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-text-muted mt-2">
                    <span className="text-brass font-medium">{gap.category}</span>
                    <span>·</span>
                    <span className="capitalize">{gap.effort}</span>
                    <span>·</span>
                    <span>3 tasks mapped</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-line bg-surface p-5 sm:p-6 shadow-theme space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brass-soft text-brass">
                {activeGap.category}
              </span>
              <ProvenanceBadge type="from_data" />
            </div>
            <span className="text-xs text-text-muted font-medium capitalize">
              Effort: {activeGap.effort}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-text">{activeGap.title}</h2>
            <div className="mt-3 p-3 rounded-lg bg-surface-2 border border-line text-xs font-mono text-text">
              <strong>Evidence:</strong> {activeGap.evidenceTemplate}
            </div>
          </div>

          {/* Why It Matters on Serif Surface (§9.3) */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-brass uppercase tracking-wider">
              Strategic Implication
            </span>
            <p className="surface-document text-xs sm:text-sm text-text leading-relaxed">
              {activeGap.whyItMatters}
            </p>
          </div>

          {/* Solution Playbook */}
          <div className="space-y-3 pt-3 border-t border-line">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Action Playbook
              </span>
              <span className="text-xs text-jade font-semibold">
                Target: {activeGap.solutionPlaybook.successMetric}
              </span>
            </div>

            <p className="text-xs text-text-muted">
              {activeGap.solutionPlaybook.summary}
            </p>

            <div className="space-y-2">
              {activeGap.solutionPlaybook.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-surface-2/60 border border-line flex items-start gap-3 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-brass/20 text-brass font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-text flex items-center justify-between">
                      <span>{step.title}</span>
                      <span className="text-[10px] text-text-muted font-mono">{step.days} days</span>
                    </div>
                    <p className="text-text-muted mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-line flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Link
                href="/tasks"
                className="px-3.5 py-1.5 rounded-lg bg-brass text-white text-xs font-semibold shadow-sm hover:brightness-110 btn-tactile inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Create Plan ({activeGap.solutionPlaybook.steps.length} Tasks)</span>
              </Link>
              <Link
                href="/simulator"
                className="px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-xs font-medium text-text hover:bg-surface btn-tactile inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-brass" />
                <span>Simulate Fix</span>
              </Link>
            </div>

            <Link
              href="/chat"
              className="text-xs text-brass hover:underline inline-flex items-center gap-1 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Executive AI</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
