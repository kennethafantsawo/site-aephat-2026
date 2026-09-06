import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.userId || !body.profileType) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "userId and profileType are required" } },
      { status: 422 }
    );
  }

  return NextResponse.json({ message: "Verification request submitted (demo)" }, { status: 201 });
}
