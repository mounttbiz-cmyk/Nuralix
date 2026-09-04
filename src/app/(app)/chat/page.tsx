"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, Send, Tag, CheckCircle2, Search, Filter, Plus, ArrowRight } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";

interface MessageItem {
  id: string;
  sender: "user" | "ceo" | "cfo";
  senderName: string;
  avatar: string;
  time: string;
  content: string;
  provenance?: "from_data" | "benchmark" | "estimate";
  situation?: string;
  analysis?: string;
  recommendation?: string;
  risks?: string;
  opportunities?: string;
  nextSteps?: string[];
}

interface ThreadItem {
  id: string;
  title: string;
  agent: string;
  date: string;
  messages: MessageItem[];
}

export default function FullChatPage() {
  const [companyName, setCompanyName] = useState("Apex Technologies");
  const [founderName, setFounderName] = useState("Alex Sharma");
  const [industryName, setIndustryName] = useState("IT & Technology Services");
  const [monthlyRev, setMonthlyRev] = useState(500000);
  const [monthlyBurn, setMonthlyBurn] = useState(150000);
  const [cash, setCash] = useState(1200000);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nuralix_business_profile");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.name) setCompanyName(p.name);
        if (p.founderName) setFounderName(p.founderName);
        if (p.industryLabel) setIndustryName(p.industryLabel);
        else if (p.industry) setIndustryName(p.industry);
        if (p.revenue) setMonthlyRev(Number(p.revenue));
        if (p.burn) setMonthlyBurn(Number(p.burn));
        if (p.cash) setCash(Number(p.cash));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const runwayMonths = monthlyBurn > 0 ? (cash / monthlyBurn).toFixed(1) : "18+";

  const [threads, setThreads] = useState<ThreadItem[]>([
    {
      id: "thread_1",
      title: "Client concentration & quarterly contract lock-in",
      agent: "Astra (CEO)",
      date: "Today",
      messages: [
        {
          id: "m1",
          sender: "user",
          senderName: "You",
          avatar: "👤",
          time: "09:12 AM",
          content: "How should we handle the fact that our largest client represents > 30% of our recurring revenue? What are the immediate risks to cash runway?",
        },
        {
          id: "m2",
          sender: "ceo",
          senderName: "Astra (CEO AI)",
          avatar: "👑",
          time: "09:13 AM",
          provenance: "from_data",
          content: "Here is our joint executive assessment based on your active trailing ledger metrics and renewal schedules:",
          situation: `Top client accounts for approximately 35% of monthly revenue (₹${Math.round(monthlyRev * 0.35).toLocaleString("en-IN")} of ₹${monthlyRev.toLocaleString("en-IN")}/mo). Renewal is up in 74 days.`,
          analysis: `Monthly net burn is ₹${monthlyBurn.toLocaleString("en-IN")} against ₹${cash.toLocaleString("en-IN")} liquid reserves (${runwayMonths} months runway). An unhedged loss of this account would expand burn and compress runway to 4.2 months.`,
          recommendation: "Initiate an early 24-month contract renewal lock-in this week offering guaranteed SLA pricing in exchange for quarterly advance billing.",
          risks: "Client hesitation or budget freeze without replacement pipeline strains working capital.",
          opportunities: "Securing 24-month terms guarantees ₹42L+ backlog and stabilizes enterprise valuation.",
          nextSteps: [
            "Review primary agreement terms with sales leadership",
            "Model 12% price sensitivity in Decision Simulator",
          ],
        },
      ],
    },
    {
      id: "thread_2",
      title: "Runway forecast & team delivery capacity",
      agent: "Marcus (CFO)",
      date: "Yesterday",
      messages: [
        {
          id: "m2_1",
          sender: "user",
          senderName: "You",
          avatar: "👤",
          time: "02:30 PM",
          content: "Can we afford to expand engineering headcount next quarter without shortening runway below 6 months?",
        },
        {
          id: "m2_2",
          sender: "cfo",
          senderName: "Marcus (CFO AI)",
          avatar: "⚡",
          time: "02:31 PM",
          provenance: "from_data",
          content: `With current liquid reserves of ₹${cash.toLocaleString("en-IN")} and ${runwayMonths} months runway, hiring 2 engineers at ₹80,000/mo each will trim runway to 6.3 months. We recommend gating the hires behind hitting ₹${Math.round(monthlyRev * 1.15).toLocaleString("en-IN")}/mo in booked revenue.`,
        },
      ],
    },
  ]);

  const [selectedThreadId, setSelectedThreadId] = useState("thread_1");
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages, isThinking]);

  // Handle + New Thread button
  const handleNewThread = () => {
    const newId = `thread_${Date.now()}`;
    const newThread: ThreadItem = {
      id: newId,
      title: `Executive Advisory #${threads.length + 1}`,
      agent: "Astra (CEO)",
      date: "Just now",
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: "ceo",
          senderName: "Astra (CEO AI)",
          avatar: "👑",
          time: "Just now",
          content: `Good day ${founderName}. I have synchronized latest operational telemetry for ${companyName}. What strategic priority or operational bottleneck shall we address?`,
        },
      ],
    };
    setThreads(prev => [newThread, ...prev]);
    setSelectedThreadId(newId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");

    const userMsg: MessageItem = {
      id: `usr_${Date.now()}`,
      sender: "user",
      senderName: "You",
      avatar: "👤",
      time: "Just now",
      content: userText,
    };

    // Update active thread
    setThreads(prev =>
      prev.map(t =>
        t.id === activeThread.id
          ? {
              ...t,
              title: t.messages.length <= 1 ? userText.slice(0, 45) + (userText.length > 45 ? "…" : "") : t.title,
              messages: [...t.messages, userMsg],
            }
          : t
      )
    );

    setIsThinking(true);

    setTimeout(() => {
      const aiResponse: MessageItem = {
        id: `ai_${Date.now()}`,
        sender: "ceo",
        senderName: "Astra & Marcus AI",
        avatar: "👑",
        time: "Just now",
        provenance: "from_data",
        content: `Regarding "${userText}":`,
        situation: `${companyName} is currently operating at ₹${monthlyRev.toLocaleString("en-IN")} monthly run-rate with ${runwayMonths} months verified runway.`,
        analysis: `Our deterministic telemetry indicates healthy unit economics. Factoring in ₹${monthlyBurn.toLocaleString("en-IN")} monthly net burn, this decision carries low solvency risk if executed with clear operational milestones.`,
        recommendation: `Proceed with structured rollout. Assign lead ownership to delivery team and review outcomes in next week's Executive Briefing.`,
        risks: `Scope expansion or delayed invoice collections could temporarily widen monthly burn by 8-12%.`,
        opportunities: `Disciplined execution strengthens ${industryName} market positioning and expands gross margins.`,
        nextSteps: [
          `Document playbook in Knowledge Hub`,
          `Set automated solvency alarm in Automations`,
        ],
      };

      setThreads(prev =>
        prev.map(t =>
          t.id === activeThread.id
            ? { ...t, messages: [...t.messages, aiResponse] }
            : t
        )
      );
      setIsThinking(false);
    }, 1200);
  };

  const filteredThreads = threads.filter(
    t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row rounded-xl border border-line bg-surface shadow-theme overflow-hidden">
      {/* Thread list column */}
      <div className="w-full md:w-80 border-r border-line bg-surface flex flex-col shrink-0">
        <div className="p-3 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brass" />
            <span className="text-xs font-bold text-text uppercase tracking-wider">Executive Threads</span>
          </div>
          <button
            type="button"
            onClick={handleNewThread}
            className="flex items-center gap-1 text-xs text-brass hover:brightness-110 font-bold px-2 py-1 rounded-md bg-brass-soft btn-tactile cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Thread</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-line">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-md bg-surface-2 border border-line text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-line/60">
          {filteredThreads.map(thread => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setSelectedThreadId(thread.id)}
              className={`w-full text-left p-3 transition-colors flex flex-col gap-1 cursor-pointer ${
                selectedThreadId === thread.id
                  ? "bg-surface-2 border-l-2 border-brass pl-2.5"
                  : "hover:bg-surface-2/60"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span className="font-semibold text-brass">{thread.agent}</span>
                <span>{thread.date}</span>
              </div>
              <span className="text-xs font-medium text-text line-clamp-2 leading-snug">
                {thread.title}
              </span>
            </button>
          ))}

          {filteredThreads.length === 0 && (
            <div className="p-6 text-center text-xs text-text-muted">
              No matching threads found.
            </div>
          )}
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="flex-1 flex flex-col bg-surface-2/30 min-w-0">
        <div className="p-3.5 border-b border-line bg-surface flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-text truncate">
              {activeThread.title}
            </h1>
            <p className="text-xs text-text-muted truncate">
              Convened: Astra (CEO AI) & Marcus (CFO AI) · {companyName} Operating Telemetry (INR ₹)
            </p>
          </div>
          <ProvenanceBadge type="from_data" />
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeThread.messages.map(msg => {
            const isUser = msg.sender === "user";
            return (
              <div key={msg.id} className="flex flex-col space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>{msg.avatar}</span>
                  <span className="font-semibold text-text">{msg.senderName}</span>
                  <span>· {msg.time}</span>
                  {msg.provenance && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-jade/10 text-jade border border-jade/30">
                      Verified From Ledger
                    </span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed max-w-3xl ${
                    isUser
                      ? "bg-brass text-white font-medium"
                      : "bg-surface border border-line text-text surface-document shadow-theme space-y-3"
                  }`}
                >
                  <p>{msg.content}</p>

                  {/* 6-part executive structure */}
                  {msg.situation && (
                    <div className="space-y-2.5 pt-2.5 border-t border-line/60 text-xs">
                      <div>
                        <span className="font-semibold text-brass text-[10px] uppercase tracking-wider block">
                          1. The Situation
                        </span>
                        <p className="text-text-muted mt-0.5 leading-relaxed">{msg.situation}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-brass text-[10px] uppercase tracking-wider block">
                          2. Quantitative Analysis
                        </span>
                        <p className="text-text-muted mt-0.5 leading-relaxed">{msg.analysis}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-brass text-[10px] uppercase tracking-wider block">
                          3. Executive Recommendation
                        </span>
                        <p className="text-text font-medium mt-0.5 leading-relaxed">{msg.recommendation}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-lg bg-rust/10 border border-rust/20">
                          <span className="font-bold text-rust text-[9px] uppercase block">
                            4. Key Risk
                          </span>
                          <p className="text-text-muted text-[11px] mt-0.5">{msg.risks}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-jade/10 border border-jade/20">
                          <span className="font-bold text-jade text-[9px] uppercase block">
                            5. Strategic Opportunity
                          </span>
                          <p className="text-text-muted text-[11px] mt-0.5">{msg.opportunities}</p>
                        </div>
                      </div>

                      {msg.nextSteps && msg.nextSteps.length > 0 && (
                        <div className="pt-1 space-y-1">
                          <span className="font-semibold text-brass text-[10px] uppercase tracking-wider block">
                            6. Immediate Actions
                          </span>
                          {msg.nextSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded bg-surface-2 border border-line text-[11px]"
                            >
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brass shrink-0" />
                                <span>{step}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-text-muted p-3 rounded-lg bg-surface border border-line animate-pulse">
              <Sparkles className="w-4 h-4 text-brass animate-spin" />
              <span>Astra & Marcus AI synthesizing executive analysis for {companyName}…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Full Page Composer */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-line bg-surface">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your executive team (e.g. Can we afford expansion?)..."
              className="w-full text-xs sm:text-sm pl-4 pr-12 py-3 rounded-xl border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-2 p-2 rounded-lg bg-brass text-white disabled:opacity-40 btn-tactile cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
