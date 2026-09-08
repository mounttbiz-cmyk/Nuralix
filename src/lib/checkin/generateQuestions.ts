import { db, DEFAULT_BUSINESS_ID } from "@/lib/db";
import { defaultGapRules } from "@/config/seeds/defaultRules";

export interface CheckInQuestion {
  id: string;
  category: string;
  badge: string;
  badgeColor: "amber" | "rust" | "cyan" | "purple" | "brass" | "jade";
  iconType: "alert" | "flame" | "task" | "dollar" | "users" | "shield" | "sparkles";
  title: string;
  subtext?: string;
  quickOptions: string[];
  placeholder: string;
  isSkipped?: boolean;
  skipReason?: string;
}

export function generateDynamicCheckInQuestions(businessId: string = DEFAULT_BUSINESS_ID): {
  questions: CheckInQuestion[];
  contextSummary: {
    hasYesterdayFollowup: boolean;
    activeTaskTitle?: string;
    industry: string;
    detectedGap?: string;
    skipRevenue: boolean;
    skipTech: boolean;
  };
} {
  // 1. Fetch Business Profile
  const business = db.prepare("SELECT * FROM businesses WHERE id = ?").get(businessId) as any;
  const industry = business?.industry || "saas";
  const connectedTools: string[] = business?.connected_tools ? JSON.parse(business.connected_tools) : [];
  
  const integrations = db
    .prepare("SELECT tool_key, status FROM integrations WHERE business_id = ? AND status = 'connected'")
    .all(businessId) as any[];
  const activeTools = new Set([...connectedTools, ...integrations.map(i => i.tool_key)]);
  const skipRevenue = activeTools.has("stripe") || activeTools.has("zoho_books");
  const skipTech = activeTools.has("help_desk");

  // 2. Fetch Recent Check-Ins (to follow up on yesterday's problems / blockers)
  const recentCheckinRow = db
    .prepare("SELECT * FROM daily_checkins WHERE business_id = ? ORDER BY date DESC LIMIT 1")
    .get(businessId) as any;

  let lastBlocker: string | null = null;
  let lastUrgent: string | null = null;

  if (recentCheckinRow?.answers) {
    try {
      const parsedAnswers = JSON.parse(recentCheckinRow.answers);
      // Check for blockers from past answers (supports both old keys and dynamic keys)
      const foundBlocker = parsedAnswers.blockers || parsedAnswers.recent_blocker_followup || parsedAnswers.problem;
      if (foundBlocker && !foundBlocker.toLowerCase().includes("none") && !foundBlocker.toLowerCase().includes("smooth")) {
        lastBlocker = foundBlocker;
      }
      const foundUrgent = parsedAnswers.urgent || parsedAnswers.urgent_escalation;
      if (foundUrgent && !foundUrgent.toLowerCase().includes("nominal") && !foundUrgent.toLowerCase().includes("all clear")) {
        lastUrgent = foundUrgent;
      }
    } catch (e) {
      // ignore parse error
    }
  }

  // 3. Fetch Active / In-Progress Tasks from Execution Queue
  const activeTask = db
    .prepare(`
      SELECT * FROM tasks 
      WHERE business_id = ? AND status IN ('in_progress', 'todo') 
      ORDER BY 
        CASE priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          ELSE 3 
        END, 
        created_at DESC 
      LIMIT 1
    `)
    .get(businessId) as any;

  // 4. Determine Active Gap / Bottleneck
  const detectedGapRule = defaultGapRules[0]; // e.g. rule_cash_runway or founder dependency

  const questions: CheckInQuestion[] = [];

  // ==========================================
  // QUESTION 1: RECENT PROBLEM / BLOCKER FOLLOW-UP
  // ==========================================
  if (lastBlocker) {
    questions.push({
      id: "recent_blocker_followup",
      category: "Recent Problem Follow-up",
      badge: "Yesterday's Blocker Follow-up",
      badgeColor: "rust",
      iconType: "alert",
      title: `Did you get resolution on "${lastBlocker}", or is delivery still impacted?`,
      subtext: "Direct follow-up on the operational blocker you flagged in your previous check-in.",
      quickOptions: [
        "Resolved today",
        "Still blocked / Escalated",
        "Workaround deployed",
        "Waiting on external party",
      ],
      placeholder: "Note resolution status or if executive intervention is required...",
    });
  } else if (lastUrgent) {
    questions.push({
      id: "recent_urgent_followup",
      category: "Urgent Item Follow-up",
      badge: "Urgent Escalation Follow-up",
      badgeColor: "rust",
      iconType: "flame",
      title: `Status on "${lastUrgent}" — has the escalation cooled down?`,
      subtext: "Checking status on the urgent escalation reported in your last pulse.",
      quickOptions: [
        "Fully contained & resolved",
        "Active remediation in progress",
        "Client/partner call scheduled",
        "Still critical risk",
      ],
      placeholder: "Detail containment steps taken today...",
    });
  } else {
    // Default to top strategic operational bottleneck (e.g. Founder Dependency or Bottleneck Gaps)
    questions.push({
      id: "founder_bottleneck_pulse",
      category: "Operational Bottleneck",
      badge: "Active Bottleneck: Founder Dependency",
      badgeColor: "amber",
      iconType: "alert",
      title: "Founder Firefighting: Did operational issues pull the founder into the weeds today?",
      subtext: "Tracking how much executive bandwidth is absorbed by operational fires vs strategic execution.",
      quickOptions: [
        "Zero firefighting (Team handled it)",
        "Spent 30-60m on client delivery",
        "Heavy firefighting (>2 hours)",
        "Documented new SOP to delegate",
      ],
      placeholder: "Specify what pulled leadership into the weeds today...",
    });
  }

  // ==========================================
  // QUESTION 2: IN-PROGRESS EXECUTION TASK
  // ==========================================
  if (activeTask) {
    const taskGapLabel = activeTask.gap && activeTask.gap !== "error" ? activeTask.gap : "Priority Queue";
    questions.push({
      id: `task_progress_${activeTask.id}`,
      category: "Execution Queue Milestone",
      badge: `Task: ${taskGapLabel}`,
      badgeColor: "purple",
      iconType: "task",
      title: `What is the latest milestone progress on "${activeTask.title}"?`,
      subtext: `Assigned Owner: ${activeTask.owner || "Operations"} · Priority: ${(activeTask.priority || "high").toUpperCase()}`,
      quickOptions: [
        "Milestone completed today",
        "On track / In progress",
        "Waiting on external dependency",
        "Blocked / Needs leadership help",
      ],
      placeholder: "Note specific milestone deliverables completed today...",
    });
  }

  // ==========================================
  // QUESTION 3: FINANCIAL & CASH INFLOW / REVENUE
  // ==========================================
  if (skipRevenue) {
    questions.push({
      id: "cash_collection_pulse",
      category: "Cash & Profitability",
      badge: "Financial Health",
      badgeColor: "jade",
      iconType: "dollar",
      title: "Cash Outflows & Overdue Receivables: Any delayed payments or surprise costs today?",
      subtext: "Revenue telemetry is auto-synced via Stripe. Tracking cash collections and discretionary expense control.",
      quickOptions: [
        "All collections & spend nominal",
        "Overdue client payment received",
        "Client payment delayed / Overdue",
        "Unexpected vendor cost approved",
      ],
      placeholder: "Note any unusual cash outflows or collected receivables...",
      isSkipped: false,
    });
  } else {
    questions.push({
      id: "manual_revenue_pulse",
      category: "Revenue & Sales Inflow",
      badge: "Daily Inflow & Deals",
      badgeColor: "jade",
      iconType: "dollar",
      title: "How did revenue, collections, and new deals track today?",
      subtext: "Connect Stripe or Accounting in Settings to automatically sync live transaction telemetry.",
      quickOptions: [
        "Strong sales day (above target)",
        "Steady / on track",
        "Slow / below average",
        "Major deal / contract closed",
      ],
      placeholder: "Enter today's revenue figure (e.g. ₹45,000) or contract notes...",
    });
  }

  // ==========================================
  // QUESTION 4: INDUSTRY-SPECIFIC RECENT PROBLEMS
  // ==========================================
  const industryQuestions: Record<string, CheckInQuestion> = {
    saas: {
      id: "industry_saas_pulse",
      category: "SaaS Telemetry",
      badge: "SaaS Risk: Churn & Pipeline",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Customer Churn & Uptime: Any trial drop-offs, contraction requests, or SLA bugs today?",
      subtext: "Tracking early warning signals before monthly subscription retention reports.",
      quickOptions: [
        "Zero churn signals / 100% uptime",
        "Enterprise trial demo advanced",
        "Customer flagged downgrade risk",
        "Service latency / incident reported",
      ],
      placeholder: "Note specific accounts with churn risk or production incidents...",
    },
    agency: {
      id: "industry_agency_pulse",
      category: "Agency Operations",
      badge: "Agency: Scope Creep & Retainers",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Scope Creep & Billable Load: Any unbilled change requests or stalled milestones today?",
      subtext: "Protecting project gross margin and identifying client change order opportunities.",
      quickOptions: [
        "All project milestones on schedule",
        "Change order / upsell approved",
        "Client requested out-of-scope work",
        "Client delayed milestone sign-off",
      ],
      placeholder: "Note client name and scope creep or approval delay details...",
    },
    d2c: {
      id: "industry_d2c_pulse",
      category: "E-Commerce Logistics",
      badge: "D2C: Ad ROAS & Dispatches",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Fulfillment & Paid Ads: Any courier delivery delays, return spikes, or ROAS drops today?",
      subtext: "Monitoring daily shipping SLAs and customer acquisition unit economics.",
      quickOptions: [
        "Dispatches 100% on schedule",
        "High ROAS / Acquisition scaling",
        "Logistics courier transit delay",
        "Supplier replenishment stockout",
      ],
      placeholder: "Note transit SLA bottlenecks or ad spend fluctuations...",
    },
    it: {
      id: "industry_it_pulse",
      category: "IT & Tech Services",
      badge: "IT Services: Delivery & QA",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Sprints & Client UAT: Any blocked staging deployments or stalled client signoffs today?",
      subtext: "Ensuring developer velocity and preventing sprint scope bloat.",
      quickOptions: [
        "Sprint release deployed smoothly",
        "Client UAT signoff received",
        "Release blocked by critical bug",
        "Third-party API dependency blocked",
      ],
      placeholder: "Note specific code release or client acceptance bottlenecks...",
    },
    healthcare: {
      id: "industry_health_pulse",
      category: "Clinic Capacity",
      badge: "Healthcare: Utilization & No-Shows",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Patient Operations: Any procedure room downtime, practitioner gaps, or no-shows today?",
      subtext: "Balancing clinical room utilization and patient appointment throughput.",
      quickOptions: [
        "Full room utilization today",
        "Patient intake on schedule",
        "Multiple appointment cancellations",
        "Equipment maintenance hold",
      ],
      placeholder: "Specify appointment cancellations or equipment downtime...",
    },
    manufacturing: {
      id: "industry_mfg_pulse",
      category: "Plant Operations",
      badge: "Manufacturing: OEE & Quality",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Floor & Supply Chain: Any assembly line stoppages, raw material holds, or scrap today?",
      subtext: "Tracking plant equipment effectiveness and batch reject rates.",
      quickOptions: [
        "OEE capacity above 80%",
        "Raw material shipments received",
        "Unplanned machine downtime",
        "Batch rework / scrap flagged",
      ],
      placeholder: "Note line stoppage duration or rejected batch numbers...",
    },
    real_estate: {
      id: "industry_re_pulse",
      category: "Deal Pipeline",
      badge: "Real Estate: Transactions & Closings",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Deal Pipeline & Closings: Any buyer financing delays, title issues, or deal dropouts today?",
      subtext: "Monitoring transaction velocity and token deposit escrow stages.",
      quickOptions: [
        "Deal closed / Deposit received",
        "High-intent buyer site visits",
        "Buyer loan qualification delayed",
        "Seller renegotiating terms",
      ],
      placeholder: "Note deal name and escrow or mortgage hold details...",
    },
    finance: {
      id: "industry_fin_pulse",
      category: "Capital & Advisory",
      badge: "Finance: AUM & Client Outflows",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Capital & Advisory: Any large liquidity withdrawals, allocation holds, or audit alerts today?",
      subtext: "Protecting portfolio client retention and compliance standing.",
      quickOptions: [
        "Net positive AUM inflow",
        "Advisory reviews on track",
        "Client withdrawal request flagged",
        "Compliance audit item pending",
      ],
      placeholder: "Specify high-net-worth client updates or liquidity movements...",
    },
    other: {
      id: "industry_other_pulse",
      category: "Operations & Delivery",
      badge: "Operational Bottlenecks",
      badgeColor: "cyan",
      iconType: "flame",
      title: "Delivery & Clients: Any supplier delays, customer disputes, or resource crunches today?",
      subtext: "Daily operational health check across core commercial workflows.",
      quickOptions: [
        "Operations running smoothly",
        "Customer escalation resolved",
        "Supplier / partner delay",
        "Key resource constraint",
      ],
      placeholder: "Note specific partner, customer, or operational holds...",
    },
  };

  const industryQ = industryQuestions[industry] || industryQuestions.other;
  questions.push(industryQ);

  // ==========================================
  // QUESTION 5: TEAM CAPACITY & HR PULSE
  // ==========================================
  questions.push({
    id: "team_capacity_pulse",
    category: "Team & Capacity",
    badge: "Team Bandwidth & HR",
    badgeColor: "purple",
    iconType: "users",
    title: "Team Bandwidth & Morale: Any team members stretched past capacity or key personnel absences today?",
    subtext: "Identifying burnout risks and headcount recruiting bottlenecks early.",
    quickOptions: [
      "Team fully productive & on track",
      "Candidate interview conducted",
      "Key team member stretched / overloaded",
      "Unplanned team absence / leave",
    ],
    placeholder: "Note key employee updates, recruiting stages, or team overload...",
  });

  return {
    questions,
    contextSummary: {
      hasYesterdayFollowup: Boolean(lastBlocker || lastUrgent),
      activeTaskTitle: activeTask?.title,
      industry,
      detectedGap: detectedGapRule?.title,
      skipRevenue,
      skipTech,
    },
  };
}
