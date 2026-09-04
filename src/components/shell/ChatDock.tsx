"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Sparkles, Tag, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";

export interface ContextChip {
  id: string;
  label: string;
  type: "metric" | "gap" | "scenario" | "page" | "task";
  payload?: any;
}

interface ChatDockProps {
  isOpen: boolean;
  onClose: () => void;
  activeContextChips?: ContextChip[];
  onRemoveChip?: (chipId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ceo" | "cfo";
  senderName: string;
  role: string;
  avatar: string;
  content: string;
  timestamp: string;
  provenance?: "from_data" | "benchmark" | "estimate";
  situation?: string;
  analysis?: string;
  recommendation?: string;
  risks?: string;
  opportunities?: string;
  nextSteps?: string[];
  actionTaken?: string;
}

export function ChatDock({
  isOpen,
  onClose,
  activeContextChips = [],
  onRemoveChip,
}: ChatDockProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "ceo",
      senderName: "Astra",
      role: "CEO AI",
      avatar: "👑",
      content: "Good morning. I've reviewed your latest pipeline numbers and runway metrics. How can I assist with your executive priorities today?",
      timestamp: "09:00 AM",
      situation: "Q3 pipeline is currently 2.4x quota; cash runway sits at 7.2 months.",
      analysis: "Top client represents 38% of total revenue ($18,500/mo of $48,000 MRR). This triggers our Layer 1 critical concentration rule.",
      recommendation: "Prioritize closing the two late-stage mid-market prospects to reduce concentration under 25% within 60 days.",
      risks: "If top account churns or slows payment, runway drops from 7.2 to 4.1 months immediately.",
      opportunities: "Cross-selling the enterprise telemetry tier could yield an extra $4,200/mo with zero incremental CAC.",
      nextSteps: [
        "Create task: Review contract renewal terms for primary client",
        "Run scenario simulation: Model 15% pricing increase vs 5% churn",
      ],
      provenance: "from_data",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Keyboard shortcut: ⌘J or Ctrl+J to toggle dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      senderName: "You",
      role: "Founder / Operator",
      avatar: "👤",
      content: input,
      timestamp: "Just now",
    };

    setMessages(prev => [...prev, userMsg]);
    const question = input;
    setInput("");
    setIsStreaming(true);

