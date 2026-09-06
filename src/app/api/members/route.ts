import { NextResponse } from "next/server";
import { getData, saveData } from "@/lib/store";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.users);
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  const idx = data.users.findIndex((u) => u.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  data.users[idx] = { ...data.users[idx], ...body };
  saveData(data);
  return NextResponse.json(data.users[idx]);
}
