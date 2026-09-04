"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles, Send, Tag, CheckCircle2, Search, Filter } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/Badge";

export default function FullChatPage() {
  const [selectedThread, setSelectedThread] = useState("thread_1");
  const [input, setInput] = useState("");

  const threads = [
    { id: "thread_1", title: "Top client concentration & renewal strategy", agent: "Astra (CEO)", date: "Today", unread: false },
    { id: "thread_2", title: "Runway forecast & Q4 AE hiring capacity", agent: "Marcus (CFO)", date: "Yesterday", unread: false },
    { id: "thread_3", title: "CAC payback reduction & paid channel audit", agent: "Elena (CMO)", date: "Sep 2", unread: false },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row rounded-xl border border-line bg-surface shadow-theme overflow-hidden">
      {/* Thread list column */}
      <div className="w-full md:w-80 border-r border-line bg-surface flex flex-col">
        <div className="p-3 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brass" />
            <span className="text-xs font-bold text-text uppercase tracking-wider">Executive Threads</span>
          </div>
          <button type="button" className="text-[11px] text-brass hover:underline font-semibold">
            + New Thread
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-line">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-md bg-surface-2 border border-line text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-line/60">
          {threads.map(thread => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setSelectedThread(thread.id)}
              className={`w-full text-left p-3 transition-colors flex flex-col gap-1 ${
                selectedThread === thread.id
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
        </div>
      </div>

      {/* Main Conversation Canvas on Serif Document Surface */}
      <div className="flex-1 flex flex-col bg-surface-2/30">
        <div className="p-3.5 border-b border-line bg-surface flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-text">
              Top client concentration & renewal strategy
            </h1>
            <p className="text-xs text-text-muted">
              Convened: Astra (CEO AI) & Marcus (CFO AI) · Source: Verified telemetry
            </p>
          </div>
          <ProvenanceBadge type="from_data" />
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span>👤</span>
              <span className="font-semibold text-text">You</span>
              <span>· 09:12 AM</span>
            </div>
            <div className="p-4 rounded-xl bg-brass text-white text-xs max-w-2xl font-medium leading-relaxed">
              How should we handle the fact that our largest client represents 38% of our recurring revenue? What are the immediate risks to cash runway?
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span>👑</span>
              <span className="font-semibold text-text">Astra (CEO AI)</span>
              <span>· 09:13 AM</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-jade/10 text-jade border border-jade/30">
                Verified From Ledger
              </span>
            </div>
            <div className="p-5 rounded-xl bg-surface border border-line text-xs sm:text-sm text-text surface-document max-w-3xl space-y-3 shadow-theme">
              <p>
                Here is our joint assessment based on your active trailing metrics and client renewal schedules:
              </p>

              <div className="space-y-2 pt-2 border-t border-line/60">
                <div>
                  <span className="font-semibold text-brass text-xs uppercase tracking-wider block">
                    1. The Situation
                  </span>
                  <p className="text-text-muted mt-0.5 leading-relaxed">
                    Client &ldquo;Enterprise Alpha&rdquo; currently accounts for $18,500 of your $48,200 MRR (38.4%). Their annual contract matures in 74 days.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-brass text-xs uppercase tracking-wider block">
                    2. Quantitative Analysis
                  </span>
                  <p className="text-text-muted mt-0.5 leading-relaxed">
                    Your monthly net burn is $12,400 with $89,000 cash on hand (7.2 months runway). If this account churns, monthly gross profit falls by $14,430, flipping your burn to $26,830 and compressing runway to 3.3 months.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-brass text-xs uppercase tracking-wider block">
                    3. Executive Recommendation
                  </span>
                  <p className="text-text font-medium mt-0.5 leading-relaxed">
                    Initiate an early 24-month contract renewal lock-in this week offering a grandfathered SLA discount in exchange for quarterly advance billing. Concurrently, fast-track two secondary prospects to dilute single-client share below 25%.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-lg bg-rust/10 border border-rust/20">
                    <span className="font-bold text-rust text-[10px] uppercase block">
                      4. Catastrophic Risk
                    </span>
                    <p className="text-text-muted text-xs mt-1">
                      Account non-renewal without replacement forces emergency headcount cuts within 90 days.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-jade/10 border border-jade/20">
                    <span className="font-bold text-jade text-[10px] uppercase block">
                      5. Strategic Upside
                    </span>
                    <p className="text-text-muted text-xs mt-1">
                      Securing 24-month terms adds $444k guaranteed backlog and stabilizes valuation for future rounds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Page Composer */}
        <div className="p-4 border-t border-line bg-surface">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Reply to Astra and Marcus, or ask another strategic question..."
              className="w-full text-xs sm:text-sm pl-4 pr-12 py-3 rounded-xl border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
            />
            <button
              type="button"
              className="absolute right-2 p-2 rounded-lg bg-brass text-white btn-tactile"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
