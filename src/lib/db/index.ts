// @ts-ignore
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

// Initialize data folder
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Clear read-only attributes on Windows if set by OneDrive or OS
if (process.platform === "win32") {
  try {
    const { execSync } = require("child_process");
    execSync(`attrib -r "${dataDir}" /d`, { stdio: "ignore" });
    execSync(`attrib -r "${path.join(dataDir, "*.*")}"`, { stdio: "ignore" });
  } catch {}
}

const dbPath = path.join(dataDir, "nuralix.db");
const db = new DatabaseSync(dbPath);

// Enable WAL mode & resilient pragmas so SQLite handles Windows/OneDrive concurrent locks
try {
  db.exec(`
    PRAGMA busy_timeout = 10000;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA temp_store = MEMORY;
  `);
} catch (e) {
  console.warn("Could not set SQLite pragmas:", e);
}

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    industry_label TEXT,
    custom_industry TEXT,
    founder_name TEXT,
    website TEXT,
    team_size INTEGER,
    annual_revenue REAL,
    monthly_revenue REAL,
    monthly_burn REAL,
    cash_on_hand REAL,
    connected_tools TEXT, -- JSON array of tool keys: ["stripe", "slack", ...]
    no_integrations INTEGER DEFAULT 0, -- 1 if opted for manual collection
    whatsapp_opt_in INTEGER DEFAULT 0,
    whatsapp_number TEXT,
    dynamic_intake_answers TEXT, -- JSON object
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS integrations (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    tool_key TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL, -- 'not_connected' | 'pending_connection' | 'connected' | 'error'
    api_key TEXT,
    webhook_url TEXT,
    config TEXT, -- JSON object
    updated_at TEXT,
    UNIQUE(business_id, tool_key)
  );

  CREATE TABLE IF NOT EXISTS daily_checkins (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    date TEXT NOT NULL,
    source TEXT NOT NULL, -- 'manual_web' | 'whatsapp'
    answers TEXT NOT NULL, -- JSON object { revenue_status, blockers, urgent_items, hr_issues, tech_issues }
    raw_text TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    amount REAL,
    currency TEXT,
    payload TEXT NOT NULL,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    title TEXT NOT NULL,
    owner TEXT NOT NULL,
    gap TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'todo', -- 'todo' | 'in_progress' | 'done'
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS platform_config (
    config_key TEXT PRIMARY KEY,
    config_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

// Default business ID for single-tenant local workspace
export const DEFAULT_BUSINESS_ID = "biz_enterprise_01";

// Ensure default business exists
const existingBiz = db.prepare("SELECT id FROM businesses WHERE id = ?").get(DEFAULT_BUSINESS_ID);
if (!existingBiz) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO businesses (
      id, name, industry, industry_label, founder_name, website, team_size, 
      annual_revenue, monthly_revenue, monthly_burn, cash_on_hand, 
      connected_tools, no_integrations, whatsapp_opt_in, whatsapp_number, 
      dynamic_intake_answers, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, 
      ?, ?, ?, ?, 
      ?, ?, ?
    )
  `).run(
    DEFAULT_BUSINESS_ID,
    "Apex Analytics",
    "saas",
    "B2B SaaS & Cloud Platforms",
    "Alex Sharma",
    "apexanalytics.in",
    15,
    6000000,
    500000,
    150000,
    1200000,
    JSON.stringify([]),
    0,
    0,
    "",
    JSON.stringify({}),
    now,
    now
  );
}

// Ensure default integrations exist
const DEFAULT_TOOLS = [
  { tool_key: "stripe", name: "Stripe", category: "payments" },
  { tool_key: "slack", name: "Slack", category: "communication" },
  { tool_key: "zoho_books", name: "Zoho Books", category: "accounting" },
  { tool_key: "google_calendar", name: "Google Calendar", category: "scheduling" },
  { tool_key: "help_desk", name: "Help Desk (Zendesk / Freshdesk)", category: "support" },
  { tool_key: "zoom", name: "Zoom", category: "meetings" },
  { tool_key: "github", name: "GitHub", category: "engineering" },
];

for (const tool of DEFAULT_TOOLS) {
  const exists = db
    .prepare("SELECT id FROM integrations WHERE business_id = ? AND tool_key = ?")
    .get(DEFAULT_BUSINESS_ID, tool.tool_key);
  if (!exists) {
    db.prepare(`
      INSERT INTO integrations (id, business_id, tool_key, name, category, status, updated_at)
      VALUES (?, ?, ?, ?, ?, 'not_connected', ?)
    `).run(
      `int_${tool.tool_key}`,
      DEFAULT_BUSINESS_ID,
      tool.tool_key,
      tool.name,
      tool.category,
      new Date().toISOString()
    );
  }
}

// Ensure initial seed tasks exist
const taskCountRow = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE business_id = ?").get(DEFAULT_BUSINESS_ID) as { count: number };
if (taskCountRow.count === 0) {
  const initialTasks = [
    { id: "task_1", title: "Audit discretionary SaaS tool spend for ₹12,000/mo savings", status: "todo", owner: "Marcus (CFO)", gap: "Cash Runway", priority: "high" },
    { id: "task_2", title: "Draft enterprise SLA & multi-year contract for top account", status: "in_progress", owner: "Astra (CEO)", gap: "Client Concentration", priority: "critical" },
    { id: "task_3", title: "Launch secondary customer acquisition sprint on LinkedIn", status: "todo", owner: "Elena (CMO)", gap: "Channel Concentration", priority: "medium" },
    { id: "task_4", title: "Document sales script & handover discovery calls", status: "done", owner: "Founder", gap: "Founder Dependency", priority: "high" },
  ];

  for (const t of initialTasks) {
    db.prepare(`
      INSERT INTO tasks (id, business_id, title, owner, gap, priority, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(t.id, DEFAULT_BUSINESS_ID, t.title, t.owner, t.gap, t.priority, t.status, new Date().toISOString());
  }
}

// -------------------------------------------------------------
// Platform Dynamic Configuration (Website + Dashboard)
// -------------------------------------------------------------

export const DEFAULT_WEBSITE_CONFIG = {
  sections: {
    hero: { enabled: true, title: "Hero Section" },
    sceneAwakening: { enabled: true, title: "Scene 01 — Awakening" },
    sceneConnection: { enabled: true, title: "Scene 02 — Connection" },
    sceneIntelligence: { enabled: true, title: "Scene 03 — Intelligence" },
    sceneNuralix: { enabled: true, title: "Scene 04 — This is Nuralix" },
    about: { enabled: true, title: "About Section" },
    sceneExpansion: { enabled: true, title: "Scene 05 — Expansion" },
    solutions: { enabled: true, title: "Solutions & Capabilities" },
    stats: { enabled: true, title: "Impact & Stats" },
    sceneHuman: { enabled: true, title: "Scene 06 — Human + AI" },
    vision: { enabled: true, title: "Vision Section" },
    sceneFuture: { enabled: true, title: "Scene 07 — Future" },
    contact: { enabled: true, title: "Contact & Onboarding" },
    footer: { enabled: true, title: "Site Footer" },
  },
  announcement: {
    enabled: false,
    text: "🚀 Nuralix Enterprise Platform v2.0 is now live for all partners.",
    linkText: "Read announcement",
    linkUrl: "#s01",
  },
  hero: {
    eyebrow: "Artificial Intelligence · Nuralix.in",
    word: "NURALIX",
    subtitle: "Intelligence. Engineered for Tomorrow.",
    primaryCtaText: "Explore Nuralix",
    primaryCtaHref: "#s01",
    secondaryCtaText: "Discover Our Intelligence",
    secondaryCtaHref: "#s03",
  },
  scenes: {
    s01: {
      eyebrow: "Scene 01 — Awakening",
      headline: "Every breakthrough begins with a signal.",
    },
    s02: {
      eyebrow: "Scene 02 — Connection",
      headline: "We connect data, intelligence and possibility.",
    },
    s03: {
      eyebrow: "Scene 03 — Intelligence",
      headline: "Turning complexity into intelligence.",
    },
    s04: {
      headline: "This is Nuralix.",
      lead: "Building intelligent systems for a rapidly evolving world.",
    },
    s05: {
      eyebrow: "Scene 05 — Expansion",
      headline: "One intelligence. Infinite possibilities.",
    },
    s06: {
      eyebrow: "Scene 06 — Human + AI",
      headline: "AI doesn't replace possibility. It expands it.",
      lead: "Technology should amplify human potential — not stand in for it.",
    },
    s07: {
      eyebrow: "Scene 07 — Future",
      headline: "The future isn't coming. We're engineering it.",
      ctaText: "Build the Future with Nuralix",
      ctaHref: "/dashboard",
    },
  },
  about: {
    eyebrow: "About Nuralix",
    headline: "We build intelligence that moves the world forward.",
    p1: "Nuralix uses artificial intelligence to automate tasks, analyse data, and help businesses make smarter, faster decisions for growth.",
    p2: "We work at the point where information becomes understanding — designing systems that read complexity, find the signal inside it, and turn that signal into a decision a business can act on today.",
  },
  solutions: {
    eyebrow: "Solutions",
    headline: "Capabilities, engineered.",
    subtitle: "Each capability is a system, not a feature — built around the problem it is meant to solve.",
    cards: [
      { id: "c1", num: "01", fx: "ai", title: "AI & Machine Intelligence", desc: "Systems that transform complex information into actionable intelligence." },
      { id: "c2", num: "02", fx: "auto", title: "Intelligent Automation", desc: "Smarter workflows designed to reduce friction and increase scale." },
      { id: "c3", num: "03", fx: "data", title: "Data & Analytics", desc: "Turning data into clarity, prediction and strategic advantage." },
      { id: "c4", num: "04", fx: "digital", title: "Digital Intelligence", desc: "Building intelligent digital experiences for modern organisations." },
      { id: "c5", num: "05", fx: "custom", title: "Custom AI Systems", desc: "Purpose-built intelligence designed around specific business challenges." },
    ],
  },
  stats: {
    items: [
      { id: "s1", num: "01", label: "Intelligence" },
      { id: "s2", num: "∞", label: "Possibilities" },
      { id: "s3", num: "24/7", label: "Designed to think" },
      { id: "s4", num: "01", label: "Vision" },
    ],
  },
  contact: {
    eyebrow: "Start with Nuralix",
    headline: "Ready to build what's next?",
    note: "Enter your email to begin your executive onboarding.",
    ctaText: "Start with Nuralix",
    ctaHref: "/dashboard",
    email: "hello@nuralix.in",
    site: "nuralix.in",
    linkedin: "https://linkedin.com/company/nuralix",
    twitter: "https://twitter.com/nuralix",
  },
  footer: {
    copyright: "© 2026 Nuralix",
    tagline: "Nuralix — Intelligence in Motion",
  },
};

export const DEFAULT_DASHBOARD_FEATURES = {
  enableAiCopilot: true,
  enableDailyCheckin: true,
  enableCommandPalette: true,
  enableWhatsApp: true,
  enableToolsCatalog: true,
};

export const DEFAULT_TOOLS_CATALOG = [
  // Finance Tools
  {
    id: "profit",
    name: "Profit Calculator",
    category: "finance",
    description: "Calculate gross, operating, and net margins with loaded Indian payroll & overheads.",
    requiredPlan: "Starter",
    badge: "Unit Economics",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "cashflow",
    name: "Cash Flow Forecast",
    category: "finance",
    description: "Multi-month forward cash projections incorporating collections, net burn, and tax outlays.",
    requiredPlan: "Professional",
    badge: "Runway Guard",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "breakeven",
    name: "Break-Even Calculator",
    category: "finance",
    description: "Determine exact monthly transaction volume and revenue required to reach zero net burn.",
    requiredPlan: "Starter",
    badge: "Solvency",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "pricing",
    name: "Pricing Simulator",
    category: "finance",
    description: "Model tiered packaging, discounting thresholds, and margin impacts on Indian buyers.",
    requiredPlan: "Professional",
    badge: "Revenue Ops",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "roi",
    name: "ROI Calculator",
    category: "finance",
    description: "Evaluate software licenses, capital expenditure, and vendor investments payback periods.",
    requiredPlan: "Starter",
    badge: "Capital Efficiency",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "budget",
    name: "Budget Planner",
    category: "finance",
    description: "Departmental allocation limits across engineering, marketing, sales, and administration.",
    requiredPlan: "Professional",
    badge: "Allocation",
    hasInteractiveCalculator: false,
    enabled: true,
  },

  // Sales Tools
  {
    id: "sales_forecast",
    name: "Sales Forecast",
    category: "sales",
    description: "Weighted pipeline forecasting by deal stage, historical velocity, and deal probabilities.",
    requiredPlan: "Starter",
    badge: "Pipeline",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "lead_scoring",
    name: "Lead Scoring Matrix",
    category: "sales",
    description: "Algorithmic ICP fit and engagement scoring to prioritize high-value inbound prospects.",
    requiredPlan: "Professional",
    badge: "Conversion",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "pipeline",
    name: "Pipeline Analyzer",
    category: "sales",
    description: "Detect deal slippage, stage bottlenecks, and sales cycle deceleration across reps.",
    requiredPlan: "Starter",
    badge: "Velocity",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "deal_simulator",
    name: "Deal Simulator",
    category: "sales",
    description: "Simulate multi-year enterprise contracts, SLA guarantees, and payment milestones.",
    requiredPlan: "Professional",
    badge: "Enterprise",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "ltv",
    name: "Customer Lifetime Value (LTV)",
    category: "sales",
    description: "Cohort retention modeling, expansion revenue, and gross margin-adjusted customer value.",
    requiredPlan: "Starter",
    badge: "Retention",
    hasInteractiveCalculator: true,
    enabled: true,
  },

  // Marketing Tools
  {
    id: "campaign",
    name: "Campaign Analyzer",
    category: "marketing",
    description: "Performance diagnostics across Google, LinkedIn, Meta, and organic content pipelines.",
    requiredPlan: "Starter",
    badge: "Attribution",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "cac",
    name: "CAC Calculator",
    category: "marketing",
    description: "Calculate fully loaded Customer Acquisition Cost including team salaries and tools.",
    requiredPlan: "Starter",
    badge: "Acquisition",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "roas",
    name: "ROAS Calculator",
    category: "marketing",
    description: "Direct return on ad spend versus organic pipeline contribution and payback cycles.",
    requiredPlan: "Starter",
    badge: "Ad Efficiency",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "marketing_forecast",
    name: "Marketing Forecast",
    category: "marketing",
    description: "Predict MQL and SQL generation curves based on current budget allocation scenarios.",
    requiredPlan: "Professional",
    badge: "Demand Gen",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "competitor",
    name: "Competitor Analyzer",
    category: "marketing",
    description: "Evaluate competitor positioning, feature parity, pricing gaps, and keyword capture.",
    requiredPlan: "Professional",
    badge: "Market Intel",
    hasInteractiveCalculator: false,
    enabled: true,
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
    enabled: true,
  },
  {
    id: "inventory",
    name: "Inventory Simulator",
    category: "operations",
    description: "Holding cost, re-order trigger levels, and working capital cash lockup simulations.",
    requiredPlan: "Professional",
    badge: "Supply Chain",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "workforce",
    name: "Workforce Planner",
    category: "operations",
    description: "FTE capacity modeling against annual growth targets and onboarding ramp lags.",
    requiredPlan: "Professional",
    badge: "Staffing",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "process",
    name: "Process Analyzer",
    category: "operations",
    description: "Map end-to-end client delivery workflows to pinpoint handoff friction and delays.",
    requiredPlan: "Enterprise",
    badge: "SLA Guard",
    hasInteractiveCalculator: false,
    enabled: true,
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
    enabled: true,
  },
  {
    id: "market_entry",
    name: "Market Entry Simulator",
    category: "strategy",
    description: "Simulate entry costs, localized competition, and payback for new domestic or global markets.",
    requiredPlan: "Professional",
    badge: "Expansion",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "scenario_planner",
    name: "Scenario Planner",
    category: "strategy",
    description: "Macro stress-testing: inflation, demand contraction, and competitor price wars.",
    requiredPlan: "Professional",
    badge: "Risk Defense",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "hiring",
    name: "Hiring Simulator",
    category: "strategy",
    description: "Fully loaded Indian payroll simulation including provident fund, benefits, and revenue lag.",
    requiredPlan: "Professional",
    badge: "Talent Ops",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "expansion",
    name: "Expansion Simulator",
    category: "strategy",
    description: "Capital requirements and projected ROI for opening new branch offices or enterprise teams.",
    requiredPlan: "Enterprise",
    badge: "Scale Vector",
    hasInteractiveCalculator: false,
    enabled: true,
  },
];

const memoryConfigCache = new Map<string, any>();

export function deepMerge<T>(fallback: T, override: any): T {
  if (!override || typeof override !== "object" || Array.isArray(override)) {
    return (override !== undefined ? override : fallback) as T;
  }
  if (!fallback || typeof fallback !== "object" || Array.isArray(fallback)) {
    return override as T;
  }
  const result: any = { ...fallback };
  for (const key of Object.keys(override)) {
    if (
      override[key] !== null &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key]) &&
      key in result &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], override[key]);
    } else if (override[key] !== undefined) {
      result[key] = override[key];
    }
  }
  return result as T;
}

