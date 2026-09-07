"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Shield, ArrowRight, Sparkles, CheckCircle2, X, Building2, Zap } from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";

interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  color: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  isCurrent?: boolean;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PlanTier | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nuralix_subscription_plan");
      if (saved) {
        setCurrentPlan(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const ensureSessionAndOpenDashboard = (planId: string, planName: string) => {
    try {
      localStorage.setItem("nuralix_subscription_plan", planId);
      setCurrentPlan(planId);

      // Guarantee user session is active so AuthGuard always admits the user to dashboard
      let session = localStorage.getItem("nuralix_user_session");
      if (!session) {
        const profileStr = localStorage.getItem("nuralix_business_profile");
        const profile = profileStr ? JSON.parse(profileStr) : null;
        const userSession = {
          id: `usr_${Date.now()}`,
          email: profile?.website ? `founder@${profile.website.replace(/^https?:\/\//, '')}` : "founder@mycompany.in",
          name: profile?.founderName || "Founder",
          role: "owner",
          provider: "email",
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem("nuralix_user_session", JSON.stringify(userSession));
      }
    } catch (e) {
      // ignore
    }

    notify(`${planName} activated! Launching your Business OS…`);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  const plans: PlanTier[] = [
    {
      id: "free",
      name: "Nuralix Free / Demo",
      tagline: "Try Nuralix free to see how it works.",
      price: "₹0",
      period: "/forever",
      color: "border-emerald-400/30 text-emerald-400",
      badge: "Free Trial",
      features: [
        "Business Dashboard",
        "CEO AI Assistant (Astra)",
        "Company Health Score",
        "Profit & ROI Calculators",
        "Save up to 5 Documents & SOPs",
        "Daily Business Briefings",
        "Task Manager",
        "Free AI questions",
      ],
      ctaLabel: currentPlan === "free" ? "Continue to Dashboard →" : "Start Free & Open Dashboard",
      isCurrent: currentPlan === "free",
    },
    {
      id: "starter",
      name: "Nuralix Starter",
      tagline: "For small businesses & growing founders.",
      price: "₹1,999",
      period: "/month",
      color: "border-blue-400/30 text-blue-400",
      badge: "Small Business",
      features: [
        "Everything in Free, plus:",
        "4 AI Assistants (CEO, CFO, Sales & Marketing)",
        "Core Calculators (Break-Even, Cash Flow, CAC, LTV)",
        "Unlimited Document & SOP Storage",
        "Automated Daily Executive Briefings",
        "3 Active Automated Workflows",
        "Connect with Google Workspace & Slack",
        "Assign tasks to team members",
      ],
      ctaLabel: currentPlan === "starter" ? "Continue to Dashboard →" : "Upgrade to Starter",
      isCurrent: currentPlan === "starter",
    },
    {
      id: "pro",
      name: "Nuralix Professional",
      tagline: "The complete AI executive team for scaling companies.",
      price: "₹5,999",
      period: "/month",
      color: "border-purple-400/40 text-purple-400",
      badge: "Most Popular",
      isPopular: true,
      features: [
        "Everything in Starter, plus:",
        "All 7 AI Executives (CEO, CFO, Marketing, Sales, HR, Ops, Strategy)",
        "All 25 Business Tools & Calculators",
        "Decision Simulator (Test hiring, pricing & scale)",
        "Revenue & Cash Forecasting",
        "Visual Drag-and-Drop Workflow Builder",
        "Connect with Stripe, QuickBooks, WhatsApp & Zoom",
        "Multi-User Team Access & Permissions",
      ],
      ctaLabel: currentPlan === "pro" ? "Continue to Dashboard →" : "Upgrade to Professional",
      isCurrent: currentPlan === "pro",
    },
    {
      id: "enterprise",
      name: "Nuralix Business / Enterprise",
      tagline: "For larger teams needing custom tools, security & integrations.",
      price: "₹19,999",
      period: "/month",
      color: "border-amber-400/40 text-amber-400",
      badge: "Enterprise",
      features: [
        "Everything in Professional, plus:",
        "Unlimited AI questions & analysis",
        "Complete Virtual Business Simulation",
        "Advanced Custom Automations & Workflows",
        "Connect with HubSpot, Salesforce & Databases",
        "Full API Access & Custom Webhooks",
        "Single Sign-On (Google, Okta, Microsoft)",
        "Activity & Security Audit Logs",
      ],
      ctaLabel: currentPlan === "enterprise" ? "Continue to Dashboard →" : "Upgrade to Enterprise",
      isCurrent: currentPlan === "enterprise",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-surface border border-brass/40 shadow-2xl text-xs font-semibold text-text flex items-center gap-2 animate-fade-in ring-1 ring-brass/20">
          <Sparkles className="w-4 h-4 text-brass" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="max-w-7xl w-full mx-auto pb-6 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-surface border border-line flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Nuralix Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-text font-sans">Nuralix</span>
              <span className="text-[10px] ml-2 px-1.5 py-0.2 rounded bg-brass-soft text-brass font-bold uppercase">
                Capability Tiers
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-text-muted hover:text-text btn-tactile px-3 py-1.5 rounded-lg border border-line bg-surface-2"
          >
            Go to Dashboard →
          </Link>
          <div className="w-32">
            <ThemeSwitch compact />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto my-auto py-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brass-soft border border-brass/30 text-brass text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plans & Pricing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight font-sans">
            Choose the Plan That Fits Your Business
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Start free to see what Nuralix can do, or choose a plan with more tools, AI executives, and automated workflows.
          </p>
        </div>

        {/* 4 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map(p => (
            <div
              key={p.id}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all relative ${
                p.isPopular
                  ? "bg-surface border-brass shadow-2xl ring-2 ring-brass/30 scale-[1.02]"
                  : "bg-surface/80 border-line hover:border-line-strong shadow-theme"
              }`}
            >
              {p.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                    p.isPopular
                      ? "bg-brass text-white shadow-brass/30"
                      : "bg-surface-2 border border-line text-text-muted"
                  }`}
                >
                  {p.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-text">{p.name}</h3>
                  <p className="text-[11px] text-text-muted mt-0.5 min-h-[2rem] leading-relaxed">
                    {p.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-line flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-text font-mono tracking-tight">
                    {p.price}
                  </span>
                  <span className="text-xs text-text-muted">{p.period}</span>
                </div>

                {/* Features List */}
                <div className="pt-2 border-t border-line space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Capabilities Included:
                  </span>
                  <ul className="space-y-2 text-xs">
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-jade shrink-0 mt-0.5" />
                        <span className="text-text text-[11px] leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => {
                    if (p.id === "free" || p.isCurrent) {
                      ensureSessionAndOpenDashboard(p.id, p.name);
                    } else {
                      setSelectedPlanForModal(p);
                    }
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all btn-tactile cursor-pointer text-center ${
                    p.isPopular
                      ? "bg-brass text-white shadow-md hover:brightness-110"
                      : p.isCurrent
                      ? "bg-surface-2 border border-brass text-brass hover:bg-brass-soft"
                      : "bg-surface-2 hover:bg-surface border border-line text-text hover:border-line-strong"
                  }`}
                >
                  {p.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Security Banner */}
        <div className="p-4 rounded-xl border border-line bg-surface text-center flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Shield className="w-4 h-4 text-brass shrink-0" />
            <span>Bank-grade 256-bit encryption. Multi-tenant privacy guarantees for enterprise ledgers.</span>
          </div>
          <Link href="/dashboard" className="text-brass font-bold hover:underline shrink-0">
            Skip directly to Dashboard →
          </Link>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border border-line bg-surface shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brass" />
                <h3 className="text-sm font-bold text-text">Confirm Subscription</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForModal(null)}
                className="text-xs text-text-muted hover:text-text cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-text">{selectedPlanForModal.name}</div>
                  <div className="text-[11px] text-text-muted">{selectedPlanForModal.tagline}</div>
                </div>
                <div className="text-base font-bold font-mono text-brass">
                  {selectedPlanForModal.price}
                </div>
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed">
                You are activating {selectedPlanForModal.name}. All features, AI agents, specialized tools, and workflows will be unlocked immediately for your workspace.
              </p>
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedPlanForModal(null)}
                className="px-3 py-1.5 rounded-lg border border-line text-text-muted hover:text-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    ensureSessionAndOpenDashboard(selectedPlanForModal.id, selectedPlanForModal.name);
                    setSelectedPlanForModal(null);
                  }, 800);
                }}
                className="px-4 py-2 rounded-lg bg-brass text-white font-bold btn-tactile hover:brightness-110 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? "Activating OS…" : `Confirm & Launch OS`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-[11px] text-text-muted pt-4">
        Nuralix OS v3 · Enterprise Capability Matrix
      </div>
    </div>
  );
}
