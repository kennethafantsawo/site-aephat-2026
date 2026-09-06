"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/modules/content/types";

export default function VieAephatPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((p) => {
        setPosts(p.filter((post: Post) => post.status === "published"));
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500">{t.common.loading}</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          {locale === "fr" ? "Journal" : "News"}
        </p>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
          {t.vieAephat.title}
        </h1>
        <div className="w-12 h-1 bg-primary rounded mt-4" />
        <p className="mt-4 text-gray-500 max-w-xl">
          {t.vieAephat.description}
        </p>

        {posts.length === 0 ? (
          <p className="text-gray-400 py-16 text-center">{t.vieAephat.empty}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
