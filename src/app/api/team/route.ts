import { NextResponse } from "next/server";
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamAuditLogs,
  getActiveBusiness
} from "@/lib/db";

export async function GET() {
  try {
    const activeBiz = getActiveBusiness();
    const members = getTeamMembers();
    const auditLogs = getTeamAuditLogs();

    return NextResponse.json({
      success: true,
      business: activeBiz,
      members,
      auditLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, department, twoFactor } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const newMember = addTeamMember({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || "Operator",
      department: department || "Operations",
      twoFactor: Boolean(twoFactor),
    });

    return NextResponse.json({
      success: true,
      member: newMember,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    const updated = updateTeamMember(id, updates);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    const deleted = deleteTeamMember(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
