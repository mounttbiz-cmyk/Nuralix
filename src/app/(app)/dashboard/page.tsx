"use client";

import React, { useState, useEffect } from "react";
import { resolveTenantConfig, TenantContext } from "@/config/resolver";
import { RenderWidget } from "@/components/widgets/WidgetRegistry";
import { WidgetDef } from "@/config/schemas/widget";
import { useSearchParams } from "next/navigation";
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedIndustry, setSelectedIndustry] = useState<TenantContext["industry"]>("saas");
  const [selectedModel, setSelectedModel] = useState<TenantContext["businessModel"]>("subscription");
  const [companyName, setCompanyName] = useState("Apex Analytics");

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

      {/* Top Header & Tenant Profile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-line bg-surface shadow-theme">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brass-soft flex items-center justify-center text-brass">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text font-sans">{companyName} Dashboard</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-text-muted border border-line font-mono font-semibold">
                v{baseConfig.version} Registry
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Widgets and telemetry configured for {selectedIndustry.toUpperCase()} growth stage.
            </p>
          </div>
        </div>

        {/* Action Controls: Profile Selector + Customize Dashboard Button */}
        <div className="flex items-center gap-2 flex-wrap">
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
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all btn-tactile ${
                    isActive
                      ? "bg-surface text-text shadow-sm border border-line font-bold"
                      : "text-text-muted hover:text-text"
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
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all btn-tactile ${
              isEditingLayout
                ? "bg-brass text-white border-brass shadow-md font-bold"
                : "bg-surface border-line text-text hover:bg-surface-2"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEditingLayout ? "Editing Dashboard…" : "Customize Dashboard"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Dashboard Customization Panel */}
      {isEditingLayout && (
        <div className="p-5 rounded-2xl border-2 border-brass/50 bg-surface shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brass" />
                <h2 className="text-xs font-bold text-text uppercase tracking-wider font-sans">
                  Customize Your Dashboard
                </h2>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Toggle cards, change column widths, and personalize your executive view.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetLayout}
                className="px-3 py-1 text-xs font-semibold rounded-lg border border-line text-text-muted hover:text-text hover:bg-surface-2 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={handleSaveLayout}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-brass text-white shadow-md hover:brightness-110 flex items-center gap-1.5 btn-tactile"
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
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  widget.enabled
                    ? "bg-surface-2/70 border-brass/40"
                    : "bg-surface-2/20 border-line opacity-60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`p-1 rounded-md transition-colors ${
                      widget.enabled ? "text-brass hover:text-rust" : "text-text-muted hover:text-brass"
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
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold transition-all ${
                          widget.defaultSpan === span
                            ? "bg-brass text-white"
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

      {/* Dynamic 4-column Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {activeWidgets
          .filter(w => w.enabled)
          .map(widget => (
            <RenderWidget key={widget.id} widget={widget} />
          ))}
      </div>
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
