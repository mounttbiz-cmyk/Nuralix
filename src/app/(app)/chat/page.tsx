"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Wrench,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Target,
  Users,
  Building2,
  Workflow,
  Compass,
  AlertTriangle,
  FileText,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Bot
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";

interface AgentMeta {
  id: string;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  color: string;
  summary: string;
  quickTools: { name: string; href: string; iconName?: string }[];
  promptSuggestions: string[];
}

const EXECUTIVE_AGENTS: AgentMeta[] = [
  {
    id: "ceo",
    name: "Astra",
    role: "CEO AI",
    avatar: "👑",
    badge: "Strategic Vision",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    summary: "Capital efficiency, enterprise scale milestones, founder alignment, and board-level directives.",
    quickTools: [
      { name: "Scenario Planner", href: "/simulator" },
      { name: "Gap Register", href: "/gaps" },
      { name: "Executive Briefings", href: "/reports" },
    ],
    promptSuggestions: [
      "What is our top strategic vulnerability this month?",
      "Review my runway and recommend our next 90-day focus.",
      "How should I allocate budget between sales and product?",
    ],
  },
  {
    id: "cfo",
    name: "Marcus",
    role: "CFO AI",
    avatar: "📊",
    badge: "Capital & Runway",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    summary: "Cash burn, liquidity runway, unit economics, INR tax/balance sheet discipline, and solvency alarms.",
    quickTools: [
      { name: "Cash Flow Forecast", href: "/tools?tool=cashflow" },
      { name: "Profit Calculator", href: "/tools?tool=profit" },
      { name: "Break-Even Calculator", href: "/tools?tool=breakeven" },
      { name: "ROI Calculator", href: "/tools?tool=roi" },
    ],
    promptSuggestions: [
      "Analyze our net burn against current liquid reserves.",
      "What is our target break-even milestone in Indian Rupees?",
      "Calculate runway extension if we reduce tooling by 15%.",
    ],
  },
  {
    id: "marketing",
    name: "Elena",
    role: "Marketing AI",
    avatar: "🎯",
    badge: "Demand & Growth",
    color: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    summary: "CAC, ROAS efficiency, organic funnels, brand positioning, and demand generation economics.",
    quickTools: [
      { name: "CAC Calculator", href: "/tools?tool=cac" },
      { name: "ROAS Calculator", href: "/tools?tool=roas" },
      { name: "Campaign Analyzer", href: "/tools?tool=campaign" },
      { name: "Marketing Forecast", href: "/tools?tool=marketing_forecast" },
    ],
    promptSuggestions: [
      "How can we reduce our blended customer acquisition cost (CAC)?",
      "Benchmark our ROAS against Indian SaaS standards.",
      "Suggest high-converting inbound content topics for our ICP.",
    ],
  },
  {
    id: "sales",
    name: "Vikram",
    role: "Sales AI",
    avatar: "⚡",
    badge: "Deal Velocity",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    summary: "Pipeline velocity, enterprise deal structuring, lead scoring, and sales representative quotas.",
    quickTools: [
      { name: "Lead Scoring", href: "/tools?tool=lead_scoring" },
      { name: "Pipeline Analyzer", href: "/tools?tool=pipeline" },
      { name: "Deal Simulator", href: "/tools?tool=deal_simulator" },
      { name: "Customer LTV", href: "/tools?tool=ltv" },
    ],
    promptSuggestions: [
      "Audit our deal qualification criteria to improve close rates.",
      "How do we transition mid-market deals to annual contracts?",
      "Simulate revenue impact of closing 3 enterprise accounts.",
    ],
  },
  {
    id: "hr",
    name: "Sarah",
    role: "HR & Talent AI",
    avatar: "🤝",
    badge: "Talent & Culture",
    color: "text-rose-400 bg-rose-400/10 border-rose-400/30",
    summary: "Headcount planning, talent retention, hiring cost, organizational structure, and compensation benchmarks.",
    quickTools: [
      { name: "Hiring Simulator", href: "/tools?tool=hiring" },
      { name: "Workforce Planner", href: "/tools?tool=workforce" },
      { name: "Compensation Guide", href: "/tools?tool=comp" },
    ],
    promptSuggestions: [
      "What is the fully loaded cost of hiring 2 senior developers in India?",
      "Evaluate our revenue per employee vs peers.",
      "Draft performance milestone incentives for our sales team.",
    ],
  },
  {
    id: "operations",
    name: "David",
    role: "Operations AI",
    avatar: "⚙️",
    badge: "Efficiency & SLAs",
    color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    summary: "Process optimization, workflow automation, operational bottlenecks, vendor SLAs, and delivery margins.",
    quickTools: [
      { name: "Capacity Planner", href: "/tools?tool=capacity" },
      { name: "Process Analyzer", href: "/tools?tool=process" },
      { name: "Workflows Builder", href: "/workflows" },
      { name: "Inventory Simulator", href: "/tools?tool=inventory" },
    ],
    promptSuggestions: [
      "Where are the biggest operational bottlenecks in our delivery cycle?",
      "How can we automate client onboarding handoffs?",
      "Review our vendor software subscriptions for redundancy.",
    ],
  },
  {
    id: "strategy",
    name: "Rohan",
    role: "Strategy AI",
    avatar: "🧭",
    badge: "Moats & Expansion",
    color: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    summary: "Defensibility analysis, competitive moats, market expansion playbooks, and strategic partnerships.",
    quickTools: [
      { name: "SWOT Analyzer", href: "/tools?tool=swot" },
      { name: "Market Entry Simulator", href: "/tools?tool=market_entry" },
      { name: "Competitor Analyzer", href: "/tools?tool=competitor" },
      { name: "Expansion Simulator", href: "/tools?tool=expansion" },
    ],
    promptSuggestions: [
      "Evaluate our competitive moat against legacy enterprise players.",
      "What are the highest-margin expansion vectors for next year?",
      "Structure a defensibility framework for our platform data.",
    ],
  },
];

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  agentId: string;
  agentName: string;
  avatar: string;
  timestamp: string;
  content: string;
  provider?: string;
  nextSteps?: string[];
}

