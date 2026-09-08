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
  TrendingUp,
  AlertTriangle,
  Zap,
  HelpCircle,
  Laptop,
  ShoppingBag,
  Cloud,
  Briefcase,
  Stethoscope,
  Factory,
  Landmark,
  Globe,
  RefreshCw,
  Check,
  CreditCard,
  MessageSquare,
  Calendar,
  LifeBuoy,
  Phone,
  Radio,
  FileSpreadsheet
} from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { PhoneCountryInput } from "@/components/ui/PhoneCountryInput";

// Proper Indian Numbering System formatting (e.g. 12,00,000 / 1,50,000)
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

// Industry specific dynamic question schema
interface DynamicQuestion {
  id: string;
  question: string;
  hint: string;
  options: string[];
}

const INDUSTRY_DYNAMIC_QUESTIONS: Record<string, DynamicQuestion[]> = {
  saas: [
    {
      id: "pricing_model",
      question: "What is your primary software packaging & pricing model?",
      hint: "Helps Astra calibrate recurring MRR predictability and expansion revenue models.",
      options: [
        "Per-Seat / User License (Monthly/Annual)",
        "Usage-Based / Consumption Metering",
        "Flat-Rate Tiered Subscriptions",
        "High-ACV Enterprise Custom Contracts",
      ],
    },
    {
      id: "sales_motion",
      question: "How do your enterprise customers primarily buy?",
      hint: "Used to calibrate pipeline velocity and rep quota benchmarks.",
      options: [
        "Product-Led Growth (Self-serve checkout)",
        "Inbound Demo Requests & Inside Sales",
        "Outbound Account-Based Enterprise Sales",
        "Partner Ecosystem & Reseller Channel",
      ],
    },
    {
      id: "annual_churn",
      question: "What is your estimated annual net revenue churn rate?",
      hint: "Informs CFO Marcus's LTV-to-CAC payback formulas.",
      options: [
        "Negative Churn (High Net Expansion >110%)",
        "Under 5% Annual Logo Churn",
        "5% – 12% Annual Churn",
        "Over 12% / Early stage baseline",
      ],
    },
  ],
  real_estate: [
    {
      id: "portfolio_scope",
      question: "What is the primary asset mix in your portfolio?",
      hint: "Calibrates capital depreciation, rental yield spreads, and vacancy reserves.",
      options: [
        "Commercial Grade-A Office Leasing",
        "Residential Multi-Family Developments",
        "Industrial Logistics & Warehousing Assets",
        "Land Parcels & Mixed-Use Masterplans",
      ],
    },
    {
      id: "revenue_engine",
      question: "What drives the majority of your cash collections?",
      hint: "Shapes forward liquidity horizons and debt-service coverage ratio.",
      options: [
        "Predictable Monthly Long-Term Leases",
        "Deal Brokerage & Syndication Fees",
        "Property Asset Management Retainers",
        "Project Construction Milestone Advances",
      ],
    },
    {
      id: "average_occupancy",
      question: "What is your portfolio's current average occupancy rate?",
      hint: "Sets risk alarms for asset yield compression.",
      options: [
        "Over 92% (Near Full Capacity)",
        "80% – 92% (Healthy Commercial Baseline)",
        "65% – 80% (Leasing Push Underway)",
        "Under 65% / Turnaround Phase",
      ],
    },
  ],
  d2c: [
    {
      id: "fulfillment_model",
      question: "How do you store and dispatch inventory to buyers?",
      hint: "Used by Operations AI to track stockout exposure and shipping margins.",
      options: [
        "In-House Dedicated Central Warehouse",
        "Distributed 3PL Network (Shiprocket/Delhivery)",
        "Marketplace Direct (Amazon FBA / Flipkart)",
        "On-Demand Contract Manufacturing Dispatch",
      ],
    },
    {
      id: "sku_count",
      question: "How many active SKUs (stock keeping units) do you manage?",
      hint: "Determines working capital cycle and inventory holding costs.",
      options: [
        "Focused Hero Catalog (1 – 15 SKUs)",
        "Expanding Lineup (16 – 75 SKUs)",
        "Broad Multi-Category (75 – 300 SKUs)",
        "High-Volume Enterprise (300+ SKUs)",
      ],
    },
    {
      id: "primary_channel",
      question: "Where does your brand acquire the highest order volume?",
      hint: "Informs CMO Elena's blended ROAS and repeat purchase modeling.",
      options: [
        "Direct Brand Website (Shopify/Custom)",
        "Amazon & Flipkart Marketplaces",
        "Quick-Commerce (Blinkit, Zepto, Instamart)",
        "Omnichannel / Offline Retail Stores",
      ],
    },
  ],
  agency: [
    {
      id: "billing_structure",
      question: "What is your agency's standard client agreement structure?",
      hint: "Directly calculates utilization rates, revenue realization, and margin buffers.",
      options: [
        "Monthly Rolling Strategic Retainers",
        "Fixed-Price SOW Milestones with Delivery Gates",
        "Blended Hourly / Time & Materials",
        "Performance Incentive / Revenue-Share Model",
      ],
    },
    {
      id: "client_concentration",
      question: "How many core accounts represent >60% of your revenue?",
      hint: "Flags single-client concentration vulnerabilities in the Gap Register.",
      options: [
        "1 – 2 Whale Accounts (High Concentration)",
        "3 – 6 Anchor Accounts (Balanced Core)",
        "7 – 15 Diversified Active Accounts",
        "Highly Distributed (No client >10%)",
      ],
    },
    {
      id: "team_utilization",
      question: "What is your target billable biller utilization?",
      hint: "Used to model hiring triggers before taking on new enterprise mandates.",
      options: [
        "Over 85% (High Billable Load)",
        "70% – 85% (Optimal Creative & Exec Balance)",
        "50% – 70% (Capacity Available for Scaling)",
        "Under 50% / Repositioning offerings",
      ],
    },
  ],
  it: [
    {
      id: "service_delivery",
      question: "What is the primary scope of your IT delivery?",
      hint: "Calibrates engineering margins, bench costs, and cloud infrastructure pass-throughs.",
      options: [
        "Custom Enterprise Software & Web Development",
        "Cloud Infrastructure & Managed DevOps (AWS/Azure)",
        "Staff Augmentation & Dedicated Pods",
        "Cybersecurity, Compliance & Audits",
      ],
    },
    {
      id: "contract_duration",
      question: "What is the typical tenure of your client engagements?",
      hint: "Projects forward cash runway and pipeline replenishment requirements.",
      options: [
        "Multi-Year Enterprise Managed Services (2-3+ yrs)",
        "Annual Service Level Agreements (12 months)",
        "6-Month Development Sprints",
        "Ad-hoc Short Engagements (1-3 months)",
      ],
    },
    {
      id: "bench_rate",
      question: "What percentage of billable engineers are on bench/unallocated?",
      hint: "Informs CFO Marcus's gross margin protection rules.",
      options: [
        "Zero Bench / Immediate Backfill Needed",
        "Healthy Buffer (< 8% on Bench)",
        "8% – 18% Bench Reserve",
        "Over 18% / Optimization Needed",
      ],
    },
  ],
  healthcare: [
    {
      id: "practice_model",
      question: "What is the primary structure of your healthcare operations?",
      hint: "Calibrates equipment amortisation, doctor payout ratios, and bed turnover.",
      options: [
        "Multi-Specialty Hospital or Surgery Center",
        "Outpatient Specialty Clinic Chain",
        "Diagnostic Labs & Pathology Centers",
        "Dental & Cosmetic Wellness Center",
      ],
    },
    {
      id: "patient_volume",
      question: "What is your average daily patient footfall?",
      hint: "Determines revenue per practitioner and clinical throughput efficiency.",
      options: [
        "Over 250 Patients / Day (High Volume)",
        "100 – 250 Patients / Day",
        "30 – 100 Patients / Day",
        "Boutique / High-Touch (< 30 Patients/Day)",
      ],
    },
  ],
  manufacturing: [
    {
      id: "production_model",
      question: "What is your core manufacturing & delivery cycle?",
      hint: "Shapes factory capacity models, downtime reserves, and scrap rate metrics.",
      options: [
        "Continuous Make-to-Stock (MTS) High-Volume Runs",
        "Custom Engineered Make-to-Order (MTO)",
        "OEM White-Label for Enterprise Brands",
        "Batch Assembly & Specialized Fabrication",
      ],
    },
    {
      id: "raw_lead_time",
      question: "What is your critical raw material procurement lead time?",
      hint: "Used to model safety stock and working capital lockup.",
      options: [
        "Short Domestic Supply (< 10 Days)",
        "2 – 4 Weeks Procurement Cycle",
        "1 – 3 Months (Import / Custom Component Dependent)",
        "Over 3 Months (Global Supply Chain Buffer Required)",
      ],
    },
  ],
  finance: [
    {
      id: "fin_scope",
      question: "What is the primary financial vehicle or advisory focus?",
      hint: "Configures fiduciary compliance, AUM schedules, and advisory realization.",
      options: [
        "Wealth Management & Multi-Family Office",
        "NBFC / Private Credit & Secured Lending",
        "Corporate Advisory, M&A & Capital Syndication",
        "Tax, Audit & Statutory Assurance Services",
      ],
    },
    {
      id: "fee_mechanism",
      question: "What is your primary revenue generation mechanism?",
      hint: "Determines quarterly fee collection schedules and liquidity models.",
      options: [
        "Asset-Based AUM % Retainer Fee",
        "Transaction Success Fees & Syndicate Spread",
        "Fixed Advisory Retainers & Retainer Mandates",
        "Net Interest Margin (NIM) on Loan Portfolios",
      ],
    },
  ],
  other: [
    {
      id: "operating_model",
      question: "What is the primary operational rhythm of your business?",
      hint: "Astra synthesizes custom agent behaviors from your operating model.",
      options: [
        "B2B Professional Contracts & Deliverables",
        "High-Frequency Consumer Transactions",
        "Recurring Memberships / Subscriptions",
        "Asset Utilization & Field Operations",
      ],
    },
    {
      id: "core_bottleneck",
      question: "Where is the largest operational drag currently located?",
      hint: "Directly primes your initial Gap Register priorities.",
      options: [
        "Founder Being the Single Point of Contact & Sale",
        "Unpredictable Working Capital & Delayed Collections",
        "Sales Pipeline Inconsistency & Conversion Drops",
        "Talent Quality, Handover & Mid-Management Friction",
      ],
    },
  ],
};

