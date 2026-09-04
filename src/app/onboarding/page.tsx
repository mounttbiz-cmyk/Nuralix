"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Zap,
  HelpCircle
} from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Analyzing business shape…");

  // Form State
  const [businessType, setBusinessType] = useState<string>("saas");
  const [customBusinessType, setCustomBusinessType] = useState<string>("");
  const [businessModel, setBusinessModel] = useState<string>("subscription");
  const [companyName, setCompanyName] = useState<string>("Apex Technologies");
  const [founderName, setFounderName] = useState<string>("Alex Morgan");
  const [website, setWebsite] = useState<string>("apextech.com");
  const [teamSize, setTeamSize] = useState<string>("14");
  const [annualRevenue, setAnnualRevenue] = useState<string>("600000");
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("50000");
  const [monthlyBurn, setMonthlyBurn] = useState<string>("15000");
  const [cashOnHand, setCashOnHand] = useState<string>("120000");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-sync monthly revenue when annual revenue changes
  const handleAnnualRevenueChange = (val: string) => {
    setAnnualRevenue(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      setMonthlyRevenue(Math.round(num / 12).toString());
    }
    if (errors.annualRevenue) {
      setErrors(prev => ({ ...prev, annualRevenue: "" }));
    }
  };

  // What they need right now (multi-select goals and pain points)
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    "extend_runway",
    "fix_concentration",
    "founder_bottleneck",
  ]);

  const businessTypes = [
    {
      id: "it",
      title: "IT & Technology Services",
      desc: "Custom development, IT infrastructure, cloud engineering, and tech consultancy.",
      icon: "💻",
    },
    {
      id: "real_estate",
      title: "Real Estate & Property",
      desc: "Property portfolios, commercial leasing, brokerage, asset yields, and tenancy.",
      icon: "🏢",
    },
    {
      id: "d2c",
      title: "E-Commerce & Retail",
      desc: "AOV, ROAS, SKU margins, repeat purchase frequency, and inventory cash cycle.",
      icon: "🛍️",
    },
    {
      id: "saas",
      title: "B2B SaaS & Cloud Platforms",
      desc: "Recurring ARR/MRR subscriptions, CAC payback, NRR, and churn telemetry.",
      icon: "☁️",
    },
    {
      id: "agency",
      title: "Agency & Professional Services",
      desc: "Team billable utilisation, project margins, retainer pipeline, and realization.",
      icon: "⚡",
    },
    {
      id: "healthcare",
      title: "Healthcare & Clinics",
      desc: "Patient volume, practitioner utilisation, recurring care, and clinic margins.",
      icon: "🏥",
    },
    {
      id: "manufacturing",
      title: "Manufacturing & Physical Goods",
      desc: "Capacity utilisation, unit economics, supply lead time, and distributor cycles.",
      icon: "🏭",
    },
    {
      id: "finance",
      title: "Financial Services & Wealth",
      desc: "AUM, advisory fees, portfolio performance, compliance, and asset management.",
      icon: "📈",
    },
    {
      id: "other",
      title: "Others (Custom Business)",
      desc: "Specify your exact established business type (e.g. Hospitality, Logistics, etc.)",
      icon: "✨",
    },
  ];

  const needsOptions = [
    {
      id: "extend_runway",
      title: "Extend Cash Runway & Control Burn",
      detail: "Audit discretionary vendor opex, model bridge scenarios, and prolong runway.",
      category: "Financial",
    },
    {
      id: "fix_concentration",
      title: "Eliminate Client Concentration Risk",
      detail: "De-risk primary account representing >25% of company revenues.",
      category: "Risk",
    },
    {
      id: "founder_bottleneck",
      title: "Remove Founder Bottleneck in Sales & Ops",
      detail: "Codify founder closing playbook so team can execute and close enterprise deals independently.",
      category: "Operations",
    },
    {
      id: "reduce_cac_payback",
      title: "Shorten CAC Payback & Scale Acquisition",
      detail: "Lower customer acquisition costs and eliminate saturation in primary channels.",
      category: "Growth",
    },
    {
      id: "reprice_products",
      title: "Reprice Products & Model Margin Elasticity",
      detail: "Test price increases with Monte Carlo sensitivity before notifying accounts.",
      category: "Pricing",
    },
    {
      id: "board_intelligence",
      title: "Instrument Board-Ready Reporting & KPIs",
      detail: "Weekly executive briefings, automated telemetry, and gap solution playbooks.",
      category: "Strategy",
    },
  ];

  const toggleNeed = (id: string) => {
    setSelectedNeeds(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (businessType === "other" && !customBusinessType.trim()) {
      newErrors.customBusinessType = "Please type your business category / industry";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) {
      newErrors.companyName = "Company Name is compulsory";
    }
    if (!founderName.trim()) {
      newErrors.founderName = "Founder / Boss Name is compulsory";
    }
    if (!teamSize.trim() || Number(teamSize) <= 0) {
      newErrors.teamSize = "Valid Team Size is compulsory";
    }
    if (!annualRevenue.trim() || Number(annualRevenue) <= 0) {
      newErrors.annualRevenue = "Company Annual Income / Revenue is compulsory";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleCompleteSetup = () => {
    setIsAssembling(true);
    const resolvedIndustryLabel = businessType === "other" && customBusinessType.trim()
      ? customBusinessType.trim()
      : businessTypes.find(b => b.id === businessType)?.title || businessType;

    const statuses = [
      `Persisting company profile for ${companyName}…`,
      `Calibrating benchmarks for established ${resolvedIndustryLabel.toUpperCase()} business…`,
      `Configuring Astra (CEO) and Marcus (CFO) executive agents for ${founderName}…`,
      "Running deterministic Layer 1 gap analysis…",
      "Synthesizing your opening executive briefing…",
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < statuses.length) {
        setStatusMessage(statuses[current]);
        setAssemblyProgress(Math.round((current / statuses.length) * 100));
      } else {
        clearInterval(interval);
        setAssemblyProgress(100);

        // Save completed profile
        const profile = {
          name: companyName.trim() || "My Company",
          founderName: founderName.trim() || "Executive",
          website: website.trim(),
          industry: businessType === "other" && customBusinessType.trim() ? customBusinessType.trim() : businessType,
          industryLabel: resolvedIndustryLabel,
          industryKey: businessType,
          customBusinessType: businessType === "other" ? customBusinessType.trim() : "",
          businessModel,
          teamSize: Number(teamSize) || 10,
          annualRevenue: Number(annualRevenue) || 600000,
          revenue: Number(monthlyRevenue) || (Number(annualRevenue) ? Math.round(Number(annualRevenue) / 12) : 50000),
          burn: Number(monthlyBurn) || 15000,
          cash: Number(cashOnHand) || 120000,
          needs: selectedNeeds,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem("nuralix_business_profile", JSON.stringify(profile));

        setTimeout(() => {
          router.push("/");
        }, 800);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface border border-line flex items-center justify-center p-1 shadow-sm">
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
              Business Intake
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted font-medium">Step {step} of 3</span>
          <div className="w-32">
            <ThemeSwitch compact />
          </div>
        </div>
      </div>

      {/* Main Questionnaire Container */}
      <div className="max-w-3xl w-full mx-auto my-auto py-6">
        {!isAssembling ? (
          <div className="p-6 sm:p-8 rounded-2xl border border-line bg-surface shadow-theme space-y-6">
            {/* Step 1: Business Industry & Category */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass-soft text-brass text-[10px] font-bold uppercase tracking-wider mb-2">
                    Established Business Profile
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                    Select your business industry & category
                  </h1>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Nuralix adapts to your established company operations. Select your sector to derive tailored benchmark models, executive metrics, and specialist AI agents.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {businessTypes.map(type => {
                    const isSelected = businessType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => {
                          setBusinessType(type.id);
                          if (type.id !== "other") {
                            setErrors(prev => ({ ...prev, customBusinessType: "" }));
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer btn-tactile ${
                          isSelected
                            ? "bg-surface-2 border-brass ring-1 ring-brass/30 shadow-sm"
                            : "bg-surface-2/50 border-line hover:border-line-strong"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl">{type.icon}</span>
                          <span className="text-xs font-bold text-text">{type.title}</span>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          {type.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Category Input for 'Others' */}
                {businessType === "other" && (
                  <div className="p-4 rounded-xl bg-brass-soft/40 border border-brass/40 space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-text flex items-center gap-1">
                      <span>Specify Your Business Industry / Type</span>
                      <span className="text-rust">*</span>
                    </label>
                    <input
                      type="text"
                      value={customBusinessType}
                      onChange={e => {
                        setCustomBusinessType(e.target.value);
                        if (errors.customBusinessType) {
                          setErrors(prev => ({ ...prev, customBusinessType: "" }));
                        }
                      }}
                      placeholder="e.g. Hospitality & Hotels, Logistics & Freight, Construction, EdTech, Agriculture..."
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-surface border text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brass ${
                        errors.customBusinessType ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                      autoFocus
                    />
                    {errors.customBusinessType && (
                      <p className="text-[11px] font-medium text-rust flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {errors.customBusinessType}
                      </p>
                    )}
                    <p className="text-[10px] text-text-muted">
                      Your custom sector will be used to calibrate your intelligence feeds and dashboard cards.
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-line flex justify-end">
                  <button
                    id="btn-continue-step-1"
                    type="button"
                    onClick={handleStep1Next}
                    className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Scale & Fundamentals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Scale & Numbers */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                    Company Fundamentals & Scale
                  </h1>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Used to calculate your real cash runway, revenue per head, and detect early solvency gaps.
                    Fields marked with <span className="text-rust font-bold">(*) are compulsory</span>.
                  </p>
                </div>

                {/* Validation summary banner if errors exist */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-3 rounded-lg bg-rust/10 border border-rust/30 flex items-start gap-2.5 text-xs text-rust">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold">Please complete all compulsory fields to proceed:</span>
                      <ul className="list-disc list-inside text-[11px] opacity-90">
                        {Object.values(errors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Company Name - COMPULSORY */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center justify-between">
                      <span>Company Name</span>
                      <span className="text-rust font-bold text-[11px]">* Compulsory</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => {
                        setCompanyName(e.target.value);
                        if (errors.companyName) setErrors(prev => ({ ...prev, companyName: "" }));
                      }}
                      placeholder="e.g. Apex Global Ltd"
                      className={`w-full px-3 py-2 rounded-lg bg-surface-2 border text-text focus:ring-1 focus:ring-brass ${
                        errors.companyName ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-[10px] text-rust font-medium mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  {/* Founder / Boss Name - COMPULSORY */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center justify-between">
                      <span>Founder / Boss Name</span>
                      <span className="text-rust font-bold text-[11px]">* Compulsory</span>
                    </label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={e => {
                        setFounderName(e.target.value);
                        if (errors.founderName) setErrors(prev => ({ ...prev, founderName: "" }));
                      }}
                      placeholder="e.g. Alex Morgan (CEO)"
                      className={`w-full px-3 py-2 rounded-lg bg-surface-2 border text-text focus:ring-1 focus:ring-brass ${
                        errors.founderName ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                    />
                    {errors.founderName && (
                      <p className="text-[10px] text-rust font-medium mt-1">{errors.founderName}</p>
                    )}
                  </div>

                  {/* Team Size - COMPULSORY */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center justify-between">
                      <span>Team Size (FTEs)</span>
                      <span className="text-rust font-bold text-[11px]">* Compulsory</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={teamSize}
                      onChange={e => {
                        setTeamSize(e.target.value);
                        if (errors.teamSize) setErrors(prev => ({ ...prev, teamSize: "" }));
                      }}
                      placeholder="e.g. 15"
                      className={`w-full px-3 py-2 rounded-lg bg-surface-2 border text-text focus:ring-1 focus:ring-brass ${
                        errors.teamSize ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                    />
                    {errors.teamSize && (
                      <p className="text-[10px] text-rust font-medium mt-1">{errors.teamSize}</p>
                    )}
                  </div>

                  {/* Company Annual Income / Revenue - COMPULSORY */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center justify-between">
                      <span>Company Annual Income / Revenue ($)</span>
                      <span className="text-rust font-bold text-[11px]">* Compulsory</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={annualRevenue}
                      onChange={e => handleAnnualRevenueChange(e.target.value)}
                      placeholder="e.g. 600000"
                      className={`w-full px-3 py-2 rounded-lg bg-surface-2 border text-text focus:ring-1 focus:ring-brass font-mono ${
                        errors.annualRevenue ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                    />
                    {errors.annualRevenue ? (
                      <p className="text-[10px] text-rust font-medium mt-1">{errors.annualRevenue}</p>
                    ) : (
                      annualRevenue && Number(annualRevenue) > 0 && (
                        <p className="text-[10px] text-text-muted mt-1 font-mono">
                          ≈ ${Math.round(Number(annualRevenue) / 12).toLocaleString()} / month
                        </p>
                      )
                    )}
                  </div>

                  {/* Monthly Net Burn ($) */}
                  <div>
                    <label className="font-semibold text-text block mb-1">
                      Monthly Net Burn ($)
                    </label>
                    <input
                      type="number"
                      value={monthlyBurn}
                      onChange={e => setMonthlyBurn(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass font-mono"
                    />
                    <p className="text-[10px] text-text-muted mt-0.5">Average monthly operating expenses minus gross revenue</p>
                  </div>

                  {/* Cash on Hand ($) */}
                  <div>
                    <label className="font-semibold text-text block mb-1">
                      Cash on Hand / Reserves ($)
                    </label>
                    <input
                      type="number"
                      value={cashOnHand}
                      onChange={e => setCashOnHand(e.target.value)}
                      placeholder="e.g. 120000"
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass font-mono"
                    />
                    <p className="text-[10px] text-text-muted mt-0.5">Liquid bank balance for runway computation</p>
                  </div>

                  {/* Website URL */}
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-text block mb-1">Company Website URL</label>
                    <input
                      type="text"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="e.g. apexglobal.com"
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setStep(1);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="btn-continue-step-2"
                    type="button"
                    onClick={handleStep2Next}
                    className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to What You Need</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: What do you need right now? */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                    What are your biggest priorities & bottlenecks?
                  </h1>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Select everything you want Nuralix to solve. We will seed actionable gap playbooks and tasks for each item.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {needsOptions.map(need => {
                    const isChecked = selectedNeeds.includes(need.id);
                    return (
                      <div
                        key={need.id}
                        onClick={() => toggleNeed(need.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 btn-tactile ${
                          isChecked
                            ? "bg-surface-2 border-brass ring-1 ring-brass/30 shadow-sm"
                            : "bg-surface-2/40 border-line hover:border-line-strong"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked ? "bg-brass border-brass text-white" : "border-line-strong bg-surface"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text">{need.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-line text-brass font-semibold uppercase">
                              {need.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                            {need.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text"
                  >
                    Back
                  </button>
                  <button
                    id="btn-assemble-os"
                    type="button"
                    onClick={handleCompleteSetup}
                    className="px-6 py-3 rounded-xl bg-brass text-white font-bold text-xs shadow-lg hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Assemble My Custom Business OS</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Live AI Assembly Sequence (§4.2 signature sequence) */
          <div className="p-8 sm:p-12 rounded-2xl border border-line bg-surface shadow-2xl text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-line flex items-center justify-center mx-auto p-2.5 shadow-md">
              <Image
                src="/logo.png"
                alt="Nuralix Logo"
                width={48}
                height={48}
                className="object-contain animate-pulse"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-text">Assembling Your Business OS</h2>
              <p className="text-xs text-brass font-medium min-h-[1.5rem] animate-fade-in">
                {statusMessage}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden border border-line">
              <div
                className="h-full bg-brass transition-all duration-300 rounded-full"
                style={{ width: `${assemblyProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-text-muted">
              Generating tailored dashboard, specialist AI executive prompts, and gap playbooks…
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-text-muted">
        Nuralix OS v3 · Enterprise Setup Wizard
      </div>
    </div>
  );
}
