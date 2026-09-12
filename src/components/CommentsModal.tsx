"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, Lock } from "lucide-react";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { CommentItem } from "@/modules/content/types";

interface CommentsModalProps {
  locale: Locale;
  postId: string;
  postTitle: string;
  onClose: () => void;
}

export function CommentsModal({ locale, postId, postTitle, onClose }: CommentsModalProps) {
  const t = getDictionary(locale);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ authorName: "", authorEmail: "", content: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setComments(data.filter((c: CommentItem) => c.isApproved !== false));
        setLoading(false);
      });
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        authorName: form.authorName,
        authorEmail: form.authorEmail,
        content: form.content,
        visibility: "public",
      }),
    });
    setSubmitted(true);
    setForm({ authorName: "", authorEmail: "", content: "" });
    setTimeout(() => setSubmitted(false), 3000);
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data.filter((c: CommentItem) => c.isApproved !== false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t.commentModal.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{postTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-8">{t.common.loading}</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              {locale === "fr" ? "Aucun commentaire pour le moment" : "No comments yet"}
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{c.authorName}</span>
                  {c.isVerifiedUser && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      <BadgeCheck className="w-3 h-3" /> {locale === "fr" ? "Vérifié" : "Verified"}
                    </span>
                  )}
                  {c.visibility === "private" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Lock className="w-3 h-3" /> {locale === "fr" ? "Privé" : "Private"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1">{c.content}</p>
                {c.adminReply && (
                  <div className="mt-2 pl-3 border-l-2 border-primary bg-primary/5 rounded-r p-2">
                    <p className="text-[10px] font-semibold text-primary mb-0.5">{t.commentModal.replyFromAdmin}</p>
                    <p className="text-sm text-gray-700">{c.adminReply}</p>
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2 mb-3">
              {t.commentModal.successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                placeholder={t.commentModal.nameLabel}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <input
                type="email"
                value={form.authorEmail}
                onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
                placeholder={t.commentModal.emailLabel}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div className="flex gap-2">
              <input
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={t.commentModal.messageLabel}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
              >
                {t.commentModal.submitBtn}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
