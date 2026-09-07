"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  ArrowRight,
  Sparkles,
  Search,
  Plus,
  Zap,
  Database,
  Lock,
  RotateCcw,
  Check,
  ChevronRight,
  Cable,
  Workflow
} from "lucide-react";
import { IntegrationLogo } from "@/components/ui/IntegrationLogo";

interface IntegrationItem {
  id: string;
  name: string;
  category: "business" | "automation" | "data";
  logo: string;
  tagline: string;
  status: "connected" | "disconnected" | "action_required";
  connectedAt?: string;
  services: string[];
  permissions: string[];
  usedBy: string[];
  configSummary?: string;
}

const DEFAULT_INTEGRATIONS: IntegrationItem[] = [
  // Business Integrations
  {
    id: "google_workspace",
    name: "Google Workspace",
    category: "business",
    logo: "🌐",
    tagline: "Sync executive communication, scheduling, and strategic docs.",
    status: "connected",
    connectedAt: "Verified 2 days ago",
    services: ["Gmail", "Google Drive", "Google Calendar", "Google Sheets"],
    permissions: [
      "Read authorized executive emails",
      "Read business files & briefings in Drive",
      "Create executive calendar events",
      "Create and format live telemetry spreadsheets",
    ],
    usedBy: ["CEO AI (Astra)", "Sales AI (Vikram)", "Tasks & Execution", "Workflows & Automations"],
    configSummary: "OAuth 2.0 Enterprise Domain-wide Delegation active.",
  },
  {
    id: "microsoft_365",
    name: "Microsoft 365",
    category: "business",
    logo: "🏢",
    tagline: "Outlook email telemetry, OneDrive storage, and Teams communications.",
    status: "disconnected",
    services: ["Outlook", "OneDrive", "Microsoft Teams", "Excel Online"],
    permissions: [
      "Read business emails",
      "Read shared OneDrive files",
      "Dispatch alerts to Teams channels",
    ],
    usedBy: ["CEO AI", "Operations AI", "Automations"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "business",
    logo: "💬",
    tagline: "Real-time executive briefing alerts, solvency alarms, and approval bots.",
    status: "connected",
    connectedAt: "Active on #boardroom",
    services: ["Bot Notifications", "Slash Commands (/nuralix)", "Thread AI Responses"],
    permissions: [
      "Post messages to selected channels",
      "Listen for executive slash commands",
      "Create interactive approval buttons",
    ],
    usedBy: ["CFO AI (Marcus)", "David (Operations AI)", "Solvency Alarms"],
    configSummary: "Connected to workspace apex.slack.com",
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "business",
    logo: "📹",
    tagline: "Meeting transcript ingestion, AI summary synthesis, and action item extraction.",
    status: "disconnected",
    services: ["Cloud Recordings", "Live Transcripts", "Meeting Intelligence"],
    permissions: ["Read authorized meeting transcripts", "Extract speaker action items"],
    usedBy: ["Knowledge Hub", "Executive Briefings", "Tasks & Execution"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "business",
    logo: "📱",
    tagline: "Instant founder briefings, high-priority solvency alerts, and approval triggers.",
    status: "connected",
    connectedAt: "Founder number verified",
    services: ["Executive Briefings via WhatsApp", "Quick Approval Triggers"],
    permissions: ["Send high-priority executive alerts", "Receive command replies from founder"],
    usedBy: ["Founder Personal Desk", "Astra (CEO AI)", "Solvency Guard"],
    configSummary: "Encrypted webhook linked to verified founder mobile.",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "business",
    logo: "💳",
    tagline: "Live telemetry for MRR, customer churn, gross collection volume, and refunds.",
    status: "connected",
    connectedAt: "Live telemetry sync",
    services: ["Charges API", "Subscriptions Telemetry", "Disputes Webhook"],
    permissions: ["Read-only access to customer charges & subscriptions", "Read refund telemetry"],
    usedBy: ["Marcus (CFO AI)", "Adaptive Analytics", "Decision Simulator"],
    configSummary: "Restricted API key active (Read-only Billing).",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "business",
    logo: "🧾",
    tagline: "General ledger sync, vendor expense tracking, and Indian tax compliance.",
    status: "connected",
    connectedAt: "Synced 1h ago",
    services: ["Chart of Accounts", "Bills & Expenses", "Vendor Invoices"],
    permissions: ["Read ledger transactions", "Extract vendor line-item burn"],
    usedBy: ["CFO AI (Marcus)", "Solvency Alarms", "Budget Planner"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "business",
    logo: "🧡",
    tagline: "CRM deal pipeline synchronization, lead status tracking, and AE attribution.",
    status: "disconnected",
    services: ["Deals Pipeline", "Contacts & Companies", "Engagement Activity"],
    permissions: ["Read and write deals", "Update deal stages", "Enrich contacts with AI scores"],
    usedBy: ["Vikram (Sales AI)", "Elena (Marketing AI)", "Workflows"],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "business",
    logo: "☁️",
    tagline: "Enterprise CRM account mapping, quota velocity, and opportunity tracking.",
    status: "disconnected",
    services: ["Opportunities API", "Account Hierarchies", "Custom Objects"],
    permissions: ["Read opportunities & stages", "Sync enterprise account telemetry"],
    usedBy: ["Sales AI", "Workflows Builder", "Executive Intelligence"],
  },

  // Automation Integrations
  {
    id: "zapier",
    name: "Zapier",
    category: "automation",
    logo: "⚡",
    tagline: "Connect Nuralix actions and triggers with 6,000+ business applications.",
    status: "connected",
    connectedAt: "Nuralix App installed",
    services: ["Zapier Triggers", "Zapier Actions", "Multi-step Zaps"],
    permissions: ["Trigger external workflows from Nuralix actions", "Ingest inbound payloads"],
    usedBy: ["Workflows Builder", "Operations AI", "Tasks"],
  },
  {
    id: "webhooks",
    name: "Custom Webhooks",
    category: "automation",
    logo: "🪝",
    tagline: "Inbound and outbound JSON webhooks with HMAC SHA-256 signature verification.",
    status: "connected",
    connectedAt: "3 active endpoints",
    services: ["Inbound Lead Capture", "Outbound Executive Briefing Dispatch", "Custom Event Listeners"],
    permissions: ["Accept signed JSON POST requests", "Dispatch signed webhook alerts"],
    usedBy: ["Workflows", "Platform Developers", "Automations"],
    configSummary: "Secret token: whsec_live_9a87d6e5...",
  },
  {
    id: "rest_api",
    name: "REST API Access",
    category: "automation",
    logo: "🔌",
    tagline: "Enterprise programmatic access to Nuralix metrics, intelligence, and execution.",
    status: "connected",
    connectedAt: "API Key v2 active",
    services: ["Metrics Read API", "Task Creation API", "Simulation API", "Briefings Export API"],
    permissions: ["Full enterprise tenant read/write token"],
    usedBy: ["Custom Internal Portals", "Data Pipelines", "Enterprise IT"],
    configSummary: "Key: nr_live_8390bca4f71...",
  },

  // Data Connections
  {
    id: "csv",
    name: "CSV Batch Importer",
    category: "data",
    logo: "📄",
    tagline: "Upload custom transaction logs, customer rosters, and historical financials.",
    status: "connected",
    services: ["Delimiter Detection", "Currency Parser (INR / USD)", "Data Sanitization"],
    permissions: ["Parse and store local tabular files in tenant database"],
    usedBy: ["Knowledge Hub", "Adaptive Analytics", "Tools"],
  },
  {
    id: "excel",
    name: "Microsoft Excel (.xlsx)",
    category: "data",
    logo: "📊",
    tagline: "Direct ingest of multi-tab Excel workbooks, pivot tables, and P&L sheets.",
    status: "connected",
    services: ["Multi-sheet Parsing", "Formula Ingestion", "Cell Formatting Preservation"],
    permissions: ["Read and extract workbook tables"],
    usedBy: ["CFO AI", "Financial Tools", "Knowledge Hub"],
  },
  {
    id: "google_sheets",
    name: "Google Sheets Live Link",
    category: "data",
    logo: "📗",
    tagline: "Bidirectional live synchronization with company Google Sheets models.",
    status: "connected",
    connectedAt: "Synced 15m ago",
    services: ["Live Polling (every 15 min)", "Cell Writeback", "Schema Mapping"],
    permissions: ["Read spreadsheet data", "Append telemetry rows"],
    usedBy: ["Tools", "Adaptive Analytics", "CEO AI"],
  },
  {
    id: "databases",
    name: "Database Connections",
    category: "data",
    logo: "🗄️",
    tagline: "Direct read-replica connections to PostgreSQL, MySQL, MongoDB, and Snowflake.",
    status: "disconnected",
    services: ["PostgreSQL", "MySQL", "MongoDB", "Snowflake / BigQuery"],
    permissions: ["Read-only SQL query execution over SSL tunnel"],
    usedBy: ["Adaptive Analytics", "Digital Twin", "Enterprise Reports"],
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(DEFAULT_INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectItem, setInspectItem] = useState<IntegrationItem | null>(null);

  const toggleConnection = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === "connected" ? "disconnected" : "connected";
          const updated = {
            ...item,
            status: nextStatus as IntegrationItem["status"],
            connectedAt: nextStatus === "connected" ? "Just connected" : undefined,
          };
          if (inspectItem?.id === id) {
            setInspectItem(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const filtered = integrations.filter(item => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text">Platform Integrations</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
              Connected Architecture
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Connect corporate business suites, automation hubs, and data pipelines to power Nuralix AI agents and tools.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search integrations…"
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface border border-line text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
          />
        </div>
      </div>

      {/* Architecture Alert Box (§ Proper separation: Platform -> Integrations -> Tools) */}
      <div className="p-4 rounded-xl bg-surface-2 border border-line flex items-start gap-3 text-xs leading-relaxed">
        <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-brass shrink-0 mt-0.5 shadow-2xs">
          <Cable className="w-4 h-4" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="font-bold text-text block">Platform Connection Architecture</span>
          <p className="text-text-muted text-[11px]">
            Integrations are authenticated at the platform layer. Once connected, your authorization flows automatically to specialist AI agents and operational tools:
            <span className="font-mono text-text block mt-1">
              Google Workspace Connected → Sales AI reads emails → Lead Analyzer scores deals → Workflows dispatches follow-ups.
            </span>
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: "all", label: `All Integrations (${integrations.length})` },
          { id: "business", label: "Business Integrations (9)" },
          { id: "automation", label: "Automation Integrations (3)" },
          { id: "data", label: "Data Connections (4)" },
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all btn-tactile cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-brass text-white shadow-xs"
                : "bg-surface border border-line text-text-muted hover:text-text"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Detailed Inspection Drawer / Modal */}
      {inspectItem && (
        <div className="p-6 rounded-2xl border border-brass/40 bg-surface shadow-2xl space-y-5 animate-fade-in ring-1 ring-brass/20">
          <div className="flex items-start justify-between pb-4 border-b border-line gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center p-2.5 shadow-inner">
                <IntegrationLogo id={inspectItem.id} className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-text">{inspectItem.name}</h2>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      inspectItem.status === "connected"
                        ? "bg-jade/10 border-jade/30 text-jade"
                        : "bg-surface-2 border-line text-text-muted"
                    }`}
                  >
                    {inspectItem.status === "connected" ? "● Connected" : "○ Disconnected"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{inspectItem.tagline}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectItem(null)}
              className="text-xs text-text-muted hover:text-text font-semibold px-2.5 py-1 rounded-md bg-surface-2 border border-line cursor-pointer"
            >
              Close Details ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Services */}
            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Authorized Services
              </span>
              <ul className="space-y-1.5 text-[11px]">
                {inspectItem.services.map((svc, i) => (
                  <li key={i} className="flex items-center gap-2 text-text">
                    <CheckCircle2 className="w-3.5 h-3.5 text-jade shrink-0" />
                    <span>{svc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Permissions */}
            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Security Permissions & Scopes
              </span>
              <ul className="space-y-1.5 text-[11px]">
                {inspectItem.permissions.map((perm, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-muted">
                    <Shield className="w-3.5 h-3.5 text-brass shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Used By */}
            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Consumer Endpoints ("Used By")
              </span>
              <ul className="space-y-1.5 text-[11px]">
                {inspectItem.usedBy.map((consumer, i) => (
                  <li key={i} className="flex items-center gap-2 text-text font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-brass shrink-0" />
                    <span>{consumer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Connection Actions */}
          <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] text-text-muted">
              {inspectItem.configSummary || "Telemetry credentials stored in AES-256 encrypted tenant vault."}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleConnection(inspectItem.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold btn-tactile cursor-pointer ${
                  inspectItem.status === "connected"
                    ? "bg-surface border border-rust/40 text-rust hover:bg-rust/10"
                    : "bg-brass text-white hover:brightness-110 shadow-sm"
                }`}
              >
                {inspectItem.status === "connected" ? "Disconnect Integration" : "Authorize & Connect"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Integrations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-line bg-surface hover:border-line-strong transition-all flex flex-col justify-between shadow-xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center p-2 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    <IntegrationLogo id={item.id} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-text group-hover:text-brass transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-text-muted capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                    item.status === "connected"
                      ? "bg-jade/10 border-jade/30 text-jade"
                      : "bg-surface-2 border-line text-text-muted"
                  }`}
                >
                  {item.status === "connected" ? "● Connected" : "○ Connect"}
                </span>
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                {item.tagline}
              </p>

              {/* Service badges snippet */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.services.slice(0, 3).map((svc, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.2 rounded bg-surface-2 border border-line text-text-muted"
                  >
                    {svc}
                  </span>
                ))}
                {item.services.length > 3 && (
                  <span className="text-[9px] text-text-muted">
                    +{item.services.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-line flex items-center justify-between">
              <button
                type="button"
                onClick={() => setInspectItem(item)}
                className="text-xs font-semibold text-brass hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Config</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => toggleConnection(item.id)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md border btn-tactile cursor-pointer ${
                  item.status === "connected"
                    ? "bg-surface-2 border-line text-text-muted hover:text-text"
                    : "bg-brass text-white border-brass hover:brightness-110"
                }`}
              >
                {item.status === "connected" ? "Manage" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
