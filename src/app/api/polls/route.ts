import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.polls);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = getData();
  const newPoll = {
    id: generateId("poll"),
    title: body.title || "",
    titleEn: body.titleEn || "",
    description: body.description || "",
    descriptionEn: body.descriptionEn || "",
    googleFormUrl: body.googleFormUrl || "",
    resultsEmail: body.resultsEmail || "",
    eligibility: body.eligibility || "email_required",
    isActive: true,
    createdBy: body.createdBy || "u1",
    createdAt: new Date().toISOString(),
  };
  data.polls.unshift(newPoll);
  saveData(data);
  return NextResponse.json(newPoll, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  data.polls = data.polls.filter((p) => p.id !== id);
  saveData(data);
  return NextResponse.json({ ok: true });
}
