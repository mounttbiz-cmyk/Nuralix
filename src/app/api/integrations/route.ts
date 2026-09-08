import { NextResponse } from "next/server";
import { db, DEFAULT_BUSINESS_ID } from "@/lib/db";

export async function GET() {
  try {
    const integrations = db
      .prepare("SELECT * FROM integrations WHERE business_id = ? ORDER BY tool_key ASC")
      .all(DEFAULT_BUSINESS_ID) as any[];

    // Fetch recent Stripe events if Stripe is connected
    const stripeEvents = db
      .prepare("SELECT * FROM stripe_events WHERE business_id = ? ORDER BY created_at DESC LIMIT 5")
      .all(DEFAULT_BUSINESS_ID) as any[];

    const formatted = integrations.map(int => ({
      id: int.tool_key,
      name: int.name,
      category: int.category,
      status: int.status, // 'not_connected' | 'pending_connection' | 'connected' | 'error'
      apiKey: int.api_key ? "sk_live_••••••••" + int.api_key.slice(-4) : null,
      updatedAt: int.updated_at,
      config: int.config ? JSON.parse(int.config) : {},
    }));

    return NextResponse.json({
      success: true,
      integrations: formatted,
      stripeEvents: stripeEvents.map(e => ({
        id: e.id,
        eventType: e.event_type,
        amount: e.amount,
        currency: e.currency,
        createdAt: e.created_at,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { toolKey, status, apiKey, config } = body;

    if (!toolKey) {
      return NextResponse.json({ error: "toolKey is required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE integrations SET
        status = COALESCE(?, status),
        api_key = COALESCE(?, api_key),
        config = COALESCE(?, config),
        updated_at = ?
      WHERE business_id = ? AND tool_key = ?
    `).run(
      status,
      apiKey,
      config ? JSON.stringify(config) : null,
      now,
      DEFAULT_BUSINESS_ID,
      toolKey
    );

    // If connecting Stripe, also update connected_tools in business record if not already present
    if (status === "connected") {
      const biz = db.prepare("SELECT connected_tools FROM businesses WHERE id = ?").get(DEFAULT_BUSINESS_ID) as any;
      if (biz) {
        const tools = biz.connected_tools ? JSON.parse(biz.connected_tools) : [];
        if (!tools.includes(toolKey)) {
          tools.push(toolKey);
          db.prepare("UPDATE businesses SET connected_tools = ?, no_integrations = 0, updated_at = ? WHERE id = ?").run(
            JSON.stringify(tools),
            now,
            DEFAULT_BUSINESS_ID
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Integration ${toolKey} updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