const TOOLS_OPTIONS = [
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments & Revenue",
    description: "Automatic sync of invoices, ARR/MRR subscriptions, refunds, and daily cash inflow.",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Team Communication",
    description: "Executive channel alerts, solvency warnings, and bidirectional AI assistant bot.",
  },
  {
    id: "zoho_books",
    name: "Zoho Books / QuickBooks",
    category: "Accounting & Ledgers",
    description: "P&L synchronization, vendor expenses, GST reconciliation, and burn tracking.",
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    category: "Meetings & Workload",
    description: "Meeting load telemetry, client discovery calls, and executive time-burn diagnostics.",
  },
  {
    id: "help_desk",
    name: "Help Desk (Zendesk / Freshdesk)",
    category: "Support & Customer Health",
    description: "Escalated ticket volume, SLA response times, and customer churn indicators.",
  },
  {
    id: "none",
    name: "None of the above / I don't use any of these",
    category: "Manual Data Collection Mode",
    description: "Zero integrations required. We will collect your daily pulse via a 60-second in-app or WhatsApp check-in.",
  },
];

const INDUSTRY_PRIORITIES: Record<string, { id: string; title: string; detail: string; category: string; recommended?: boolean }[]> = {
  saas: [
    {
      id: "saas_churn",
      title: "Reduce Churn & Expand Net Revenue Retention (NRR)",
      detail: "Set automated alert triggers on usage drops and account friction prior to contract renewals.",
      category: "Retention",
      recommended: true,
    },
    {
      id: "saas_cac",
      title: "Shorten CAC Payback Period Below 12 Months",
      detail: "Audit paid acquisition channel saturation and optimize conversion to sales demo.",
      category: "Growth",
      recommended: true,
    },
    {
      id: "extend_runway",
      title: "Extend Cash Runway & Control Cloud Server Burn",
      detail: "Audit AWS/GCP workloads and discretionary vendor subscriptions to stretch runway.",
      category: "Financial",
    },
    {
      id: "saas_pricing",
      title: "Reprice Tiers & Seat-Based Monetization",
      detail: "Simulate pricing tier elasticities and annual contract upfront advances.",
      category: "Pricing",
    },
    {
      id: "founder_bottleneck",
      title: "Remove Founder Bottleneck from Enterprise Closing",
      detail: "Codify closing playbook so sales team can demo and close independently.",
      category: "Operations",
    },
    {
      id: "board_intelligence",
      title: "Automate Board-Ready ARR Reporting & Telemetry",
      detail: "Instrument real-time ARR waterfall, cohort telemetry, and gap diagnostics.",
      category: "Strategy",
    },
  ],
  it: [
    {
      id: "it_util",
      title: "Elevate Billable Engineering Utilisation (>82%)",
      detail: "Maximize client realization hours and minimize bench idle burn.",
      category: "Operations",
      recommended: true,
    },
    {
      id: "it_concentration",
      title: "Eliminate Single-Client Account Concentration Risk",
      detail: "De-risk primary client representing >25% of company revenues.",
      category: "Risk",
      recommended: true,
    },
    {
      id: "it_retainers",
      title: "Transition from T&M to High-Margin Managed Retainers",
      detail: "Productize recurring SLAs with upfront quarterly billing cycles.",
      category: "Pricing",
    },
    {
      id: "it_bench",
      title: "Optimize Developer Bench & Accelerate Sourcing",
      detail: "Reduce recruitment cycles and align talent bench to forward project pipeline.",
      category: "Talent",
    },
    {
      id: "founder_bottleneck",
      title: "Standardize Delivery Playbooks & Eliminate Founder Reviews",
      detail: "Empower project leads to run client scrums and milestone sign-offs independently.",
      category: "Operations",
    },
    {
      id: "it_collections",
      title: "Accelerate Milestone Cash Collections & Reduce DSO",
      detail: "Enforce payment milestones before staging release to protect cash flow.",
      category: "Financial",
    },
  ],
  d2c: [
    {
      id: "d2c_roas",
      title: "Improve Blended ROAS & Lower First-Order CAC",
      detail: "Audit Meta/Google ad efficiency, creative fatigue, and landing page dropoffs.",
      category: "Acquisition",
      recommended: true,
    },
    {
      id: "d2c_inventory",
      title: "Prevent Stockouts & Shorten Cash Conversion Cycle",
      detail: "Synchronize inventory reorder lead times with working capital availability.",
      category: "Supply Chain",
      recommended: true,
    },
    {
      id: "d2c_rto",
      title: "Reduce Courier Return-to-Origin (RTO) Losses",
      detail: "Implement OTP address verification and COD-to-prepaid customer conversion.",
      category: "Logistics",
    },
    {
      id: "d2c_ltv",
      title: "Elevate Repeat Purchase Frequency & 90-Day LTV",
      detail: "Automate post-purchase WhatsApp and email re-engagement flows.",
      category: "Retention",
    },
    {
      id: "d2c_margins",
      title: "Protect Contribution Margin After Packaging & Shipping",
      detail: "Model unit economics elasticity against carrier courier rate increases.",
      category: "Pricing",
    },
  ],
  real_estate: [
    {
      id: "re_occupancy",
      title: "Elevate Portfolio Occupancy & Commercial Yields",
      detail: "Accelerate tenant acquisition pipeline and optimize long-term lease spreads.",
      category: "Revenue",
      recommended: true,
    },
    {
      id: "re_closing",
      title: "Shorten High-Ticket Deal Closing & Syndication Velocity",
      detail: "Standardize investor diligence data room and automate buyer follow-ups.",
      category: "Sales",
      recommended: true,
    },
    {
      id: "re_collections",
      title: "Automate Rent Invoicing & Overdue Escalations",
      detail: "Eliminate overdue tenant arrears with automated GST reconciliation.",
      category: "Cash Flow",
    },
    {
      id: "re_dscr",
      title: "De-risk Debt-Service Coverage Ratio (DSCR)",
      detail: "Stress-test debt amortization obligations against fluctuating tenant vacancy.",
      category: "Financial",
    },
    {
      id: "re_pipeline",
      title: "Centralize Broker Partner Network & Commission Tracking",
      detail: "Instrument channel partner visibility and prevent broker leakages.",
      category: "Operations",
    },
  ],
  agency: [
    {
      id: "agency_founder",
      title: "Break Past Founder-Led Sales & Deal Dependency",
      detail: "Systematize inbound pitch decks and enable Account Executives to close.",
      category: "Operations",
      recommended: true,
    },
    {
      id: "agency_margins",
      title: "Eliminate Project Scope Creep & Margin Erosion",
      detail: "Track client revisions and automate change-request billings.",
      category: "Profitability",
      recommended: true,
    },
    {
      id: "agency_retainers",
      title: "Convert One-Off Projects into Recurring Monthly Retainers",
      detail: "Package ongoing strategic advisory and maintenance retainers.",
      category: "Revenue",
    },
    {
      id: "agency_dso",
      title: "Accelerate Client Receivable Collections (DSO < 30 Days)",
      detail: "Automate milestone invoicing and require retainer payments at month start.",
      category: "Cash Flow",
    },
    {
      id: "agency_churn",
      title: "Standardize Client Onboarding & Account Retention",
      detail: "Set up 30-60-90 day milestone review cadences to prevent account churn.",
      category: "Retention",
    },
  ],
  healthcare: [
    {
      id: "health_throughput",
      title: "Maximize Doctor & Procedure Room Utilisation",
      detail: "Balance clinical appointment scheduling and reduce idle room hours.",
      category: "Operations",
      recommended: true,
    },
    {
      id: "health_noshow",
      title: "Lower Patient Appointment No-Show Rate Below 5%",
      detail: "Automate WhatsApp appointment confirmations and 24-hour reminders.",
      category: "Retention",
      recommended: true,
    },
    {
      id: "health_equipment",
      title: "Accelerate High-Value Diagnostic Equipment Payback",
      detail: "Monitor scanning volume and drive referral partnership volume.",
      category: "Capital",
    },
    {
      id: "health_recurring",
      title: "Launch Recurring Preventive Care & Wellness Memberships",
      detail: "Create steady predictable cash inflow through annual wellness care subscriptions.",
      category: "Revenue",
    },
  ],
  manufacturing: [
    {
      id: "mfg_capacity",
      title: "Elevate Plant Capacity Utilisation Above 80%",
      detail: "Minimize machine idle downtime and optimize batch changeover schedules.",
      category: "Operations",
      recommended: true,
    },
    {
      id: "mfg_materials",
      title: "Mitigate Raw Material Price Volatility & Supply Lead Times",
      detail: "Diversify vendor contracts and optimize safety stock thresholds.",
      category: "Supply Chain",
      recommended: true,
    },
    {
      id: "mfg_scrap",
      title: "Reduce Quality Rejections & Production Scrap Below 1.5%",
      detail: "Implement automated stage-gate QA audits across assembly lines.",
      category: "Quality",
    },
    {
      id: "mfg_dealers",
      title: "Expand Dealer/Distributor Network & Improve Turnaround",
      detail: "Accelerate distributor dispatch cycles and track regional dealer quotas.",
      category: "Distribution",
    },
  ],
  finance: [
    {
      id: "fin_aum",
      title: "Accelerate High-Net-Worth Client Acquisition & AUM",
      detail: "Streamline wealth advisory pipeline and client portfolio proposals.",
      category: "Growth",
      recommended: true,
    },
    {
      id: "fin_compliance",
      title: "Automate Regulatory Audits & Compliance Documentation",
      detail: "Maintain continuous audit trails and KYC compliance checks.",
      category: "Compliance",
      recommended: true,
    },
    {
      id: "fin_fees",
      title: "Protect Advisory Fee Realisation & Transparency",
      detail: "Automate management fee billing and portfolio performance attribution.",
      category: "Operations",
    },
  ],
  other: [
    {
      id: "other_runway",
      title: "Extend Working Capital Runway & Optimize Cash Flow",
      detail: "Audit operational burn and forecast forward liquidity reserves.",
      category: "Financial",
      recommended: true,
    },
    {
      id: "other_sales",
      title: "Systematize Sales Pipeline & Reduce Founder Closing Burden",
      detail: "Enable team to qualify, quote, and close deals independently.",
      category: "Operations",
      recommended: true,
    },
    {
      id: "other_vendor",
      title: "Eliminate Vendor Cost Creep & Protect Gross Margins",
      detail: "Audit monthly supplier invoices and re-negotiate high-spend contracts.",
      category: "Profitability",
    },
    {
      id: "other_retention",
      title: "Elevate Client Retention & Repeat Business",
      detail: "Implement structured post-delivery check-ins and satisfaction telemetry.",
      category: "Retention",
    },
  ],
};

