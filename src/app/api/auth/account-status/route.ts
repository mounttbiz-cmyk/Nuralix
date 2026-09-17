import { NextResponse } from "next/server";
import { isUserRegistered, registerUser } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ exists: false, error: "Email parameter required" }, { status: 400 });
    }

    const exists = isUserRegistered(email);
    return NextResponse.json({ exists, email });
  } catch (err: any) {
    console.error("Account status check error:", err);
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, provider, uid } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const success = registerUser(email, name, provider, uid);
    return NextResponse.json({ success, email });
  } catch (err: any) {
    console.error("Account status register error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
