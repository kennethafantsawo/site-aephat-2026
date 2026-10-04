import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";
import { isContentReadOnly, READ_ONLY_ERROR } from "@/lib/site";
import type { SiteImage } from "@/modules/content/types";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.siteImages || []);
}

export async function POST(request: Request) {
  if (isContentReadOnly()) {
    return NextResponse.json({ error: READ_ONLY_ERROR }, { status: 403 });
  }
  const body = await request.json();
  const data = getData();
  const newImage: SiteImage = {
    id: generateId("si"),
    url: body.url || "",
    alt: body.alt || "",
    altEn: body.altEn || "",
    title: body.title || "",
    titleEn: body.titleEn || "",
    caption: body.caption || "",
    captionEn: body.captionEn || "",
    credit: body.credit || "",
    linkUrl: body.linkUrl || "",
    openInNewTab: body.openInNewTab ?? true,
    tags: body.tags || [],
    category: body.category || "general",
    order: body.order ?? (data.siteImages?.length || 0) + 1,
    isActive: body.isActive ?? true,
    isFeatured: body.isFeatured ?? false,
    visibility: body.visibility || "everyone",
    publishAt: body.publishAt || undefined,
    expireAt: body.expireAt || undefined,
    style: body.style || "rounded",
    withShadow: body.withShadow ?? true,
    withBorder: body.withBorder ?? false,
    focalX: body.focalX ?? 50,
    focalY: body.focalY ?? 50,
    overlayOpacity: body.overlayOpacity ?? 45,
    width: body.width || undefined,
    height: body.height || undefined,
    fileSizeKb: body.fileSizeKb || undefined,
    source: body.source || "url",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (!data.siteImages) data.siteImages = [];
  data.siteImages.push(newImage);
  saveData(data);
  return NextResponse.json(newImage, { status: 201 });
}

export async function PUT(request: Request) {
  if (isContentReadOnly()) {
    return NextResponse.json({ error: READ_ONLY_ERROR }, { status: 403 });
  }
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
  if (isContentReadOnly()) {
    return NextResponse.json({ error: READ_ONLY_ERROR }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const ids = searchParams.get("ids");
  if (!id && !ids) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  if (!data.siteImages) data.siteImages = [];
  const toDelete = ids ? ids.split(",") : [id as string];
  data.siteImages = data.siteImages.filter((img) => !toDelete.includes(img.id));
  saveData(data);
  return NextResponse.json({ ok: true, deleted: toDelete.length });
}