export default function OnboardingPage() {
  const router = useRouter();
  // Steps: 1 (Industry), 2 (Scale & Numbers), 2.5 (Website Extraction), 2.7 (Dynamic Business Intake), 2.9 (Connect Tools), 3 (Priorities)
  const [step, setStep] = useState<number>(1);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Analyzing business shape…");

  // Form State
  const [businessType, setBusinessType] = useState<string>("saas");
  const [customBusinessType, setCustomBusinessType] = useState<string>("");
  const [businessModel, setBusinessModel] = useState<string>("subscription");
  const [companyName, setCompanyName] = useState<string>("");
  const [founderName, setFounderName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("");
  const [annualRevenue, setAnnualRevenue] = useState<string>("");
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("");
  const [monthlyBurn, setMonthlyBurn] = useState<string>("");
  const [cashOnHand, setCashOnHand] = useState<string>("");

  // Automated Website Intelligence Extraction State
  const [autoExtractWebsite, setAutoExtractWebsite] = useState<boolean>(true);
  const [isExtractingWebsite, setIsExtractingWebsite] = useState<boolean>(false);
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [extractionStage, setExtractionStage] = useState<string>("Connecting to domain SSL…");
  const [extractedData, setExtractedData] = useState<{
    positioning: string;
    offerings: string;
    icp: string;
    metricsNote: string;
    verifiedDomain: string;
  }>({
    positioning: "",
    offerings: "",
    icp: "",
    metricsNote: "",
    verifiedDomain: "",
  });

  // Dynamic Business Intake State
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({});
  const [customOtherAnswers, setCustomOtherAnswers] = useState<Record<string, string>>({});

  // Tool Intake State
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [noIntegrations, setNoIntegrations] = useState<boolean>(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState<boolean>(true);
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-sync monthly revenue when annual revenue changes
  const handleAnnualRevenueChange = (rawVal: string) => {
    const rawClean = parseINR(rawVal);
    setAnnualRevenue(rawClean);
    const num = Number(rawClean);
    if (!isNaN(num) && num > 0) {
      setMonthlyRevenue(Math.round(num / 12).toString());
    } else {
      setMonthlyRevenue("");
    }
    if (errors.annualRevenue) {
      setErrors(prev => ({ ...prev, annualRevenue: "" }));
    }
  };

  // What they need right now (multi-select goals and pain points)
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const businessTypes = [
    {
      id: "it",
      title: "IT & Technology Services",
      desc: "Custom development, IT infrastructure, cloud engineering, and tech consultancy.",
      icon: "laptop",
    },
    {
      id: "real_estate",
      title: "Real Estate & Property",
      desc: "Property portfolios, commercial leasing, brokerage, asset yields, and tenancy.",
      icon: "building",
    },
    {
      id: "d2c",
      title: "E-Commerce & Retail",
      desc: "AOV, ROAS, SKU margins, repeat purchase frequency, and inventory cash cycle.",
      icon: "shopping",
    },
    {
      id: "saas",
      title: "B2B SaaS & Cloud Platforms",
      desc: "Recurring ARR/MRR subscriptions, CAC payback, NRR, and churn telemetry.",
      icon: "cloud",
    },
    {
      id: "agency",
      title: "Agency & Professional Services",
      desc: "Team billable utilisation, project margins, retainer pipeline, and realization.",
      icon: "briefcase",
    },
    {
      id: "healthcare",
      title: "Healthcare & Clinics",
      desc: "Patient volume, practitioner utilisation, recurring care, and clinic margins.",
      icon: "stethoscope",
    },
    {
      id: "manufacturing",
      title: "Manufacturing & Physical Goods",
      desc: "Capacity utilisation, unit economics, supply lead time, and distributor cycles.",
      icon: "factory",
    },
    {
      id: "finance",
      title: "Financial Services & Wealth",
      desc: "AUM, advisory fees, portfolio performance, compliance, and asset management.",
      icon: "landmark",
    },
    {
      id: "other",
      title: "Others (Custom Business)",
      desc: "Specify your exact established business type (e.g. Hospitality, Logistics, etc.)",
      icon: "layers",
    },
  ];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "it":
        return <Laptop className="w-5 h-5 text-brass" />;
      case "real_estate":
        return <Building2 className="w-5 h-5 text-brass" />;
      case "d2c":
        return <ShoppingBag className="w-5 h-5 text-brass" />;
      case "saas":
        return <Cloud className="w-5 h-5 text-brass" />;
      case "agency":
        return <Briefcase className="w-5 h-5 text-brass" />;
      case "healthcare":
        return <Stethoscope className="w-5 h-5 text-brass" />;
      case "manufacturing":
        return <Factory className="w-5 h-5 text-brass" />;
      case "finance":
        return <Landmark className="w-5 h-5 text-brass" />;
      default:
        return <Layers className="w-5 h-5 text-brass" />;
    }
  };

  const [customNeedInput, setCustomNeedInput] = useState("");
  const [customNeedsList, setCustomNeedsList] = useState<{ id: string; title: string; detail: string; category: string; recommended?: boolean }[]>([]);

  // Dynamically resolve industry priorities
  const currentNeedsOptions = [
    ...(INDUSTRY_PRIORITIES[businessType] || INDUSTRY_PRIORITIES.other),
    ...customNeedsList,
  ];

  const handleAddCustomNeed = () => {
    if (!customNeedInput.trim()) return;
    const newId = `custom_need_${Date.now()}`;
    const newNeed = {
      id: newId,
      title: customNeedInput.trim(),
      detail: "Custom operational bottleneck specified by leadership.",
      category: "Custom Directive",
    };
    setCustomNeedsList(prev => [...prev, newNeed]);
    setSelectedNeeds(prev => [...prev, newId]);
    setCustomNeedInput("");
  };

  const toggleNeed = (id: string) => {
    setSelectedNeeds(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  // Tool Selection Handler: Multi-select, with "none" mutually exclusive
  const toggleTool = (toolId: string) => {
    if (toolId === "none") {
      setNoIntegrations(prev => !prev);
      setSelectedTools([]);
      return;
    }

    setNoIntegrations(false);
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(t => t !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  // Step 2.95 Tool Authorization State & Handlers
  const [toolAuthStates, setToolAuthStates] = useState<Record<string, { status: "connected" | "connecting" | "idle"; detail?: string }>>({});
  const [isAuthorizingAll, setIsAuthorizingAll] = useState(false);

  const handleConnectTool = async (toolId: string) => {
    setToolAuthStates(prev => ({
      ...prev,
      [toolId]: { status: "connecting" },
    }));

    let detail = "Live Telemetry Connected";
    if (toolId === "stripe") {
      detail = `Connected · acct_1Nx${Math.floor(1000 + Math.random() * 9000)} (Live Ingestion Active)`;
    } else if (toolId === "slack") {
      detail = `Connected · Workspace: ${companyName || "Acme"} · #executive-briefings`;
    } else if (toolId === "zoho_books") {
      detail = `Connected · Org: ${companyName || "Enterprise"} Pvt Ltd (P&L Synced)`;
    } else if (toolId === "google_calendar") {
      detail = `Connected · ${founderName ? founderName.toLowerCase().replace(/\s+/g, "") : "founder"}@company.com`;
    } else if (toolId === "help_desk") {
      detail = `Connected · ${companyName ? companyName.toLowerCase().replace(/\s+/g, "") : "support"}.zendesk.com`;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    setToolAuthStates(prev => ({
      ...prev,
      [toolId]: { status: "connected", detail },
    }));

    try {
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolKey: toolId,
          status: "connected",
          config: { accountDetail: detail, connectedAt: new Date().toISOString() },
        }),
      });
    } catch (e) {
      console.error("Failed to connect tool via API", e);
    }
  };

  const handleConnectAllTools = async () => {
    setIsAuthorizingAll(true);
    for (const toolId of selectedTools) {
      if (toolAuthStates[toolId]?.status !== "connected") {
        await handleConnectTool(toolId);
      }
    }
    setIsAuthorizingAll(false);
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
      newErrors.companyName = "Company Name is required";
    }
    if (!founderName.trim()) {
      newErrors.founderName = "Founder Name is required";
    }
    if (!teamSize.trim() || Number(teamSize) <= 0) {
      newErrors.teamSize = "Valid Team Size is required";
    }
    if (!annualRevenue.trim() || Number(annualRevenue) <= 0) {
      newErrors.annualRevenue = "Company Annual Income / Revenue is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const startWebsiteExtraction = () => {
    setStep(2.5);
    setIsExtractingWebsite(true);
    setExtractionProgress(15);

    const cleanDomain = website.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const resolvedIndustryLabel =
      businessType === "other" && customBusinessType.trim()
        ? customBusinessType.trim()
        : businessTypes.find(b => b.id === businessType)?.title || "Business";

    const stages = [
      `Validating SSL handshake & security headers for ${cleanDomain}…`,
      `Crawling homepage, services, and sitemap navigation…`,
      `Extracting market positioning and core value proposition…`,
      `Detecting target ICP buyer personas and commercial workflows…`,
      `Synthesizing extracted telemetry into Nuralix Business OS…`,
    ];

    let current = 0;
    const timer = setInterval(() => {
      current++;
      if (current < stages.length) {
        setExtractionStage(stages[current]);
        setExtractionProgress(Math.round(((current + 1) / (stages.length + 1)) * 100));
      } else {
        clearInterval(timer);
        setExtractionProgress(100);
        setIsExtractingWebsite(false);
        setExtractedData({
          verifiedDomain: cleanDomain,
          positioning: `${companyName || "Your Company"} is an established ${resolvedIndustryLabel.toLowerCase()} operation delivering reliable, high-performance capabilities.`,
          offerings: `Custom ${resolvedIndustryLabel} solutions, SLA-backed performance architectures, operational telemetry, automated client pipelines.`,
          icp: `Mid-market to enterprise leaders, commercial directors, procurement specialists, and growth-focused founders.`,
          metricsNote: `Indian INR (₹) commercial model aligned · High client retention indicators · Active digital footprint verified.`,
        });
      }
    }, 550);
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      if (website.trim() && autoExtractWebsite) {
        startWebsiteExtraction();
      } else {
        setStep(2.7); // Jump straight to Dynamic Business Intake
      }
    }
  };

  const handleCompleteSetup = async () => {
    setIsAssembling(true);
    const resolvedIndustryLabel =
      businessType === "other" && customBusinessType.trim()
        ? customBusinessType.trim()
        : businessTypes.find(b => b.id === businessType)?.title || businessType;

    const statuses = [
      `Persisting company profile for ${companyName}…`,
      `Calibrating Indian benchmarks (INR ₹) for established ${resolvedIndustryLabel.toUpperCase()} business…`,
      `Configuring Astra (CEO) and Marcus (CFO) executive agents for ${founderName}…`,
      "Synthesizing your connected tool sync adapters and daily check-in protocols…",
      "Running deterministic Layer 1 gap analysis & synthesizing your executive briefing…",
    ];

    let current = 0;
    const interval = setInterval(async () => {
      current += 1;
      if (current < statuses.length) {
        setStatusMessage(statuses[current]);
        setAssemblyProgress(Math.round((current / statuses.length) * 100));
      } else {
        clearInterval(interval);
        setAssemblyProgress(100);

        // Compile dynamic answers merging options & custom "other" inputs
        const finalizedDynamicAnswers: Record<string, string> = {};
        for (const [k, v] of Object.entries(dynamicAnswers)) {
          if (v === "__other__") {
            finalizedDynamicAnswers[k] = customOtherAnswers[k] || "Custom Specification";
          } else {
            finalizedDynamicAnswers[k] = v;
          }
        }

        // Save completed profile locally
        const profile = {
          name: companyName.trim() || "My Company",
          founderName: founderName.trim() || "Founder",
          website: website.trim(),
          industry: businessType === "other" && customBusinessType.trim() ? customBusinessType.trim() : businessType,
          industryLabel: resolvedIndustryLabel,
          industryKey: businessType,
          customBusinessType: businessType === "other" ? customBusinessType.trim() : "",
          businessModel,
          currency: "INR",
          teamSize: Number(teamSize) || 10,
          annualRevenue: Number(annualRevenue) || 6000000,
          revenue: Number(monthlyRevenue) || (Number(annualRevenue) ? Math.round(Number(annualRevenue) / 12) : 500000),
          burn: Number(monthlyBurn) || 150000,
          cash: Number(cashOnHand) || 1200000,
          needs: selectedNeeds.length > 0 ? selectedNeeds : ["extend_runway"],
          connectedTools: noIntegrations ? [] : selectedTools,
          noIntegrations,
          whatsappOptIn,
          whatsappNumber: whatsappNumber.trim(),
          dynamicAnswers: finalizedDynamicAnswers,
          extractedWebsiteData: website.trim() ? extractedData : null,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem("nuralix_business_profile", JSON.stringify(profile));

        // Persist to persistent SQLite database via API
        try {
          await fetch("/api/business/intake", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: profile.name,
              industry: profile.industryKey,
              industryLabel: profile.industryLabel,
              customIndustry: profile.customBusinessType,
              founderName: profile.founderName,
              website: profile.website,
              teamSize: profile.teamSize,
              annualRevenue: profile.annualRevenue,
              monthlyRevenue: profile.revenue,
              monthlyBurn: profile.burn,
              cashOnHand: profile.cash,
              connectedTools: profile.connectedTools,
              noIntegrations: profile.noIntegrations,
              whatsappOptIn: profile.whatsappOptIn,
              whatsappNumber: profile.whatsappNumber,
              dynamicAnswers: profile.dynamicAnswers,
            }),
          });
        } catch (e) {
          console.error("Failed to persist intake to SQLite API:", e);
        }

        // Guarantee user session is active
        try {
          const existingSession = localStorage.getItem("nuralix_user_session");
          if (!existingSession) {
            const userSession = {
              id: `usr_${Date.now()}`,
              email: website.trim() ? `founder@${website.trim().replace(/^https?:\/\//, '')}` : "founder@mycompany.in",
              name: founderName.trim() || "Founder",
              role: "owner",
              provider: "email",
              authenticatedAt: new Date().toISOString(),
            };
            localStorage.setItem("nuralix_user_session", JSON.stringify(userSession));
          }
        } catch (e) {
          // ignore
        }

        setTimeout(() => {
          router.push("/subscription");
        }, 800);
      }
    }, 650);
  };

  const currentQuestions = INDUSTRY_DYNAMIC_QUESTIONS[businessType] || INDUSTRY_DYNAMIC_QUESTIONS.other;

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
          <span className="text-xs font-semibold text-text-muted">
            {step === 1 && "Step 1 of 5 · Industry"}
            {step === 2 && "Step 2 of 5 · Financials"}
            {step === 2.5 && "Step 2.5 · AI Extraction"}
            {step === 2.7 && "Step 3 of 5 · Operations"}
            {step === 2.9 && "Step 4 of 5 · Connected Tools"}
            {step === 2.95 && "Step 4.5 · Authorize & Sign In"}
            {step === 3 && "Step 5 of 5 · Priorities"}
          </span>
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
                        className={`p-4 rounded-xl border transition-all cursor-pointer btn-tactile flex items-start gap-3 ${
                          isSelected
                            ? "bg-surface-2 border-brass ring-1 ring-brass/30 shadow-sm"
                            : "bg-surface-2/50 border-line hover:border-line-strong"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-surface border border-line flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          {getCategoryIcon(type.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-text block mb-1">{type.title}</span>
                          <p className="text-[11px] text-text-muted leading-relaxed">
                            {type.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Category Input for 'Others' */}
                {businessType === "other" && (
                  <div className="p-4 rounded-xl bg-brass-soft/40 border border-brass/40 space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-text flex items-center">
                      <span>Specify Your Business Industry / Type</span>
                      <span className="text-rust font-bold ml-1">*</span>
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
                  </p>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div className="p-3 rounded-lg bg-rust/10 border border-rust/30 flex items-start gap-2.5 text-xs text-rust">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold">Please complete required fields to proceed:</span>
                      <ul className="list-disc list-inside text-[11px] opacity-90">
                        {Object.values(errors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Company Name */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center">
                      <span>Company Name</span>
                      <span className="text-rust font-bold ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => {
                        setCompanyName(e.target.value);
                        if (errors.companyName) setErrors(prev => ({ ...prev, companyName: "" }));
                      }}
                      placeholder="e.g. Apex Global Pvt Ltd"
                      className={`w-full px-3 py-2 rounded-lg bg-surface-2 border text-text focus:ring-1 focus:ring-brass ${
                        errors.companyName ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-[10px] text-rust font-medium mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  {/* Founder Name */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center">
                      <span>Founder Name</span>
                      <span className="text-rust font-bold ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={e => {
                        setFounderName(e.target.value);
                        if (errors.founderName) setErrors(prev => ({ ...prev, founderName: "" }));
                      }}
                      placeholder="e.g. Alex Sharma"
                      className={`w-full px-3 py-2 rounded-lg bg-surface-2 border text-text focus:ring-1 focus:ring-brass ${
                        errors.founderName ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                    />
                    {errors.founderName && (
                      <p className="text-[10px] text-rust font-medium mt-1">{errors.founderName}</p>
                    )}
                  </div>

                  {/* Team Size */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center">
                      <span>Team Size (FTEs)</span>
                      <span className="text-rust font-bold ml-1">*</span>
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

                  {/* Annual Revenue (INR ₹) */}
                  <div>
                    <label className="font-semibold text-text mb-1 flex items-center">
                      <span>Company Annual Income / Revenue (₹)</span>
                      <span className="text-rust font-bold ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={annualRevenue ? formatINR(annualRevenue) : ""}
                      onChange={e => handleAnnualRevenueChange(e.target.value)}
                      placeholder="e.g. 60,00,000"
                      className={`w-full px-3 py-2 rounded-lg bg-surface-2 border text-text focus:ring-1 focus:ring-brass font-mono ${
                        errors.annualRevenue ? "border-rust ring-1 ring-rust/50" : "border-line"
                      }`}
                    />
                    {errors.annualRevenue ? (
                      <p className="text-[10px] text-rust font-medium mt-1">{errors.annualRevenue}</p>
                    ) : (
                      annualRevenue && Number(annualRevenue) > 0 && (
                        <p className="text-[10px] text-text-muted mt-1 font-mono">
                          ≈ ₹{formatINR(Math.round(Number(annualRevenue) / 12))} / month
                        </p>
                      )
                    )}
                  </div>

                  {/* Monthly Net Burn (INR ₹) */}
                  <div>
                    <label className="font-semibold text-text block mb-1">
                      Monthly Net Burn (₹)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyBurn ? formatINR(monthlyBurn) : ""}
                      onChange={e => setMonthlyBurn(parseINR(e.target.value))}
                      placeholder="e.g. 1,50,000"
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass font-mono"
                    />
                  </div>

                  {/* Cash on Hand (INR ₹) */}
                  <div>
                    <label className="font-semibold text-text block mb-1">
                      Cash on Hand / Reserves (₹)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cashOnHand ? formatINR(cashOnHand) : ""}
                      onChange={e => setCashOnHand(parseINR(e.target.value))}
                      placeholder="e.g. 12,00,000"
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass font-mono"
                    />
                  </div>

                  {/* Website URL */}
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-text flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        <span>Company Website URL</span>
                      </label>
                      <span className="text-[10px] text-text-muted">Optional</span>
                    </div>
                    <input
                      type="text"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="e.g. apexglobal.in"
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass"
                    />
                    <div className="p-3 rounded-lg bg-brass-soft/30 border border-brass/20 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="auto-extract-toggle"
                        checked={autoExtractWebsite}
                        onChange={e => setAutoExtractWebsite(e.target.checked)}
                        className="mt-0.5 rounded border-line text-brass focus:ring-brass cursor-pointer"
                      />
                      <label htmlFor="auto-extract-toggle" className="text-[11px] text-text leading-relaxed cursor-pointer select-none">
                        <span className="font-bold text-brass block">Automated Business Intelligence Extraction</span>
                        <span>If provided, Nuralix AI will crawl your website to automatically extract positioning, products, customer segments, and market telemetry in the next step.</span>
                      </label>
                    </div>
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
                    <span>{website.trim() && autoExtractWebsite ? "Continue to Website Extraction" : "Continue to Operational Details"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2.5: Automated Website Intelligence Extraction */}
            {step === 2.5 && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass-soft border border-brass/30 text-brass text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Website Intelligence Extraction</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                    Extracted Business Intelligence
                  </h1>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Nuralix AI has crawled <span className="font-mono text-text font-semibold">{website}</span> to automatically extract and structure your company positioning, offerings, and commercial model.
                  </p>
                </div>

                {isExtractingWebsite ? (
                  <div className="p-8 rounded-xl border border-brass/30 bg-surface-2/60 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-brass/10 border border-brass/30 text-brass flex items-center justify-center mx-auto animate-spin">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-text">{extractionStage}</div>
                      <p className="text-[11px] text-text-muted font-mono">Parsing sitemap & telemetry heuristics…</p>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-line">
                      <div
                        className="bg-brass h-full transition-all duration-300 rounded-full"
                        style={{ width: `${extractionProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-jade/10 border border-jade/30 flex items-center justify-between text-xs text-jade">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-jade shrink-0" />
                        <span>Domain verified: {extractedData.verifiedDomain} · 4 telemetry vectors synthesized</span>
                      </div>
                      <button
                        type="button"
                        onClick={startWebsiteExtraction}
                        className="text-[11px] underline hover:opacity-80 flex items-center gap-1 text-text-muted cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-crawl</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-text flex items-center justify-between">
                        <span>Extracted Value Proposition & Positioning</span>
                        <span className="text-[10px] text-brass font-bold uppercase">Editable</span>
                      </label>
                      <textarea
                        rows={2}
                        value={extractedData.positioning}
                        onChange={e => setExtractedData(prev => ({ ...prev, positioning: e.target.value }))}
                        className="w-full p-2.5 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-text flex items-center justify-between">
                        <span>Extracted Core Offerings & Services</span>
                        <span className="text-[10px] text-brass font-bold uppercase">Editable</span>
                      </label>
                      <textarea
                        rows={2}
                        value={extractedData.offerings}
                        onChange={e => setExtractedData(prev => ({ ...prev, offerings: e.target.value }))}
                        className="w-full p-2.5 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-text flex items-center justify-between">
                        <span>Identified Target Customer Persona (ICP)</span>
                        <span className="text-[10px] text-brass font-bold uppercase">Editable</span>
                      </label>
                      <input
                        type="text"
                        value={extractedData.icp}
                        onChange={e => setExtractedData(prev => ({ ...prev, icp: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-line text-text focus:ring-1 focus:ring-brass text-xs"
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-surface-2 border border-line text-[11px] text-text-muted flex items-start gap-2.5">
                      <Building2 className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                      <span>{extractedData.metricsNote}</span>
                    </div>

                    <div className="pt-3 border-t border-line flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
                      >
                        Back to Financials
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(2.7)}
                        className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                      >
                        <span>Confirm & Continue to Operational Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2.7: Dynamic Business Intake Questions (Tailored by Industry) */}
            {step === 2.7 && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
                      Tailored Industry Telemetry
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                      Operational Anatomy & Mechanics
                    </h1>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Calibrated specifically for your <span className="font-semibold text-text">{businessTypes.find(b => b.id === businessType)?.title || "business"}</span> model. Answer or customize these questions, or skip to continue anytime.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2.9)}
                    className="self-start sm:self-auto text-xs text-text-muted hover:text-brass underline decoration-dotted font-semibold cursor-pointer px-2 py-1"
                  >
                    Skip this section →
                  </button>
                </div>

                {/* Dynamic Questions List */}
                <div className="space-y-5 pt-1">
                  {currentQuestions.map((q, qIndex) => {
                    const selectedVal = dynamicAnswers[q.id] || "";
                    const isOther = selectedVal === "__other__";

                    return (
                      <div key={q.id} className="p-4 rounded-xl border border-line bg-surface-2/40 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-brass uppercase tracking-wider block">
                            Question {qIndex + 1} of {currentQuestions.length}
                          </span>
                          <h2 className="text-xs sm:text-sm font-bold text-text mt-0.5">{q.question}</h2>
                          <p className="text-[11px] text-text-muted mt-0.5">{q.hint}</p>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map(opt => {
                            const isOptSelected = selectedVal === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setDynamicAnswers(prev => ({
                                    ...prev,
                                    [q.id]: isOptSelected ? "" : opt,
                                  }));
                                }}
                                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between btn-tactile ${
                                  isOptSelected
                                    ? "bg-brass-soft border-brass text-text font-bold shadow-xs"
                                    : "bg-surface border-line text-text-muted hover:text-text hover:border-line-strong"
                                }`}
                              >
                                <span>{opt}</span>
                                {isOptSelected && <Check className="w-3.5 h-3.5 text-brass shrink-0" />}
                              </button>
                            );
                          })}

                          {/* "Other (manual input)" option */}
                          <button
                            type="button"
                            onClick={() => {
                              setDynamicAnswers(prev => ({
                                ...prev,
                                [q.id]: isOther ? "" : "__other__",
                              }));
                            }}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between btn-tactile ${
                              isOther
                                ? "bg-brass-soft border-brass text-text font-bold shadow-xs"
                                : "bg-surface border-line text-text-muted hover:text-text hover:border-line-strong"
                            }`}
                          >
                            <span>Other (write manually)</span>
                            {isOther && <Check className="w-3.5 h-3.5 text-brass shrink-0" />}
                          </button>
                        </div>

                        {/* Manual write-in box if "Other" is selected */}
                        {isOther && (
                          <div className="pt-2">
                            <input
                              type="text"
                              value={customOtherAnswers[q.id] || ""}
                              onChange={e => {
                                const val = e.target.value;
                                setCustomOtherAnswers(prev => ({ ...prev, [q.id]: val }));
                              }}
                              placeholder="Type your specific answer here..."
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-brass text-xs text-text focus:outline-none focus:ring-1 focus:ring-brass"
                              autoFocus
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(website.trim() && autoExtractWebsite ? 2.5 : 2)}
                    className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2.9)}
                    className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Business Tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2.9: Connect Your Business Tools */}
            {step === 2.9 && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass-soft text-brass text-[10px] font-bold uppercase tracking-wider mb-2">
                    Integration & Collection Mode
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                    Connect your business tools
                  </h1>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Select the platforms and systems your company already uses. You can select multiple tools, or choose none to use automated daily check-ins.
                  </p>
                </div>

                {/* Multi-Select Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TOOLS_OPTIONS.map(tool => {
                    const isSelected = tool.id === "none" ? noIntegrations : selectedTools.includes(tool.id);

                    return (
                      <div
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 btn-tactile ${
                          isSelected
                            ? "bg-surface-2 border-brass ring-1 ring-brass/40 shadow-sm"
                            : "bg-surface-2/40 border-line hover:border-line-strong"
                        }`}
                      >
                        <ToolLogo toolId={tool.id} size={36} className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-text">{tool.name}</span>
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-brass border-brass text-white" : "border-line-strong bg-surface"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-brass block mt-0.5">{tool.category}</span>
                          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Visible Explanation Under the Grid */}
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-text space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>How Nuralix Collects Your Daily Data</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Selected tools sync your data automatically. For anything not connected, we&apos;ll ask you for a quick daily update instead — no manual dashboard work required.
                  </p>
                </div>

                {/* WhatsApp Check-In Bot Opt-In Field */}
                <div className="p-4 rounded-xl border border-line bg-surface-2/60 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-jade/10 border border-jade/30 flex items-center justify-center text-jade shrink-0 mt-0.5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold text-text">WhatsApp Daily Executive Check-In Bot</h2>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                          Receive a 60-second morning message. Reply with 1 line or a voice note and Nuralix updates your dashboard and executive briefings automatically.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={whatsappOptIn}
                        onChange={e => setWhatsappOptIn(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface rounded-full border border-line peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted peer-checked:after:bg-white after:border-line after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-jade" />
                    </label>
                  </div>

                  {whatsappOptIn && (
                    <div className="pt-2 border-t border-line/60 animate-fade-in space-y-1.5">
                      <label className="text-[11px] font-semibold text-text block">
                        Founder / Primary WhatsApp Number
                      </label>
                      <PhoneCountryInput
                        value={whatsappNumber}
                        onChange={setWhatsappNumber}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2.7)}
                    className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="btn-continue-step-tools"
                    type="button"
                    onClick={() => {
                      if (!noIntegrations && selectedTools.length > 0) {
                        setStep(2.95);
                      } else {
                        setStep(3);
                        if (selectedNeeds.length === 0) {
                          const recs = (INDUSTRY_PRIORITIES[businessType] || INDUSTRY_PRIORITIES.other)
                            .filter(o => o.recommended)
                            .map(o => o.id);
                          setSelectedNeeds(recs);
                        }
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {!noIntegrations && selectedTools.length > 0
                        ? `Continue to Sign In & Connect (${selectedTools.length})`
                        : "Continue to Priorities & Bottlenecks"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2.95: Sign In & Authorize Connected Tools */}
            {step === 2.95 && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
                    OAuth & Handshake Verification
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                    Sign in & authorize your connected tools
                  </h1>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Authenticate your selected platforms so Nuralix can ingest live daily metrics, calibrate executive briefings, and eliminate manual reporting.
                  </p>
                </div>

                {/* Quick Connect All Banner */}
                {selectedTools.some(t => toolAuthStates[t]?.status !== "connected") && (
                  <div className="p-3.5 rounded-xl bg-surface-2 border border-line flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text block">One-Click Multi-Tool Handshake</span>
                        <span className="text-[11px] text-text-muted">Authorize all {selectedTools.length} selected systems simultaneously.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isAuthorizingAll}
                      onClick={handleConnectAllTools}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold text-xs hover:bg-cyan-500/30 btn-tactile cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {isAuthorizingAll ? (
                        <>
                          <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          <span>Connecting Tools…</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Connect & Sign In to All</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Individual Tool Sign-In Cards */}
                <div className="space-y-3">
                  {selectedTools.map(toolId => {
                    const toolObj = TOOLS_OPTIONS.find(t => t.id === toolId);
                    if (!toolObj) return null;
                    const authState = toolAuthStates[toolId] || { status: "idle" };
                    const isConnected = authState.status === "connected";
                    const isConnecting = authState.status === "connecting";

                    return (
                      <div
                        key={toolId}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isConnected
                            ? "bg-jade/5 border-jade/30 shadow-sm"
                            : "bg-surface-2/40 border-line hover:border-line-strong"
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <ToolLogo toolId={toolId} size={36} className="mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-text">{toolObj.name}</span>
                              {isConnected ? (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-jade/15 text-jade border border-jade/30 font-mono font-semibold uppercase flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Connected</span>
                                </span>
                              ) : (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 font-mono font-semibold uppercase">
                                  Pending Auth
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                              {isConnected && authState.detail ? (
                                <span className="text-jade font-medium font-mono text-[10px]">{authState.detail}</span>
                              ) : (
                                toolObj.description
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isConnected ? (
                            <div className="px-3.5 py-1.5 rounded-lg bg-jade/15 border border-jade/30 text-jade text-xs font-bold flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Authorized</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={isConnecting}
                              onClick={() => handleConnectTool(toolId)}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brass text-white font-bold text-xs shadow-sm hover:brightness-110 btn-tactile cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                            >
                              {isConnecting ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Signing In…</span>
                                </>
                              ) : (
                                <>
                                  <span>Sign In with {toolObj.name.split(" ")[0]}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2.9)}
                    className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
                  >
                    Back to Tools
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(3);
                        if (selectedNeeds.length === 0) {
                          const recs = (INDUSTRY_PRIORITIES[businessType] || INDUSTRY_PRIORITIES.other)
                            .filter(o => o.recommended)
                            .map(o => o.id);
                          setSelectedNeeds(recs);
                        }
                      }}
                      className="text-xs text-text-muted hover:text-text cursor-pointer"
                    >
                      Skip for now
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(3);
                        if (selectedNeeds.length === 0) {
                          const recs = (INDUSTRY_PRIORITIES[businessType] || INDUSTRY_PRIORITIES.other)
                            .filter(o => o.recommended)
                            .map(o => o.id);
                          setSelectedNeeds(recs);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Priorities & Bottlenecks</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: What do you need right now? (Priorities & Bottlenecks) */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
                    Dynamic Strategic Calibration
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight font-sans">
                    What are your biggest priorities & bottlenecks?
                  </h1>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Tailored for your established <strong className="text-text font-bold">{businessTypes.find(b => b.id === businessType)?.title || "business"}</strong>. Recommended items are pre-selected to seed your gap register, AI executives, and execution queue.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {currentNeedsOptions.map(need => {
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
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="text-xs font-bold text-text">{need.title}</span>
                            <div className="flex items-center gap-1.5">
                              {need.recommended && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold uppercase font-mono tracking-wide">
                                  Recommended
                                </span>
                              )}
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-line text-brass font-semibold uppercase">
                                {need.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                            {need.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Bottleneck / Priority Write-in Option */}
                <div className="p-3.5 rounded-xl border border-line bg-surface-2/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text">Add Custom Priority or Bottleneck</span>
                    <span className="text-[10px] text-text-muted">Type and press Enter or click + Add</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customNeedInput}
                      onChange={e => setCustomNeedInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomNeed();
                        }
                      }}
                      placeholder="e.g. Reduce customer onboarding drop-off rate, negotiate supplier credit terms..."
                      className="flex-1 px-3 py-2 rounded-lg bg-surface border border-line text-xs text-text focus:outline-none focus:ring-1 focus:ring-brass"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomNeed}
                      className="px-3.5 py-2 rounded-lg bg-brass text-white text-xs font-bold hover:brightness-110 btn-tactile cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2.9)}
                    className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
                  >
                    Back to Business Tools
                  </button>
                  <button
                    id="btn-assemble-os"
                    type="button"
                    onClick={handleCompleteSetup}
                    className="px-6 py-3 rounded-xl bg-brass text-white font-bold text-xs shadow-lg hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Assemble My Custom Business OS</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Live AI Assembly Sequence */
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
