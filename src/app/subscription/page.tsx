"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Shield, ArrowRight, Sparkles, CheckCircle2, X } from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";

interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  words: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  isCurrent?: boolean;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("starter");
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

  const plans: PlanTier[] = [
    {
      id: "starter",
      name: "Public Starter",
      tagline: "Try Nuralix free, forever.",
      price: "₹0",
      period: "/month",
      words: "35,000 words / month",
      features: [
        "Marketing Engine",
        "Decision Helper",
      ],
      ctaLabel: "Current Plan",
      isCurrent: currentPlan === "starter",
    },
    {
      id: "side_hustler",
      name: "Side-Hustler",
      tagline: "Build & market your idea.",
      price: "₹499",
      period: "/month",
      words: "120,000 words / month",
      features: [
        "Marketing Engine",
        "Business Builder",
        "Decision Helper",
      ],
      ctaLabel: "Upgrade to Side-Hustler",
      isCurrent: currentPlan === "side_hustler",
    },
    {
      id: "growth_founder",
      name: "Growth Founder",
      tagline: "Charts, images, clips & voice.",
      price: "₹2,499",
      period: "/month",
      words: "600,000 words / month",
      isPopular: true,
      features: [
        "Marketing Engine",
        "Business Builder",
        "Chart Intelligence",
        "Image Studio",
        "Business Clips",
        "Decision Helper",
      ],
      ctaLabel: "Upgrade to Growth Founder",
      isCurrent: currentPlan === "growth_founder",
    },
    {
      id: "business_empire",
      name: "Business Empire",
      tagline: "Every tool, unlimited scale.",
      price: "₹24,999",
      period: "/month",
      words: "6,000,000 words / month",
      features: [
        "Marketing Engine",
        "Business Builder",
        "Chart Intelligence",
        "Image Studio",
        "Financial Planner",
        "Growth Analyzer",
        "Diagram Builder",
        "Business Clips",
        "Decision Helper",
      ],
      ctaLabel: "Upgrade to Business Empire",
      isCurrent: currentPlan === "business_empire",
    },
  ];

  const handleSelectPlan = (plan: PlanTier) => {
    if (plan.id === "starter") {
      localStorage.setItem("nuralix_subscription_plan", "starter");
      setCurrentPlan("starter");
      notify("Public Starter plan selected! Launching your Business OS…");
      setTimeout(() => {
        router.push("/");
      }, 900);
      return;
    }

    // Open simulated Razorpay checkout modal
    setSelectedPlanForModal(plan);
  };

  const confirmPaymentAndUpgrade = () => {
    if (!selectedPlanForModal) return;
    setIsProcessing(true);

    setTimeout(() => {
      localStorage.setItem("nuralix_subscription_plan", selectedPlanForModal.id);
      setCurrentPlan(selectedPlanForModal.id);
      setIsProcessing(false);
      const planName = selectedPlanForModal.name;
      setSelectedPlanForModal(null);
      notify(`Success! You are now on the ${planName} plan.`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-surface border border-jade shadow-2xl text-xs font-semibold text-jade flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-jade" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Bar with Brand & Nav */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-line">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-surface border border-line flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Nuralix Logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-text font-sans">Nuralix</span>
            <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-brass-soft text-brass font-bold uppercase">
              Subscription
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-text font-medium flex items-center gap-1 transition-colors"
          >
            <span>Skip to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="w-28">
            <ThemeSwitch compact />
          </div>
        </div>
      </header>

      {/* Main Pricing Header */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight font-sans">
            Choose Your Plan
          </h1>
          <p className="text-sm text-text-muted">
            Pick the tier that fits your stage. Cancel anytime.
          </p>
        </div>

        {/* 4-Column Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((plan) => {
            const isSelected = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl transition-all duration-200 ${
                  plan.isPopular
                    ? "bg-surface border-2 border-[#0284c7] shadow-xl ring-1 ring-[#0284c7]/30 scale-[1.02] z-10"
                    : "bg-surface border border-line shadow-theme hover:border-line-strong"
                }`}
              >
                {/* Most Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0284c7] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <span>👑</span>
                    <span>MOST POPULAR</span>
                  </div>
                )}

                <div>
                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-text font-sans">
                      {plan.name}
                    </h2>
                    <p className="text-xs text-text-muted">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="my-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-text font-sans tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-text-muted font-normal">
                      {plan.period}
                    </span>
                  </div>

                  {/* Word limit line */}
                  <div className="text-xs text-text-muted font-medium mb-5 pb-4 border-b border-line">
                    {plan.words}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-6 text-xs text-text">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                        <span className="font-medium text-text/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all btn-tactile ${
                      plan.isPopular
                        ? "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-md hover:shadow-lg"
                        : plan.id === "starter"
                        ? isSelected
                          ? "bg-surface-2 border border-line text-text-muted cursor-default"
                          : "bg-surface border border-line text-text hover:bg-surface-2"
                        : "bg-surface border border-line-strong text-text hover:bg-surface-2 hover:border-text shadow-xs"
                    }`}
                  >
                    {plan.id === "starter" && isSelected ? "Current Plan" : plan.ctaLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Notes */}
        <div className="mt-12 text-center space-y-2 text-xs text-text-muted">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure payments via Razorpay</span>
            <span>·</span>
            <span>Cancel anytime</span>
          </div>
          <p className="text-[11px] text-text-muted/70">
            Side-Hustler & Solo Founder both map to the Pro tier on checkout.
          </p>
        </div>
      </main>

      {/* Simulated Razorpay Indian Payment Gateway Modal */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full rounded-2xl bg-surface border border-line p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                  ₹
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">Razorpay Indian Checkout</h3>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Secure 256-bit Encrypted
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForModal(null)}
                className="p-1 rounded-md text-text-muted hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Selected Plan:</span>
                <strong className="text-text">{selectedPlanForModal.name}</strong>
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>Billing Cycle:</span>
                <span className="text-text">Monthly (Recurring)</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-text pt-2 border-t border-line">
                <span>Total Amount Payable:</span>
                <span className="text-brass text-base font-mono">{selectedPlanForModal.price}</span>
              </div>
            </div>

            {/* Indian payment options list */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-text-muted block text-[11px] uppercase tracking-wider">
                Select Indian Payment Mode (Simulated)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg border border-brass bg-brass-soft/30 font-semibold text-text">
                  UPI / QR
                </div>
                <div className="p-2 rounded-lg border border-line bg-surface-2 font-medium text-text-muted">
                  NetBanking
                </div>
                <div className="p-2 rounded-lg border border-line bg-surface-2 font-medium text-text-muted">
                  Debit / Cards
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={confirmPaymentAndUpgrade}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all btn-tactile flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Authorizing via Razorpay…</span>
                ) : (
                  <span>Pay {selectedPlanForModal.price} & Activate Plan</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanForModal(null)}
                className="w-full py-2 text-xs text-text-muted hover:text-text font-medium text-center"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
