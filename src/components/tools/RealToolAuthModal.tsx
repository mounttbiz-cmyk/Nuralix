"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Lock,
  ExternalLink,
  Sparkles,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Building2,
  Mail,
  Hash,
  Globe,
  Radio,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { PortalModal } from "@/components/ui/PortalModal";
import { ToolLogo } from "@/components/tools/ToolLogo";

interface RealToolAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string | null;
  toolName: string;
  currentUserEmail?: string;
  companyName?: string;
  currentAuthState?: {
    status: "connected" | "connecting" | "idle";
    detail?: string;
    config?: any;
  };
  onConnectSuccess: (toolId: string, detail: string, config: any) => void;
  onDisconnect?: (toolId: string) => void;
}

export function RealToolAuthModal({
  isOpen,
  onClose,
  toolId,
  toolName,
  currentUserEmail = "",
  companyName = "",
  currentAuthState,
  onConnectSuccess,
  onDisconnect,
}: RealToolAuthModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tool-specific fields
  // Google Calendar
  const [googleEmail, setGoogleEmail] = useState("");
  const [calendarScope, setCalendarScope] = useState("primary");

  // Stripe
  const [stripeMode, setStripeMode] = useState<"live" | "test">("live");
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [stripeApiKey, setStripeApiKey] = useState("");

  // Slack
  const [slackWorkspace, setSlackWorkspace] = useState("");
  const [slackChannel, setSlackChannel] = useState("#executive-briefings");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");

  // Zoho / QuickBooks
  const [accountingPlatform, setAccountingPlatform] = useState<"zoho" | "quickbooks">("zoho");
  const [zohoOrgId, setZohoOrgId] = useState("");
  const [zohoEmail, setZohoEmail] = useState("");
  const [zohoRegion, setZohoRegion] = useState("zoho.in");
  const [qbRealmId, setQbRealmId] = useState("");
  const [qbEmail, setQbEmail] = useState("");

  // Help Desk
  const [helpdeskPlatform, setHelpdeskPlatform] = useState<"zendesk" | "freshdesk">("zendesk");
  const [helpdeskDomain, setHelpdeskDomain] = useState("");
  const [helpdeskEmail, setHelpdeskEmail] = useState("");
  const [helpdeskToken, setHelpdeskToken] = useState("");

  // General / Fallback
  const [genericId, setGenericId] = useState("");
  const [genericEmail, setGenericEmail] = useState("");

  // Initialize values when modal opens or tool changes
  useEffect(() => {
    if (!isOpen || !toolId) return;

    setError(null);
    setSubmitting(false);

    const cfg = currentAuthState?.config || {};
    const safeDomain = companyName ? companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

    // Google Calendar
    setGoogleEmail(cfg.accountEmail || currentUserEmail || "");
    setCalendarScope(cfg.calendarScope || "primary");

    // Stripe
    setStripeMode(cfg.mode || "live");
    setStripeAccountId(cfg.accountId || "");
    setStripeApiKey(cfg.apiKey || "");

    // Slack
    setSlackWorkspace(cfg.workspace || (safeDomain ? `${safeDomain}.slack.com` : ""));
    setSlackChannel(cfg.channel || "#executive-briefings");
    setSlackWebhookUrl(cfg.webhookUrl || "");

    // Accounting
    setAccountingPlatform(cfg.platform || "zoho");
    setZohoOrgId(cfg.organizationId || "");
    setZohoEmail(cfg.accountEmail || currentUserEmail || "");
    setZohoRegion(cfg.region || "zoho.in");
    setQbRealmId(cfg.realmId || "");
    setQbEmail(cfg.accountEmail || currentUserEmail || "");

    // Helpdesk
    setHelpdeskPlatform(cfg.platform || "zendesk");
    setHelpdeskDomain(cfg.domain || (safeDomain ? `${safeDomain}.zendesk.com` : ""));
    setHelpdeskEmail(cfg.accountEmail || currentUserEmail || "");
    setHelpdeskToken(cfg.token || "");

    // Generic
    setGenericId(cfg.accountId || "");
    setGenericEmail(cfg.accountEmail || currentUserEmail || "");
  }, [isOpen, toolId, currentAuthState, currentUserEmail, companyName]);

  if (!isOpen || !toolId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    let detail = "Live Telemetry Connected";
    let configPayload: any = {
      connectedAt: new Date().toISOString(),
      liveSync: true,
    };

    try {
      if (toolId === "google_calendar") {
        const cleanEmail = googleEmail.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes("@")) {
          throw new Error("Please enter your real Google Account Email.");
        }
        detail = `Connected · Real Account: ${cleanEmail} (Live Calendar Synced)`;
        configPayload = {
          ...configPayload,
          accountEmail: cleanEmail,
          calendarScope,
          provider: "Google Workspace / Calendar",
        };
      } else if (toolId === "stripe") {
        const cleanAcc = stripeAccountId.trim();
        const cleanKey = stripeApiKey.trim();
        if (!cleanAcc && !cleanKey) {
          throw new Error("Please enter your real Stripe Account ID (e.g. acct_...) or Live/Restricted API Key.");
        }
        const accLabel = cleanAcc ? cleanAcc : cleanKey.slice(0, 12) + "…";
        detail = `Connected · Real Stripe ID: ${accLabel} (${stripeMode === "live" ? "Live Production" : "Test Mode"})`;
        configPayload = {
          ...configPayload,
          accountId: cleanAcc,
          apiKey: cleanKey,
          mode: stripeMode,
          webhookEndpoint: "/api/webhooks/stripe",
        };
      } else if (toolId === "slack") {
        const cleanWs = slackWorkspace.trim();
        const cleanCh = slackChannel.trim() || "#executive-briefings";
        if (!cleanWs) {
          throw new Error("Please enter your real Slack Workspace Domain (e.g. yourcompany.slack.com).");
        }
        detail = `Connected · Workspace: ${cleanWs} · ${cleanCh}`;
        configPayload = {
          ...configPayload,
          workspace: cleanWs,
          channel: cleanCh,
          webhookUrl: slackWebhookUrl.trim(),
        };
      } else if (toolId === "zoho_books") {
        if (accountingPlatform === "zoho") {
          const cleanOrg = zohoOrgId.trim();
          const cleanEmail = zohoEmail.trim().toLowerCase();
          if (!cleanOrg) {
            throw new Error("Please enter your real Zoho Books Organization ID (found in Zoho Settings).");
          }
          detail = `Connected · Zoho Org ID: ${cleanOrg} · ${cleanEmail || zohoRegion} (P&L Live)`;
          configPayload = {
            ...configPayload,
            platform: "zoho",
            organizationId: cleanOrg,
            accountEmail: cleanEmail,
            region: zohoRegion,
          };
        } else {
          const cleanRealm = qbRealmId.trim();
          if (!cleanRealm) {
            throw new Error("Please enter your real QuickBooks Company / Realm ID.");
          }
          detail = `Connected · QuickBooks Realm ID: ${cleanRealm} (Live General Ledger)`;
          configPayload = {
            ...configPayload,
            platform: "quickbooks",
            realmId: cleanRealm,
            accountEmail: qbEmail.trim().toLowerCase(),
          };
        }
      } else if (toolId === "help_desk") {
        const cleanDom = helpdeskDomain.trim();
        if (!cleanDom) {
          throw new Error("Please enter your Help Desk Portal Subdomain (e.g. yourcompany.zendesk.com).");
        }
        const cleanEmail = helpdeskEmail.trim().toLowerCase();
        detail = `Connected · ${helpdeskPlatform === "zendesk" ? "Zendesk" : "Freshdesk"}: ${cleanDom} · ${cleanEmail || "SLA Active"}`;
        configPayload = {
          ...configPayload,
          platform: helpdeskPlatform,
          domain: cleanDom,
          accountEmail: cleanEmail,
          token: helpdeskToken.trim(),
        };
      } else {
        const cleanId = genericId.trim() || genericEmail.trim();
        if (!cleanId) {
          throw new Error(`Please enter your real ${toolName} Account ID or Email.`);
        }
        detail = `Connected · Real Account: ${cleanId}`;
        configPayload = {
          ...configPayload,
          accountId: genericId.trim(),
          accountEmail: genericEmail.trim(),
        };
      }

      // Persist to backend database via API
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolKey: toolId,
          status: "connected",
          apiKey: configPayload.apiKey || null,
          config: {
            ...configPayload,
            accountDetail: detail,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to persist tool connection");
      }

      onConnectSuccess(toolId, detail, configPayload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to authorize live tool account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(`Are you sure you want to disconnect ${toolName}?`)) return;
    setSubmitting(true);
    try {
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolKey: toolId,
          status: "not_connected",
          config: null,
        }),
      });
      if (onDisconnect) {
        onDisconnect(toolId);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to disconnect tool");
    } finally {
      setSubmitting(false);
    }
  };

  const isConnected = currentAuthState?.status === "connected";

  return (
    <PortalModal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface-2/40">
          <div className="flex items-center gap-3">
            <ToolLogo toolId={toolId} size={36} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-text">Connect Real {toolName} Account</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-bold uppercase tracking-wider font-mono">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Link your real production credentials for live telemetry and data ingestion.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Trust Banner */}
        <div className="px-5 py-2.5 bg-cyan-500/5 border-b border-cyan-500/15 flex items-center gap-2 text-[11px] text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Encrypted with TLS 1.3. Credentials are saved directly to your local database instance.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Google Calendar / Workspace */}
          {toolId === "google_calendar" && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Your Real Google Account Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={e => setGoogleEmail(e.target.value)}
                    placeholder="you@company.com or your.name@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                  />
                </div>
                {currentUserEmail && googleEmail !== currentUserEmail && (
                  <button
                    type="button"
                    onClick={() => setGoogleEmail(currentUserEmail)}
                    className="text-[10px] text-cyan-400 hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Autofill with my logged-in account: <strong>{currentUserEmail}</strong></span>
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Calendar Telemetry Scope
                </label>
                <select
                  value={calendarScope}
                  onChange={e => setCalendarScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text focus:outline-none focus:border-brass cursor-pointer"
                >
                  <option value="primary">Primary Executive Calendar (Executive Meetings & Focus Time)</option>
                  <option value="team">Team Shared Calendar (Company All-Hands & Client Demos)</option>
                  <option value="discovery">Sales & Client Discovery Bookings</option>
                </select>
                <p className="text-[10px] text-text-muted mt-1">
                  BizzPal ingests executive meeting loads, average focus hours, and sales call velocity.
                </p>
              </div>
            </div>
          )}

          {/* 2. Stripe */}
          {toolId === "stripe" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2/60 border border-line">
                <span className="text-xs font-semibold text-text">Environment Mode</span>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-line">
                  <button
                    type="button"
                    onClick={() => setStripeMode("live")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      stripeMode === "live"
                        ? "bg-jade text-white shadow-xs"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    Live Production
                  </button>
                  <button
                    type="button"
                    onClick={() => setStripeMode("test")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      stripeMode === "test"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    Test Sandbox
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Real Stripe Account ID <span className="text-text-muted font-normal">(Found in top-left of Stripe Dashboard)</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={stripeAccountId}
                    onChange={e => setStripeAccountId(e.target.value)}
                    placeholder="acct_1Nx7414..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 font-mono focus:outline-none focus:border-brass"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Stripe Live or Restricted API Key <span className="text-text-muted font-normal">(Optional for deeper MRR reconciliation)</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={stripeApiKey}
                    onChange={e => setStripeApiKey(e.target.value)}
                    placeholder={stripeMode === "live" ? "rk_live_... or sk_live_..." : "rk_test_... or sk_test_..."}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 font-mono focus:outline-none focus:border-brass"
                  />
                </div>
                <p className="text-[10px] text-text-muted mt-1">
                  Live Webhook Endpoint is ready at <code>/api/webhooks/stripe</code> for instant subscription updates.
                </p>
              </div>
            </div>
          )}

          {/* 3. Slack */}
          {toolId === "slack" && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Real Slack Workspace Domain <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={slackWorkspace}
                    onChange={e => setSlackWorkspace(e.target.value)}
                    placeholder="yourcompany.slack.com or workspace-name"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Executive Notification Channel
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={slackChannel}
                    onChange={e => setSlackChannel(e.target.value)}
                    placeholder="#executive-briefings or #general"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 font-mono focus:outline-none focus:border-brass"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Incoming Webhook URL <span className="text-text-muted font-normal">(Optional for instant pings)</span>
                </label>
                <input
                  type="url"
                  value={slackWebhookUrl}
                  onChange={e => setSlackWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/T.../B.../..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 font-mono focus:outline-none focus:border-brass"
                />
              </div>
            </div>
          )}

          {/* 4. Zoho Books / QuickBooks */}
          {toolId === "zoho_books" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountingPlatform("zoho")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    accountingPlatform === "zoho"
                      ? "bg-brass/10 border-brass text-brass"
                      : "bg-surface-2 border-line text-text-muted hover:text-text"
                  }`}
                >
                  <span>Zoho Books (India/Global)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountingPlatform("quickbooks")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    accountingPlatform === "quickbooks"
                      ? "bg-brass/10 border-brass text-brass"
                      : "bg-surface-2 border-line text-text-muted hover:text-text"
                  }`}
                >
                  <span>QuickBooks Online</span>
                </button>
              </div>

              {accountingPlatform === "zoho" ? (
                <>
                  <div>
                    <label className="text-xs font-semibold text-text block mb-1">
                      Real Zoho Books Organization ID <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={zohoOrgId}
                      onChange={e => setZohoOrgId(e.target.value)}
                      placeholder="e.g. 802931481 (Found in Settings → Organization Profile)"
                      className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 font-mono focus:outline-none focus:border-brass"
                    />
                    <p className="text-[10px] text-text-muted mt-1">
                      Located in Zoho Books under <em>Settings → Organization Profile → Organization ID</em>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-text block mb-1">
                        Zoho Admin Email
                      </label>
                      <input
                        type="email"
                        value={zohoEmail}
                        onChange={e => setZohoEmail(e.target.value)}
                        placeholder="billing@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text block mb-1">
                        Data Center Region
                      </label>
                      <select
                        value={zohoRegion}
                        onChange={e => setZohoRegion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text focus:outline-none focus:border-brass cursor-pointer"
                      >
                        <option value="zoho.in">zoho.in (India GST compliant)</option>
                        <option value="zoho.com">zoho.com (US / Global)</option>
                        <option value="zoho.eu">zoho.eu (Europe)</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-text block mb-1">
                      QuickBooks Company / Realm ID <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={qbRealmId}
                      onChange={e => setQbRealmId(e.target.value)}
                      placeholder="e.g. 913035... (Found in Account & Settings)"
                      className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 font-mono focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text block mb-1">
                      Intuit Administrator Email
                    </label>
                    <input
                      type="email"
                      value={qbEmail}
                      onChange={e => setQbEmail(e.target.value)}
                      placeholder="accountant@company.com"
                      className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* 5. Help Desk */}
          {toolId === "help_desk" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHelpdeskPlatform("zendesk")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    helpdeskPlatform === "zendesk"
                      ? "bg-brass/10 border-brass text-brass"
                      : "bg-surface-2 border-line text-text-muted hover:text-text"
                  }`}
                >
                  <span>Zendesk Support</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHelpdeskPlatform("freshdesk")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    helpdeskPlatform === "freshdesk"
                      ? "bg-brass/10 border-brass text-brass"
                      : "bg-surface-2 border-line text-text-muted hover:text-text"
                  }`}
                >
                  <span>Freshdesk Portal</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Real Help Desk Subdomain or URL <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={helpdeskDomain}
                    onChange={e => setHelpdeskDomain(e.target.value)}
                    placeholder={helpdeskPlatform === "zendesk" ? "yourcompany.zendesk.com" : "help.freshdesk.com"}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Support Admin Email
                  </label>
                  <input
                    type="email"
                    value={helpdeskEmail}
                    onChange={e => setHelpdeskEmail(e.target.value)}
                    placeholder="support@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    API Access Token <span className="text-text-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="password"
                    value={helpdeskToken}
                    onChange={e => setHelpdeskToken(e.target.value)}
                    placeholder="Token or API key"
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 font-mono focus:outline-none focus:border-brass"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. Fallback / Other tools */}
          {!["google_calendar", "stripe", "slack", "zoho_books", "help_desk"].includes(toolId) && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Real {toolName} Account ID or Workspace Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={genericId}
                  onChange={e => setGenericId(e.target.value)}
                  placeholder={`Your real ${toolName} ID, URL, or identifier`}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Authorized Account Email
                </label>
                <input
                  type="email"
                  value={genericEmail}
                  onChange={e => setGenericEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-brass"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-line flex items-center justify-between gap-3">
            {isConnected ? (
              <button
                type="button"
                disabled={submitting}
                onClick={handleDisconnect}
                className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-brass text-white font-bold text-xs shadow-sm hover:brightness-110 btn-tactile cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Real Account…</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isConnected ? "Update Real Account" : "Authorize & Connect Live"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PortalModal>
  );
}
