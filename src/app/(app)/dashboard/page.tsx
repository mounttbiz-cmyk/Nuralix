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
  X,
  UploadCloud,
} from "lucide-react";
import { Suspense } from "react";
import { DailyCheckInModal } from "@/components/checkin/DailyCheckInModal";
import { UploadDataModal } from "@/components/upload/UploadDataModal";
import { QuickBusinessInputModal } from "@/components/intake/QuickBusinessInputModal";
import { useBusinessDataSync } from "@/lib/upload/events";
import { Clock, Send, Radio } from "lucide-react";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedIndustry, setSelectedIndustry] = useState<TenantContext["industry"]>("saas");
  const [selectedModel, setSelectedModel] = useState<TenantContext["businessModel"]>("subscription");
  const [companyName, setCompanyName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const p = localStorage.getItem("bizzpal_business_profile");
        if (p) {
          const parsed = JSON.parse(p);
          if (parsed.name) return parsed.name;
        }
      } catch {}
    }
    return "BizzPal Enterprise";
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState("Live Today");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [liquidRunwayMo, setLiquidRunwayMo] = useState("8.0");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isQuickInputModalOpen, setIsQuickInputModalOpen] = useState(false);

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

  // Close daily check-in modal on Escape
  useEscapeKey(() => setIsCheckInModalOpen(false), isCheckInModalOpen);

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

  const [featureFlags, setFeatureFlags] = useState({
    enableDailyCheckin: true,
  });

  const hasLoadedBackendWidgetsRef = React.useRef(false);

  useEffect(() => {
    let mounted = true;
    refreshCheckinStatus();

    const fetchConfig = () => {
      // Instant client-side hydration from Superadmin edits in localStorage
      if (typeof window !== "undefined") {
        try {
          const cachedFeatures = localStorage.getItem("bizzpal_dashboard_features");
          if (cachedFeatures) {
            setFeatureFlags(JSON.parse(cachedFeatures));
          }
          const cachedWidgets = localStorage.getItem("bizzpal_dashboard_widgets");
          if (cachedWidgets) {
            const wList = JSON.parse(cachedWidgets);
            if (Array.isArray(wList) && wList.length > 0) {
              hasLoadedBackendWidgetsRef.current = true;
              const disabledIds = new Set(
                wList.filter((w: any) => w.enabled === false).map((w: any) => w.id)
              );
              const savedLayout = localStorage.getItem(`bizzpal_layout_${selectedIndustry}`);
              if (savedLayout) {
                try {
                  const parsed = JSON.parse(savedLayout);
                  const existingIds = new Set(parsed.map((w: any) => w.id));
                  const missingDefaults = wList.filter((w: any) => !existingIds.has(w.id) && !disabledIds.has(w.id));
                  setActiveWidgets([...parsed.filter((w: any) => !disabledIds.has(w.id)), ...missingDefaults]);
                } catch {
                  setActiveWidgets(wList.filter((w: any) => w.enabled !== false));
                }
              } else {
                setActiveWidgets(wList.filter((w: any) => w.enabled !== false));
              }
            }
          }
        } catch {}
      }

      fetch("/api/public/config", { cache: "no-store" })
        .then(r => r.json())
        .then(d => {
          if (!mounted) return;
          if (d.success) {
            if (d.features) {
              setFeatureFlags(d.features);
            }
            if (Array.isArray(d.widgets) && d.widgets.length > 0) {
              hasLoadedBackendWidgetsRef.current = true;
              const disabledIds = new Set(
                d.widgets.filter((w: any) => w.enabled === false).map((w: any) => w.id)
              );
              const savedLayout = localStorage.getItem(`bizzpal_layout_${selectedIndustry}`);
              if (savedLayout) {
                try {
                  const parsed = JSON.parse(savedLayout);
                  const existingIds = new Set(parsed.map((w: any) => w.id));
                  const missingDefaults = d.widgets.filter((w: any) => !existingIds.has(w.id) && !disabledIds.has(w.id));
                  setActiveWidgets([...parsed.filter((w: any) => !disabledIds.has(w.id)), ...missingDefaults]);
                } catch {
                  setActiveWidgets(d.widgets.filter((w: any) => w.enabled !== false));
                }
              } else {
                setActiveWidgets(d.widgets.filter((w: any) => w.enabled !== false));
              }
            }
          }
        })
        .catch(() => {});
    };

    fetchConfig();

    window.addEventListener("bizzpal_config_updated", fetchConfig);
    window.addEventListener("storage", fetchConfig);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("bizzpal_channel");
      bc.onmessage = () => fetchConfig();
    } catch {}

    return () => {
      mounted = false;
      window.removeEventListener("bizzpal_config_updated", fetchConfig);
      window.removeEventListener("storage", fetchConfig);
      if (bc) bc.close();
    };
  }, [selectedIndustry]);

  const applyProfileData = (saved: any) => {
    if (!saved) return;
    if (saved.industry) setSelectedIndustry(saved.industry);
    if (saved.name) setCompanyName(saved.name);
    if (saved.isUploadedData && saved.sourceFileName) {
      setUploadedFileName(saved.sourceFileName);
    } else {
      setUploadedFileName(null);
    }
    const cash = Number(saved.cash || saved.cashOnHand || 0);
    const burn = Number(saved.burn || saved.monthlyBurn || saved.monthlyNetBurn || 0);
    if (burn > 0) {
      setLiquidRunwayMo((cash / burn).toFixed(1));
    } else if (cash > 0) {
      setLiquidRunwayMo("18+");
    } else {
      setLiquidRunwayMo("0.0");
    }
  };

  // Read saved business profile if available from localStorage or backend SQLite database
  useEffect(() => {
    try {
      const savedProfileStr = localStorage.getItem("bizzpal_business_profile");
      if (savedProfileStr) {
        applyProfileData(JSON.parse(savedProfileStr));
      } else {
        // Fetch real enterprise record from database API
        fetch("/api/business/intake")
          .then(r => r.json())
          .then(d => {
            if (d.success && d.business) {
              applyProfileData(d.business);
              localStorage.setItem("bizzpal_business_profile", JSON.stringify(d.business));
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useBusinessDataSync(metrics => {
    applyProfileData(metrics);
  });

  // Base dynamic config from registry
  const baseConfig = resolveTenantConfig({
    industry: selectedIndustry,
    businessModel: selectedModel,
    plan: "growth",
  });

  // User's custom layout state (allowing user to customize the website dashboard)
  const [isEditingLayout, setIsEditingLayout] = useState(false);

  useEffect(() => {
    if (searchParams.get("customize") === "true") {
      setIsEditingLayout(true);
    }
    if (searchParams.get("quickInput") === "true") {
      setIsQuickInputModalOpen(true);
    }
  }, [searchParams]);
  const [activeWidgets, setActiveWidgets] = useState<WidgetDef[]>(baseConfig.widgets);
  const [toast, setToast] = useState<string | null>(null);

  // Load custom layout overrides from storage ONLY if customized and no backend widgets loaded yet
  useEffect(() => {
    if (hasLoadedBackendWidgetsRef.current) return;
    try {
      const savedLayout = localStorage.getItem(`bizzpal_layout_${selectedIndustry}`);
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
    localStorage.setItem(`bizzpal_layout_${selectedIndustry}`, JSON.stringify(activeWidgets));
    setIsEditingLayout(false);
    notify("Custom Dashboard Layout Saved!");
  };

  // Reset to default layout
  const handleResetLayout = () => {
    localStorage.removeItem(`bizzpal_layout_${selectedIndustry}`);
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
      {featureFlags.enableDailyCheckin !== false && (
        <div className="p-4 sm:p-5 rounded-2xl border border-line bg-surface shadow-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-amber-500/[0.04] to-transparent pointer-events-none" />
          <div className="flex items-start gap-3.5 relative z-10">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                checkinData.isCompletedToday
                  ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                  : "bg-gold/15 text-gold"
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
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                    checkinData.isCompletedToday
                      ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                      : "bg-gold/15 text-gold"
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
            className={`px-4 py-2 rounded-xl text-xs font-semibold btn-tactile inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer relative z-10 ${
              checkinData.isCompletedToday
                ? "bg-surface-2 text-text hover:bg-surface-2/80 border border-line"
                : "btn-gold-gradient font-bold shadow-md hover:brightness-105 active:scale-[0.98]"
            }`}
          >
            <span>{checkinData.isCompletedToday ? "Review / Update Check-In" : "Complete 60s Check-In →"}</span>
          </button>
        </div>
      )}

      {/* Top Header & Executive Command Center */}
      <div className="p-6 sm:p-7 space-y-6 rounded-3xl bg-surface border border-line shadow-theme relative overflow-hidden">
        {/* Live Status Beacon & Timeframe Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line relative z-10">
          <div className="inline-flex items-center gap-2.5 text-xs text-text-muted">
            <span className="beacon-dot" />
            <span className="font-semibold text-text">Autonomous Intelligence Engine</span>
            <span className="text-text-muted/40">•</span>
            {uploadedFileName ? (
              <>
                <span className="text-jade font-semibold">Custom Telemetry Synced</span>
                <span className="text-text-muted/40">•</span>
                <span className="text-text font-mono text-[11px]">{uploadedFileName}</span>
              </>
            ) : (
              <span className="text-text-muted font-medium font-mono text-[11px]">Telemetry Synced Live</span>
            )}
            <span className="text-text-muted/40">•</span>
            <span className="font-mono text-[11px] text-text-muted">v{baseConfig.version} Registry</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl border border-line text-xs">
            {["Live Today", "7D Trend", "Month to Date", "Q3 Live"].map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setSelectedTimeframe(tf);
                  notify(`Timeframe changed to ${tf}`);
                }}
                className={`px-3 py-1 rounded-lg text-xs transition-all btn-tactile cursor-pointer ${
                  selectedTimeframe === tf
                    ? "bg-surface text-text border border-line font-bold shadow-xs"
                    : "text-text-muted hover:text-text hover:bg-surface/50"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Main Title, Profile Switcher & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight font-sans">
                {companyName}
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-2 text-text-muted border border-line font-semibold font-mono tracking-normal">
                {selectedIndustry.toUpperCase()} · Growth Plan
              </span>
              {uploadedFileName && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-jade/10 text-jade font-mono font-semibold inline-flex items-center gap-1.5 border border-jade/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-jade" />
                  Uploaded Data Active
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-2xl leading-relaxed">
              Real-time enterprise dashboard synthesized by BizzPal AI. Cross-correlating cash reserves, unit economics, and operational playbooks.
            </p>
          </div>

          {/* Action Controls: Upload Business Data + Profile Selector + Customize Layout */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Quick Business Input Button */}
            <button
              type="button"
              onClick={() => setIsQuickInputModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all btn-tactile cursor-pointer btn-gold-gradient hover:brightness-105 shadow-md active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Quick Business Input</span>
            </button>

            {/* Upload Business Data Button */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all btn-tactile cursor-pointer bg-surface-2 hover:bg-surface border border-line text-text"
            >
              <UploadCloud className="w-3.5 h-3.5 text-text-muted" />
              <span>Upload Business Data</span>
              {uploadedFileName && (
                <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" title="Custom dataset active" />
              )}
            </button>

            {/* Profile Switcher */}
            <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl border border-line">
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
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all btn-tactile ${
                      isActive
                        ? "bg-surface text-text font-bold shadow-xs border border-line"
                        : "text-text-muted hover:text-text hover:bg-surface/50"
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
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all btn-tactile cursor-pointer ${
                isEditingLayout
                  ? "btn-gold-gradient font-bold shadow-md"
                  : "bg-surface-2 hover:bg-surface border border-line text-text-muted hover:text-text"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditingLayout ? "Exit Layout Editor" : "Customize Layout"}</span>
            </button>
          </div>
        </div>

        {/* Quick-Glance Executive KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
          <Link
            href="/analytics"
            className="p-4 rounded-2xl bg-surface-2/70 hover:bg-surface-2 border border-line flex items-center justify-between transition-all duration-200 group cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block group-hover:text-text transition-colors">Overall Health</span>
              <span className="text-lg font-bold text-text font-mono mt-0.5 block">82 / 100</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-semibold font-mono border border-emerald-500/20">
              Optimal
            </span>
          </Link>

          <Link
            href="/simulator"
            className="p-4 rounded-2xl bg-surface-2/70 hover:bg-surface-2 border border-line flex items-center justify-between transition-all duration-200 group cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block group-hover:text-text transition-colors">Liquid Runway</span>
              <span className="text-lg font-bold text-text font-mono mt-0.5 block">{liquidRunwayMo} mo</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-2 text-text-muted font-semibold font-mono border border-line">
              {Number(liquidRunwayMo) >= 6 ? "Safe Zone" : "Caution"}
            </span>
          </Link>

          <Link
            href="/tasks"
            className="p-4 rounded-2xl bg-surface-2/70 hover:bg-surface-2 border border-line flex items-center justify-between transition-all duration-200 group cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block group-hover:text-text transition-colors">Execution Queue</span>
              <span className="text-lg font-bold text-text font-mono mt-0.5 block">3 Active</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-2 text-text-muted font-semibold font-mono border border-line">
              On Schedule
            </span>
          </Link>

          <Link
            href="/gaps"
            className="p-4 rounded-2xl bg-surface-2/70 hover:bg-surface-2 border border-line flex items-center justify-between transition-all duration-200 group cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block group-hover:text-text transition-colors">Bottleneck Gaps</span>
              <span className="text-lg font-bold text-text font-mono mt-0.5 block">3 Flagged</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-2 text-text-muted font-semibold font-mono border border-line">
              Action Ready
            </span>
          </Link>
        </div>
      </div>

      {/* Interactive Dashboard Customization Panel */}
      {isEditingLayout && (
        <div className="p-5 rounded-2xl border border-gold/40 bg-surface/95 backdrop-blur-xl shadow-2xl shadow-[0_16px_40px_-10px_var(--gold-glow)] space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-line/60">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gold" />
                <h2 className="text-xs font-bold text-text uppercase tracking-wider font-sans">
                  Customize Executive Layout
                </h2>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Toggle widget visibility, adjust grid column spans, or reset to optimal preset.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleResetLayout} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Reset Preset
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleSaveLayout} icon={<Save className="w-3.5 h-3.5" />}>
                Save Layout
              </Button>
            </div>
          </div>

          {/* Widget customization pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeWidgets.map(widget => (
              <div
                key={widget.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  widget.enabled
                    ? "bg-surface-2/80 border-gold/40 shadow-xs"
                    : "bg-surface-2/20 border-line opacity-50"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      widget.enabled ? "text-gold bg-gold/15 hover:text-rust" : "text-text-muted hover:text-gold"
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
                            ? "bg-gold text-[#1a1206] font-bold shadow-xs"
                            : "bg-surface border border-line text-text-muted hover:text-text"
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

      {/* Dynamic Dashboard Grid (Masonry-style dense packing) */}
      <div className="pt-4 mt-2">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Layers className="w-4 h-4 text-gold" />
          <h2 className="text-xs font-bold text-text uppercase tracking-wider font-sans">
            Executive Operations & Active Tooling
          </h2>
        </div>
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-max grid-flow-row-dense"
        >
          {activeWidgets
            .filter(w => w.enabled)
            .map((widget, index) => (
              <motion.div
                key={widget.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="contents"
              >
                <RenderWidget widget={widget} />
              </motion.div>
            ))}
        </motion.div>
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

      {/* Business Data Upload Modal */}
      <UploadDataModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(metrics) => {
          notify(`Business Data applied: ${metrics.name || companyName}! Telemetry synchronized.`);
        }}
      />

      {/* Quick Business Input Modal */}
      <QuickBusinessInputModal
        isOpen={isQuickInputModalOpen}
        onClose={() => setIsQuickInputModalOpen(false)}
        onSuccess={() => {
          notify(`Daily Business Input recorded! Live metrics updated.`);
        }}
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
