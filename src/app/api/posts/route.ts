import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";
import { isContentReadOnly, READ_ONLY_ERROR } from "@/lib/site";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.posts);
}

export async function POST(request: Request) {
  if (isContentReadOnly()) {
    return NextResponse.json({ error: READ_ONLY_ERROR }, { status: 403 });
  }
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
    images: body.images || (body.imageUrl ? [body.imageUrl] : []),
    authorName: body.authorName || "AEPHAT",
    authorAvatar: body.authorAvatar || "/brand/aez.png",
    authorHandle: body.authorHandle || "@aephat.tg",
    isVerifiedAuthor: body.isVerifiedAuthor ?? true,
    location: body.location || "Lomé, Togo",
    status: body.status || "draft",
    authorId: body.authorId || "u1",
    category: body.category || undefined,
    tags: body.tags || [],
    visibility: body.visibility || "everyone",
    isDemo: false,
    isPinned: body.isPinned || false,
    isSponsored: body.isSponsored || false,
    scheduledAt: body.scheduledAt || undefined,
    likes: 0,
    reposts: 0,
    shares: 0,
    bookmarks: 0,
    views: 0,
    commentCount: 0,
    pollId: body.pollId || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.posts.unshift(newPost);
  saveData(data);
  return NextResponse.json(newPost, { status: 201 });
}
