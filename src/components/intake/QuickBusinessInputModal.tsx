"use client";

import React, { useState, useEffect, useRef } from "react";
import { PortalModal } from "@/components/ui/PortalModal";
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Zap,
  RefreshCw,
  Clock
} from "lucide-react";
import { parseNaturalBusinessInput, ExtractedBusinessRecord } from "@/lib/intake/nlpParser";
import { emitBusinessDataUpdated } from "@/lib/upload/events";

interface QuickBusinessInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickBusinessInputModal({ isOpen, onClose, onSuccess }: QuickBusinessInputModalProps) {
  const [activeTab, setActiveTab] = useState<"natural" | "voice" | "form" | "integrations">("natural");

  // Natural Input State
  const [naturalText, setNaturalText] = useState("");
  const [extractedRecord, setExtractedRecord] = useState<ExtractedBusinessRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Structured Form State
  const [formData, setFormData] = useState({
    dailyRevenue: "",
    dailyOrders: "",
    dailyExpenses: "",
    cashOnHand: "",
    operationalNotes: "",
  });

  // Example Prompt Pills
  const EXAMPLE_PROMPTS = [
    "Today we received 42 orders and revenue was ₹85,000",
    "Revenue today ₹1,20,000, 60 orders, and ₹25,000 ad spend",
    "Closed enterprise deal for ₹4,50,000 with 3 annual contracts",
    "Hired 2 engineers today, team headcount is now 16",
  ];

