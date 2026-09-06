import { NextResponse } from "next/server";
import { getData, saveData } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = getData();
  const post = data.posts.find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data = getData();
  const idx = data.posts.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  data.posts[idx] = { ...data.posts[idx], ...body, updatedAt: new Date().toISOString() };
  saveData(data);
  return NextResponse.json(data.posts[idx]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = getData();
  data.posts = data.posts.filter((p) => p.id !== id);
  saveData(data);
  return NextResponse.json({ ok: true });
}
