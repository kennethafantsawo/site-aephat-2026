import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Email and password are required" } },
      { status: 422 }
    );
  }

  return NextResponse.json({
    message: "Auth endpoint ready (demo - connect Supabase for production)",
    user: { email: body.email, role: "citizen" },
  });
}
