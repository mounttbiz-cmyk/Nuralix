"use client";

import React, { useState, useEffect } from "react";
import { resolveTenantConfig, TenantContext } from "@/config/resolver";
import { RenderWidget } from "@/components/widgets/WidgetRegistry";
import { WidgetDef } from "@/config/schemas/widget";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Sliders,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Save,
  CheckCircle2,
  X
} from "lucide-react";
import { Suspense } from "react";
import { DailyCheckInModal } from "@/components/checkin/DailyCheckInModal";
import { Clock, Send, Radio } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedIndustry, setSelectedIndustry] = useState<TenantContext["industry"]>("saas");
  const [selectedModel, setSelectedModel] = useState<TenantContext["businessModel"]>("subscription");
  const [companyName, setCompanyName] = useState("Apex Analytics");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Live Today");

  // Daily Check-In State
  const [checkinData, setCheckinData] = useState<{
    isCompletedToday: boolean;
    todayCheckin: any;
    questionRules: { skipRevenue: boolean; skipTech: boolean };
    questions: any[];
  }>({
    isCompletedToday: false,
    todayCheckin: null,
    questionRules: { skipRevenue: false, skipTech: false },
    questions: [],
  });
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Fetch Check-In Status
  const refreshCheckinStatus = async () => {
    try {
      const res = await fetch("/api/checkin");
      const data = await res.json();
      if (data.success) {
        setCheckinData({
          isCompletedToday: Boolean(data.isCompletedToday),
          todayCheckin: data.todayCheckin,
          questionRules: data.questionRules || { skipRevenue: false, skipTech: false },
          questions: data.questions || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch checkin status", err);
    }
  };

  useEffect(() => {
    refreshCheckinStatus();
  }, []);

  // Read saved business profile if available
  useEffect(() => {
    try {
      const savedProfileStr = localStorage.getItem("nuralix_business_profile");
      if (savedProfileStr) {
        const saved = JSON.parse(savedProfileStr);
        if (saved.industry) setSelectedIndustry(saved.industry);
        if (saved.name) setCompanyName(saved.name);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Base dynamic config from registry
  const baseConfig = resolveTenantConfig({
    industry: selectedIndustry,
    businessModel: selectedModel,
    plan: "growth",
  });

  // User's custom layout state (allowing user to customize the website dashboard)
  const [isEditingLayout, setIsEditingLayout] = useState(false);

  // Sync customize parameter from URL (e.g. side panel Customize Dashboard button)
  useEffect(() => {
    if (searchParams.get("customize") === "true") {
      setIsEditingLayout(true);
    }
  }, [searchParams]);
  const [activeWidgets, setActiveWidgets] = useState<WidgetDef[]>(baseConfig.widgets);
  const [toast, setToast] = useState<string | null>(null);

  // Load custom layout overrides from storage
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem(`nuralix_layout_${selectedIndustry}`);
      if (savedLayout) {
        setActiveWidgets(JSON.parse(savedLayout));
      } else {
        setActiveWidgets(baseConfig.widgets);
      }
    } catch (e) {
      setActiveWidgets(baseConfig.widgets);
    }
  }, [selectedIndustry, baseConfig.version]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (id: string) => {
    setActiveWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  // Change widget span
  const changeWidgetSpan = (id: string, span: 1 | 2 | 3 | 4) => {
    setActiveWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, defaultSpan: span } : w))
    );
  };

  // Save layout
  const handleSaveLayout = () => {
    localStorage.setItem(`nuralix_layout_${selectedIndustry}`, JSON.stringify(activeWidgets));
    setIsEditingLayout(false);
    notify("Custom Dashboard Layout Saved!");
  };

  // Reset to default layout
  const handleResetLayout = () => {
    localStorage.removeItem(`nuralix_layout_${selectedIndustry}`);
    setActiveWidgets(baseConfig.widgets);
    setIsEditingLayout(false);
    notify("Restored default dashboard layout");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-surface border border-jade shadow-2xl text-xs font-semibold text-jade flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-jade" />
          <span>{toast}</span>
        </div>
      )}

      {/* Daily Executive Check-in Banner / Status */}
      <div className="p-4 sm:p-5 rounded-2xl border border-line bg-surface shadow-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
              checkinData.isCompletedToday
                ? "bg-jade/10 border-jade/30 text-jade"
                : "bg-amber-500/10 border-amber-500/30 text-amber-500"
            }`}
          >
            {checkinData.isCompletedToday ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">
                {checkinData.isCompletedToday
                  ? "Today's Executive Check-In Completed"
                  : "Daily Executive Pulse Check Pending"}
              </span>
              <span
                className={`text-[9px] px-2 py-0.2 rounded-full font-bold uppercase border ${
                  checkinData.isCompletedToday
                    ? "bg-jade/10 border-jade/30 text-jade"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                }`}
              >
                {checkinData.isCompletedToday ? `● Synced (${checkinData.todayCheckin?.source || "web"})` : "⚡ 60s Required"}
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
              {checkinData.isCompletedToday
                ? "Executive agents (Astra, Marcus, Elena) are calibrated with today's operational telemetry."
                : "Continuous data collection mode is active. Give your AI executive team today's quick 60-second update."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCheckInModalOpen(true)}
          className={`px-4 py-2 rounded-xl text-xs font-bold btn-tactile inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer ${
            checkinData.isCompletedToday
              ? "bg-surface-2 border border-line text-text hover:border-line-strong"
              : "bg-brass text-white shadow-md hover:brightness-110"
          }`}
        >
          <span>{checkinData.isCompletedToday ? "Review / Update Check-In" : "Complete 60s Check-In →"}</span>
        </button>
      </div>

      {/* Top Header & Executive Command Center */}
      <div className="glass-card hairline-accent p-5 sm:p-6 space-y-4">
        {/* Live Status Beacon & Timeframe Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-2/70 border border-line text-[11px]">
            <span className="beacon-dot" />
            <span className="font-semibold text-text">Autonomous Intelligence Engine</span>
            <span className="text-line-strong">|</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">Telemetry Synced Live</span>
            <span className="text-line-strong">|</span>
            <span className="font-mono text-[10px] text-text-muted">v{baseConfig.version} Registry</span>
          </div>

          <div className="flex items-center gap-1.5 p-0.5 bg-surface-2/60 rounded-xl border border-line text-xs">
            {["Live Today", "7D Trend", "Month to Date", "Q3 Live"].map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setSelectedTimeframe(tf);
                  notify(`Timeframe changed to ${tf}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all btn-tactile cursor-pointer ${
                  selectedTimeframe === tf
                    ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shadow-xs"
                    : "text-text-muted hover:text-text hover:bg-surface"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Main Title, Profile Switcher & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                {companyName}
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-semibold font-mono tracking-normal">
                {selectedIndustry.toUpperCase()} · Growth Plan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl">
              Real-time enterprise dashboard synthesized by Nuralix AI. Cross-correlating cash reserves, unit economics, and operational playbooks.
            </p>
          </div>

          {/* Action Controls: Profile Selector + Customize Dashboard Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Profile Switcher */}
            <div className="flex items-center gap-1 p-1 bg-surface-2/70 rounded-xl border border-line">
              {[
                { ind: "saas", mod: "subscription", label: "B2B SaaS" },
                { ind: "d2c", mod: "one-time", label: "D2C Brand" },
                { ind: "agency", mod: "retainer", label: "Agency" },
              ].map(profile => {
                const isActive = selectedIndustry === profile.ind;
                return (
                  <button
                    key={profile.ind}
                    type="button"
                    onClick={() => {
                      setSelectedIndustry(profile.ind as any);
                      setSelectedModel(profile.mod as any);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all btn-tactile ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 shadow-sm border border-cyan-500/30 font-semibold"
                        : "text-text-muted hover:text-text hover:bg-surface"
                    }`}
                  >
                    {profile.label}
                  </button>
                );
              })}
            </div>

            {/* Customize Dashboard Button */}
            <button
              type="button"
              onClick={() => setIsEditingLayout(!isEditingLayout)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all btn-tactile cursor-pointer ${
                isEditingLayout
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25 font-bold"
                  : "bg-surface-2/80 border-line text-text hover:bg-surface-2 hover:border-line-strong"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>{isEditingLayout ? "Exit Layout Editor" : "Customize Layout"}</span>
            </button>
          </div>
        </div>

        {/* Quick-Glance Executive KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <Link
            href="/analytics"
            className="p-3 rounded-xl bg-surface-2/40 border border-line hover:border-cyan-500/40 hover:bg-surface-2/70 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Overall Health</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">82 / 100</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-jade/15 text-jade font-semibold font-mono border border-jade/30">
              Optimal
            </span>
          </Link>

          <Link
            href="/simulator"
            className="p-3 rounded-xl bg-surface-2/40 border border-line hover:border-cyan-500/40 hover:bg-surface-2/70 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Liquid Runway</span>
              <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">8.0 mo</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold font-mono border border-cyan-500/30">
              Safe Zone
            </span>
          </Link>

          <Link
            href="/tasks"
            className="p-3 rounded-xl bg-surface-2/40 border border-line hover:border-cyan-500/40 hover:bg-surface-2/70 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Execution Queue</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">3 Active</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 font-semibold font-mono border border-violet-500/30">
              On Schedule
            </span>
          </Link>

          <Link
            href="/gaps"
            className="p-3 rounded-xl bg-surface-2/40 border border-line hover:border-cyan-500/40 hover:bg-surface-2/70 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Bottleneck Gaps</span>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">3 Flagged</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold font-mono border border-amber-500/30">
              Action Ready
            </span>
          </Link>
        </div>
      </div>

      {/* Interactive Dashboard Customization Panel */}
      {isEditingLayout && (
        <div className="p-5 rounded-2xl border border-cyan-500/40 bg-surface/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  Customize Executive Layout
                </h2>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Toggle widget visibility, adjust grid column spans, or reset to optimal preset.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetLayout}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/[0.08] text-text-muted hover:text-text hover:bg-surface-2 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Preset</span>
              </button>

              <button
                type="button"
                onClick={handleSaveLayout}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 flex items-center gap-1.5 btn-tactile"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Layout</span>
              </button>
            </div>
          </div>

          {/* Widget customization pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeWidgets.map(widget => (
              <div
                key={widget.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  widget.enabled
                    ? "bg-surface-2/80 border-cyan-500/40 shadow-xs"
                    : "bg-surface-2/20 border-white/[0.06] opacity-50"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      widget.enabled ? "text-cyan-400 bg-cyan-500/15 hover:text-rust" : "text-text-muted hover:text-cyan-400"
                    }`}
                    title={widget.enabled ? "Hide from dashboard" : "Show on dashboard"}
                  >
                    {widget.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <span className="font-semibold text-text truncate">{widget.title}</span>
                </div>

                {widget.enabled && (
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-text-muted font-mono mr-1">Span:</span>
                    {([2, 4] as const).map(span => (
                      <button
                        key={span}
                        type="button"
                        onClick={() => changeWidgetSpan(widget.id, span)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-mono font-semibold transition-all ${
                          widget.defaultSpan === span
                            ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                            : "bg-surface border border-white/[0.08] text-text-muted hover:text-text"
                        }`}
                      >
                        {span === 4 ? "Full" : "Half"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic 4-column Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {activeWidgets
          .filter(w => w.enabled)
          .map(widget => (
            <RenderWidget key={widget.id} widget={widget} />
          ))}
      </div>

      {/* Daily Check-In Modal */}
      <DailyCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onCompleted={() => {
          refreshCheckinStatus();
          setToast("Daily Executive Check-In recorded! Telemetry synchronized.");
          setTimeout(() => setToast(null), 4000);
        }}
        questionRules={checkinData.questionRules}
        questions={checkinData.questions}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
