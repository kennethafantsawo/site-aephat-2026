"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { Comment } from "@/modules/moderation/types";
import type { Post } from "@/modules/content/types";

export default function AdminCommentsPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/comments").then((r) => r.json()), fetch("/api/posts").then((r) => r.json())])
      .then(([c, p]) => { setComments(c); setPosts(p); setLoading(false); });
  }, []);

  const handleApprove = async (comment: Comment) => {
    const res = await fetch("/api/comments", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: comment.id, isApproved: true }) });
    if (res.ok) setComments((prev) => prev.map((c) => c.id === comment.id ? { ...c, isApproved: true } : c));
  };

  const handleReject = async (comment: Comment) => {
    const res = await fetch("/api/comments", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: comment.id, isApproved: false }) });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== comment.id));
  };

  const getPostTitle = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    return post ? (locale === "en" && post.titleEn ? post.titleEn : post.title) : postId;
  };

  if (loading) return <p className="text-gray-500">{t.common.loading}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.admin.comments}</h1>
      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Auteur</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Commentaire</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Publication</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="font-medium text-gray-900">{comment.authorName}</div><div className="text-xs text-gray-500">{comment.authorEmail}</div></td>
                <td className="px-4 py-3 text-gray-600 max-w-xs">{comment.content}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{getPostTitle(comment.postId)}</td>
                <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${comment.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{comment.isApproved ? t.admin.posted : t.admin.pendingReview}</span></td>
                <td className="px-4 py-3 text-right space-x-2">
                  {!comment.isApproved && <button onClick={() => handleApprove(comment)} className="text-green-600 hover:underline text-xs font-medium">{t.admin.approve}</button>}
                  <button onClick={() => handleReject(comment)} className="text-red-600 hover:underline text-xs font-medium">{t.admin.deletePost}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
