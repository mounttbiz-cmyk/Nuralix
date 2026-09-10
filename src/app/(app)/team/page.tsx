"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Key,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  Search,
  Sliders,
  Sparkles,
  FileText,
  AlertTriangle
} from "lucide-react";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";
import { PortalModal } from "@/components/ui/PortalModal";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Executive" | "Manager" | "Operator";
  department: string;
  twoFactor: boolean;
  status: "active" | "invited" | "suspended";
  lastActive: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "mem_1",
    name: "Alex Sharma",
    email: "alex@apextechnologies.in",
    role: "Owner",
    department: "Executive Office",
    twoFactor: true,
    status: "active",
    lastActive: "Just now",
  },
  {
    id: "mem_2",
    name: "Dharmendar Shah",
    email: "dharmendar@salespal.io",
    role: "Executive",
    department: "Corporate Strategy",
    twoFactor: true,
    status: "active",
    lastActive: "15m ago",
  },
  {
    id: "mem_3",
    name: "Priya Nair",
    email: "priya@apextechnologies.in",
    role: "Manager",
    department: "Operations & Delivery",
    twoFactor: false,
    status: "active",
    lastActive: "1h ago",
  },
  {
    id: "mem_4",
    name: "Karan Verma",
    email: "karan@apextechnologies.in",
    role: "Operator",
    department: "Finance & Accounting",
    twoFactor: true,
    status: "active",
    lastActive: "3h ago",
  },
  {
    id: "mem_5",
    name: "Astra (CEO Copilot)",
    email: "astra.ai@nuralix.internal",
    role: "Executive",
    department: "Autonomous Strategy",
    twoFactor: true,
    status: "active",
    lastActive: "Real-time engine",
  },
  {
    id: "mem_6",
    name: "Marcus (CFO Copilot)",
    email: "marcus.ai@nuralix.internal",
    role: "Executive",
    department: "Autonomous Finance",
    twoFactor: true,
    status: "active",
    lastActive: "Real-time engine",
  },
];

