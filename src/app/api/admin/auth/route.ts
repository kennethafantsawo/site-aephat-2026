import { NextResponse } from "next/server";
import { verifyPassword, ADMIN_PASSWORD_HASH } from "@/lib/auth";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const hasSession = cookie.includes("admin_session=authenticated");
  return NextResponse.json({ authenticated: hasSession });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.check) {
    const cookie = request.headers.get("cookie") || "";
    const hasSession = cookie.includes("admin_session=authenticated");
    return NextResponse.json({ authenticated: hasSession });
  }

  const { password } = body;

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, role: "admin" });

  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
