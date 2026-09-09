"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Wrench,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Compass,
  Calculator,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import { Suspense } from "react";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

// Format numbers using Indian comma numbering (e.g. 12,00,000 / 3,00,000)
const formatINR = (val: string | number): string => {
  if (val === "" || val === null || val === undefined) return "";
  const clean = String(val).replace(/[^\d]/g, "");
  if (!clean) return "";
  const num = Number(clean);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-IN");
};

const parseINR = (val: string): string => {
  return val.replace(/[^\d]/g, "");
};

interface BusinessTool {
  id: string;
  name: string;
  category: "finance" | "sales" | "marketing" | "operations" | "strategy";
  description: string;
  requiredPlan: "Starter" | "Professional" | "Enterprise";
  badge: string;
  hasInteractiveCalculator?: boolean;
}

const TOOLS_CATALOG: BusinessTool[] = [
  // Finance Tools
  {
    id: "profit",
    name: "Profit Calculator",
    category: "finance",
    description: "Calculate gross, operating, and net margins with loaded Indian payroll & overheads.",
    requiredPlan: "Starter",
    badge: "Unit Economics",
    hasInteractiveCalculator: true,
  },
  {
    id: "cashflow",
    name: "Cash Flow Forecast",
    category: "finance",
    description: "Multi-month forward cash projections incorporating collections, net burn, and tax outlays.",
    requiredPlan: "Professional",
    badge: "Runway Guard",
    hasInteractiveCalculator: true,
  },
  {
    id: "breakeven",
    name: "Break-Even Calculator",
    category: "finance",
    description: "Determine exact monthly transaction volume and revenue required to reach zero net burn.",
    requiredPlan: "Starter",
    badge: "Solvency",
    hasInteractiveCalculator: true,
  },
  {
    id: "pricing",
    name: "Pricing Simulator",
    category: "finance",
    description: "Model tiered packaging, discounting thresholds, and margin impacts on Indian buyers.",
    requiredPlan: "Professional",
    badge: "Revenue Ops",
  },
  {
    id: "roi",
    name: "ROI Calculator",
    category: "finance",
    description: "Evaluate software licenses, capital expenditure, and vendor investments payback periods.",
    requiredPlan: "Starter",
    badge: "Capital Efficiency",
    hasInteractiveCalculator: true,
  },
  {
    id: "budget",
    name: "Budget Planner",
    category: "finance",
    description: "Departmental allocation limits across engineering, marketing, sales, and administration.",
    requiredPlan: "Professional",
    badge: "Allocation",
  },

  // Sales Tools
  {
    id: "sales_forecast",
    name: "Sales Forecast",
    category: "sales",
    description: "Weighted pipeline forecasting by deal stage, historical velocity, and deal probabilities.",
    requiredPlan: "Starter",
    badge: "Pipeline",
  },
  {
    id: "lead_scoring",
    name: "Lead Scoring Matrix",
    category: "sales",
    description: "Algorithmic ICP fit and engagement scoring to prioritize high-value inbound prospects.",
    requiredPlan: "Professional",
    badge: "Conversion",
    hasInteractiveCalculator: true,
  },
  {
    id: "pipeline",
    name: "Pipeline Analyzer",
    category: "sales",
    description: "Detect deal slippage, stage bottlenecks, and sales cycle deceleration across reps.",
    requiredPlan: "Starter",
    badge: "Velocity",
  },
  {
    id: "deal_simulator",
    name: "Deal Simulator",
    category: "sales",
    description: "Simulate multi-year enterprise contracts, SLA guarantees, and payment milestones.",
    requiredPlan: "Professional",
    badge: "Enterprise",
  },
  {
    id: "ltv",
    name: "Customer Lifetime Value (LTV)",
    category: "sales",
    description: "Cohort retention modeling, expansion revenue, and gross margin-adjusted customer value.",
    requiredPlan: "Starter",
    badge: "Retention",
    hasInteractiveCalculator: true,
  },

  // Marketing Tools
  {
    id: "campaign",
    name: "Campaign Analyzer",
    category: "marketing",
    description: "Performance diagnostics across Google, LinkedIn, Meta, and organic content pipelines.",
    requiredPlan: "Starter",
    badge: "Attribution",
  },
  {
    id: "cac",
    name: "CAC Calculator",
    category: "marketing",
    description: "Calculate fully loaded Customer Acquisition Cost including team salaries and tools.",
    requiredPlan: "Starter",
    badge: "Acquisition",
    hasInteractiveCalculator: true,
  },
  {
    id: "roas",
    name: "ROAS Calculator",
    category: "marketing",
    description: "Direct return on ad spend versus organic pipeline contribution and payback cycles.",
    requiredPlan: "Starter",
    badge: "Ad Efficiency",
    hasInteractiveCalculator: true,
  },
  {
    id: "marketing_forecast",
    name: "Marketing Forecast",
    category: "marketing",
    description: "Predict MQL and SQL generation curves based on current budget allocation scenarios.",
    requiredPlan: "Professional",
    badge: "Demand Gen",
  },
  {
    id: "competitor",
    name: "Competitor Analyzer",
    category: "marketing",
    description: "Evaluate competitor positioning, feature parity, pricing gaps, and keyword capture.",
    requiredPlan: "Professional",
    badge: "Market Intel",
  },

  // Operations Tools
  {
    id: "capacity",
    name: "Capacity Planner",
    category: "operations",
    description: "Evaluate team bandwidth, billable utilization rates, and operational strain thresholds.",
    requiredPlan: "Professional",
    badge: "Fulfillment",
    hasInteractiveCalculator: true,
  },
  {
    id: "inventory",
    name: "Inventory Simulator",
    category: "operations",
    description: "Holding cost, re-order trigger levels, and working capital cash lockup simulations.",
    requiredPlan: "Professional",
    badge: "Supply Chain",
  },
  {
    id: "workforce",
    name: "Workforce Planner",
    category: "operations",
    description: "FTE capacity modeling against annual growth targets and onboarding ramp lags.",
    requiredPlan: "Professional",
    badge: "Staffing",
  },
  {
    id: "process",
    name: "Process Analyzer",
    category: "operations",
    description: "Map end-to-end client delivery workflows to pinpoint handoff friction and delays.",
    requiredPlan: "Enterprise",
    badge: "SLA Guard",
  },

  // Strategy Tools
  {
    id: "swot",
    name: "SWOT Analyzer",
    category: "strategy",
    description: "Interactive Strengths, Weaknesses, Opportunities, and Threats strategic mapping matrix.",
    requiredPlan: "Starter",
    badge: "Strategic Matrix",
    hasInteractiveCalculator: true,
  },
  {
    id: "market_entry",
    name: "Market Entry Simulator",
    category: "strategy",
    description: "Simulate entry costs, localized competition, and payback for new domestic or global markets.",
    requiredPlan: "Professional",
    badge: "Expansion",
  },
  {
    id: "scenario_planner",
    name: "Scenario Planner",
    category: "strategy",
    description: "Macro stress-testing: inflation, demand contraction, and competitor price wars.",
    requiredPlan: "Professional",
    badge: "Risk Defense",
  },
  {
    id: "hiring",
    name: "Hiring Simulator",
    category: "strategy",
    description: "Fully loaded Indian payroll simulation including provident fund, benefits, and revenue lag.",
    requiredPlan: "Professional",
    badge: "Talent Ops",
    hasInteractiveCalculator: true,
  },
  {
    id: "expansion",
    name: "Expansion Simulator",
    category: "strategy",
    description: "Capital requirements and projected ROI for opening new branch offices or enterprise teams.",
    requiredPlan: "Enterprise",
    badge: "Scale Vector",
  },
];

function ToolsContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  // Close active tool calculator on Escape
  useEscapeKey(() => setActiveToolId(null), Boolean(activeToolId));

  // Read URL query parameter if launched from an AI Agent
  useEffect(() => {
    const toolParam = searchParams.get("tool");
    if (toolParam) {
      setActiveToolId(toolParam);
      const tool = TOOLS_CATALOG.find(t => t.id === toolParam);
      if (tool) setSelectedCategory(tool.category);
    }
  }, [searchParams]);

  // Interactive Calculator State (Profit & Margin)
  const [calcRevenue, setCalcRevenue] = useState(1200000);
  const [calcCogs, setCalcCogs] = useState(300000);
  const [calcOpex, setCalcOpex] = useState(450000);

  // Break-even State
  const [fixedCosts, setFixedCosts] = useState(250000);
  const [pricePerUnit, setPricePerUnit] = useState(25000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(5000);

  // CAC / LTV State
  const [marketingSpend, setMarketingSpend] = useState(200000);
  const [acquiredCustomers, setAcquiredCustomers] = useState(20);
  const [avgRevenuePerAccount, setAvgRevenuePerAccount] = useState(60000);
  const [avgRetentionMonths, setAvgRetentionMonths] = useState(18);

  const filteredTools = TOOLS_CATALOG.filter(tool => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeTool = TOOLS_CATALOG.find(t => t.id === activeToolId);

  // Calculations
  const grossProfit = calcRevenue - calcCogs;
  const grossMargin = calcRevenue > 0 ? ((grossProfit / calcRevenue) * 100).toFixed(1) : "0";
  const netProfit = grossProfit - calcOpex;
  const netMargin = calcRevenue > 0 ? ((netProfit / calcRevenue) * 100).toFixed(1) : "0";

  const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
  const breakevenUnits = contributionMarginPerUnit > 0 ? Math.ceil(fixedCosts / contributionMarginPerUnit) : 0;
  const breakevenRevenue = breakevenUnits * pricePerUnit;

  const calculatedCAC = acquiredCustomers > 0 ? Math.round(marketingSpend / acquiredCustomers) : 0;
  const calculatedLTV = Math.round(avgRevenuePerAccount * (avgRetentionMonths / 12) * 0.7);
  const ltvToCacRatio = calculatedCAC > 0 ? (calculatedLTV / calculatedCAC).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
              <Wrench className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text">Executive Intelligence Tools</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-soft text-brass font-bold uppercase tracking-wider">
              25 Specialist Calculators
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Specialized business tools for unit economics, pipeline forecasting, talent modeling, and strategic defensibility.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tools or calculators…"
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface border border-line text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: "all", label: "All Tools (25)" },
          { id: "finance", label: "Finance (6)" },
          { id: "sales", label: "Sales (5)" },
          { id: "marketing", label: "Marketing (5)" },
          { id: "operations", label: "Operations (4)" },
          { id: "strategy", label: "Strategy (5)" },
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all btn-tactile cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-brass text-white shadow-xs"
                : "bg-surface border border-line text-text-muted hover:text-text"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive Tool Modal / Drawer if a tool is active */}
      {activeTool && (
        <div className="p-5 rounded-2xl border border-brass/40 bg-surface shadow-xl space-y-4 animate-fade-in ring-1 ring-brass/20">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text">{activeTool.name}</h2>
                <p className="text-[11px] text-text-muted">{activeTool.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveToolId(null)}
              className="text-xs text-text-muted hover:text-text font-semibold px-2.5 py-1 rounded-md bg-surface-2 border border-line cursor-pointer"
            >
              Close Calculator ✕
            </button>
          </div>

          {/* Calculator Body Based on Tool ID */}
          {activeTool.id === "profit" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
              <div className="md:col-span-6 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-text block mb-1">Monthly Gross Revenue (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={calcRevenue ? formatINR(calcRevenue) : ""}
                    onChange={e => setCalcRevenue(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 12,00,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text block mb-1">Cost of Goods Sold / Delivery (COGS) (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={calcCogs ? formatINR(calcCogs) : ""}
                    onChange={e => setCalcCogs(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 3,00,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text block mb-1">Operating Overheads & Payroll (OpEx) (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={calcOpex ? formatINR(calcOpex) : ""}
                    onChange={e => setCalcOpex(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 4,50,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
              </div>

              <div className="md:col-span-6 p-4 rounded-xl bg-surface-2 border border-line flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Calculated Profitability Engine
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-surface border border-line">
                      <div className="text-[10px] text-text-muted">Gross Margin</div>
                      <div className="text-base font-extrabold text-jade font-mono">{grossMargin}%</div>
                      <div className="text-[10px] text-text-muted font-mono">₹{grossProfit.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-line">
                      <div className="text-[10px] text-text-muted">Net Operating Margin</div>
                      <div className={`text-base font-extrabold font-mono ${netProfit >= 0 ? "text-brass" : "text-rust"}`}>
                        {netMargin}%
                      </div>
                      <div className="text-[10px] text-text-muted font-mono">₹{netProfit.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-line">
                  <Link
                    href={`/chat?message=${encodeURIComponent(`Marcus, review our Profit Calculator results: Gross margin is ${grossMargin}%, Net margin is ${netMargin}%. How do we expand EBITDA?`)}`}
                    className="flex-1 py-2 px-3 rounded-lg bg-brass text-white font-bold text-[11px] text-center btn-tactile hover:brightness-110"
                  >
                    Consult Marcus (CFO AI) on Margins →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTool.id === "breakeven" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
              <div className="md:col-span-6 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-text block mb-1">Total Monthly Fixed Overheads (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fixedCosts ? formatINR(fixedCosts) : ""}
                    onChange={e => setFixedCosts(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 2,50,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text block mb-1">Average Selling Price Per Contract (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={pricePerUnit ? formatINR(pricePerUnit) : ""}
                    onChange={e => setPricePerUnit(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 25,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text block mb-1">Direct Variable Cost Per Contract (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={variableCostPerUnit ? formatINR(variableCostPerUnit) : ""}
                    onChange={e => setVariableCostPerUnit(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 5,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
              </div>

              <div className="md:col-span-6 p-4 rounded-xl bg-surface-2 border border-line flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Break-Even Solvency Requirement
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-surface border border-line">
                      <div className="text-[10px] text-text-muted">Target Deals / Units</div>
                      <div className="text-base font-extrabold text-brass font-mono">{breakevenUnits} contracts</div>
                      <div className="text-[10px] text-text-muted">per month</div>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-line">
                      <div className="text-[10px] text-text-muted">Required Revenue</div>
                      <div className="text-base font-extrabold text-jade font-mono">
                        ₹{breakevenRevenue.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-text-muted">at break-even</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-line">
                  <Link
                    href={`/chat?message=${encodeURIComponent(`Marcus, our break-even target is ₹${breakevenRevenue.toLocaleString("en-IN")} across ${breakevenUnits} contracts/mo. What's our quickest path to achieving this?`)}`}
                    className="w-full block py-2 px-3 rounded-lg bg-brass text-white font-bold text-[11px] text-center btn-tactile hover:brightness-110"
                  >
                    Analyze with CFO AI →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {(activeTool.id === "cac" || activeTool.id === "ltv") && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
              <div className="md:col-span-6 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-text block mb-1">Total Monthly Sales & Marketing Outlay (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={marketingSpend ? formatINR(marketingSpend) : ""}
                    onChange={e => setMarketingSpend(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 2,00,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text block mb-1">New Customers Signed This Month</label>
                  <input
                    type="number"
                    value={acquiredCustomers}
                    onChange={e => setAcquiredCustomers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text block mb-1">Annual Revenue Per Customer (ACV) (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={avgRevenuePerAccount ? formatINR(avgRevenuePerAccount) : ""}
                    onChange={e => setAvgRevenuePerAccount(Number(parseINR(e.target.value)) || 0)}
                    placeholder="e.g. 60,000"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
              </div>

              <div className="md:col-span-6 p-4 rounded-xl bg-surface-2 border border-line flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Unit Acquisition & Lifetime Value
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-surface border border-line">
                      <div className="text-[10px] text-text-muted">Blended CAC</div>
                      <div className="text-sm font-extrabold text-rust font-mono">₹{calculatedCAC.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-line">
                      <div className="text-[10px] text-text-muted">Customer LTV</div>
                      <div className="text-sm font-extrabold text-jade font-mono">₹{calculatedLTV.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-line">
                      <div className="text-[10px] text-text-muted">LTV / CAC</div>
                      <div className="text-sm font-extrabold text-brass font-mono">{ltvToCacRatio}x</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-line">
                  <Link
                    href={`/chat?message=${encodeURIComponent(`Elena, evaluate our LTV to CAC ratio of ${ltvToCacRatio}x (CAC: ₹${calculatedCAC.toLocaleString("en-IN")}, LTV: ₹${calculatedLTV.toLocaleString("en-IN")}). How should we optimize our demand funnel?`)}`}
                    className="w-full block py-2 px-3 rounded-lg bg-brass text-white font-bold text-[11px] text-center btn-tactile hover:brightness-110"
                  >
                    Consult Elena (Marketing AI) on CAC →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Generic default view for other calculators */}
          {!["profit", "breakeven", "cac", "ltv"].includes(activeTool.id) && (
            <div className="p-6 rounded-xl bg-surface-2 border border-line text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center text-brass mx-auto">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-text">{activeTool.name} Telemetry Sandbox</h3>
                <p className="text-[11px] text-text-muted max-w-md mx-auto">
                  Configured with active ledger parameters for {activeTool.name}. You can calibrate assumptions or execute a full simulation in AI Workspace.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href={`/chat?message=${encodeURIComponent(`Open ${activeTool.name} analysis with relevant operational telemetry.`)}`}
                  className="px-4 py-2 rounded-lg bg-brass text-white font-bold text-xs btn-tactile hover:brightness-110 inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch in AI Workspace</span>
                </Link>
                <Link
                  href="/simulator"
                  className="px-4 py-2 rounded-lg bg-surface border border-line hover:border-line-strong text-text font-bold text-xs btn-tactile inline-flex items-center gap-1.5"
                >
                  <span>Decision Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className="p-4 rounded-xl border border-line bg-surface hover:border-line-strong transition-all flex flex-col justify-between shadow-xs group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brass bg-brass-soft px-2 py-0.5 rounded-full">
                  {tool.badge}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${
                    tool.requiredPlan === "Starter"
                      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
                      : tool.requiredPlan === "Professional"
                      ? "text-purple-400 bg-purple-400/10 border-purple-400/20"
                      : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                  }`}
                >
                  {tool.requiredPlan}+
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-text group-hover:text-brass transition-colors">
                  {tool.name}
                </h3>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-line flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveToolId(tool.id)}
                className="text-xs font-semibold text-brass hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{tool.hasInteractiveCalculator ? "Launch Calculator" : "Inspect Tool"}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <Link
                href={`/chat?message=${encodeURIComponent(`Evaluate our ${tool.name} benchmarks and recommend optimizations.`)}`}
                className="text-[10px] text-text-muted hover:text-text p-1.5 rounded hover:bg-surface-2 transition-colors"
                title="Consult AI Agent"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-text-muted">Loading Nuralix Tools…</div>}>
      <ToolsContent />
    </Suspense>
  );
}
