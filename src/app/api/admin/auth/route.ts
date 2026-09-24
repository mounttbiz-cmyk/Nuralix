import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    const expectedPasscode = process.env.SUPERADMIN_PASSCODE || process.env.ADMIN_PASSCODE || "bizzpal2026";

    if (!passcode || passcode !== expectedPasscode) {
      return NextResponse.json(
        { success: false, error: "Invalid developer/superadmin credentials." },
        { status: 401 }
      );
    }

    // Set secure HTTP-only cookie for session verification in middleware
    const res = NextResponse.json({
      success: true,
      message: "Superadmin authenticated successfully.",
      user: {
        id: "adm_platform_developer",
        role: "platform_admin",
      },
    });

    res.cookies.set("bizzpal_admin_token", "authenticated_developer_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Authentication failed." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out." });
  res.cookies.delete("bizzpal_admin_token");
  return res;
}