    // Simulated executive response using the 6-part executive structure (§12.2)
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "cfo",
        senderName: "Marcus",
        role: "CFO AI",
        avatar: "📊",
        content: `Regarding "${question}": Here is our verified financial assessment based on your active trailing metrics.`,
        timestamp: "Just now",
        situation: "Assessing capital allocation against your $12,400 monthly burn and $89,000 cash reserve.",
        analysis: "Your gross margin of 78% gives room for targeted reinvestment, but CAC payback is currently 14.2 months (benchmark median is 12 months).",
        recommendation: "Hold on senior hiring until pipeline coverage crosses 3.2x quota. Focus existing budget on reducing CAC payback.",
        risks: "Premature hiring would shorten runway by 2.1 months before the new hire completes ramp-up.",
        opportunities: "Repricing your Starter tier from $99 to $149 can generate an immediate $3,800/mo recurring gross profit.",
        nextSteps: [
          "Create task: Audit vendor SaaS subscriptions for quick $1,200/mo savings",
          "Run simulation: Model adding 1 AE with 4-month ramp-up",
        ],
        provenance: "from_data",
      };
      setMessages(prev => [...prev, replyMsg]);
      setIsStreaming(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="AI Executive Team Chat"
      className="fixed inset-y-0 right-0 z-50 flex w-full md:w-[480px] lg:w-[440px] bg-surface border-l border-line shadow-2xl flex-col transition-all duration-base ease-out-custom"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brass/15 text-brass flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-xs text-text flex items-center gap-1.5">
              <span>Executive Team AI</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-jade/15 text-jade font-semibold">
                Online
              </span>
            </div>
            <div className="text-[10px] text-text-muted">Astra (CEO) & Marcus (CFO)</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden sm:inline-block text-[10px] text-text-muted font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-line">
            ⌘J
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-2 btn-tactile"
            aria-label="Close AI Executive Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visible Context Chips above chat (§11.2) */}
      {activeContextChips.length > 0 && (
        <div className="px-3 py-1.5 bg-surface-2/70 border-b border-line flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[10px] uppercase font-semibold text-text-muted">Context:</span>
          {activeContextChips.map(chip => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-surface border border-line text-text"
            >
              <Tag className="w-2.5 h-2.5 text-brass" />
              <span>{chip.label}</span>
              {onRemoveChip && (
                <button
                  type="button"
                  onClick={() => onRemoveChip(chip.id)}
                  className="text-text-muted hover:text-rust ml-0.5"
                  title="Remove context chip"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-text-muted px-1">
                <span>{msg.avatar}</span>
                <span className="font-semibold text-text">{msg.senderName}</span>
                <span>({msg.role})</span>
                <span>· {msg.timestamp}</span>
                {msg.provenance && (
                  <span className="ml-1 text-[9px] px-1 rounded bg-jade/10 text-jade border border-jade/30">
                    From Data
                  </span>
                )}
              </div>

              <div
                className={`p-3.5 rounded-xl text-xs max-w-[95%] border ${
                  isUser
                    ? "bg-brass text-white border-brass font-medium"
                    : "bg-surface-2 border-line text-text surface-document"
                }`}
              >
                <p className="mb-2 leading-relaxed">{msg.content}</p>

                {/* Substantive 6-part executive structure on document surface (§12.2) */}
                {msg.situation && (
                  <div className="mt-3 pt-3 border-t border-line/60 space-y-2 text-[11.5px]">
                    <div>
                      <span className="font-semibold text-text uppercase tracking-wider text-[9.5px] block text-brass">
                        1. The Situation
                      </span>
                      <p className="text-text-muted mt-0.5">{msg.situation}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-text uppercase tracking-wider text-[9.5px] block text-brass">
                        2. Analysis
                      </span>
                      <p className="text-text-muted mt-0.5">{msg.analysis}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-text uppercase tracking-wider text-[9.5px] block text-brass">
                        3. Recommendation
                      </span>
                      <p className="text-text font-medium mt-0.5">{msg.recommendation}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded bg-rust/10 border border-rust/20">
                        <span className="font-semibold text-rust text-[9px] uppercase block">
                          4. Key Risk
                        </span>
                        <p className="text-text-muted text-[10.5px] mt-0.5">{msg.risks}</p>
                      </div>
                      <div className="p-2 rounded bg-jade/10 border border-jade/20">
                        <span className="font-semibold text-jade text-[9px] uppercase block">
                          5. Opportunity
                        </span>
                        <p className="text-text-muted text-[10.5px] mt-0.5">{msg.opportunities}</p>
                      </div>
                    </div>

                    {msg.nextSteps && msg.nextSteps.length > 0 && (
                      <div className="pt-1">
                        <span className="font-semibold text-text uppercase tracking-wider text-[9.5px] block text-brass mb-1">
                          6. Immediate Actions
                        </span>
                        <div className="space-y-1">
                          {msg.nextSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-1.5 rounded bg-surface border border-line text-[11px]"
                            >
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brass shrink-0" />
                                <span className="truncate">{step}</span>
                              </div>
                              <button
                                type="button"
                                className="text-[10px] text-brass hover:underline shrink-0 ml-2 font-medium"
                              >
                                Execute
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-text-muted p-2 rounded-lg bg-surface-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-brass animate-spin" />
            <span>Consulting Marcus (CFO) and verifying active ledger metrics…</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts (§11.4) */}
      <div className="px-3 py-1.5 bg-surface-2/40 border-t border-line flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
        <span className="text-[10px] text-text-muted font-medium shrink-0">Ask:</span>
        <button
          type="button"
          onClick={() => setInput("What should I do about our top client being 38% of revenue?")}
          className="px-2 py-0.5 rounded-full border border-line bg-surface text-text hover:border-brass transition-colors"
        >
          Top client risk?
        </button>
        <button
          type="button"
          onClick={() => setInput("Can we afford to hire two senior engineers before Q4?")}
          className="px-2 py-0.5 rounded-full border border-line bg-surface text-text hover:border-brass transition-colors"
        >
          Can I afford 2 engineers?
        </button>
        <button
          type="button"
          onClick={() => setInput("Simulate raising Starter price by 25%")}
          className="px-2 py-0.5 rounded-full border border-line bg-surface text-text hover:border-brass transition-colors"
        >
          Model 25% price increase
        </button>
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="p-3 border-t border-line bg-surface">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your executive team (e.g. @cfo runway impact)..."
            className="w-full text-xs pl-3 pr-10 py-2.5 rounded-lg border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-1.5 p-1.5 rounded-md bg-brass text-white disabled:opacity-40 btn-tactile"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
