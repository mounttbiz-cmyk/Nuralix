import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const businesses = db.prepare("SELECT * FROM businesses ORDER BY updated_at DESC").all() as any[];
    const users = db.prepare("SELECT id, email, name, provider, business_profile, created_at FROM registered_users ORDER BY created_at DESC").all() as any[];

    // Calculate aggregated platform metrics for the Superadmin dashboard
    let totalAnnualRev = 0;
    let totalMonthlyRev = 0;
    let totalBurn = 0;
    let totalCash = 0;

    const formattedBusinesses = businesses.map((b) => {
      const annRev = Number(b.annual_revenue || 0);
      const monRev = Number(b.monthly_revenue || 0);
      const burn = Number(b.monthly_burn || 0);
      const cash = Number(b.cash_on_hand || 0);

      totalAnnualRev += annRev;
      totalMonthlyRev += monRev;
      totalBurn += burn;
      totalCash += cash;

      const runwayMo = burn > 0 ? (cash / burn).toFixed(1) : cash > 0 ? "18+" : "0.0";

      let connectedToolsList: string[] = [];
      try {
        connectedToolsList = JSON.parse(b.connected_tools || "[]");
      } catch {}

      return {
        id: b.id,
        name: b.name || "Untitled Enterprise",
        founderName: b.founder_name || "Founder",
        industry: b.industry || "saas",
        industryLabel: b.industry_label || "Enterprise",
        website: b.website || "",
        teamSize: Number(b.team_size || 1),
        annualRevenue: annRev,
        monthlyRevenue: monRev,
        monthlyBurn: burn,
        cashOnHand: cash,
        runwayMonths: runwayMo,
        connectedTools: connectedToolsList,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        businesses: formattedBusinesses,
        users: users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          provider: u.provider || "email",
          createdAt: u.created_at,
        })),
        stats: {
          totalBusinesses: businesses.length,
          totalUsers: users.length,
          totalAnnualRevenue: totalAnnualRev,
          totalMonthlyRevenue: totalMonthlyRev,
          totalCashReserves: totalCash,
          totalMonthlyBurn: totalBurn,
        },
      },
    });
  } catch (error: any) {
    console.error("Superadmin tenants GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      founderName,
      industry,
      industryLabel,
      annualRevenue,
      monthlyRevenue,
      monthlyBurn,
      cashOnHand,
      teamSize,
      website,
      setActive,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Business ID is required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE businesses SET
        name = COALESCE(?, name),
        founder_name = COALESCE(?, founder_name),
        industry = COALESCE(?, industry),
        industry_label = COALESCE(?, industry_label),
        annual_revenue = COALESCE(?, annual_revenue),
        monthly_revenue = COALESCE(?, monthly_revenue),
        monthly_burn = COALESCE(?, monthly_burn),
        cash_on_hand = COALESCE(?, cash_on_hand),
        team_size = COALESCE(?, team_size),
        website = COALESCE(?, website),
        updated_at = ?
      WHERE id = ?
    `).run(
      name || null,
      founderName || null,
      industry || null,
      industryLabel || null,
      annualRevenue !== undefined ? Number(annualRevenue) : null,
      monthlyRevenue !== undefined ? Number(monthlyRevenue) : null,
      monthlyBurn !== undefined ? Number(monthlyBurn) : null,
      cashOnHand !== undefined ? Number(cashOnHand) : null,
      teamSize !== undefined ? Number(teamSize) : null,
      website !== undefined ? website : null,
      now,
      id
    );

    // If setActive requested, touch the updated_at timestamp so it sorts first in getActiveBusiness()
    if (setActive) {
      db.prepare("UPDATE businesses SET updated_at = ? WHERE id = ?").run(now, id);
    }

    return NextResponse.json({
      success: true,
      message: `Business "${name || id}" updated successfully in SQLite.`,
    });
  } catch (error: any) {
    console.error("Superadmin tenants PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      founderName = "Founder",
      industry = "saas",
      industryLabel = "B2B SaaS & Tech",
      annualRevenue = 0,
      monthlyRevenue = 0,
      monthlyBurn = 0,
      cashOnHand = 0,
      teamSize = 5,
      website = "",
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Business name is required" }, { status: 400 });
    }

    const id = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO businesses (
        id, name, founder_name, industry, industry_label, website, team_size,
        annual_revenue, monthly_revenue, monthly_burn, cash_on_hand,
        connected_tools, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      founderName.trim(),
      industry,
      industryLabel,
      website.trim(),
      Number(teamSize),
      Number(annualRevenue),
      Number(monthlyRevenue),
      Number(monthlyBurn),
      Number(cashOnHand),
      JSON.stringify([]),
      now,
      now
    );

    return NextResponse.json({
      success: true,
      id,
      message: `New enterprise "${name.trim()}" created successfully.`,
    });
  } catch (error: any) {
    console.error("Superadmin tenants POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const userEmail = searchParams.get("userEmail");

    if (businessId) {
      // Delete business and associated records
      db.prepare("DELETE FROM businesses WHERE id = ?").run(businessId);
      db.prepare("DELETE FROM integrations WHERE business_id = ?").run(businessId);
      db.prepare("DELETE FROM tasks WHERE business_id = ?").run(businessId);
      db.prepare("DELETE FROM daily_checkins WHERE business_id = ?").run(businessId);

      return NextResponse.json({
        success: true,
        message: `Business ${businessId} and its associated records purged.`,
      });
    }

    if (userEmail) {
      db.prepare("DELETE FROM registered_users WHERE LOWER(email) = ?").run(userEmail.toLowerCase());
      return NextResponse.json({
        success: true,
        message: `User ${userEmail} removed from registered users ledger.`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Specify businessId or userEmail to delete" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Superadmin tenants DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