  // Live NLP Extraction effect
  useEffect(() => {
    if (naturalText.trim().length >= 4) {
      const parsed = parseNaturalBusinessInput(naturalText);
      setExtractedRecord(parsed);
    } else {
      setExtractedRecord(null);
    }
  }, [naturalText]);

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setVoiceTranscript(currentTranscript);
            setNaturalText(currentTranscript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch {
        // Speech not supported or permission denied
      }
    }
  }, []);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      // Simulated voice if browser doesn't support Web Speech API
      if (!isListening) {
        setIsListening(true);
        setVoiceTranscript("Listening to voice dictation…");
        setTimeout(() => {
          const sample = "Today we received 42 orders and revenue was ₹85,000 with ₹18,000 expenses";
          setVoiceTranscript(sample);
          setNaturalText(sample);
          setIsListening(false);
        }, 2200);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Commit Business Input
  const handleCommitRecord = async (dataToCommit: {
    dailyRevenue?: number;
    dailyOrders?: number;
    dailyExpenses?: number;
    cashOnHand?: number;
    teamSize?: number;
    notes?: string;
  }) => {
    setIsSubmitting(true);
    try {
      // 1. Fetch existing profile
      const savedProfileStr = localStorage.getItem("nuralix_business_profile");
      const existing = savedProfileStr ? JSON.parse(savedProfileStr) : {};

      // 2. Compute updated metrics
      const currentMonthlyRev = Number(existing.revenue || existing.monthlyRevenue) || 500000;
      const currentBurn = Number(existing.burn || existing.monthlyBurn) || 150000;
      const currentCash = Number(existing.cash || existing.cashOnHand) || 1200000;

      // Project daily amounts into monthly equivalents if provided, or add incremental daily cash
      const newMonthlyRev = dataToCommit.dailyRevenue
        ? Math.round(dataToCommit.dailyRevenue * 30)
        : currentMonthlyRev;

      const newBurn = dataToCommit.dailyExpenses
        ? Math.round(dataToCommit.dailyExpenses * 30)
        : currentBurn;

      const newCash = dataToCommit.cashOnHand
        ? dataToCommit.cashOnHand
        : (dataToCommit.dailyRevenue ? currentCash + dataToCommit.dailyRevenue : currentCash);

      const newAnnualRev = newMonthlyRev * 12;

      const updatedProfile = {
        ...existing,
        revenue: newMonthlyRev,
        monthlyRevenue: newMonthlyRev,
        annualRevenue: newAnnualRev,
        burn: newBurn,
        monthlyBurn: newBurn,
        cash: newCash,
        cashOnHand: newCash,
        teamSize: dataToCommit.teamSize || existing.teamSize || 10,
        lastDailyInput: {
          dailyRevenue: dataToCommit.dailyRevenue,
          dailyOrders: dataToCommit.dailyOrders,
          dailyExpenses: dataToCommit.dailyExpenses,
          recordedAt: new Date().toISOString(),
          notes: dataToCommit.notes || naturalText.trim(),
        },
      };

      // 3. Save to localStorage
      localStorage.setItem("nuralix_business_profile", JSON.stringify(updatedProfile));

      // 4. Save to persistent SQLite DB via API
      try {
        await fetch("/api/business/intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updatedProfile.name,
            monthlyRevenue: newMonthlyRev,
            annualRevenue: newAnnualRev,
            monthlyBurn: newBurn,
            cashOnHand: newCash,
            teamSize: updatedProfile.teamSize,
          }),
        });
      } catch (err) {
        console.error("Failed to sync daily record with backend API", err);
      }

      // 5. Emit live sync event across dashboard
      emitBusinessDataUpdated({
        name: updatedProfile.name,
        founderName: updatedProfile.founderName,
        industry: updatedProfile.industry,
        industryLabel: updatedProfile.industryLabel,
        revenue: newMonthlyRev,
        monthlyRevenue: newMonthlyRev,
        annualRevenue: newAnnualRev,
        burn: newBurn,
        monthlyBurn: newBurn,
        cash: newCash,
        cashOnHand: newCash,
        teamSize: updatedProfile.teamSize,
        grossMargin: updatedProfile.grossMargin || 80,
      });

      setSuccessMessage("Business telemetry updated successfully! Dashboard recalibrated.");
      setTimeout(() => {
        setSuccessMessage(null);
        setNaturalText("");
        setExtractedRecord(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 1400);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommitRecord({
      dailyRevenue: formData.dailyRevenue ? Number(formData.dailyRevenue) : undefined,
      dailyOrders: formData.dailyOrders ? Number(formData.dailyOrders) : undefined,
      dailyExpenses: formData.dailyExpenses ? Number(formData.dailyExpenses) : undefined,
      cashOnHand: formData.cashOnHand ? Number(formData.cashOnHand) : undefined,
      notes: formData.operationalNotes,
    });
  };

  if (!isOpen) return null;

  return (
    <PortalModal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface-2/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brass-soft flex items-center justify-center text-brass">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-text">Day-to-Day Business Input</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase">
                  Multi-Modal
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Record operational updates naturally. Nuralix extracts, validates, and syncs metrics.
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

        {/* Tab Navigation */}
        <div className="flex border-b border-line bg-surface-2/20 px-5 pt-2 gap-2">
          {[
            { id: "natural", label: "Natural Language", icon: Send },
            { id: "voice", label: "Voice Dictation", icon: Mic },
            { id: "form", label: "Structured Form", icon: FileText },
            { id: "integrations", label: "Auto-Sync Feeds", icon: Zap },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-brass text-brass"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-jade/10 border border-jade/30 flex items-center gap-2 text-xs font-semibold text-jade animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Natural Language Chat Input */}
          {activeTab === "natural" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text block mb-1.5">
                  Type your daily operations update in natural language:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={naturalText}
                    onChange={e => setNaturalText(e.target.value)}
                    placeholder="e.g. Today we received 42 orders and revenue was ₹85,000 with ₹15,000 ad spend."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-line text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brass resize-none"
                    autoFocus
                  />
                  {naturalText && (
                    <button
                      type="button"
                      onClick={() => setNaturalText("")}
                      className="absolute right-2.5 top-2.5 text-text-muted hover:text-text text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Example Suggestions */}
              <div>
                <span className="text-[11px] font-semibold text-text-muted block mb-1.5">
                  Quick examples to try:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLE_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNaturalText(prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-text-muted hover:text-brass hover:border-brass/40 transition-colors text-left btn-tactile"
                    >
                      “{prompt}”
                    </button>
                  ))}
                </div>
              </div>

              {/* Extracted Record Card */}
              {extractedRecord && (
                <div className="p-4 rounded-xl border border-brass/40 bg-brass-soft/30 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brass uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Structured Business Record
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-text font-semibold">
                      {Math.round(extractedRecord.confidence * 100)}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-surface border border-line">
                      <span className="text-[10px] text-text-muted block">Daily Orders</span>
                      <span className="text-xs font-bold text-text">
                        {extractedRecord.dailyOrders !== undefined ? extractedRecord.dailyOrders : "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-line">
                      <span className="text-[10px] text-text-muted block">Daily Revenue</span>
                      <span className="text-xs font-bold text-jade">
                        {extractedRecord.dailyRevenue !== undefined
                          ? `₹${extractedRecord.dailyRevenue.toLocaleString("en-IN")}`
                          : "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-line">
                      <span className="text-[10px] text-text-muted block">Daily Burn/Cost</span>
                      <span className="text-xs font-bold text-amber">
                        {extractedRecord.dailyExpenses !== undefined
                          ? `₹${extractedRecord.dailyExpenses.toLocaleString("en-IN")}`
                          : "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-line">
                      <span className="text-[10px] text-text-muted block">Monthly Projected</span>
                      <span className="text-xs font-bold text-text">
                        {extractedRecord.monthlyRevenueEquivalent
                          ? `₹${extractedRecord.monthlyRevenueEquivalent.toLocaleString("en-IN")}/mo`
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleCommitRecord(extractedRecord)}
                      className="px-4 py-2 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? "Recording…" : "Confirm & Record into Ledger"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Voice Dictation */}
          {activeTab === "voice" && (
            <div className="space-y-4 text-center py-4">
              <div className="flex flex-col items-center justify-center space-y-3">
                <button
                  type="button"
                  onClick={toggleVoiceListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                    isListening
                      ? "bg-rust text-white ring-4 ring-rust/30 animate-pulse"
                      : "bg-brass text-white hover:brightness-110"
                  }`}
                >
                  {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
                <div>
                  <span className="text-xs font-bold text-text block">
                    {isListening ? "Listening… Speak your daily numbers clearly" : "Click microphone to start voice recording"}
                  </span>
                  <p className="text-[11px] text-text-muted mt-0.5 max-w-sm mx-auto">
                    Dictate in Hindi, English, or mixed: “Today we received 42 orders and revenue was 85,000.”
                  </p>
                </div>
              </div>

              {voiceTranscript && (
                <div className="p-3 rounded-xl bg-surface-2 border border-line text-left text-xs font-mono text-text">
                  <strong>Transcribed:</strong> “{voiceTranscript}”
                </div>
              )}

              {extractedRecord && (
                <div className="text-left">
                  <div className="p-3.5 rounded-xl border border-brass/40 bg-brass-soft/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-text block">
                        Extracted: {extractedRecord.summary}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        Ready to validate and record to business profile.
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleCommitRecord(extractedRecord)}
                      className="px-3.5 py-1.5 rounded-lg bg-brass text-white font-bold text-xs hover:brightness-110 btn-tactile cursor-pointer"
                    >
                      {isSubmitting ? "Saving…" : "Save Record"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Structured Daily Form */}
          {activeTab === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Today's Revenue (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.dailyRevenue}
                    onChange={e => setFormData({ ...formData, dailyRevenue: e.target.value })}
                    placeholder="e.g. 85000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-xs text-text focus:ring-1 focus:ring-brass focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Orders / Transactions Count
                  </label>
                  <input
                    type="number"
                    value={formData.dailyOrders}
                    onChange={e => setFormData({ ...formData, dailyOrders: e.target.value })}
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-xs text-text focus:ring-1 focus:ring-brass focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Today's Operating Expenses (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.dailyExpenses}
                    onChange={e => setFormData({ ...formData, dailyExpenses: e.target.value })}
                    placeholder="e.g. 15000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-xs text-text focus:ring-1 focus:ring-brass focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Liquid Bank Reserves (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.cashOnHand}
                    onChange={e => setFormData({ ...formData, cashOnHand: e.target.value })}
                    placeholder="e.g. 1200000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-xs text-text focus:ring-1 focus:ring-brass focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Operational Context / Key Win
                </label>
                <input
                  type="text"
                  value={formData.operationalNotes}
                  onChange={e => setFormData({ ...formData, operationalNotes: e.target.value })}
                  placeholder="e.g. Launched Diwali campaign, conversion rate up 14%."
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-xs text-text focus:ring-1 focus:ring-brass focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Updating Platform…" : "Commit Daily Input"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Tab 4: Automated Integrations Feed */}
          {activeTab === "integrations" && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">
                When integrations are active, Nuralix pulls data automatically so you don’t need to enter numbers manually.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { name: "Stripe Revenue Telemetry", status: "Live Sync Active", type: "Recurring MRR & Invoices", icon: CreditCard, color: "text-emerald-400" },
                  { name: "Shopify / Storefront", status: "Syncing Every 15m", type: "Order volumes & AOV", icon: ShoppingBag, color: "text-purple-400" },
                  { name: "Zoho Books / QuickBooks", status: "Reconciled Today", type: "P&L, Vendor Invoices, GST", icon: Activity, color: "text-blue-400" },
                  { name: "Slack / WhatsApp Bot", status: "Bidirectional Ready", type: "Daily check-in prompts", icon: Zap, color: "text-amber-400" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3 rounded-xl border border-line bg-surface-2/40 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-surface border border-line flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-text block truncate">{item.name}</span>
                        <span className="text-[10px] text-text-muted block">{item.type}</span>
                        <span className="text-[10px] font-semibold text-jade flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-surface-2 border border-line text-xs flex items-center justify-between">
                <span className="text-text-muted text-[11px]">
                  Next scheduled telemetry pull in <strong className="text-text">4 minutes</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMessage("Triggered on-demand synchronization with connected tools!");
                    setTimeout(() => setSuccessMessage(null), 2500);
                  }}
                  className="px-3 py-1 rounded-md bg-brass text-white text-[11px] font-bold hover:brightness-110 btn-tactile cursor-pointer"
                >
                  Sync Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalModal>
  );
}
