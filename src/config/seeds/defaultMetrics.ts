import { MetricDef } from "../schemas/metric";

export const defaultMetrics: MetricDef[] = [
  // B2B SaaS
  {
    id: "metric_mrr",
    key: "mrr",
    label: "Monthly Recurring Revenue",
    description: "Normalized monthly predictable revenue from active subscriptions.",
    unit: "currency",
    format: { decimals: 0, prefix: "$" },
    direction: "up_is_good",
    benchmarks: {
      "saas_seed": { p25: 15000, median: 45000, p75: 120000, source: "OpenView 2024 SaaS Benchmarks" }
    },
    appliesTo: { models: ["subscription"], industries: ["saas"] },
    enabled: true,
  },
  {
    id: "metric_nrr",
    key: "nrr",
    label: "Net Revenue Retention",
    description: "Percentage of recurring revenue retained from existing customers over a period.",
    unit: "percent",
    format: { decimals: 1, suffix: "%" },
    direction: "up_is_good",
    benchmarks: {
      "saas": { p25: 98, median: 106, p75: 118, source: "Bessemer Cloud Index 2024" }
    },
    appliesTo: { models: ["subscription"] },
    enabled: true,
  },
  {
    id: "metric_cac_payback",
    key: "cac_payback",
    label: "CAC Payback Period",
    description: "Months of gross profit required to recover customer acquisition cost.",
    unit: "months",
    format: { decimals: 1, suffix: " mo" },
    direction: "down_is_good",
    benchmarks: {
      "saas": { p25: 18, median: 12, p75: 8, source: "SaaS Capital Survey" }
    },
    appliesTo: { models: ["subscription"] },
    enabled: true,
  },
  {
    id: "metric_burn_multiple",
    key: "burn_multiple",
    label: "Burn Multiple",
    description: "Net burn divided by net new ARR generated.",
    unit: "ratio",
    format: { decimals: 2, suffix: "x" },
    direction: "down_is_good",
    benchmarks: {
      "early": { p25: 2.5, median: 1.6, p75: 1.1, source: "Craft Ventures Rule of Growth" }
    },
    appliesTo: { industries: ["saas", "fintech"] },
    enabled: true,
  },
  // D2C
  {
    id: "metric_aov",
    key: "aov",
    label: "Average Order Value",
    description: "Average gross amount spent per transaction.",
    unit: "currency",
    format: { decimals: 2, prefix: "$" },
    direction: "up_is_good",
    appliesTo: { industries: ["d2c", "retail"] },
    enabled: true,
  },
  {
    id: "metric_contribution_margin",
    key: "contribution_margin",
    label: "Contribution Margin after Ads",
    description: "Net revenue minus COGS, shipping, and ad spend.",
    unit: "percent",
    format: { decimals: 1, suffix: "%" },
    direction: "up_is_good",
    appliesTo: { industries: ["d2c"] },
    enabled: true,
  },
  // Agency / Services
  {
    id: "metric_utilisation",
    key: "utilisation",
    label: "Team Billable Utilisation",
    description: "Percentage of total available working hours billed to client work.",
    unit: "percent",
    format: { decimals: 1, suffix: "%" },
    direction: "up_is_good",
    benchmarks: {
      "agency": { p25: 60, median: 72, p75: 82, source: "Promethean Agency Benchmarks" }
    },
    appliesTo: { industries: ["agency", "services"] },
    enabled: true,
  },
  {
    id: "metric_rev_per_head",
    key: "rev_per_head",
    label: "Annualised Revenue per Head",
    description: "Total trailing 12-month revenue divided by full-time equivalent headcount.",
    unit: "currency",
    format: { decimals: 0, prefix: "$" },
    direction: "up_is_good",
    appliesTo: { industries: ["agency", "saas", "services"] },
    enabled: true,
  },
];
