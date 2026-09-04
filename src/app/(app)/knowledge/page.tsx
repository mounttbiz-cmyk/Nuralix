"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Plus,
  FileText,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Share2,
  Download,
  FolderOpen
} from "lucide-react";

interface KnowledgeDoc {
  id: string;
  title: string;
  category: "operations" | "finance" | "sales" | "governance" | "technology";
  description: string;
  updatedAt: string;
  version: string;
  author: string;
  indexed: boolean;
  content: string;
}

export default function KnowledgeHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeDoc, setActiveDoc] = useState<KnowledgeDoc | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("Apex Technologies");

  // New Doc Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<KnowledgeDoc["category"]>("operations");
  const [newDescription, setNewDescription] = useState("");
  const [newContent, setNewContent] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [docs, setDocs] = useState<KnowledgeDoc[]>([
    {
      id: "doc-1",
      title: "Standard Operating Procedures: Client Onboarding & SLA Protocol",
      category: "operations",
      description: "End-to-end framework for provisioning enterprise client accounts, assigning project leads, and meeting 99.9% uptime SLAs.",
      updatedAt: "3 days ago",
      version: "v2.4",
      author: "COO / Operations",
      indexed: true,
      content: `### 1. Scope & Objective\nThis document codifies the mandatory onboarding standard for all enterprise clients. Compliance is tracked automatically by Astra AI.\n\n### 2. Immediate 48-Hour Protocol\n- **T+2 Hours**: Account setup in CRM and assignment of senior account lead.\n- **T+24 Hours**: Kickoff alignment call, discovery survey sign-off, and security verification.\n- **T+48 Hours**: Infrastructure configuration and access provisioning.\n\n### 3. Escalation Criteria\nAny blocker exceeding 4 hours must be escalated to the Executive Operations Slack Channel.`,
    },
    {
      id: "doc-2",
      title: "Quarterly Financial Governance & Discretionary Opex Policy",
      category: "finance",
      description: "Threshold rules for software vendor renewals, departmental budget caps, and capital expense approval workflows.",
      updatedAt: "1 week ago",
      version: "v3.1",
      author: "CFO / Finance",
      indexed: true,
      content: `### Financial Controls Policy\n- Any vendor contract exceeding ₹50,000/yr requires dual sign-off from Department Head and CFO.\n- Discretionary SaaS subscriptions are audited monthly by Marcus AI.\n- Target cash runway must never breach 6.0 months without board disclosure.`,
    },
    {
      id: "doc-3",
      title: "Enterprise Sales Playbook & Objection Handling Matrix",
      category: "sales",
      description: "Codified closing methodology, competitor battlecards, and ROI calculation frameworks for high-ticket accounts.",
      updatedAt: "Yesterday",
      version: "v4.0",
      author: "Founder / Head of Growth",
      indexed: true,
      content: `### Sales Closing Playbook\n- **Target ICP**: Mid-market and enterprise leadership.\n- **Primary Value Prop**: Proven 3.8x ROI within 90 days.\n- **Objection: 'We already have legacy software'**: Highlight integration speed and zero-downtime deployment.\n- **Pricing Guardrail**: Never discount annual prepay beyond 15% without CEO approval.`,
    },
    {
      id: "doc-4",
      title: "Cloud Infrastructure Architecture & Data Security Standard",
      category: "technology",
      description: "SOC2 compliance guidelines, multi-region deployment topography, encrypted backup rotation, and incident drills.",
      updatedAt: "2 weeks ago",
      version: "v2.0",
      author: "CTO / Engineering",
      indexed: true,
      content: `### Security Standards\n- All customer data encrypted at rest (AES-256) and in transit (TLS 1.3).\n- Zero-trust RBAC enforced across all internal production databases.\n- Automated failover tests executed bi-weekly.`,
    },
    {
      id: "doc-5",
      title: "Company Shareholder Governance & Board Charter",
      category: "governance",
      description: "Voting thresholds, stock option plan administration, quarterly board meeting schedules, and advisory committee structure.",
      updatedAt: "1 month ago",
      version: "v1.2",
      author: "General Counsel",
      indexed: true,
      content: `### Governance & Board Protocols\n- Board packets distributed exactly 5 business days prior to quarterly review.\n- Executive compensation and option grant approvals require majority quorum.\n- Material litigation or regulatory inquiries require immediate notice within 24 hours.`,
    },
  ]);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("nuralix_business_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setCompanyName(parsed.name);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newDocItem: KnowledgeDoc = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      updatedAt: "Just now",
      version: "v1.0",
      author: "Company Executive",
      indexed: true,
      content: newContent.trim() || `### ${newTitle}\n\n${newDescription}`,
    };

    setDocs(prev => [newDocItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewContent("");

    setToastMessage(`Knowledge item '${newDocItem.title}' indexed into AI memory!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brass-soft flex items-center justify-center text-brass">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-text">Knowledge Hub</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
                  AI Context Repository
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Central operating playbooks, financial policies, and governance records powering {companyName}.
              </p>
            </div>
          </div>
        </div>

        {/* Add Knowledge Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brass text-white text-xs font-semibold shadow-sm hover:brightness-110 btn-tactile cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Item</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-brass-soft border border-brass/30 text-xs font-medium text-brass flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-brass" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Memory Banner */}
      <div className="p-4 rounded-xl border border-line bg-surface-2/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface border border-line flex items-center justify-center text-brass shadow-sm">
            <Sparkles className="w-4 h-4 text-brass" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">Continuous Vector Ingestion</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-500 font-bold uppercase">
                Active & Synced
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              {docs.length} company playbooks are embedded into Astra (CEO) & Marcus (CFO) executive cognition.
            </p>
          </div>
        </div>

        <a
          href="/chat"
          className="text-xs font-semibold text-brass hover:underline flex items-center gap-1"
        >
          <span>Query documents with AI</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search playbooks, policies, SOPs…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-line text-xs text-text placeholder:text-text-muted focus:ring-1 focus:ring-brass"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {[
            { id: "all", label: "All Items" },
            { id: "operations", label: "Operations" },
            { id: "finance", label: "Finance" },
            { id: "sales", label: "Sales & Growth" },
            { id: "technology", label: "Tech & Security" },
            { id: "governance", label: "Governance" },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all btn-tactile ${
                selectedCategory === cat.id
                  ? "bg-brass text-white border-brass font-semibold"
                  : "bg-surface-2 border-line text-text-muted hover:text-text"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => setActiveDoc(doc)}
            className="p-4 rounded-xl border border-line bg-surface hover:border-brass/70 shadow-theme hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 btn-tactile"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 border border-line text-brass font-bold uppercase tracking-wider">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-text-muted">
                  {doc.version}
                </span>
              </div>

              <h3 className="text-xs font-bold text-text line-clamp-2 leading-snug">
                {doc.title}
              </h3>

              <p className="text-[11px] text-text-muted line-clamp-3 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-line/60 flex items-center justify-between text-[10px] text-text-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>AI Synced</span>
              </div>
              <span>Updated {doc.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-line bg-surface-2/40 space-y-2">
          <FolderOpen className="w-8 h-8 text-text-muted mx-auto opacity-50" />
          <h3 className="text-xs font-bold text-text">No matching documents found</h3>
          <p className="text-[11px] text-text-muted">Try clearing your search query or filter tags.</p>
        </div>
      )}

      {/* View Document Drawer / Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-2xl w-full bg-surface border border-line rounded-2xl shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-line">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-line text-brass font-bold uppercase">
                    {activeDoc.category} · {activeDoc.version}
                  </span>
                  <h2 className="text-sm font-bold text-text mt-1.5 leading-snug">
                    {activeDoc.title}
                  </h2>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Authored by {activeDoc.author} · Last updated {activeDoc.updatedAt}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDoc(null)}
                  className="p-1.5 rounded-lg border border-line bg-surface-2 text-text-muted hover:text-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Doc Body */}
              <div className="overflow-y-auto max-h-[48vh] pr-2 text-xs text-text space-y-3 font-sans whitespace-pre-line leading-relaxed bg-surface-2/30 p-4 rounded-xl border border-line">
                {activeDoc.content}
              </div>
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-between">
              <a
                href={`/chat?prompt=${encodeURIComponent(`Analyze the policy '${activeDoc.title}' and suggest operational optimizations.`)}`}
                className="px-3.5 py-2 rounded-lg bg-surface-2 border border-line hover:border-brass text-xs font-semibold text-text flex items-center gap-1.5 btn-tactile"
              >
                <Sparkles className="w-3.5 h-3.5 text-brass" />
                <span>Discuss with AI Executive</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="px-4 py-2 rounded-lg bg-brass text-white text-xs font-semibold hover:brightness-110 btn-tactile"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleAddDoc}
            className="max-w-lg w-full bg-surface border border-line rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brass" />
                <h2 className="text-sm font-bold text-text">Add Company Knowledge Item</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg border border-line bg-surface-2 text-text-muted hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-text block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Growth Mandate & Hiring Thresholds"
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass"
                />
              </div>

              <div>
                <label className="font-semibold text-text block mb-1">Knowledge Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass"
                >
                  <option value="operations">Operations & Delivery</option>
                  <option value="finance">Finance & Accounting</option>
                  <option value="sales">Sales & Growth</option>
                  <option value="technology">Technology & Infrastructure</option>
                  <option value="governance">Governance & Legal</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-text block mb-1">Summary / Abstract *</label>
                <input
                  type="text"
                  required
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Brief synopsis of what this protocol controls"
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass"
                />
              </div>

              <div>
                <label className="font-semibold text-text block mb-1">Document Content / Markdown</label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Paste or write document text, policy guidelines, and SOP steps…"
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-line text-xs font-semibold text-text-muted hover:text-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brass text-white text-xs font-bold shadow-md hover:brightness-110 btn-tactile cursor-pointer"
              >
                Index & Save Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