export function getPlatformConfig<T>(key: string, fallback: T): T {
  // First check in-memory cache
  if (memoryConfigCache.has(key)) {
    const cached = memoryConfigCache.get(key);
    return typeof fallback === "object" && fallback !== null && !Array.isArray(fallback)
      ? deepMerge(fallback, cached)
      : (cached as T);
  }
  try {
    const row = db.prepare("SELECT config_value FROM platform_config WHERE config_key = ?").get(key) as { config_value: string } | undefined;
    if (row && row.config_value) {
      const parsed = JSON.parse(row.config_value);
      const merged = typeof fallback === "object" && fallback !== null && !Array.isArray(fallback)
        ? deepMerge(fallback, parsed)
        : (parsed as T);
      memoryConfigCache.set(key, merged);
      return merged;
    }
  } catch (err) {
    console.error(`Error reading config for key ${key}:`, err);
  }
  return fallback;
}

export function setPlatformConfig<T>(key: string, value: T): void {
  // Always update in-memory cache immediately so runtime never lags or errors
  memoryConfigCache.set(key, value);

  const now = new Date().toISOString();
  
  // Try writing to SQLite with retry and permission healing
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      db.prepare(`
        INSERT INTO platform_config (config_key, config_value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(config_key) DO UPDATE SET
          config_value = excluded.config_value,
          updated_at = excluded.updated_at
      `).run(key, JSON.stringify(value), now);
      return;
    } catch (err: any) {
      console.warn(`Attempt ${attempt} to write config ${key} to SQLite failed:`, err.message);
      
      // On Windows / OneDrive, clear read-only attribute if it got reapplied
      if (process.platform === "win32") {
        try {
          const { execSync } = require("child_process");
          execSync(`attrib -r "${dataDir}" /d`, { stdio: "ignore" });
          execSync(`attrib -r "${dbPath}"`, { stdio: "ignore" });
        } catch {}
      }

      if (attempt === 3) {
        console.error(`Persisting ${key} to SQLite failed after 3 attempts (${err.message}). Value safely retained in memory.`);
      }
    }
  }
}

// Initialize seed platform configs if not present or heal if partial
const existingWebsiteRow = db.prepare("SELECT config_value FROM platform_config WHERE config_key = ?").get("website_config") as { config_value: string } | undefined;
if (!existingWebsiteRow) {
  setPlatformConfig("website_config", DEFAULT_WEBSITE_CONFIG);
} else {
  try {
    const parsedWeb = JSON.parse(existingWebsiteRow.config_value);
    if (!parsedWeb.hero || !parsedWeb.scenes || !parsedWeb.sections?.about) {
      const healed = deepMerge(DEFAULT_WEBSITE_CONFIG, parsedWeb);
      setPlatformConfig("website_config", healed);
    }
  } catch {
    setPlatformConfig("website_config", DEFAULT_WEBSITE_CONFIG);
  }
}

if (!db.prepare("SELECT config_key FROM platform_config WHERE config_key = ?").get("dashboard_features")) {
  setPlatformConfig("dashboard_features", DEFAULT_DASHBOARD_FEATURES);
}

if (!db.prepare("SELECT config_key FROM platform_config WHERE config_key = ?").get("tools_catalog")) {
  setPlatformConfig("tools_catalog", DEFAULT_TOOLS_CATALOG);
}

export { db };