export default function AIWorkspacePage() {
  const [activeAgentId, setActiveAgentId] = useState<string>("ceo");
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial messages per agent
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({
    ceo: [
      {
        id: "msg_init_ceo",
        sender: "agent",
        agentId: "ceo",
        agentName: "Astra (CEO AI)",
        avatar: "👑",
        timestamp: "Just now",
        content:
          "Good day. I am Astra, your CEO AI. I monitor company runway, capital allocation, and top-tier execution priorities. What strategic directive shall we review today?",
        provider: "nuralix-ai",
        nextSteps: ["Review Runway & Solvency", "Examine Secondary Pipelines", "Run Decision Simulation"],
      },
    ],
    cfo: [
      {
        id: "msg_init_cfo",
        sender: "agent",
        agentId: "cfo",
        agentName: "Marcus (CFO AI)",
        avatar: "📊",
        timestamp: "Just now",
        content:
          "Greetings. Marcus here. I oversee your Indian Rupee balance sheet, monthly burn, liquidity runways, and unit economics. All figures align with current ledger benchmarks.",
        provider: "nuralix-ai",
        nextSteps: ["Open Cash Flow Tool", "Review Vendor Subscriptions", "Calculate Break-Even Threshold"],
      },
    ],
    marketing: [
      {
        id: "msg_init_mktg",
        sender: "agent",
        agentId: "marketing",
        agentName: "Elena (Marketing AI)",
        avatar: "🎯",
        timestamp: "Just now",
        content:
          "Hello! Elena on deck. I track customer acquisition costs, campaign ROAS, organic positioning, and ICP buyer qualification. How can we accelerate growth today?",
        provider: "nuralix-ai",
        nextSteps: ["Simulate CAC Payback", "Audit Inbound Conversion", "Review Competitor Ads"],
      },
    ],
    sales: [
      {
        id: "msg_init_sales",
        sender: "agent",
        agentId: "sales",
        agentName: "Vikram (Sales AI)",
        avatar: "⚡",
        timestamp: "Just now",
        content:
          "Vikram ready. Let's look at pipeline velocity, deal size qualification, proposal win rates, and enterprise client expansions. What pipeline are we closing?",
        provider: "nuralix-ai",
        nextSteps: ["Score Pipeline Deals", "Audit Stalled Leads", "Model Enterprise Contract Tiering"],
      },
    ],
    hr: [
      {
        id: "msg_init_hr",
        sender: "agent",
        agentId: "hr",
        agentName: "Sarah (HR & Talent AI)",
        avatar: "🤝",
        timestamp: "Just now",
        content:
          "Hi there, Sarah here. I specialize in headcount planning, talent retention benchmarks, compensation parity, and operational hiring velocity.",
        provider: "nuralix-ai",
        nextSteps: ["Simulate Engineering Hire", "Check Revenue Per FTE", "Benchmark Tech Salaries in India"],
      },
    ],
    operations: [
      {
        id: "msg_init_ops",
        sender: "agent",
        agentId: "operations",
        agentName: "David (Operations AI)",
        avatar: "⚙️",
        timestamp: "Just now",
        content:
          "David active. I optimize your day-to-day workflow pipelines, eliminate manual friction, and ensure customer delivery SLAs remain in the top quartile.",
        provider: "nuralix-ai",
        nextSteps: ["Launch Workflows Builder", "Audit Delivery Delays", "Connect Zapier & Webhooks"],
      },
    ],
    strategy: [
      {
        id: "msg_init_strat",
        sender: "agent",
        agentId: "strategy",
        agentName: "Rohan (Strategy AI)",
        avatar: "🧭",
        timestamp: "Just now",
        content:
          "Rohan here. I analyze competitive defensibility, market expansion opportunities, pricing power moats, and strategic alliances.",
        provider: "nuralix-ai",
        nextSteps: ["Open SWOT Analyzer", "Simulate Tier-2 City Expansion", "Map Platform Defensibility"],
      },
    ],
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nuralix_business_profile");
      if (saved) {
        setCompanyProfile(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, isTyping, activeAgentId]);

  const activeAgent = EXECUTIVE_AGENTS.find(a => a.id === activeAgentId) || EXECUTIVE_AGENTS[0];
  const currentMessages = conversations[activeAgentId] || [];

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      agentId: activeAgentId,
      agentName: companyProfile?.founderName || "You",
      avatar: "👤",
      timestamp: "Just now",
      content: message,
    };

    setConversations(prev => ({
      ...prev,
      [activeAgentId]: [...(prev[activeAgentId] || []), userMsg],
    }));

    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    try {
      const resp = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          agentId: activeAgentId,
          companyProfile,
        }),
      });

      const data = await resp.json();
      if (data.success) {
        const agentMsg: ChatMessage = {
          id: `agt_${Date.now()}`,
          sender: "agent",
          agentId: activeAgentId,
          agentName: activeAgent.name + ` (${activeAgent.role})`,
          avatar: activeAgent.avatar,
          timestamp: "Just now",
          content: data.text,
          provider: data.provider,
        };

        setConversations(prev => ({
          ...prev,
          [activeAgentId]: [...(prev[activeAgentId] || []), agentMsg],
        }));
      }
    } catch (err) {
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: `agt_err_${Date.now()}`,
        sender: "agent",
        agentId: activeAgentId,
        agentName: activeAgent.name + ` (${activeAgent.role})`,
        avatar: activeAgent.avatar,
        timestamp: "Just now",
        content: `Acknowledged for ${companyProfile?.name || "Apex Technologies"}. Based on current financial reserves (₹${Number(companyProfile?.cash || 1200000).toLocaleString("en-IN")}), I recommend maintaining strict capital discipline while executing on this initiative.`,
        provider: "nuralix-ai",
      };
      setConversations(prev => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] || []), fallbackMsg],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text">AI Workspace</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
              Executive Suite
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Universal intelligence command center. Converse with your specialist AI executive team and launch connected tools.
          </p>
        </div>

        {/* Company Telemetry pill */}
        <div className="flex items-center gap-2 text-[11px] bg-surface-2 border border-line px-3 py-1.5 rounded-lg text-text-muted shrink-0">
          <Building2 className="w-3.5 h-3.5 text-brass" />
          <span className="font-semibold text-text">{companyProfile?.name || "Apex Technologies"}</span>
          <span>·</span>
          <span>₹{Number(companyProfile?.revenue || 500000).toLocaleString("en-IN")}/mo</span>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {EXECUTIVE_AGENTS.map(agent => {
          const isSelected = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => setActiveAgentId(agent.id)}
              className={`p-2.5 rounded-xl border text-left transition-all btn-tactile cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-surface-2 border-brass ring-1 ring-brass/40 shadow-sm"
                  : "bg-surface border-line hover:border-line-strong opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-lg">{agent.avatar}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${agent.color}`}>
                  {agent.role.replace(" AI", "")}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-text truncate">{agent.name}</div>
                <div className="text-[10px] text-text-muted truncate">{agent.badge}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Agent Detail Bar & Embedded Quick Tools */}
      <div className="p-3.5 rounded-xl border border-line bg-surface flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-xl shrink-0 shadow-inner">
            {activeAgent.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">{activeAgent.name} ({activeAgent.role})</span>
              <span className="text-[10px] text-brass bg-brass-soft px-1.5 py-0.2 rounded font-semibold">
                Active Desk
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">{activeAgent.summary}</p>
          </div>
        </div>

        {/* Quick Tools Launchers (§ Embedded in relevant agents) */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Wrench className="w-3 h-3 text-brass" />
            <span>Agent Tools:</span>
          </span>
          {activeAgent.quickTools.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-surface border border-line hover:border-line-strong text-text btn-tactile inline-flex items-center gap-1 shadow-2xs"
            >
              <span>{tool.name}</span>
              <ArrowRight className="w-2.5 h-2.5 text-text-muted" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="rounded-2xl border border-line bg-surface shadow-theme flex flex-col h-[520px] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {currentMessages.map(msg => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border ${
                    isUser
                      ? "bg-brass text-white border-brass"
                      : "bg-surface-2 border-line text-text"
                  }`}
                >
                  {msg.avatar}
                </div>

                <div className="space-y-1.5 max-w-lg">
                  <div className={`flex items-center gap-2 text-[10px] ${isUser ? "justify-end" : ""}`}>
                    <span className="font-bold text-text">{msg.agentName}</span>
                    <span className="text-text-muted">{msg.timestamp}</span>
                    {msg.provider && (
                      <span className="px-1.5 py-0.2 rounded bg-surface-2 border border-line text-[9px] font-mono text-brass">
                        {msg.provider === "gemini" ? "⚡ Gemini Live" : "✨ Nuralix AI"}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-brass text-white font-medium rounded-tr-none shadow-sm"
                        : "bg-surface-2 border border-line text-text rounded-tl-none shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Next Steps Chips if provided */}
                    {msg.nextSteps && msg.nextSteps.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-line/60 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-jade" />
                          <span>Recommended Action Playbooks:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.nextSteps.map((step, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleSendMessage(step)}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface border border-line hover:border-brass text-text cursor-pointer hover:text-brass transition-colors"
                            >
                              → {step}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-lg">
              <div className="w-8 h-8 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-sm shrink-0">
                {activeAgent.avatar}
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-2 border border-line text-xs rounded-tl-none flex items-center gap-2 text-text-muted">
                <div className="w-2 h-2 rounded-full bg-brass animate-pulse" />
                <span>{activeAgent.name} is synthesizing business telemetry…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions Bar */}
        <div className="px-4 py-2 border-t border-line bg-surface-2/40 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brass" />
            <span>Suggested:</span>
          </span>
          {activeAgent.promptSuggestions.map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-surface border border-line hover:border-line-strong text-[11px] text-text-muted hover:text-text cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 border-t border-line bg-surface">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={`Ask ${activeAgent.name} (${activeAgent.role}) about strategy, runway, metrics, or execution…`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2.5 rounded-xl bg-brass text-white text-xs font-bold shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed btn-tactile inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
