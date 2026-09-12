"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { PostCard } from "./PostCard";
import type { Post } from "@/modules/content/types";

interface InteractiveCardsProps {
  posts: Post[];
  locale: string;
  title: string;
  titleEn: string;
  viewAllHref: string;
  viewAllText: string;
  viewAllTextEn: string;
}

export function InteractiveCards({
  posts,
  locale,
  title,
  titleEn,
  viewAllHref,
  viewAllText,
  viewAllTextEn,
}: InteractiveCardsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "featured">("all");

  return (
    <section className="py-16 lg:py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              {locale === "fr" ? "Actualités" : "News"}
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              {locale === "fr" ? title : titleEn}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-primary hover:text-primary hover:shadow-md transition-all"
          >
            {locale === "fr" ? viewAllText : viewAllTextEn} →
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {locale === "fr" ? "Tout" : "All"}
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "featured"
                ? "bg-secondary text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {locale === "fr" ? "En vedette" : "Featured"}
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <PostCard post={post} locale={locale} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
          >
            {locale === "fr" ? "Voir toutes les actualités" : "View all news"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
