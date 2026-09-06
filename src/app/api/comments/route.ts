import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";

export async function GET() {
  const data = getData();
  return NextResponse.json(data.comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.authorEmail || !body.content || !body.postId) {
    return NextResponse.json({ error: "Email, content and postId required" }, { status: 422 });
  }
  const data = getData();
  const newComment = {
    id: generateId("c"),
    postId: body.postId,
    authorName: body.authorName || "Anonyme",
    authorEmail: body.authorEmail,
    content: body.content,
    isApproved: false,
    createdAt: new Date().toISOString(),
  };
  data.comments.unshift(newComment);
  const post = data.posts.find((p) => p.id === body.postId);
  if (post) post.commentCount = (post.commentCount || 0) + 1;
  saveData(data);
  return NextResponse.json(newComment, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data = getData();
  const idx = data.comments.findIndex((c) => c.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  data.comments[idx] = { ...data.comments[idx], ...body };
  saveData(data);
  return NextResponse.json(data.comments[idx]);
}
