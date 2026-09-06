import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = getData();
  const newPost = {
    id: generateId("p"),
    title: body.title || "",
    titleEn: body.titleEn || "",
    content: body.content || "",
    contentEn: body.contentEn || "",
    excerpt: body.excerpt || "",
    excerptEn: body.excerptEn || "",
    imageUrl: body.imageUrl || undefined,
    status: body.status || "draft",
    authorId: body.authorId || "u1",
    category: body.category || undefined,
    tags: body.tags || [],
    visibility: body.visibility || "everyone",
    isDemo: false,
    scheduledAt: body.scheduledAt || undefined,
    likes: 0,
    commentCount: 0,
    pollId: body.pollId || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.posts.unshift(newPost);
  saveData(data);
  return NextResponse.json(newPost, { status: 201 });
}
