const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const dbPath = path.join(__dirname, "..", "data", "bizzpal.db");
console.log("Opening SQLite db at:", dbPath);
const db = new DatabaseSync(dbPath);

// 1. Delete test registered users with fake data
db.prepare("DELETE FROM registered_users WHERE email LIKE '%test%' OR business_profile LIKE '%Acme%'").run();
console.log("Deleted test registered users.");

// 2. Delete test businesses
db.prepare("DELETE FROM businesses WHERE id != 'biz_enterprise_01'").run();
console.log("Deleted auxiliary test businesses.");

// 3. Reset default business to clean 0 baseline
const now = new Date().toISOString();
db.prepare(`
  UPDATE businesses
  SET 
    name = 'My Enterprise',
    founder_name = 'Founder',
    industry = 'saas',
    industry_label = 'Technology & Services',
    website = '',
    team_size = 1,
    annual_revenue = 0,
    monthly_revenue = 0,
    monthly_burn = 0,
    cash_on_hand = 0,
    connected_tools = '[]',
    no_integrations = 0,
    whatsapp_opt_in = 0,
    whatsapp_number = '',
    dynamic_intake_answers = '{}',
    updated_at = ?
  WHERE id = 'biz_enterprise_01'
`).run(now);
console.log("Reset biz_enterprise_01 to clean 0 baseline.");

// 4. Clean tasks
db.prepare("DELETE FROM tasks WHERE business_id = 'biz_enterprise_01' OR business_id LIKE '%test%'").run();
console.log("Purged test tasks.");

// 5. Verify
const biz = db.prepare("SELECT * FROM businesses").all();
console.log("Current businesses in db:", biz);

const users = db.prepare("SELECT id, email, name FROM registered_users").all();
console.log("Current registered users in db:", users);
