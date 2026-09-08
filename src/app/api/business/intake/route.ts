import { NextResponse } from "next/server";
import { db, DEFAULT_BUSINESS_ID } from "@/lib/db";

export async function GET() {
  try {
    const business = db.prepare("SELECT * FROM businesses WHERE id = ?").get(DEFAULT_BUSINESS_ID) as any;
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const connectedTools = business.connected_tools ? JSON.parse(business.connected_tools) : [];
    const dynamicAnswers = business.dynamic_intake_answers ? JSON.parse(business.dynamic_intake_answers) : {};

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        name: business.name,
        industry: business.industry,
        industryLabel: business.industry_label,
        founderName: business.founder_name,
        website: business.website,
        teamSize: business.team_size,
        annualRevenue: business.annual_revenue,
        monthlyRevenue: business.monthly_revenue,
        monthlyBurn: business.monthly_burn,
        cashOnHand: business.cash_on_hand,
        connectedTools,
        noIntegrations: Boolean(business.no_integrations),
        whatsappOptIn: Boolean(business.whatsapp_opt_in),
        whatsappNumber: business.whatsapp_number || "",
        dynamicAnswers,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      industry,
      industryLabel,
      customIndustry,
      founderName,
      website,
      teamSize,
      annualRevenue,
      monthlyRevenue,
      monthlyBurn,
      cashOnHand,
      connectedTools = [],
      noIntegrations = false,
      whatsappOptIn = false,
      whatsappNumber = "",
      dynamicAnswers = {},
    } = body;

    const now = new Date().toISOString();

    // 1. Update or create business record
    const existing = db.prepare("SELECT id FROM businesses WHERE id = ?").get(DEFAULT_BUSINESS_ID);
    if (existing) {
      db.prepare(`
        UPDATE businesses SET
          name = COALESCE(?, name),
          industry = COALESCE(?, industry),
          industry_label = COALESCE(?, industry_label),
          custom_industry = COALESCE(?, custom_industry),
          founder_name = COALESCE(?, founder_name),
          website = COALESCE(?, website),
          team_size = COALESCE(?, team_size),
          annual_revenue = COALESCE(?, annual_revenue),
          monthly_revenue = COALESCE(?, monthly_revenue),
          monthly_burn = COALESCE(?, monthly_burn),
          cash_on_hand = COALESCE(?, cash_on_hand),
          connected_tools = ?,
          no_integrations = ?,
          whatsapp_opt_in = ?,
          whatsapp_number = ?,
          dynamic_intake_answers = ?,
          updated_at = ?
        WHERE id = ?
      `).run(
        name,
        industry,
        industryLabel,
        customIndustry,
        founderName,
        website,
        teamSize,
        annualRevenue,
        monthlyRevenue,
        monthlyBurn,
        cashOnHand,
        JSON.stringify(connectedTools),
        noIntegrations ? 1 : 0,
        whatsappOptIn ? 1 : 0,
        whatsappNumber,
        JSON.stringify(dynamicAnswers),
        now,
        DEFAULT_BUSINESS_ID
      );
    }

    // 2. Update integrations according to intake branching logic
    // For each selected tool: mark as pending_connection unless already connected
    // For unselected tools or if noIntegrations is true: mark not_connected
    const allTools = ["stripe", "slack", "zoho_books", "google_calendar", "help_desk"];
    for (const toolKey of allTools) {
      const isSelected = !noIntegrations && Array.isArray(connectedTools) && connectedTools.includes(toolKey);
      const currentInt = db
        .prepare("SELECT status FROM integrations WHERE business_id = ? AND tool_key = ?")
        .get(DEFAULT_BUSINESS_ID, toolKey) as any;

      let nextStatus = "not_connected";
      if (isSelected) {
        // Keep connected if already connected, otherwise pending_connection
        nextStatus = currentInt && currentInt.status === "connected" ? "connected" : "pending_connection";
      }

      db.prepare(`
        INSERT INTO integrations (id, business_id, tool_key, name, category, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(business_id, tool_key) DO UPDATE SET
          status = excluded.status,
          updated_at = excluded.updated_at
      `).run(
        `int_${toolKey}`,
        DEFAULT_BUSINESS_ID,
        toolKey,
        toolKey === "stripe" ? "Stripe" : toolKey === "slack" ? "Slack" : toolKey === "zoho_books" ? "Zoho Books" : toolKey === "google_calendar" ? "Google Calendar" : "Help Desk",
        toolKey === "stripe" ? "payments" : toolKey === "slack" ? "communication" : toolKey === "zoho_books" ? "accounting" : toolKey === "google_calendar" ? "scheduling" : "support",
        nextStatus,
        now
      );
    }

    return NextResponse.json({
      success: true,
      message: "Business intake recorded successfully",
      connectedTools,
      noIntegrations,
      whatsappOptIn,
      whatsappNumber,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
