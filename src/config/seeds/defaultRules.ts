import { GapRule } from "../schemas/rule";

export const defaultGapRules: GapRule[] = [
  {
    id: "rule_cash_runway",
    key: "cash_runway",
    title: "Cash runway under 6 months",
    category: "Financial",
    severity: "critical",
    condition: { field: "runway_months", operator: "lt", value: 6, unit: "months" },
    whyItMatters: "A runway under 6 months severely limits strategic options and forces emergency fundraising or emergency headcount reductions.",
    effort: "project",
    evidenceTemplate: "Current cash reserve of {cash_on_hand} against net monthly burn of {monthly_burn} gives {runway_months} months runway.",
    solutionPlaybook: {
      summary: "Initiate runway extension protocol immediately by pruning non-core opex and accelerating receivables.",
      steps: [
        { title: "Audit discretionary monthly SaaS & opex", detail: "Identify at least 15% reduction in non-essential recurring vendor costs.", ownerRole: "CFO", days: 3 },
        { title: "Review receivables and invoice terms", detail: "Enforce upfront quarterly/annual payment discounts to inject cash immediately.", ownerRole: "Sales", days: 5 },
        { title: "Model emergency bridge scenario", detail: "Run simulator for 3-month opex reduction vs 6-month capital raise.", ownerRole: "CEO", days: 7 }
      ],
      successMetric: "Runway extended beyond 9 months",
      firstAction: "Review line-item monthly expenses"
    },
    enabled: true,
  },
  {
    id: "rule_revenue_concentration",
    key: "revenue_concentration",
    title: "High customer revenue concentration (>25%)",
    category: "Risk",
    severity: "critical",
    condition: { field: "top_client_rev_pct", operator: "gt", value: 25, unit: "percent" },
    whyItMatters: "If your top customer represents over a quarter of total revenue, client churn or renegotiation would imperil solvency.",
    effort: "project",
    evidenceTemplate: "Your largest customer accounts for {top_client_rev_pct}% of total company revenues.",
    solutionPlaybook: {
      summary: "De-risk client concentration by building pipeline across secondary accounts and securing multi-year lock-in with the primary account.",
      steps: [
        { title: "Secure multi-year contract or SLA", detail: "Offer preferential terms in exchange for minimum 24-month commitment.", ownerRole: "CEO", days: 14 },
        { title: "Accelerate mid-market pipeline acquisition", detail: "Target 5 new accounts to dilute top customer share below 18%.", ownerRole: "Sales", days: 45 }
      ],
      successMetric: "Top customer share below 20%",
      firstAction: "Open contract terms with top account"
    },
    enabled: true,
  },
  {
    id: "rule_channel_concentration",
    key: "channel_concentration",
    title: "Customer acquisition concentrated in single channel (>60%)",
    category: "Marketing",
    severity: "high",
    condition: { field: "top_channel_share_pct", operator: "gt", value: 60, unit: "percent" },
    whyItMatters: "Over-reliance on one acquisition channel exposes the company to algorithmic price spikes, account bans, or audience fatigue.",
    effort: "project",
    evidenceTemplate: "One acquisition channel generates {top_channel_share_pct}% of your inbound customer volume.",
    solutionPlaybook: {
      summary: "Diversify into a second validated channel (organic search, outbound, or partnerships).",
      steps: [
        { title: "Audit secondary acquisition experiments", detail: "Allocate 15% of ad budget to seed two secondary channels.", ownerRole: "Marketing", days: 10 },
        { title: "Validate CAC on secondary channel", detail: "Measure conversion payback over 30-day cohort.", ownerRole: "Marketing", days: 30 }
      ],
      successMetric: "No single channel represents >45% of acquisition",
      firstAction: "Launch secondary channel sprint"
    },
    enabled: true,
  },
  {
    id: "rule_founder_dependency",
    key: "founder_dependency",
    title: "Founder bottleneck in core sales/operations",
    category: "Operations",
    severity: "high",
    condition: { field: "founder_handles_sales", operator: "eq", value: true },
    whyItMatters: "When the founder is the only person capable of closing deals or running core delivery, growth scales linearly with founder burnout.",
    effort: "quick win",
    evidenceTemplate: "Founder is the primary closer for >70% of enterprise opportunities.",
    solutionPlaybook: {
      summary: "Codify founder closing playbook into documented sales play and transition first deal to team.",
      steps: [
        { title: "Record and transcribe last 5 closing calls", detail: "Extract objection handling and value proposition framework.", ownerRole: "CEO", days: 7 },
        { title: "Shadow deal handover", detail: "Have sales lead lead the discovery and demo on next 3 qualified leads.", ownerRole: "Sales", days: 14 }
      ],
      successMetric: "At least 50% of new revenue closed without founder participation",
      firstAction: "Document sales script from latest win"
    },
    enabled: true,
  },
  {
    id: "rule_measurement_gap",
    key: "measurement_gap",
    title: "Measurement gap: fewer than 3 core KPIs tracked",
    category: "Operations",
    severity: "medium",
    condition: { field: "tracked_kpis_count", operator: "lt", value: 3 },
    whyItMatters: "Operating without instrumented unit metrics blinds the leadership team to silent churn and rising acquisition costs.",
    effort: "quick win",
    evidenceTemplate: "Currently tracking {tracked_kpis_count} core operational metrics.",
    solutionPlaybook: {
      summary: "Instrument primary financial and conversion metrics from the Nuralix metric registry.",
      steps: [
        { title: "Connect revenue data or enter monthly baseline", detail: "Add trailing 3-month revenue and expenses to unlock live health score.", ownerRole: "CFO", days: 2 }
      ],
      successMetric: "5 core metrics actively tracked",
      firstAction: "Add baseline monthly data"
    },
    enabled: true,
  },
];
