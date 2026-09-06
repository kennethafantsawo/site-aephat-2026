"use client";

import { useState } from "react";
import { type Locale, getDictionary } from "@/lib/i18n";

interface ArticleModalProps {
  locale: Locale;
  article: {
    id: string;
    title: string;
    titleEn?: string;
    content: string;
    contentEn?: string;
    sourceName?: string;
    sourceUrl?: string;
    imageUrl?: string;
    createdAt?: string;
    publishedDate?: string;
    authorName?: string;
  };
  onClose: () => void;
  onComment?: () => void;
}

export function ArticleModal({ locale, article, onClose, onComment }: ArticleModalProps) {
  const t = getDictionary(locale);
  const [liked, setLiked] = useState(false);

  const title = locale === "en" && article.titleEn ? article.titleEn : article.title;
  const content = locale === "en" && article.contentEn ? article.contentEn : article.content;
  const date = article.publishedDate || article.createdAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {article.imageUrl && (
          <div className="aspect-[16/9] overflow-hidden rounded-t-xl">
            <img src={article.imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-3">
            {article.sourceName && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {article.sourceName}
              </span>
            )}
            {date && (
              <time className="text-xs text-gray-400">
                {new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
          </div>

          <h1 className="text-xl font-bold text-gray-900 leading-snug">{title}</h1>

          {article.authorName && (
            <p className="text-sm text-gray-500 mt-2">
              {locale === "fr" ? "Par" : "By"} {article.authorName}
            </p>
          )}

          <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</div>

          {article.sourceUrl && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
              >
                {t.health.readOriginal} →
              </a>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={() => setLiked(!liked)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              liked ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
            }`}
          >
            <svg className="h-4 w-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {locale === "fr" ? "J'aime" : "Like"}
          </button>
          {onComment && (
            <button
              onClick={onComment}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t.posts.commentsAction}
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
}
