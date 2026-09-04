"use client";

import React, { useState } from "react";
import { platformConfigStore } from "@/config/store";
import { WidgetDef } from "@/config/schemas/widget";
import { MetricDef } from "@/config/schemas/metric";
import {
  Layers,
  Database,
  Sliders,
  CheckCircle2,
  AlertCircle,
  History,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Palette,
  Check,
  Sparkles,
  Save
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"widgets" | "metrics" | "theme" | "audit">("widgets");
  const [version, setVersion] = useState(platformConfigStore.getVersion());
  const [auditLogs, setAuditLogs] = useState(platformConfigStore.getAuditLogs());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable lists from registry store
  const [widgets, setWidgets] = useState<WidgetDef[]>([...platformConfigStore.getWidgets()]);
  const [metrics, setMetrics] = useState<MetricDef[]>([...platformConfigStore.getMetrics()]);

  // Modal / Form state for adding/editing a widget
  const [editingWidget, setEditingWidget] = useState<WidgetDef | null>(null);
  const [newWidgetTitle, setNewWidgetTitle] = useState("");
  const [newWidgetComponent, setNewWidgetComponent] = useState("KpiGridWidget");
  const [newWidgetSpan, setNewWidgetSpan] = useState<1 | 2 | 3 | 4>(2);
  const [newWidgetPriority, setNewWidgetPriority] = useState(80);

  // Notification helper
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save/Update Widget in Registry
  const handleSaveWidget = () => {
    if (!newWidgetTitle.trim()) return;

    const widgetToSave: WidgetDef = {
      id: editingWidget ? editingWidget.id : `widget_${Date.now()}`,
      title: newWidgetTitle,
      component: newWidgetComponent,
      defaultSpan: newWidgetSpan,
      priority: Number(newWidgetPriority),
      minContainerWidth: 300,
      requires: {},
      enabled: true,
    };

    platformConfigStore.updateWidget(widgetToSave);
    const updatedWidgets = [...platformConfigStore.getWidgets()];
    setWidgets(updatedWidgets);
    const newVer = platformConfigStore.publishDrafts(
      editingWidget ? `Updated widget "${newWidgetTitle}"` : `Added new widget "${newWidgetTitle}"`
    );
    setVersion(newVer);
    setAuditLogs([...platformConfigStore.getAuditLogs()]);
    setEditingWidget(null);
    setNewWidgetTitle("");
    notify(`Saved to Live Registry: ${widgetToSave.title} (v${newVer})`);
  };

  // Toggle Widget Enabled State
  const handleToggleWidget = (widget: WidgetDef) => {
    const updated = { ...widget, enabled: !widget.enabled };
    platformConfigStore.updateWidget(updated);
    setWidgets([...platformConfigStore.getWidgets()]);
    const newVer = platformConfigStore.publishDrafts(`Toggled widget "${widget.title}" (${updated.enabled ? "enabled" : "disabled"})`);
    setVersion(newVer);
    setAuditLogs([...platformConfigStore.getAuditLogs()]);
    notify(`Widget ${updated.title} is now ${updated.enabled ? "LIVE" : "HIDDEN"}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-surface border border-jade shadow-2xl text-xs font-semibold text-jade flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-jade" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Plane Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-xl border border-line bg-surface shadow-theme">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-text font-sans">
              Superadmin Control Plane (§15)
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brass/15 text-brass font-bold font-mono">
              v{version} Published
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Directly edit platform widgets, metrics, and configurations. Changes take effect on tenant dashboards instantly without a code deploy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingWidget(null);
              setNewWidgetTitle("");
              setNewWidgetComponent("KpiGridWidget");
              setNewWidgetSpan(2);
              setNewWidgetPriority(85);
            }}
            className="px-3.5 py-2 rounded-lg bg-brass text-white text-xs font-bold shadow-md hover:brightness-110 btn-tactile flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Widget</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: "widgets", label: "Dashboard Widgets Editor", count: widgets.length, icon: Layers },
          { id: "metrics", label: "KPI & Metric Registry", count: metrics.length, icon: Database },
          { id: "audit", label: "Append-Only Audit Log", count: auditLogs.length, icon: History },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all btn-tactile whitespace-nowrap ${
                isActive
                  ? "bg-surface-2 border-brass text-brass shadow-sm font-bold"
                  : "border-transparent text-text-muted hover:text-text hover:bg-surface-2/60"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-line text-text-muted font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WIDGETS EDITOR */}
      {activeTab === "widgets" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Widgets List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="text-xs font-bold text-text uppercase tracking-wider">
                  Configured Dashboard Widgets ({widgets.length})
                </span>
                <span className="text-[11px] text-text-muted">Click to toggle or edit</span>
              </div>

              <div className="divide-y divide-line/60">
                {widgets.map(w => (
                  <div key={w.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text truncate">{w.title}</span>
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-surface-2 border border-line text-brass font-mono">
                          {w.defaultSpan}/4 col span
                        </span>
                      </div>
                      <div className="text-[11px] text-text-muted font-mono mt-0.5">
                        Component: {w.component} · Priority: {w.priority}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleWidget(w)}
                        className={`text-[10px] px-2 py-1 rounded font-bold uppercase transition-all ${
                          w.enabled
                            ? "bg-jade/15 text-jade border border-jade/30"
                            : "bg-surface-2 text-text-muted border border-line"
                        }`}
                      >
                        {w.enabled ? "Active" : "Disabled"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingWidget(w);
                          setNewWidgetTitle(w.title);
                          setNewWidgetComponent(w.component);
                          setNewWidgetSpan(w.defaultSpan);
                          setNewWidgetPriority(w.priority);
                        }}
                        className="p-1.5 rounded text-text-muted hover:text-text hover:bg-surface-2"
                        title="Edit Widget Settings"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Widget Create / Edit Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="text-xs font-bold text-text uppercase tracking-wider">
                  {editingWidget ? `Edit: ${editingWidget.title}` : "Add New Widget"}
                </span>
                {editingWidget && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWidget(null);
                      setNewWidgetTitle("");
                    }}
                    className="text-[10px] text-text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-text block mb-1">Widget Display Title</label>
                  <input
                    type="text"
                    value={newWidgetTitle}
                    onChange={e => setNewWidgetTitle(e.target.value)}
                    placeholder="e.g. Sales Pipeline Velocity"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass"
                  />
                </div>

                <div>
                  <label className="font-semibold text-text block mb-1">Registered React Component</label>
                  <select
                    value={newWidgetComponent}
                    onChange={e => setNewWidgetComponent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass"
                  >
                    <option value="HealthScoreWidget">HealthScoreWidget (Gauge + Breakdown)</option>
                    <option value="BriefingWidget">BriefingWidget (Executive Serif Briefing)</option>
                    <option value="KpiGridWidget">KpiGridWidget (4-column Sparkline Tiles)</option>
                    <option value="GapsPreviewWidget">GapsPreviewWidget (Bottlenecks Register)</option>
                    <option value="TasksPreviewWidget">TasksPreviewWidget (Execution Queue)</option>
                    <option value="SimulatorHighlightWidget">SimulatorHighlightWidget (Monte Carlo Fan)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-text block mb-1">Default Column Span</label>
                    <select
                      value={newWidgetSpan}
                      onChange={e => setNewWidgetSpan(Number(e.target.value) as any)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass font-mono"
                    >
                      <option value={1}>1 Column (Compact)</option>
                      <option value={2}>2 Columns (Half Width)</option>
                      <option value={3}>3 Columns</option>
                      <option value={4}>4 Columns (Full Width)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-text block mb-1">Display Priority</label>
                    <input
                      type="number"
                      value={newWidgetPriority}
                      onChange={e => setNewWidgetPriority(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-line text-[11px] text-text-muted leading-relaxed">
                  Saving writes directly to the runtime registry and publishes version <strong>v{version + 1}</strong>. Targeted businesses will render this widget on next reload.
                </div>

                <button
                  type="button"
                  onClick={handleSaveWidget}
                  className="w-full py-2.5 rounded-lg bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingWidget ? "Publish Widget Updates" : "Publish New Widget to Registry"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: METRICS REGISTRY */}
      {activeTab === "metrics" && (
        <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <span className="text-xs font-bold text-text uppercase tracking-wider">
              Live Metric & KPI Registry (§15.3)
            </span>
            <span className="text-[11px] text-text-muted">Formulas, directions & industry benchmarks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.map(m => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-line bg-surface-2/60 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-text">{m.label}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-surface text-brass border border-line">
                      {m.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-text-muted font-mono">
                  <span>Key: {m.key}</span>
                  <span className={m.direction === "up_is_good" ? "text-jade font-semibold" : "text-rust font-semibold"}>
                    {m.direction === "up_is_good" ? "↑ Up is Good" : "↓ Down is Good"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {activeTab === "audit" && (
        <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-jade" />
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Append-Only Audit Log (§15.11)
              </span>
            </div>
            <span className="text-[11px] text-text-muted">Signed change history</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-surface-2/70 border border-line text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-brass font-bold">{log.actor}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-jade/10 text-jade uppercase font-semibold">
                      {log.action}
                    </span>
                  </div>
                  <span className="font-mono text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-semibold text-text">{log.note}</div>
                <div className="text-[10px] text-text-muted font-mono">
                  Entity: {log.entityType} ({log.entityId})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
