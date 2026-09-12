"use client";

import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Eye, Share2, Bookmark, MapPin, Lock, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/modules/content/types";
import { CommentsModal } from "./CommentsModal";

function timeAgo(iso: string, locale: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return locale === "fr" ? "à l'instant" : "just now";
  if (m < 60) return locale === "fr" ? `il y a ${m} min` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return locale === "fr" ? `il y a ${h} h` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return locale === "fr" ? `il y a ${d} j` : `${d}d ago`;
}

export function SocialPostCard({ post, locale, compact = false }: { post: Post; locale: string; compact?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const body = locale === "en" && post.contentEn ? post.contentEn : post.content;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
  const gallery = post.images && post.images.length ? post.images : post.imageUrl ? [post.imageUrl] : [];
  const authorName = post.authorName || "AEPHAT";
  const handle = post.authorHandle || "@aephat.tg";
  const avatar = post.authorAvatar || "/brand/aez.png";

  const like = async () => {
    const v = !liked;
    setLiked(v);
    if (v) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: (post.likes || 0) + (v ? 1 : 0) }),
      });
    } catch {}
  };

  const share = async () => {
    const url = `${window.location.origin}/${locale}/vie-aephat`;
    const text = `${title} — via AEPHAT`;
    try {
      if (navigator.share) await navigator.share({ title, text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); alert(locale === "fr" ? "Lien copié." : "Link copied."); }
    } catch {}
  };

  return (
    <>
      <article className="card-soft card-hover overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 pb-3 flex items-start gap-3">
          <span className="story-ring shrink-0"><span className="block w-11 h-11 rounded-full overflow-hidden bg-white"><img src={avatar} alt="" className="w-full h-full object-cover" /></span></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-[14.5px] text-[#101418] truncate">{authorName}</span>
              {(post.isVerifiedAuthor ?? true) && <BadgeCheck className="w-4 h-4 text-[#1FA34A] shrink-0" />}
              <span className="text-[12.5px] text-[#5A6570] truncate">{handle} · {timeAgo(post.createdAt, locale)}</span>
            </div>
            <p className="text-[12px] font-bold text-[#0C6B2D] mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {post.location || "Lomé, Togo — FSS"}</p>
          </div>
          {post.isPinned && <span className="text-[11px] font-extrabold bg-[#101418] text-white rounded-full px-2.5 py-1 shrink-0">{locale === "fr" ? "Épinglé" : "Pinned"}</span>}
        </div>

        <div className="px-4 sm:px-5">
          <h3 className="font-display font-extrabold text-[16.5px] leading-snug">{title}</h3>
          {!compact && <p className="text-[13.5px] text-[#3A454E] mt-1.5 leading-relaxed line-clamp-3">{excerpt || body.slice(0, 220)}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(post.tags || []).slice(0, 4).map((tag) => (
              <span key={tag} className="text-[12px] font-bold text-[#0C6B2D] bg-[#E9F7EE] rounded-full px-2.5 py-1">#{tag}</span>
            ))}
            {post.visibility === "students_only" && <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#101418] bg-[#F2F5F3] rounded-full px-2.5 py-1"><Lock className="w-3 h-3" /> {locale === "fr" ? "Étudiants" : "Students"}</span>}
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="relative mt-3 mx-4 sm:mx-5 rounded-2xl overflow-hidden bg-[#0A2E18]" onDoubleClick={like}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[imgIdx % gallery.length]} alt="" className="w-full h-64 sm:h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
            {showHeart && <span className="heart-pop absolute inset-0 grid place-items-center pointer-events-none"><Heart className="w-16 h-16 text-red-500" fill="currentColor" /></span>}
            {gallery.length > 1 && (
              <>
                <button onClick={() => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur grid place-items-center" aria-label="prev"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setImgIdx((i) => (i + 1) % gallery.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur grid place-items-center" aria-label="next"><ChevronRight className="w-4 h-4" /></button>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {gallery.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === imgIdx % gallery.length ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />)}
                </div>
              </>
            )}
          </div>
        )}

        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={like} className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold transition-all ${liked ? "text-red-500" : "text-[#3A454E] hover:text-red-500 hover:bg-red-50"}`} aria-label="like">
              <Heart className={`w-[19px] h-[19px] ${liked ? "heart-pop" : ""}`} fill={liked ? "currentColor" : "none"} />
              {(post.likes || 0) + (liked ? 1 : 0)}
            </button>
            <button onClick={() => setShowComments(true)} className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold text-[#3A454E] hover:text-[#0C6B2D] hover:bg-green-50 transition-all" aria-label="comment">
              <MessageCircle className="w-[19px] h-[19px]" />
              {post.commentCount || 0}
            </button>
            <button onClick={() => setReposted((v) => !v)} className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold transition-all ${reposted ? "text-[#0C6B2D] bg-green-50" : "text-[#3A454E] hover:text-[#0C6B2D] hover:bg-green-50"}`} aria-label="repost">
              <Repeat2 className="w-[19px] h-[19px]" />
              {(post.reposts || 0) + (reposted ? 1 : 0)}
            </button>
            <span className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold text-[#5A6570]"><Eye className="w-[19px] h-[19px]" /> {(post.views || 128) + (liked ? 1 : 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={share} className="w-9 h-9 grid place-items-center rounded-full text-[#3A454E] hover:bg-[#F2F5F3] hover:text-[#0C6B2D] transition-all" aria-label="share"><Share2 className="w-[18px] h-[18px]" /></button>
            <button onClick={() => setSaved((v) => !v)} className={`w-9 h-9 grid place-items-center rounded-full transition-all ${saved ? "text-[#0C6B2D] bg-[#E9F7EE]" : "text-[#3A454E] hover:bg-[#F2F5F3]"}`} aria-label="save"><Bookmark className="w-[18px] h-[18px]" fill={saved ? "currentColor" : "none"} /></button>
          </div>
        </div>
      </article>

      {showComments && (
        <CommentsModal locale={locale as "fr" | "en"} postId={post.id} postTitle={title} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}
