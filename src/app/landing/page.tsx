"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  TrendingUp,
  Compass,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  CheckCircle2,
  Lock,
  Play,
  Check,
  Building2,
  Users,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"briefing" | "simulator" | "health">("briefing");
  const [simRun, setSimRun] = useState(false);
  const [simProgress, setSimProgress] = useState(1000);

  const handleSimulate = () => {
    setSimRun(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 250;
      setSimProgress(p);
      if (p >= 1000) {
        clearInterval(interval);
        setSimRun(false);
      }
    }, 90);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-brass selection:text-white flex flex-col font-sans">
      {/* Background Ambient Glow & Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brass/10 dark:bg-brass/15 rounded-full blur-3xl" />
        <div className="absolute top-[600px] -right-40 w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-[1200px] -left-40 w-[600px] h-[600px] bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-line px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-text font-sans">Nuralix</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider border border-brass/20">
                Business OS
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-text-muted">
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#intelligence" className="hover:text-text transition-colors">AI Executives</a>
            <a href="#simulator" className="hover:text-text transition-colors">Decision Simulator</a>
            <a href="#pricing" className="hover:text-text transition-colors">Pricing</a>
            <Link href="/help" className="hover:text-text transition-colors">Help & FAQs</Link>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-24">
              <ThemeSwitch compact />
            </div>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl border border-line bg-surface text-xs font-semibold text-text hover:bg-surface-2 transition-all btn-tactile shadow-xs"
            >
              Sign In
            </Link>
            <Link
              href="/login?signup=true"
              className="px-4 py-1.5 rounded-xl bg-brass hover:brightness-110 text-white text-xs font-bold shadow-md transition-all btn-tactile flex items-center gap-1.5"
            >
              <span>Launch Free OS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-6">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-brass/30 shadow-sm text-xs font-semibold text-brass animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Autonomous AI Executive Board for Modern Indian Businesses</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-text tracking-tight font-sans leading-[1.12]">
          Your Entire Business Health, Runway & Growth — <span className="text-brass">Engineered by AI</span>.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
          Replace fragmented spreadsheets and guesswork. Nuralix gives you a dedicated AI C-Suite (CEO, CFO, CMO), real-time solvency telemetry in INR (₹), and a deterministic Monte Carlo decision simulator.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/login?signup=true"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brass text-white font-bold text-sm shadow-xl hover:brightness-110 transition-all btn-tactile flex items-center justify-center gap-2"
          >
            <span>Assemble Your Custom Business OS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#interactive-demo"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-line bg-surface hover:bg-surface-2 text-text font-semibold text-sm transition-all btn-tactile flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-brass fill-brass/20" />
            <span>Explore Interactive Preview</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Built for Indian MSMEs & Startups</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% INR (₹) Financial Modeling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Deterministic Arithmetic, Not Hallucinations</span>
          </div>
        </div>
      </section>

      {/* Interactive Live Product Preview Showcase */}
      <section id="interactive-demo" className="relative z-10 px-4 sm:px-8 max-w-6xl mx-auto pb-20 w-full">
        <div className="rounded-3xl border border-line bg-surface shadow-2xl p-4 sm:p-8 space-y-6">
          {/* Mock Window Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-bold text-text ml-2 font-mono">
                apex-tech.nuralix.os · Verified Telemetry
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-2 rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setActiveTab("briefing")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "briefing"
                    ? "bg-surface text-text shadow-sm border border-line font-bold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Executive Briefing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("simulator")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "simulator"
                    ? "bg-surface text-text shadow-sm border border-line font-bold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Decision Simulator
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("health")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "health"
                    ? "bg-surface text-text shadow-sm border border-line font-bold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Business Health Score
              </button>
            </div>
          </div>

          {/* Interactive Screen 1: Executive Briefing */}
          {activeTab === "briefing" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Signed by Astra (CEO AI) & Marcus (CFO AI)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text">
                  Today's Morning Executive Strategic Briefing
                </h3>
                <div className="p-4 rounded-2xl bg-surface-2 border border-line space-y-3 text-xs leading-relaxed text-text">
                  <p>
                    <strong>1. THE SITUATION:</strong> Monthly recurring revenue climbed to <strong>₹48,20,000/mo</strong> (+6.4% MoM). However, liquid cash runway sits at <strong>7.2 months</strong> with a monthly net burn of ₹1,24,000.
                  </p>
                  <p>
                    <strong>2. CRITICAL PRIORITY GAP:</strong> Your top customer represents <strong>38% of total revenue</strong> (₹18,50,000/mo). If this account churns, your runway contracts immediately to 3.3 months.
                  </p>
                  <p className="text-brass font-medium">
                    <strong>3. EXECUTIVE DIRECTIVE:</strong> We recommend initiating an early 24-month contract renewal this week with a 5% SLA performance guarantee, locking in cash flow.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-text-muted">Autonomous next steps:</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-line text-text font-semibold">
                    Draft Renewal Contract
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-line text-text font-semibold">
                    Re-run Cash Model
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-surface-2/60 border border-line space-y-3">
                <span className="text-xs font-bold text-text block uppercase tracking-wider">
                  Live Key Metrics
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface border border-line">
                    <span className="text-[10px] text-text-muted block">Annualized Run-Rate</span>
                    <span className="text-lg font-bold text-text font-mono">₹5.78 Cr</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-line">
                    <span className="text-[10px] text-text-muted block">Cash Runway</span>
                    <span className="text-lg font-bold text-emerald-500 font-mono">7.2 mo</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-line">
                    <span className="text-[10px] text-text-muted block">Net Retention</span>
                    <span className="text-lg font-bold text-text font-mono">108.4%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-line">
                    <span className="text-[10px] text-text-muted block">CAC Payback</span>
                    <span className="text-lg font-bold text-amber-500 font-mono">14.2 mo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Screen 2: Decision Simulator */}
          {activeTab === "simulator" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <h3 className="text-lg font-bold text-text">
                    Monte Carlo Strategic Sandbox: Senior Hire & Expansion
                  </h3>
                  <p className="text-xs text-text-muted">
                    Test operational decisions against 1,000 randomized market iterations before signing contracts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSimulate}
                  disabled={simRun}
                  className="px-4 py-2 rounded-xl bg-brass text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 self-start btn-tactile"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{simRun ? `Simulating (${simProgress})…` : "Re-run 1,000 Iterations"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-center">
                  <span className="text-[10px] font-bold text-red-500 uppercase block">P10 (Pessimistic)</span>
                  <span className="text-xl font-bold font-mono text-text block mt-1">-₹2,84,000</span>
                  <span className="text-xs text-text-muted">Breakeven: Month 10</span>
                </div>
                <div className="p-4 rounded-xl border border-brass bg-brass-soft/30 text-center ring-1 ring-brass/30">
                  <span className="text-[10px] font-bold text-brass uppercase block">P50 (Expected)</span>
                  <span className="text-xl font-bold font-mono text-text block mt-1">+₹4,20,000</span>
                  <span className="text-xs text-text-muted">Breakeven: Month 7</span>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase block">P90 (Optimistic)</span>
                  <span className="text-xl font-bold font-mono text-text block mt-1">+₹8,92,000</span>
                  <span className="text-xs text-text-muted">Breakeven: Month 5</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-2 border border-line text-xs text-text flex items-center justify-between">
                <span>
                  <strong>Model Verdict:</strong> In <strong>842 of 1,000 runs</strong>, liquid cash reserves never fell below your ₹15L safety floor.
                </span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Passed Safety Threshold</span>
              </div>
            </div>
          )}

          {/* Interactive Screen 3: Business Health Score */}
          {activeTab === "health" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-fade-in">
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-2 border border-line text-center">
                <div className="w-24 h-24 rounded-full border-4 border-brass flex flex-col items-center justify-center mb-3 shadow-inner bg-surface">
                  <span className="text-3xl font-extrabold text-text font-mono">78</span>
                  <span className="text-[10px] text-text-muted">out of 100</span>
                </div>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +4.2% vs last month
                </span>
                <p className="text-xs text-text-muted mt-2">
                  Aggregate telemetry matched to 24 operational benchmarks for growth businesses.
                </p>
              </div>

              <div className="md:col-span-7 space-y-2.5">
                {[
                  { name: "Financial Solvency", score: 82, weight: "25%", detail: "Healthy gross margin, runway 7.2 mo." },
                  { name: "Customer Concentration", score: 84, weight: "20%", detail: "NRR 108%, logo retention 94%." },
                  { name: "Team Velocity", score: 88, weight: "15%", detail: "High revenue/head (₹18.4L)." },
                  { name: "Operations & SOPs", score: 71, weight: "20%", detail: "Founder sales bottleneck requires delegation." },
                  { name: "Growth Efficiency", score: 68, weight: "20%", detail: "CAC payback currently trailing benchmark." },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-surface-2/60 border border-line flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-bold text-text block">{item.name}</span>
                      <span className="text-[11px] text-text-muted">{item.detail}</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-text shrink-0">{item.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Features & Modules */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-8 max-w-6xl mx-auto border-t border-line space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brass uppercase tracking-wider">Enterprise Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight font-sans">
            Built from First Principles for Founders
          </h2>
          <p className="text-sm text-text-muted max-w-xl mx-auto">
            Not another generic chatbot. A verified, cohesive intelligence architecture designed to safeguard your cash and scale operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme space-y-4 hover:border-brass/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brass-soft text-brass flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text">Autonomous C-Suite Team</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Astra (CEO), Marcus (CFO), and Elena (CMO) audit your ledger, unit economics, and pipeline trailing numbers to give definitive executive recommendations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme space-y-4 hover:border-brass/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text">Decision Simulator</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Test big capital commitments with 1,000 Monte Carlo runs. Verify cash drawdown, breakeven horizon, and downside risk before signing vendor or hiring agreements.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme space-y-4 hover:border-brass/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text">Priority Gap Register</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Continuous detection of client concentration risks, key-person dependencies, and CAC payback drag with pre-seeded actionable resolution playbooks.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section (Matching 4 Tiers) */}
      <section id="pricing" className="relative z-10 py-16 px-4 sm:px-8 max-w-6xl mx-auto border-t border-line space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brass uppercase tracking-wider">Transparent INR Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight font-sans">
            Choose Your Plan
          </h2>
          <p className="text-sm text-text-muted">
            Pick the tier that fits your business stage. Cancel anytime.
          </p>
        </div>

        {/* 4 Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-base font-bold text-text">Public Starter</h3>
              <p className="text-xs text-text-muted mt-0.5">Try Nuralix free, forever.</p>
              <div className="my-4 text-3xl font-extrabold text-text font-mono">₹0 <span className="text-xs font-normal text-text-muted">/mo</span></div>
              <span className="text-xs text-text-muted block pb-3 border-b border-line">35,000 words / month</span>
              <ul className="space-y-2 mt-4 text-xs text-text">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Marketing Engine</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Decision Helper</li>
              </ul>
            </div>
            <Link
              href="/login?signup=true"
              className="w-full py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-2 text-xs font-bold text-text text-center block transition-all btn-tactile"
            >
              Get Started Free
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-base font-bold text-text">Side-Hustler</h3>
              <p className="text-xs text-text-muted mt-0.5">Build & market your idea.</p>
              <div className="my-4 text-3xl font-extrabold text-text font-mono">₹499 <span className="text-xs font-normal text-text-muted">/mo</span></div>
              <span className="text-xs text-text-muted block pb-3 border-b border-line">120,000 words / month</span>
              <ul className="space-y-2 mt-4 text-xs text-text">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Marketing Engine</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Business Builder</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Decision Helper</li>
              </ul>
            </div>
            <Link
              href="/subscription"
              className="w-full py-2.5 rounded-xl border border-line-strong bg-surface hover:bg-surface-2 text-xs font-bold text-text text-center block transition-all btn-tactile"
            >
              Upgrade to Side-Hustler
            </Link>
          </div>

          <div className="p-6 rounded-2xl border-2 border-[#0284c7] bg-surface shadow-xl flex flex-col justify-between space-y-6 relative scale-[1.02]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0284c7] text-white text-[10px] font-extrabold uppercase">
              👑 MOST POPULAR
            </div>
            <div>
              <h3 className="text-base font-bold text-text">Growth Founder</h3>
              <p className="text-xs text-text-muted mt-0.5">Charts, images, clips & voice.</p>
              <div className="my-4 text-3xl font-extrabold text-text font-mono">₹2,499 <span className="text-xs font-normal text-text-muted">/mo</span></div>
              <span className="text-xs text-text-muted block pb-3 border-b border-line">600,000 words / month</span>
              <ul className="space-y-2 mt-4 text-xs text-text">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Marketing Engine</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Business Builder</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Chart Intelligence</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Image Studio</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Business Clips</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Decision Helper</li>
              </ul>
            </div>
            <Link
              href="/subscription"
              className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-bold text-white text-center block transition-all shadow-md btn-tactile"
            >
              Upgrade to Growth Founder
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-line bg-surface shadow-theme flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-base font-bold text-text">Business Empire</h3>
              <p className="text-xs text-text-muted mt-0.5">Every tool, unlimited scale.</p>
              <div className="my-4 text-3xl font-extrabold text-text font-mono">₹24,999 <span className="text-xs font-normal text-text-muted">/mo</span></div>
              <span className="text-xs text-text-muted block pb-3 border-b border-line">6,000,000 words / month</span>
              <ul className="space-y-2 mt-4 text-xs text-text">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> All Features Included</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Financial Planner</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Growth Analyzer</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Diagram Builder</li>
              </ul>
            </div>
            <Link
              href="/subscription"
              className="w-full py-2.5 rounded-xl border border-line-strong bg-surface hover:bg-surface-2 text-xs font-bold text-text text-center block transition-all btn-tactile"
            >
              Upgrade to Business Empire
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-text-muted">
          <span>🛡️ Secure Indian payments powered by Razorpay · Cancel anytime</span>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-brass/40 shadow-2xl space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight font-sans">
            Ready to Take Control of Your Business?
          </h2>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            Join hundreds of founders who run their operations, cash runway, and strategic decisions with Nuralix.
          </p>
          <div className="pt-2">
            <Link
              href="/login?signup=true"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brass text-white font-bold text-sm shadow-xl hover:brightness-110 transition-all btn-tactile"
            >
              <span>Get Started Free in 2 Minutes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-line bg-surface/50 py-8 px-4 sm:px-8 text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Nuralix Logo" width={20} height={20} className="object-contain" />
            <span className="font-bold text-text">Nuralix</span>
            <span>· The AI Business Operating System</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-text">Help & FAQs</Link>
            <Link href="/subscription" className="hover:text-text">Plans & Pricing</Link>
            <Link href="/login" className="hover:text-text">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
