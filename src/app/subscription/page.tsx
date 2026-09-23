"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Sparkles, CheckCircle2, X, Building2, Zap, Crown } from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

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

  // Close Plan modal on Escape
  useEscapeKey(() => setSelectedPlanForModal(null), Boolean(selectedPlanForModal));

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bizzpal_subscription_plan");
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
      localStorage.setItem("bizzpal_subscription_plan", planId);
      setCurrentPlan(planId);

      // Guarantee user session is active so AuthGuard always admits the user to dashboard
      let session = localStorage.getItem("bizzpal_user_session");
      if (!session) {
        const profileStr = localStorage.getItem("bizzpal_business_profile");
        const profile = profileStr ? JSON.parse(profileStr) : null;
        const userSession = {
          id: `usr_${Date.now()}`,
          email: profile?.website ? `founder@${profile.website.replace(/^https?:\/\//, '')}` : "founder@mycompany.in",
          name: profile?.founderName || "Founder",
          role: "owner",
          provider: "email",
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem("bizzpal_user_session", JSON.stringify(userSession));
      }
    } catch (e) {
      // ignore
    }

    notify(`${planName} activated! Launching your Business OS…`);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  const [plans, setPlans] = useState<PlanTier[]>([
    {
      id: "free",
      name: "BizzPal Free / Demo",
      tagline: "Try BizzPal free to see how it works.",
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
      ctaLabel: "Start Free & Open Dashboard",
    },
    {
      id: "starter",
      name: "Starter Business OS",
      tagline: "For solo founders and early teams (1-5 people).",
      price: "₹3,999",
      period: "/month",
      color: "border-cyan-400/30 text-cyan-400",
      badge: "Most Popular",
      isPopular: true,
      features: [
        "All Free tier features",
        "All 3 AI Executives (CEO, CFO, CMO)",
        "Automated Daily 8:00 AM WhatsApp Briefings",
        "Connect 3 Business Tools (Stripe, Slack, Zoho)",
        "Cash Runway & Burn Alarm System",
        "Unlimited AI Strategy Consultations",
        "3 Team Member Seats",
        "Email & WhatsApp Support",
      ],
      ctaLabel: "Activate Starter Plan",
    },
    {
      id: "growth",
      name: "Growth Scale",
      tagline: "For expanding businesses ready to scale (5-30 people).",
      price: "₹9,999",
      period: "/month",
      color: "border-violet-400/30 text-violet-400",
      badge: "Recommended",
      features: [
        "All Starter tier features",
        "Scenario Planner & Simulator",
        "Executive Playbooks & Growth Vectors",
        "Connect Unlimited Tools & Bank Accounts",
        "Weekly AI Strategic Audits",
        "Custom KPI Dashboards & Role-based Access",
        "10 Team Member Seats",
        "Dedicated Account Manager",
      ],
      ctaLabel: "Activate Growth Scale",
    },
    {
      id: "enterprise",
      name: "Enterprise Custom",
      tagline: "For mid-market companies & conglomerates (30+ people).",
      price: "Custom",
      period: "/billed annually",
      color: "border-amber-400/30 text-amber-400",
      badge: "Enterprise",
      features: [
        "All Growth Scale features",
        "Self-hosted / Dedicated Cloud Deployment",
        "Custom AI Executive Models trained on your data",
        "Custom ERP & Legacy Integrations",
        "Enterprise SLA (99.9% uptime)",
        "Unlimited Seats & Departments",
        "SOC 2 Type II & ISO 27001 Compliance",
        "24/7 Executive Hotline",
      ],
      ctaLabel: "Contact Enterprise Sales",
    },
  ]);

  useEffect(() => {
    fetch("/api/public/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.plans) && d.plans.length > 0) {
          setPlans(d.plans.filter((p: any) => p.enabled !== false));
        }
      })
      .catch(() => {});
  }, []);

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
                alt="BizzPal Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-text font-sans">BizzPal</span>
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brass-soft border border-brass/35 text-brass text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Plans & Pricing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight font-sans">
            Choose the Plan That Fits Your Business
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Start free to see what BizzPal can do, or choose a plan with more tools, AI executives, and automated workflows.
          </p>
        </div>

        {/* 4 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map(p => {
            const isStarter = p.id === "starter" || p.isPopular;
            const isGrowth = p.id === "growth";
            const isEnterprise = p.id === "enterprise";
            const isFree = p.id === "free";

            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  isStarter
                    ? "bg-surface border-amber-500/80 shadow-[0_12px_36px_rgba(245,197,66,0.18)] ring-2 ring-amber-500/30 scale-[1.02] lg:-translate-y-1.5"
                    : isGrowth
                    ? "bg-surface/95 border-indigo-500/35 hover:border-indigo-500/60 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/15 backdrop-blur-xl hover:-translate-y-1"
                    : isEnterprise
                    ? "bg-surface/95 border-violet-500/35 hover:border-violet-500/60 shadow-lg shadow-violet-500/5 hover:shadow-violet-500/15 backdrop-blur-xl hover:-translate-y-1"
                    : "bg-surface/95 border-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/15 backdrop-blur-xl hover:-translate-y-1"
                }`}
              >
                {p.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      isStarter
                        ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold shadow-md shadow-amber-500/25"
                        : isGrowth
                        ? "bg-indigo-500/15 border border-indigo-500/35 text-indigo-600 dark:text-indigo-400 font-bold"
                        : isEnterprise
                        ? "bg-violet-500/15 border border-violet-500/35 text-violet-600 dark:text-violet-300 font-bold"
                        : "bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 font-bold"
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
                    <span
                      className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                        isStarter
                          ? "text-amber-500 dark:text-amber-400"
                          : isGrowth
                          ? "text-indigo-600 dark:text-indigo-400"
                          : isEnterprise
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
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
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isStarter
                                ? "text-amber-500"
                                : isGrowth
                                ? "text-indigo-500"
                                : isEnterprise
                                ? "text-violet-500"
                                : "text-emerald-500"
                            }`}
                          />
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
                      isStarter
                        ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold shadow-md hover:shadow-amber-500/30 hover:brightness-105"
                        : isGrowth
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/25 hover:brightness-105"
                        : isEnterprise
                        ? "bg-surface-2 hover:bg-violet-500/15 border border-line-strong hover:border-violet-500/50 text-text font-bold"
                        : "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-600 dark:text-emerald-300 font-bold"
                    }`}
                  >
                    {p.ctaLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border border-line bg-surface shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
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
    </div>
  );
}
