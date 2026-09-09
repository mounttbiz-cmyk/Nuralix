// @ts-ignore
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

// Initialize data folder
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "nuralix.db");
const db = new DatabaseSync(dbPath);

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
  {
    id: "profit",
    name: "Profit Calculator",
    category: "finance",
    description: "Calculate gross, operating, and net margins with loaded Indian payroll & overheads.",
    requiredPlan: "Starter",
    badge: "Core",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "breakeven",
    name: "Breakeven Calculator",
    category: "finance",
    description: "Determine exact monthly units/revenue needed to cover fixed overheads and prevent cash drain.",
    requiredPlan: "Starter",
    badge: "Essential",
    hasInteractiveCalculator: true,
    enabled: true,
  },
  {
    id: "runway",
    name: "Cash Runway Stress Test",
    category: "finance",
    description: "Simulate conservative vs aggressive burn rates to predict zero cash date down to the day.",
    requiredPlan: "Professional",
    badge: "Risk",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "cac_ltv",
    name: "CAC:LTV & Payback Period",
    category: "marketing",
    description: "Benchmark blended CAC against customer lifetime gross profit and capital recovery months.",
    requiredPlan: "Starter",
    badge: "Growth",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "sales_capacity",
    name: "Sales Rep Quota Planner",
    category: "sales",
    description: "Model headcount, quota ramp, pipeline coverage ratios, and attainment tiers.",
    requiredPlan: "Professional",
    badge: "Operations",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "working_capital",
    name: "Working Capital Cycle Analyzer",
    category: "operations",
    description: "Identify working capital trapped in receivables (DSO), inventory (DIO), and vendor payables (DPO).",
    requiredPlan: "Professional",
    badge: "Cashflow",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "unit_economics",
    name: "Contribution Margin Decomposition",
    category: "strategy",
    description: "Drill down into product-level contribution margins after shipping, payment gateway fees, and packaging.",
    requiredPlan: "Enterprise",
    badge: "Advanced",
    hasInteractiveCalculator: false,
    enabled: true,
  },
  {
    id: "founder_delegation",
    name: "Founder Bottleneck Audit",
    category: "strategy",
    description: "Score operational dependency on founder sign-offs and identify critical failure points.",
    requiredPlan: "Starter",
    badge: "Scale",
    hasInteractiveCalculator: false,
    enabled: true,
  },
];

export function getPlatformConfig<T>(key: string, fallback: T): T {
  try {
    const row = db.prepare("SELECT config_value FROM platform_config WHERE config_key = ?").get(key) as { config_value: string } | undefined;
    if (row && row.config_value) {
      return JSON.parse(row.config_value) as T;
    }
  } catch (err) {
    console.error(`Error reading config for key ${key}:`, err);
  }
  return fallback;
}

export function setPlatformConfig<T>(key: string, value: T): void {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO platform_config (config_key, config_value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(config_key) DO UPDATE SET
      config_value = excluded.config_value,
      updated_at = excluded.updated_at
  `).run(key, JSON.stringify(value), now);
}

// Initialize seed platform configs if not present
if (!db.prepare("SELECT config_key FROM platform_config WHERE config_key = ?").get("website_config")) {
  setPlatformConfig("website_config", DEFAULT_WEBSITE_CONFIG);
}

if (!db.prepare("SELECT config_key FROM platform_config WHERE config_key = ?").get("dashboard_features")) {
  setPlatformConfig("dashboard_features", DEFAULT_DASHBOARD_FEATURES);
}

if (!db.prepare("SELECT config_key FROM platform_config WHERE config_key = ?").get("tools_catalog")) {
  setPlatformConfig("tools_catalog", DEFAULT_TOOLS_CATALOG);
}

export { db };

