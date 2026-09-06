import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.bureau.sort((a, b) => a.order - b.order));
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = getData();
  const newMember = {
    id: generateId("b"),
    name: body.name || "",
    role: body.role || "",
    roleEn: body.roleEn || "",
    email: body.email || "",
    phone: body.phone || "",
    imageUrl: body.imageUrl || undefined,
    order: body.order || data.bureau.length + 1,
  };
  data.bureau.push(newMember);
  data.bureau.sort((a, b) => a.order - b.order);
  saveData(data);
  return NextResponse.json(newMember, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  const idx = data.bureau.findIndex((m) => m.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  data.bureau[idx] = { ...data.bureau[idx], ...body };
  data.bureau.sort((a, b) => a.order - b.order);
  saveData(data);
  return NextResponse.json(data.bureau[idx]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  data.bureau = data.bureau.filter((m) => m.id !== id);
  saveData(data);
  return NextResponse.json({ ok: true });
}
