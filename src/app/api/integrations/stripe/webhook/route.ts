import { NextResponse } from "next/server";
import { db, DEFAULT_BUSINESS_ID } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let event: any;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventId = event.id || `evt_${Date.now()}`;
    const eventType = event.type || "payment_intent.succeeded";
    const amount = event.data?.object?.amount ? Number(event.data.object.amount) / 100 : 25000;
    const currency = event.data?.object?.currency || "inr";
    const now = new Date().toISOString();

    // 1. Store the incoming Stripe event
    db.prepare(`
      INSERT INTO stripe_events (id, business_id, event_type, amount, currency, payload, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId,
      DEFAULT_BUSINESS_ID,
      eventType,
      amount,
      currency,
      JSON.stringify(event),
      now
    );

    // 2. Ensure Stripe integration is marked 'connected'
    db.prepare(`
      UPDATE integrations SET status = 'connected', updated_at = ?
      WHERE business_id = ? AND tool_key = 'stripe'
    `).run(now, DEFAULT_BUSINESS_ID);

    // 3. Increment monthly revenue if payment event
    if (eventType === "payment_intent.succeeded" || eventType === "invoice.payment_succeeded") {
      db.prepare(`
        UPDATE businesses SET
          monthly_revenue = monthly_revenue + ?,
          updated_at = ?
        WHERE id = ?
      `).run(amount, now, DEFAULT_BUSINESS_ID);
    }

    return NextResponse.json({
      received: true,
      eventId,
      eventType,
      amount,
      currency,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
