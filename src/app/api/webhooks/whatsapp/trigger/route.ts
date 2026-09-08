import { NextResponse } from "next/server";
import { db, DEFAULT_BUSINESS_ID } from "@/lib/db";

// Outbound scheduled job trigger for WhatsApp check-in
export async function POST() {
  try {
    const business = db.prepare("SELECT * FROM businesses WHERE id = ?").get(DEFAULT_BUSINESS_ID) as any;
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (!business.whatsapp_opt_in || !business.whatsapp_number) {
      return NextResponse.json({
        skipped: true,
        reason: "WhatsApp check-in is not opted-in or phone number is missing",
      });
    }

    // Determine dynamic questions
    const connectedTools = business.connected_tools ? JSON.parse(business.connected_tools) : [];
    const hasStripe = connectedTools.includes("stripe") || connectedTools.includes("zoho_books");
    const hasHelpDesk = connectedTools.includes("help_desk");

    const questions: string[] = [];
    if (!hasStripe) {
      questions.push("1. How was revenue/sales today?");
    }
    questions.push(`${questions.length + 1}. Any problems or blockers today?`);
    questions.push(`${questions.length + 1}. Anything urgent or unusual?`);
    questions.push(`${questions.length + 1}. Any team or HR issues?`);
    if (!hasHelpDesk) {
      questions.push(`${questions.length + 1}. Anything tech/IT related?`);
    }

    const message = `👋 Hi ${business.founder_name || "Founder"}, this is your Nuralix Daily Check-In for ${business.name}!\n\n${questions.join("\n")}\n\nReply directly with your updates in 1-2 lines (or voice note).`;

    // In production, dispatch via Twilio / Meta API here.
    // For local environment, we return the outbound payload ready for inspection.
    return NextResponse.json({
      success: true,
      status: "outbound_prompt_dispatched",
      recipient: business.whatsapp_number,
      message,
      questionsCount: questions.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
