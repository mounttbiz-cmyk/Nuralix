"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Compass,
  Sliders,
  Layers,
  Wrench,
  History,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  MessageSquare,
  Search,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { NavItem } from "@/config/schemas/nav";
import { WidgetDef } from "@/config/schemas/widget";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "website" | "navigation" | "features" | "widgets" | "tools" | "audit"
  >("website");
  const [subWebTab, setSubWebTab] = useState<
    "sections" | "hero" | "scenes" | "about_solutions" | "contact"
  >("sections");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState(1);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Platform dynamic configs
  const [websiteConfig, setWebsiteConfig] = useState<any>(null);
  const [featuresConfig, setFeaturesConfig] = useState<any>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [widgets, setWidgets] = useState<WidgetDef[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  // Navigation Modal State
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [editingNavItem, setEditingNavItem] = useState<NavItem | null>(null);
  const [navForm, setNavForm] = useState<{
    id: string;
    label: string;
    href: string;
    icon: string;
    order: number;
    badge: string;
    group: "core" | "intelligence" | "management" | "system";
    enabled: boolean;
  }>({
    id: "",
    label: "",
    href: "",
    icon: "LayoutDashboard",
    order: 1,
    badge: "",
    group: "core",
    enabled: true,
  });

  // Widget Modal State
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetDef | null>(null);
  const [widgetForm, setWidgetForm] = useState<{
    id: string;
    title: string;
    component: string;
    defaultSpan: 1 | 2 | 3 | 4;
    priority: number;
    enabled: boolean;
  }>({
    id: "",
    title: "",
    component: "KpiGridWidget",
    defaultSpan: 2,
    priority: 85,
    enabled: true,
  });

  // Tool Modal State
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<any | null>(null);
  const [toolForm, setToolForm] = useState<{
    id: string;
    name: string;
    category: "finance" | "sales" | "marketing" | "operations" | "strategy";
    description: string;
    requiredPlan: "Starter" | "Professional" | "Enterprise";
    badge: string;
    hasInteractiveCalculator: boolean;
    enabled: boolean;
  }>({
    id: "",
    name: "",
    category: "finance",
    description: "",
    requiredPlan: "Starter",
    badge: "Core",
    hasInteractiveCalculator: false,
    enabled: true,
  });

  // Close any open modal on Escape key
  const isAnyModalOpen = Boolean(isNavModalOpen || isWidgetModalOpen || isToolModalOpen);
  useEscapeKey(() => {
    setIsNavModalOpen(false);
    setIsWidgetModalOpen(false);
    setIsToolModalOpen(false);
  }, isAnyModalOpen);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch full configuration on mount
  const fetchAllConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      if (data.success && data.data) {
        setWebsiteConfig(data.data.website);
        setFeaturesConfig(data.data.features);
        setNavItems(data.data.nav || []);
        setWidgets(data.data.widgets || []);
        setTools(data.data.tools || []);
        setAuditLogs(data.data.auditLogs || []);
        setVersion(data.data.version || 1);
      }
    } catch (err) {
      console.error("Failed to load admin config", err);
      notify("Failed to connect to platform database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConfig();
  }, []);

  // Save specific section to database
  const saveSection = async (sectionName: string, payload: any, note?: string) => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionName,
          payload,
          note: note || `Updated ${sectionName} settings`,
          actor: "Superadmin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVersion(data.version);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        notify(data.message || `Saved ${sectionName} successfully (v${data.version})`);
      } else {
        notify(`Error: ${data.error}`);
      }
    } catch (err: any) {
      notify(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Factory Reset
  const handleFactoryReset = async () => {
    const ok = window.confirm(
      "Are you sure you want to restore all website and dashboard settings to default factory values? This cannot be undone."
    );
    if (!ok) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/config", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        notify("Platform restored to default factory settings");
        fetchAllConfig();
      }
    } catch (err: any) {
      notify(`Reset failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Navigation CRUD Handlers
  // -------------------------------------------------------------
  const handleOpenNavModal = (item?: NavItem) => {
    if (item) {
      setEditingNavItem(item);
      setNavForm({
        id: item.id,
        label: item.label,
        href: item.href,
        icon: item.icon,
        order: item.order,
        badge: item.badge || "",
        group: item.group || "core",
        enabled: item.enabled !== false,
      });
    } else {
      setEditingNavItem(null);
      setNavForm({
        id: `nav_custom_${Date.now()}`,
        label: "",
        href: "/new-feature",
        icon: "Compass",
        order: navItems.length + 1,
        badge: "NEW",
        group: "core",
        enabled: true,
      });
    }
    setIsNavModalOpen(true);
  };

  const handleSaveNavItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navForm.label.trim() || !navForm.href.trim()) return;

    let updatedList: NavItem[];
    if (editingNavItem) {
      updatedList = navItems.map((n) =>
        n.id === editingNavItem.id
          ? { ...n, ...navForm, order: Number(navForm.order) }
          : n
      );
    } else {
      const newItem: NavItem = {
        id: navForm.id,
        label: navForm.label,
        href: navForm.href,
        icon: navForm.icon,
        order: Number(navForm.order),
        badge: navForm.badge || undefined,
        group: navForm.group,
        enabled: navForm.enabled,
        mobileTab: false,
      };
      updatedList = [...navItems, newItem];
    }

    setNavItems(updatedList);
    setIsNavModalOpen(false);
    await saveSection(
      "nav",
      updatedList,
      editingNavItem ? `Updated nav item "${navForm.label}"` : `Added nav button "${navForm.label}"`
    );
  };

  const handleDeleteNavItem = async (id: string, label: string) => {
    if (!window.confirm(`Delete navigation button "${label}"?`)) return;
    const updatedList = navItems.filter((n) => n.id !== id);
    setNavItems(updatedList);
    await saveSection("nav", updatedList, `Removed nav button "${label}"`);
  };

  const handleToggleNavItem = async (item: NavItem) => {
    const updatedList = navItems.map((n) =>
      n.id === item.id ? { ...n, enabled: !n.enabled } : n
    );
    setNavItems(updatedList);
    await saveSection(
      "nav",
      updatedList,
      `Toggled nav "${item.label}" (${!item.enabled ? "enabled" : "disabled"})`
    );
  };

  // -------------------------------------------------------------
  // Feature Flags Toggle Handlers
  // -------------------------------------------------------------
  const handleToggleFeature = async (featureKey: string) => {
    if (!featuresConfig) return;
    const updated = {
      ...featuresConfig,
      [featureKey]: !featuresConfig[featureKey],
    };
    setFeaturesConfig(updated);
    await saveSection("features", updated, `Toggled feature flag "${featureKey}"`);
  };

  // -------------------------------------------------------------
  // Widget CRUD Handlers
  // -------------------------------------------------------------
  const handleOpenWidgetModal = (w?: WidgetDef) => {
    if (w) {
      setEditingWidget(w);
      setWidgetForm({
        id: w.id,
        title: w.title,
        component: w.component,
        defaultSpan: w.defaultSpan,
        priority: w.priority,
        enabled: w.enabled !== false,
      });
    } else {
      setEditingWidget(null);
      setWidgetForm({
        id: `widget_${Date.now()}`,
        title: "",
        component: "KpiGridWidget",
        defaultSpan: 2,
        priority: 85,
        enabled: true,
      });
    }
    setIsWidgetModalOpen(true);
  };

  const handleSaveWidget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!widgetForm.title.trim()) return;

    let updatedList: WidgetDef[];
    if (editingWidget) {
      updatedList = widgets.map((w) =>
        w.id === editingWidget.id
          ? { ...w, ...widgetForm, defaultSpan: Number(widgetForm.defaultSpan) as any, priority: Number(widgetForm.priority) }
          : w
      );
    } else {
      const newW: WidgetDef = {
        id: widgetForm.id,
        title: widgetForm.title,
        component: widgetForm.component,
        defaultSpan: Number(widgetForm.defaultSpan) as any,
        priority: Number(widgetForm.priority),
        enabled: widgetForm.enabled,
        minContainerWidth: 300,
        requires: {},
      };
      updatedList = [...widgets, newW];
    }

    setWidgets(updatedList);
    setIsWidgetModalOpen(false);
    await saveSection(
      "widgets",
      updatedList,
      editingWidget ? `Updated widget "${widgetForm.title}"` : `Added custom widget "${widgetForm.title}"`
    );
  };

  const handleDeleteWidget = async (id: string, title: string) => {
    if (!window.confirm(`Delete widget "${title}"?`)) return;
    const updatedList = widgets.filter((w) => w.id !== id);
    setWidgets(updatedList);
    await saveSection("widgets", updatedList, `Removed widget "${title}"`);
  };

  const handleToggleWidget = async (widget: WidgetDef) => {
    const updatedList = widgets.map((w) =>
      w.id === widget.id ? { ...w, enabled: !w.enabled } : w
    );
    setWidgets(updatedList);
    await saveSection(
      "widgets",
      updatedList,
      `Toggled widget "${widget.title}" (${!widget.enabled ? "enabled" : "disabled"})`
    );
  };

  // -------------------------------------------------------------
  // Tool CRUD Handlers
  // -------------------------------------------------------------
  const handleOpenToolModal = (t?: any) => {
    if (t) {
      setEditingTool(t);
      setToolForm({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        requiredPlan: t.requiredPlan || "Starter",
        badge: t.badge || "Core",
        hasInteractiveCalculator: Boolean(t.hasInteractiveCalculator),
        enabled: t.enabled !== false,
      });
    } else {
      setEditingTool(null);
      setToolForm({
        id: `tool_${Date.now()}`,
        name: "",
        category: "finance",
        description: "",
        requiredPlan: "Starter",
        badge: "New",
        hasInteractiveCalculator: false,
        enabled: true,
      });
    }
    setIsToolModalOpen(true);
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolForm.name.trim()) return;

    let updatedList: any[];
    if (editingTool) {
      updatedList = tools.map((t) =>
        t.id === editingTool.id ? { ...t, ...toolForm } : t
      );
    } else {
      updatedList = [...tools, { ...toolForm }];
    }

    setTools(updatedList);
    setIsToolModalOpen(false);
    await saveSection(
      "tools",
      updatedList,
      editingTool ? `Updated tool "${toolForm.name}"` : `Added tool "${toolForm.name}"`
    );
  };

  const handleDeleteTool = async (id: string, name: string) => {
    if (!window.confirm(`Delete tool "${name}"?`)) return;
    const updatedList = tools.filter((t) => t.id !== id);
    setTools(updatedList);
    await saveSection("tools", updatedList, `Removed tool "${name}"`);
  };

  const handleToggleTool = async (t: any) => {
    const updatedList = tools.map((item) =>
      item.id === t.id ? { ...item, enabled: !item.enabled } : item
    );
    setTools(updatedList);
    await saveSection(
      "tools",
      updatedList,
      `Toggled tool "${t.name}" (${!t.enabled ? "enabled" : "disabled"})`
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-text-muted font-mono">
          Connecting to Nuralix SQLite Control Plane...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-surface border border-jade shadow-2xl text-xs font-semibold text-jade flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-jade shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Plane Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-line bg-surface shadow-theme">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg sm:text-xl font-extrabold text-text tracking-tight font-sans">
              Superadmin Control Plane (§15)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brass/15 text-brass font-bold font-mono border border-brass/30">
              v{version} Published
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl leading-relaxed">
            Directly configure website copy, CTA buttons, section visibility, dashboard navigation links, feature flags, widgets, and specialist tools. All changes persist in SQLite.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-line text-text hover:text-cyan-500 hover:border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Website</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href="/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-line text-text hover:text-cyan-500 hover:border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>View Dashboard</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleFactoryReset}
            disabled={saving}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset all settings to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Factory Reset</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-line overflow-x-auto text-xs font-semibold">
        {[
          { id: "website", label: "Website Content & CTAs", icon: Globe },
          { id: "navigation", label: "Dashboard Navigation", icon: Compass },
          { id: "features", label: "Platform Feature Toggles", icon: Sliders },
          { id: "widgets", label: "Dashboard Widgets", icon: Layers },
          { id: "tools", label: "Specialist Tools Catalog", icon: Wrench },
          { id: "audit", label: `Audit Log (${auditLogs.length})`, icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* TAB 1: WEBSITE CONTENT & CTAs                                 */}
      {/* ============================================================= */}
      {activeTab === "website" && websiteConfig && (
        <div className="space-y-6">
          {/* Website Subtabs */}
          <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-semibold">
            {[
              { id: "sections", label: "1. Section Toggles & Visibility" },
              { id: "hero", label: "2. Hero Copy & Primary Buttons" },
              { id: "scenes", label: "3. Story Scenes (01 - 07)" },
              { id: "about_solutions", label: "4. About & Solutions Cards" },
              { id: "contact", label: "5. Contact Info & Socials" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSubWebTab(st.id as any)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  subWebTab === st.id
                    ? "bg-surface-2 text-cyan-600 dark:text-cyan-400 font-bold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Subtab: Section Visibility Switches */}
          {subWebTab === "sections" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface border border-line flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-text">Website Section Toggles</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    Toggle entire sections on or off. Changes immediately affect the marketing homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveSection("website", websiteConfig, "Saved section visibility switches")}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Visibility Changes"}</span>
                </button>
              </div>

              {/* Announcement Banner Box */}
              <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text">Top Announcement Banner</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 font-mono">Optional</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...websiteConfig,
                        announcement: {
                          ...websiteConfig.announcement,
                          enabled: !websiteConfig.announcement?.enabled,
                        },
                      };
                      setWebsiteConfig(updated);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                      websiteConfig.announcement?.enabled
                        ? "bg-jade/15 border-jade/40 text-jade"
                        : "bg-surface-2 border-line text-text-muted"
                    }`}
                  >
                    {websiteConfig.announcement?.enabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
                {websiteConfig.announcement?.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] text-text-muted font-medium">Banner Text</label>
                      <input
                        type="text"
                        value={websiteConfig.announcement?.text || ""}
                        onChange={(e) =>
                          setWebsiteConfig({
                            ...websiteConfig,
                            announcement: { ...websiteConfig.announcement, text: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-xs text-text focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-text-muted font-medium">Link Text & URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Text"
                          value={websiteConfig.announcement?.linkText || ""}
                          onChange={(e) =>
                            setWebsiteConfig({
                              ...websiteConfig,
                              announcement: { ...websiteConfig.announcement, linkText: e.target.value },
                            })
                          }
                          className="w-1/2 px-2 py-1.5 rounded-lg bg-surface-2 border border-line text-xs text-text focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={websiteConfig.announcement?.linkUrl || ""}
                          onChange={(e) =>
                            setWebsiteConfig({
                              ...websiteConfig,
                              announcement: { ...websiteConfig.announcement, linkUrl: e.target.value },
                            })
                          }
                          className="w-1/2 px-2 py-1.5 rounded-lg bg-surface-2 border border-line text-xs text-text focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid of Section Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(websiteConfig.sections || {}).map(([key, sec]: [string, any]) => (
                  <div
                    key={key}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      sec.enabled
                        ? "bg-surface border-line"
                        : "bg-surface-2/40 border-dashed border-line opacity-60"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-text block">{sec.title || key}</span>
                      <span className="text-[10px] text-text-muted font-mono">{key}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...websiteConfig,
                          sections: {
                            ...websiteConfig.sections,
                            [key]: { ...sec, enabled: !sec.enabled },
                          },
                        };
                        setWebsiteConfig(updated);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        sec.enabled
                          ? "bg-jade/15 border-jade/40 text-jade"
                          : "bg-surface-2 border-line text-text-muted"
                      }`}
                    >
                      {sec.enabled ? "VISIBLE" : "HIDDEN"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab: Hero Copy & Buttons */}
          {subWebTab === "hero" && (
            <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-text">Hero Section & Call-To-Action Buttons</h2>
                  <p className="text-xs text-text-muted">
                    Edit the main brand mark, eyebrow, subtitle, and primary/secondary button labels and links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveSection("website", websiteConfig, "Saved Hero section & buttons")}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Hero Changes"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Hero Eyebrow Text</label>
                  <input
                    type="text"
                    value={websiteConfig.hero?.eyebrow || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        hero: { ...websiteConfig.hero, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Brand Wordmark</label>
                  <input
                    type="text"
                    value={websiteConfig.hero?.word || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        hero: { ...websiteConfig.hero, word: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-text">Hero Subtitle</label>
                  <input
                    type="text"
                    value={websiteConfig.hero?.subtitle || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        hero: { ...websiteConfig.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Primary CTA Button */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2.5">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                    Primary CTA Button (Solid Glow)
                  </span>
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Button Label</label>
                    <input
                      type="text"
                      value={websiteConfig.hero?.primaryCtaText || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          hero: { ...websiteConfig.hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Destination Link (e.g. #s01 or /login)</label>
                    <input
                      type="text"
                      value={websiteConfig.hero?.primaryCtaHref || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          hero: { ...websiteConfig.hero, primaryCtaHref: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text font-mono"
                    />
                  </div>
                </div>

                {/* Secondary CTA Button */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2.5">
                  <span className="text-xs font-bold text-text-muted block">
                    Secondary CTA Button (Outline)
                  </span>
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Button Label</label>
                    <input
                      type="text"
                      value={websiteConfig.hero?.secondaryCtaText || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          hero: { ...websiteConfig.hero, secondaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Destination Link (e.g. #s03 or /dashboard)</label>
                    <input
                      type="text"
                      value={websiteConfig.hero?.secondaryCtaHref || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          hero: { ...websiteConfig.hero, secondaryCtaHref: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: Scenes 01 to 07 */}
          {subWebTab === "scenes" && (
            <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-text">Cinematic Story Scenes (01–07)</h2>
                  <p className="text-xs text-text-muted">
                    Edit the headlines and subtitles displayed during the 3D scroll journey.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveSection("website", websiteConfig, "Saved story scene copy")}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Scenes Changes"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Scene 01 */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2">
                  <span className="text-xs font-bold text-text">Scene 01 — Awakening</span>
                  <input
                    type="text"
                    placeholder="Eyebrow"
                    value={websiteConfig.scenes?.s01?.eyebrow || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s01: { ...websiteConfig.scenes?.s01, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    placeholder="Headline"
                    value={websiteConfig.scenes?.s01?.headline || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s01: { ...websiteConfig.scenes?.s01, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                </div>

                {/* Scene 02 */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2">
                  <span className="text-xs font-bold text-text">Scene 02 — Connection</span>
                  <input
                    type="text"
                    placeholder="Eyebrow"
                    value={websiteConfig.scenes?.s02?.eyebrow || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s02: { ...websiteConfig.scenes?.s02, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    placeholder="Headline"
                    value={websiteConfig.scenes?.s02?.headline || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s02: { ...websiteConfig.scenes?.s02, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                </div>

                {/* Scene 03 */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2">
                  <span className="text-xs font-bold text-text">Scene 03 — Intelligence</span>
                  <input
                    type="text"
                    placeholder="Eyebrow"
                    value={websiteConfig.scenes?.s03?.eyebrow || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s03: { ...websiteConfig.scenes?.s03, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    placeholder="Headline"
                    value={websiteConfig.scenes?.s03?.headline || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s03: { ...websiteConfig.scenes?.s03, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                </div>

                {/* Scene 04 */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2">
                  <span className="text-xs font-bold text-text">Scene 04 — This is Nuralix</span>
                  <input
                    type="text"
                    placeholder="Headline"
                    value={websiteConfig.scenes?.s04?.headline || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s04: { ...websiteConfig.scenes?.s04, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    placeholder="Lead text"
                    value={websiteConfig.scenes?.s04?.lead || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s04: { ...websiteConfig.scenes?.s04, lead: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                </div>

                {/* Scene 05 */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2">
                  <span className="text-xs font-bold text-text">Scene 05 — Expansion</span>
                  <input
                    type="text"
                    placeholder="Eyebrow"
                    value={websiteConfig.scenes?.s05?.eyebrow || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s05: { ...websiteConfig.scenes?.s05, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    placeholder="Headline"
                    value={websiteConfig.scenes?.s05?.headline || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s05: { ...websiteConfig.scenes?.s05, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                </div>

                {/* Scene 06 */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2">
                  <span className="text-xs font-bold text-text">Scene 06 — Human + AI</span>
                  <input
                    type="text"
                    placeholder="Eyebrow"
                    value={websiteConfig.scenes?.s06?.eyebrow || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s06: { ...websiteConfig.scenes?.s06, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                  <textarea
                    rows={2}
                    placeholder="Headline"
                    value={websiteConfig.scenes?.s06?.headline || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        scenes: {
                          ...websiteConfig.scenes,
                          s06: { ...websiteConfig.scenes?.s06, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                  />
                </div>

                {/* Scene 07 */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2 md:col-span-2">
                  <span className="text-xs font-bold text-text">Scene 07 — Future & Final CTA Button</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-muted">Eyebrow</label>
                      <input
                        type="text"
                        value={websiteConfig.scenes?.s07?.eyebrow || ""}
                        onChange={(e) =>
                          setWebsiteConfig({
                            ...websiteConfig,
                            scenes: {
                              ...websiteConfig.scenes,
                              s07: { ...websiteConfig.scenes?.s07, eyebrow: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted">Headline</label>
                      <input
                        type="text"
                        value={websiteConfig.scenes?.s07?.headline || ""}
                        onChange={(e) =>
                          setWebsiteConfig({
                            ...websiteConfig,
                            scenes: {
                              ...websiteConfig.scenes,
                              s07: { ...websiteConfig.scenes?.s07, headline: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted">CTA Button Label</label>
                      <input
                        type="text"
                        value={websiteConfig.scenes?.s07?.ctaText || ""}
                        onChange={(e) =>
                          setWebsiteConfig({
                            ...websiteConfig,
                            scenes: {
                              ...websiteConfig.scenes,
                              s07: { ...websiteConfig.scenes?.s07, ctaText: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted">CTA Button Href</label>
                      <input
                        type="text"
                        value={websiteConfig.scenes?.s07?.ctaHref || ""}
                        onChange={(e) =>
                          setWebsiteConfig({
                            ...websiteConfig,
                            scenes: {
                              ...websiteConfig.scenes,
                              s07: { ...websiteConfig.scenes?.s07, ctaHref: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: About & Solutions */}
          {subWebTab === "about_solutions" && (
            <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-text">About & Solutions Content</h2>
                  <p className="text-xs text-text-muted">
                    Configure the narrative paragraphs and capability solution cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveSection("website", websiteConfig, "Saved About & Solutions content")}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save About/Solutions"}</span>
                </button>
              </div>

              {/* About Text */}
              <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-3">
                <span className="text-xs font-bold text-text block">About Nuralix Narrative</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-text-muted">Headline</label>
                    <input
                      type="text"
                      value={websiteConfig.about?.headline || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          about: { ...websiteConfig.about, headline: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted">Eyebrow</label>
                    <input
                      type="text"
                      value={websiteConfig.about?.eyebrow || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          about: { ...websiteConfig.about, eyebrow: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-text-muted">Paragraph 1</label>
                    <textarea
                      rows={2}
                      value={websiteConfig.about?.p1 || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          about: { ...websiteConfig.about, p1: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-text-muted">Paragraph 2</label>
                    <textarea
                      rows={2}
                      value={websiteConfig.about?.p2 || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          about: { ...websiteConfig.about, p2: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-line text-xs text-text"
                    />
                  </div>
                </div>
              </div>

              {/* Solution Cards */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-text block">Capability Cards (5 Items)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(websiteConfig.solutions?.cards || []).map((card: any, idx: number) => (
                    <div key={card.id || idx} className="p-3.5 rounded-xl bg-surface-2/60 border border-line space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                          Card {card.num || `0${idx+1}`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-line font-mono">
                          FX: {card.fx || "ai"}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Title"
                        value={card.title || ""}
                        onChange={(e) => {
                          const updatedCards = [...websiteConfig.solutions.cards];
                          updatedCards[idx] = { ...updatedCards[idx], title: e.target.value };
                          setWebsiteConfig({
                            ...websiteConfig,
                            solutions: { ...websiteConfig.solutions, cards: updatedCards },
                          });
                        }}
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-line text-xs text-text font-semibold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description"
                        value={card.desc || ""}
                        onChange={(e) => {
                          const updatedCards = [...websiteConfig.solutions.cards];
                          updatedCards[idx] = { ...updatedCards[idx], desc: e.target.value };
                          setWebsiteConfig({
                            ...websiteConfig,
                            solutions: { ...websiteConfig.solutions, cards: updatedCards },
                          });
                        }}
                        className="w-full px-2.5 py-1 rounded-lg bg-surface border border-line text-xs text-text"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtab: Contact Info & Socials */}
          {subWebTab === "contact" && (
            <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-text">Contact Onboarding & Direct Channels</h2>
                  <p className="text-xs text-text-muted">
                    Configure the onboarding form headline, CTA button, contact emails, and social profiles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveSection("website", websiteConfig, "Saved contact details & socials")}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Contact Info"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Headline</label>
                  <input
                    type="text"
                    value={websiteConfig.contact?.headline || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        contact: { ...websiteConfig.contact, headline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Form CTA Button Label</label>
                  <input
                    type="text"
                    value={websiteConfig.contact?.ctaText || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        contact: { ...websiteConfig.contact, ctaText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Direct Contact Email</label>
                  <input
                    type="email"
                    value={websiteConfig.contact?.email || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        contact: { ...websiteConfig.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Website Domain Display</label>
                  <input
                    type="text"
                    value={websiteConfig.contact?.site || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        contact: { ...websiteConfig.contact, site: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={websiteConfig.contact?.linkedin || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        contact: { ...websiteConfig.contact, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">X / Twitter Profile URL</label>
                  <input
                    type="text"
                    value={websiteConfig.contact?.twitter || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        contact: { ...websiteConfig.contact, twitter: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: DASHBOARD NAVIGATION BUTTONS                           */}
      {/* ============================================================= */}
      {activeTab === "navigation" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-text">Dashboard Navigation Buttons & Links</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Add new navigation buttons, edit destinations, change order, or remove links from the tenant sidebar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenNavModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Navigation Button</span>
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-line overflow-hidden shadow-theme">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-line bg-surface-2/60 text-text-muted font-semibold">
                    <th className="p-3 pl-4">Order</th>
                    <th className="p-3">Button Label</th>
                    <th className="p-3">Route / URL</th>
                    <th className="p-3">Icon</th>
                    <th className="p-3">Group</th>
                    <th className="p-3">Badge</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {navItems
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-surface-2/40 transition-colors">
                        <td className="p-3 pl-4 font-mono text-text-muted">#{item.order}</td>
                        <td className="p-3 font-bold text-text">{item.label}</td>
                        <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400">{item.href}</td>
                        <td className="p-3 font-mono text-text-muted">{item.icon}</td>
                        <td className="p-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-line font-mono text-text-muted uppercase">
                            {item.group || "core"}
                          </span>
                        </td>
                        <td className="p-3">
                          {item.badge ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass/15 text-brass font-bold font-mono">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-text-muted text-[10px]">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleNavItem(item)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              item.enabled !== false
                                ? "bg-jade/15 border-jade/30 text-jade"
                                : "bg-surface-2 border-line text-text-muted"
                            }`}
                          >
                            {item.enabled !== false ? "ACTIVE" : "HIDDEN"}
                          </button>
                        </td>
                        <td className="p-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenNavModal(item)}
                              className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text transition-colors cursor-pointer"
                              title="Edit button"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNavItem(item.id, item.label)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete button"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: PLATFORM FEATURE TOGGLES                               */}
      {/* ============================================================= */}
      {activeTab === "features" && featuresConfig && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-line">
            <h2 className="text-sm font-bold text-text">Global Platform Capabilities & Feature Flags</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Instantly enable or disable executive tools, floating widgets, and integrations across all tenant accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "enableAiCopilot",
                title: "Ask Executive AI Floating Launcher",
                desc: "Floating 24/7 AI Workspace launcher button in the bottom right corner of tenant pages.",
                icon: MessageSquare,
              },
              {
                key: "enableDailyCheckin",
                title: "Daily Executive Pulse Check Ribbon",
                desc: "60-second operational telemetry collection modal and ribbon on the top of the dashboard.",
                icon: CheckCircle2,
              },
              {
                key: "enableCommandPalette",
                title: "Universal Command Palette (⌘K / Ctrl+K)",
                desc: "Spotlight search modal for finding metrics, tools, and execution tasks with quick jump.",
                icon: Search,
              },
              {
                key: "enableWhatsApp",
                title: "WhatsApp Executive Assistant",
                desc: "Direct integration sending morning check-in links and telemetry prompts via WhatsApp API.",
                icon: Globe,
              },
              {
                key: "enableToolsCatalog",
                title: "Specialist Tools & Calculators Module",
                desc: "Interactive financial modeling, break-even simulation, and CAC/LTV calculations catalog.",
                icon: Wrench,
              },
            ].map((feat) => {
              const Icon = feat.icon;
              const isEnabled = featuresConfig[feat.key] !== false;
              return (
                <div
                  key={feat.key}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isEnabled ? "bg-surface border-line" : "bg-surface-2/40 border-dashed border-line opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                        isEnabled
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                          : "bg-surface-2 border-line text-text-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-text">{feat.title}</h3>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeature(feat.key)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                      isEnabled
                        ? "bg-jade/15 border-jade/40 text-jade"
                        : "bg-surface-2 border-line text-text-muted"
                    }`}
                  >
                    {isEnabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: DASHBOARD WIDGETS                                      */}
      {/* ============================================================= */}
      {activeTab === "widgets" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-text">Configured Dashboard Widgets ({widgets.length})</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Manage widget components, grid column spans (1–4 columns), priority ordering, and visibility.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenWidgetModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Widget</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {widgets
              .sort((a, b) => b.priority - a.priority)
              .map((widget) => (
                <div
                  key={widget.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    widget.enabled !== false
                      ? "bg-surface border-line"
                      : "bg-surface-2/40 border-dashed border-line opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-text">{widget.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                        {widget.defaultSpan}/4 col span
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted font-mono mt-1">
                      Component: {widget.component} · Priority: {widget.priority}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleWidget(widget)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        widget.enabled !== false
                          ? "bg-jade/15 border-jade/30 text-jade"
                          : "bg-surface-2 border-line text-text-muted"
                      }`}
                    >
                      {widget.enabled !== false ? "ACTIVE" : "HIDDEN"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenWidgetModal(widget)}
                      className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWidget(widget.id, widget.title)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: SPECIALIST TOOLS CATALOG                               */}
      {/* ============================================================= */}
      {activeTab === "tools" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-text">Specialist Calculators & Tools Catalog ({tools.length})</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Add, configure, or remove business tools available to founders on the /tools catalog page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenToolModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Tool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tools.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                  t.enabled !== false
                    ? "bg-surface border-line"
                    : "bg-surface-2/40 border-dashed border-line opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-text">{t.name}</h3>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-surface-2 border border-line text-text-muted font-mono uppercase">
                        {t.category}
                      </span>
                      {t.hasInteractiveCalculator && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold">
                          Interactive Pop-up
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{t.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTool(t)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        t.enabled !== false
                          ? "bg-jade/15 border-jade/30 text-jade"
                          : "bg-surface-2 border-line text-text-muted"
                      }`}
                    >
                      {t.enabled !== false ? "ACTIVE" : "DISABLED"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenToolModal(t)}
                      className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTool(t.id, t.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-line/60">
                  <span>Required Plan: <b className="text-text font-semibold">{t.requiredPlan}</b></span>
                  <span>Badge: <b className="text-text font-mono">{t.badge}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 6: AUDIT LOG                                              */}
      {/* ============================================================= */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-line">
            <h2 className="text-sm font-bold text-text">Append-Only Platform Audit Log</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Historical ledger of every change made to the website, navigation, widgets, and feature flags.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-line divide-y divide-line overflow-hidden shadow-theme">
            {auditLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">No audit logs recorded yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text">{log.note || log.action}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-line font-mono text-text-muted uppercase">
                        {log.entityType}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 font-mono">
                      Actor: {log.actor} · Target ID: {log.entityId}
                    </p>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT NAVIGATION BUTTON                           */}
      {/* ============================================================= */}
      {isNavModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text">
                {editingNavItem ? `Edit Navigation Button: ${editingNavItem.label}` : "Add New Navigation Button"}
              </h3>
              <button
                type="button"
                onClick={() => setIsNavModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-2 text-text-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNavItem} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-text">Button Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Financial Models"
                  value={navForm.label}
                  onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text">Route / Destination URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /models or https://..."
                  value={navForm.href}
                  onChange={(e) => setNavForm({ ...navForm, href: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Lucide Icon Name</label>
                  <select
                    value={navForm.icon}
                    onChange={(e) => setNavForm({ ...navForm, icon: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                  >
                    <option value="LayoutDashboard">LayoutDashboard</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Compass">Compass</option>
                    <option value="TrendingUp">TrendingUp</option>
                    <option value="Wrench">Wrench</option>
                    <option value="AlertTriangle">AlertTriangle</option>
                    <option value="Layers">Layers</option>
                    <option value="Sliders">Sliders</option>
                    <option value="DollarSign">DollarSign</option>
                    <option value="Globe">Globe</option>
                    <option value="Shield">Shield</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={navForm.order}
                    onChange={(e) => setNavForm({ ...navForm, order: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Group</label>
                  <select
                    value={navForm.group}
                    onChange={(e) => setNavForm({ ...navForm, group: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text"
                  >
                    <option value="core">Core</option>
                    <option value="intelligence">Intelligence</option>
                    <option value="management">Management</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. NEW, 3, BETA"
                    value={navForm.badge}
                    onChange={(e) => setNavForm({ ...navForm, badge: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsNavModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-line text-text-muted hover:text-text cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Navigation Button"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT DASHBOARD WIDGET                            */}
      {/* ============================================================= */}
      {isWidgetModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text">
                {editingWidget ? `Edit Widget: ${editingWidget.title}` : "Add Dashboard Widget"}
              </h3>
              <button
                type="button"
                onClick={() => setIsWidgetModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-2 text-text-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWidget} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-text">Widget Display Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Pipeline Velocity"
                  value={widgetForm.title}
                  onChange={(e) => setWidgetForm({ ...widgetForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text">React Component</label>
                <select
                  value={widgetForm.component}
                  onChange={(e) => setWidgetForm({ ...widgetForm, component: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                >
                  <option value="KpiGridWidget">KpiGridWidget (4-column Sparkline Tiles)</option>
                  <option value="HealthScoreWidget">HealthScoreWidget (Gauge + Breakdown)</option>
                  <option value="BriefingWidget">BriefingWidget (Executive Intelligence Brief)</option>
                  <option value="GapsPreviewWidget">GapsPreviewWidget (Priority Gaps & Bottlenecks)</option>
                  <option value="TasksPreviewWidget">TasksPreviewWidget (Execution Queue)</option>
                  <option value="SimulatorHighlightWidget">SimulatorHighlightWidget (Active Simulation)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Default Column Span</label>
                  <select
                    value={widgetForm.defaultSpan}
                    onChange={(e) => setWidgetForm({ ...widgetForm, defaultSpan: Number(e.target.value) as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text"
                  >
                    <option value={1}>1 Column (Compact)</option>
                    <option value={2}>2 Columns (Half Width)</option>
                    <option value={3}>3 Columns (Wide)</option>
                    <option value={4}>4 Columns (Full Width)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Display Priority (0 - 100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={widgetForm.priority}
                    onChange={(e) => setWidgetForm({ ...widgetForm, priority: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsWidgetModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-line text-text-muted hover:text-text cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Widget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT SPECIALIST TOOL                             */}
      {/* ============================================================= */}
      {isToolModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text">
                {editingTool ? `Edit Tool: ${editingTool.name}` : "Add Specialist Tool"}
              </h3>
              <button
                type="button"
                onClick={() => setIsToolModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-2 text-text-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-text">Tool Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valuation Multiples Calculator"
                  value={toolForm.name}
                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Category</label>
                  <select
                    value={toolForm.category}
                    onChange={(e) => setToolForm({ ...toolForm, category: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text"
                  >
                    <option value="finance">Finance</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="strategy">Strategy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Required Plan</label>
                  <select
                    value={toolForm.requiredPlan}
                    onChange={(e) => setToolForm({ ...toolForm, requiredPlan: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief description of what this calculator or tool computes."
                  value={toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Valuation, Risk"
                    value={toolForm.badge}
                    onChange={(e) => setToolForm({ ...toolForm, badge: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={toolForm.hasInteractiveCalculator}
                      onChange={(e) => setToolForm({ ...toolForm, hasInteractiveCalculator: e.target.checked })}
                      className="rounded border-line text-cyan-600 focus:ring-0"
                    />
                    <span className="text-xs text-text">Has Pop-up Calculator</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsToolModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-line text-text-muted hover:text-text cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
