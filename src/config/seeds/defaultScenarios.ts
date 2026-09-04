import { ScenarioTemplate } from "../schemas/simulator";

export const defaultScenarioTemplates: ScenarioTemplate[] = [
  {
    id: "template_hire",
    key: "hire_someone",
    name: "Hire Headcount / Key Role",
    description: "Simulate cash impact, ramp-up time, breakeven horizon, and revenue per head before extending an offer.",
    modelKey: "model_headcount_ramp",
    inputs: [
      { key: "roleTitle", label: "Role Title", type: "text", defaultValue: "Senior Account Executive" },
      { key: "annualBaseSalary", label: "Annual Base Salary", type: "currency", defaultValue: 120000 },
      { key: "loadedMultiplier", label: "Loaded Multiplier (Taxes, Benefits, Tools)", type: "number", defaultValue: 1.3, min: 1.1, max: 1.6, step: 0.05 },
      { key: "rampMonths", label: "Ramp-up Months", type: "number", defaultValue: 4, min: 1, max: 12 },
      { key: "expectedMonthlyOutput", label: "Expected Monthly Output / New Revenue", type: "currency", defaultValue: 35000 },
    ],
    defaultAssumptions: [
      { key: "rampEfficiency", label: "Ramp curve efficiency", low: 0.6, likely: 0.85, high: 1.1, unit: "ratio", source: "benchmark" },
      { key: "recruitingCost", label: "One-off recruiting & placement cost", low: 8000, likely: 15000, high: 25000, unit: "$", source: "nuralix_estimate" },
    ],
    outputs: [
      { key: "monthlyLoadedCost", label: "Monthly Fully Loaded Cost", format: "currency" },
      { key: "runwayImpactMonths", label: "Net Runway Impact", format: "months" },
      { key: "breakevenMonth", label: "Breakeven Month", format: "month" },
      { key: "revPerHeadAfter", label: "Revenue per Head (After)", format: "currency" },
    ],
    enabled: true,
  },
  {
    id: "template_pricing",
    key: "change_price",
    name: "Reprice Product or Tier",
    description: "Model price elasticity, churn sensitivity, gross margin expansion, and 12-month cumulative revenue.",
    modelKey: "model_price_elasticity",
    inputs: [
      { key: "currentPrice", label: "Current Price per Unit / Month", type: "currency", defaultValue: 150 },
      { key: "newPrice", label: "Proposed New Price", type: "currency", defaultValue: 210 },
      { key: "currentVolume", label: "Active Customers / Units", type: "number", defaultValue: 420 },
      { key: "grandfatherExisting", label: "Grandfather existing customers?", type: "select", defaultValue: "no" },
    ],
    defaultAssumptions: [
      { key: "churnSensitivity", label: "Churn sensitivity (% lost on price hike)", low: 0.04, likely: 0.08, high: 0.16, unit: "%", source: "benchmark" },
      { key: "newConversionImpact", label: "New inbound conversion impact", low: -0.15, likely: -0.05, high: 0.02, unit: "%", source: "nuralix_estimate" },
    ],
    outputs: [
      { key: "netMonthlyRevenueDelta", label: "Monthly Revenue Delta", format: "currency" },
      { key: "twelveMonthCumulative", label: "12-Month Cumulative Gain", format: "currency" },
      { key: "churnRiskTier", label: "Churn Risk Category", format: "text" },
    ],
    enabled: true,
  },
  {
    id: "template_growth_spend",
    key: "increase_marketing",
    name: "Scale Acquisition Spend",
    description: "Evaluate customer acquisition cost inflation, marginal payback period, and net cash required.",
    modelKey: "model_paid_acquisition_scale",
    inputs: [
      { key: "channel", label: "Channel", type: "text", defaultValue: "Search & Social Ads" },
      { key: "extraMonthlySpend", label: "Additional Monthly Budget", type: "currency", defaultValue: 15000 },
      { key: "currentCac", label: "Current Blended CAC", type: "currency", defaultValue: 340 },
    ],
    defaultAssumptions: [
      { key: "marginalCacMultiplier", label: "Marginal CAC multiplier at higher scale", low: 1.15, likely: 1.3, high: 1.6, unit: "ratio", source: "benchmark" },
      { key: "paybackMonths", label: "Expected gross margin payback", low: 4, likely: 6, high: 9, unit: "months", source: "profile" },
    ],
    outputs: [
      { key: "newCustomersPerMonth", label: "Estimated New Customers / mo", format: "number" },
      { key: "blendedCacAfter", label: "Blended CAC After Scale", format: "currency" },
      { key: "cashDeficitPeak", label: "Peak Working Capital Deficit", format: "currency" },
    ],
    enabled: true,
  },
];