const AUDIT_LOGS = [
  { id: "log_1", action: "Google Workspace OAuth token refreshed", user: "System", time: "12m ago", ip: "103.21.244.1" },
  { id: "log_2", action: "Decision Simulator: Scenario 'Hire 5 Engineers' run", user: "Alex Sharma", time: "45m ago", ip: "14.139.60.2" },
  { id: "log_3", action: "Discretionary spend alert dispatched to Slack", user: "Marcus (CFO AI)", time: "2h ago", ip: "Internal" },
  { id: "log_4", action: "Member role updated: Priya Nair promoted to Executive", user: "Alex Sharma", time: "1 day ago", ip: "14.139.60.2" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);
  const [selectedTab, setSelectedTab] = useState<"members" | "roles" | "audit" | "sso">("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Manager");

  // Close invite modal on Escape
  useEscapeKey(() => setIsInviteOpen(false), isInviteOpen);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember: TeamMember = {
      id: `mem_${Date.now()}`,
      name: inviteName.trim() || inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      department: "Cross-functional",
      twoFactor: false,
      status: "invited",
      lastActive: "Pending invitation",
    };
    setMembers(prev => [...prev, newMember]);
    setInviteName("");
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  const filteredMembers = members.filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text">Team & Permissions</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
              Governance & RBAC
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Manage organizational team access, role-based security matrices, enterprise SSO, and immutable audit logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 rounded-lg bg-brass text-white text-xs font-bold shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-line pb-2 text-xs">
        {[
          { id: "members", label: `Members (${members.length})` },
          { id: "roles", label: "Permission Matrix" },
          { id: "sso", label: "Enterprise SSO / SAML" },
          { id: "audit", label: "Security Audit Logs" },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all btn-tactile cursor-pointer ${
              selectedTab === tab.id
                ? "bg-brass text-white shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-2"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Members Directory */}
      {selectedTab === "members" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search colleagues…"
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface border border-line text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
              />
            </div>
            <span className="text-xs text-text-muted">
              {filteredMembers.length} seats active
            </span>
          </div>

          <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-text-muted text-[10px] uppercase tracking-wider font-bold">
                  <th className="p-3">Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">2FA Security</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredMembers.map(m => (
                  <tr key={m.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-text">{m.name}</div>
                      <div className="text-[11px] text-text-muted">{m.email}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          m.role === "Owner"
                            ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                            : m.role === "Executive"
                            ? "bg-purple-400/10 text-purple-400 border-purple-400/30"
                            : "bg-surface-2 text-text-muted border-line"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="p-3 text-text-muted">{m.department}</td>
                    <td className="p-3">
                      {m.twoFactor ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-jade font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rust font-medium">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Not set</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-semibold ${
                          m.status === "active" ? "text-jade" : "text-amber-400"
                        }`}
                      >
                        ● {m.status === "active" ? "Active" : "Invited"}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-text-muted font-mono">{m.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Permission Matrix */}
      {selectedTab === "roles" && (
        <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs space-y-4">
          <div>
            <h2 className="text-xs font-bold text-text uppercase tracking-wider">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Granular permission matrix across Core, Executive Intelligence, Operations, and Platform.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-[10px] uppercase font-bold text-text-muted">
                  <th className="p-3">Module / Capability</th>
                  <th className="p-3 text-center">Owner</th>
                  <th className="p-3 text-center">Executive</th>
                  <th className="p-3 text-center">Manager</th>
                  <th className="p-3 text-center">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-[11px]">
                <tr>
                  <td className="p-3 font-semibold text-text">Dashboard & Health Score</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Read</td>
                  <td className="p-3 text-center text-jade">✓ Read</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">AI Workspace (All 7 Agents)</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-text-muted">Filtered</td>
                  <td className="p-3 text-center text-rust">✕ Restricted</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Decision Simulator & Scenario Commit</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-rust">✕ Restricted</td>
                  <td className="p-3 text-center text-rust">✕ Restricted</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Tools & Financial Calculators</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-text-muted">Read-only</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Visual Workflows Execution & Build</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-jade">✓ Edit</td>
                  <td className="p-3 text-center text-rust">✕ Restricted</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Integrations & API Tokens</td>
                  <td className="p-3 text-center text-jade">✓ Full</td>
                  <td className="p-3 text-center text-rust">✕ Restricted</td>
                  <td className="p-3 text-center text-rust">✕ Restricted</td>
                  <td className="p-3 text-center text-rust">✕ Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: SSO */}
      {selectedTab === "sso" && (
        <div className="p-6 rounded-2xl border border-line bg-surface shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-text uppercase tracking-wider">Enterprise Single Sign-On (SSO)</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Enforce SAML 2.0 / OIDC authentication for all employees logging into Nuralix OS.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text">Google Workspace SSO</span>
                <span className="text-[10px] text-jade font-semibold">● Verified</span>
              </div>
              <p className="text-[11px] text-text-muted">One-click login with company Google accounts.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2 opacity-70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text">Okta SAML 2.0</span>
                <span className="text-[10px] text-text-muted font-semibold">Enterprise</span>
              </div>
              <p className="text-[11px] text-text-muted">Automate user provisioning and SCIM group sync.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2 opacity-70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text">Microsoft Entra ID</span>
                <span className="text-[10px] text-text-muted font-semibold">Enterprise</span>
              </div>
              <p className="text-[11px] text-text-muted">Seamless enterprise Active Directory authentication.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {selectedTab === "audit" && (
        <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <h2 className="text-xs font-bold text-text uppercase tracking-wider">
              Immutable Security Audit Trail
            </h2>
            <span className="text-[11px] text-text-muted">Retained for 365 days</span>
          </div>
          <div className="divide-y divide-line text-xs">
            {AUDIT_LOGS.map(log => (
              <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-surface-2/40 transition-colors">
                <div className="space-y-0.5">
                  <span className="font-semibold text-text">{log.action}</span>
                  <div className="text-[11px] text-text-muted">
                    Initiated by <span className="text-brass font-medium">{log.user}</span> · IP: {log.ip}
                  </div>
                </div>
                <span className="text-[11px] text-text-muted font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <PortalModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
        <div className="w-full max-w-md p-6 rounded-2xl border border-line bg-surface shadow-2xl space-y-4 animate-scale-in">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <h3 className="text-sm font-bold text-text">Invite Colleague to Nuralix</h3>
            <button
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="text-xs text-text-muted hover:text-text cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleInvite} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-text block mb-1">Full Name</label>
              <input
                type="text"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
                placeholder="e.g. Rahul Mehta"
                className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass"
              />
            </div>
            <div>
              <label className="font-semibold text-text block mb-1">Work Email</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="e.g. rahul@company.in"
                className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass"
              />
            </div>
            <div>
              <label className="font-semibold text-text block mb-1">Role & Authority</label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:outline-none focus:ring-1 focus:ring-brass"
              >
                <option value="Operator">Operator (Read & Execute assigned actions)</option>
                <option value="Manager">Manager (Team oversight & tool execution)</option>
                <option value="Executive">Executive (Full AI Copilot & decision authority)</option>
                <option value="Owner">Owner (Enterprise root billing & permissions)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-line text-text-muted hover:text-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-brass text-white font-bold btn-tactile hover:brightness-110 cursor-pointer"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      </PortalModal>
    </div>
  );
}
