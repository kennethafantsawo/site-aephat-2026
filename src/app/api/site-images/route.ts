import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";
import type { SiteImage } from "@/modules/content/types";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.siteImages || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = getData();
  const newImage: SiteImage = {
    id: generateId("si"),
    url: body.url || "",
    alt: body.alt || "",
    altEn: body.altEn || "",
    title: body.title || "",
    titleEn: body.titleEn || "",
    category: body.category || "general",
    order: body.order ?? (data.siteImages?.length || 0) + 1,
    isActive: body.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (!data.siteImages) data.siteImages = [];
  data.siteImages.push(newImage);
  saveData(data);
  return NextResponse.json(newImage, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  if (!data.siteImages) data.siteImages = [];
  const idx = data.siteImages.findIndex((img) => img.id === id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  data.siteImages[idx] = { ...data.siteImages[idx], ...updates, updatedAt: new Date().toISOString() };
  saveData(data);
  return NextResponse.json(data.siteImages[idx]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  if (!data.siteImages) data.siteImages = [];
  data.siteImages = data.siteImages.filter((img) => img.id !== id);
  saveData(data);
  return NextResponse.json({ ok: true });
}
