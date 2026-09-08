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

export { db };
