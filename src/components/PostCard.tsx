"use client";

import { useState } from "react";
import type { Post } from "@/modules/content/types";
import { CommentsModal } from "./CommentsModal";

export function PostCard({ post, locale }: { post: Post; locale: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const body = locale === "en" && post.contentEn ? post.contentEn : post.content;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => (newLiked ? c + 1 : c - 1));
    await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: likeCount + (newLiked ? 1 : 0) }),
    });
  };

  return (
    <>
      <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-3d relative">
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
        
        {post.imageUrl && (
          <div className="aspect-[16/10] overflow-hidden relative">
            <img
              src={post.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        
        <div className="p-5 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {locale === "fr" ? "Vie AEPHAT" : "AEPHAT Life"}
            </span>
            {post.visibility === "students_only" && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                🔒 {locale === "fr" ? "Étudiants" : "Students"}
              </span>
            )}
            <span className="text-xs text-gray-300">•</span>
            <time className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {excerpt || body.slice(0, 140)}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer ${
                liked
                  ? "bg-primary text-white border-primary hover:bg-primary-dark"
                  : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary hover:shadow-md"
              }`}
            >
              <svg
                className="h-3.5 w-3.5 transition-transform group-active:scale-125"
                fill={liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {likeCount}
            </button>
            <button
              onClick={() => setShowComments(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:border-primary hover:text-primary hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {post.commentCount || 0}
            </button>
          </div>
        </div>
      </article>

      {showComments && (
        <CommentsModal
          locale={locale as "fr" | "en"}
          postId={post.id}
          postTitle={title}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
}
