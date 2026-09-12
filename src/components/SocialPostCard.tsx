"use client";

import { useState } from "react";
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
  const [following, setFollowing] = useState(false);

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
      else { await navigator.clipboard.writeText(`${text} ${url}`); alert(locale === "fr" ? "Lien copié !" : "Link copied!"); }
    } catch {}
  };

  return (
    <>
      <article className="card-soft card-hover overflow-hidden flex flex-col">
        {/* Header façon X */}
        <div className="p-4 sm:p-5 pb-3 flex items-start gap-3">
          <span className="story-ring shrink-0"><span className="block w-11 h-11 rounded-full overflow-hidden bg-white"><img src={avatar} alt="" className="w-full h-full object-cover" /></span></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-[14.5px] text-[#0B1F14] truncate">{authorName}</span>
              {(post.isVerifiedAuthor ?? true) && (
                <svg className="w-4 h-4 text-[#1A5632] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2.4 3.4-.5 1 3.3 3.2 1.2-1.3 3.1 1.3 3.1-3.2 1.2-1 3.3-3.4-.5L12 22l-2.4-2.4-3.4.5-1-3.3-3.2-1.2L3.3 12 2 8.9l3.2-1.2 1-3.3 3.4.5z"/><path d="M10.6 14.6l-2.1-2.1 1.1-1.1 1 1 3.7-3.7 1.1 1.1z" fill="#fff"/></svg>
              )}
              <span className="text-[12.5px] text-[#5B6B5F] truncate">{handle} • {timeAgo(post.createdAt, locale)}</span>
            </div>
            <p className="text-[12px] font-bold text-[#1A5632] mt-0.5">📍 {post.location || (locale === "fr" ? "Lomé, Togo • FSS" : "Lomé, Togo • FSS")}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {post.isPinned && <span className="text-[11px] font-extrabold bg-[#FFF3D6] text-[#8a6d1b] rounded-full px-2.5 py-1">📌</span>}
            <button onClick={() => setFollowing((v) => !v)} className={`text-[12px] font-extrabold rounded-full px-3.5 py-1.5 transition-all ${following ? "bg-[#EFF2EC] text-[#1A5632]" : "bg-[#0B1F14] text-white hover:scale-105"}`}>
              {following ? (locale === "fr" ? "Suivi ✓" : "Following ✓") : (locale === "fr" ? "+ Suivre" : "+ Follow")}
            </button>
          </div>
        </div>

        {/* Texte */}
        <div className="px-4 sm:px-5">
          <h3 className="font-display font-extrabold text-[16.5px] leading-snug">{title}</h3>
          {!compact && <p className="text-[13.5px] text-[#33463a] mt-1.5 leading-relaxed line-clamp-3">{excerpt || body.slice(0, 220)}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(post.tags || []).slice(0, 4).map((tag) => (
              <span key={tag} className="text-[12px] font-bold text-[#1A5632] bg-[#EAF4ED] rounded-full px-2.5 py-1">#{tag}</span>
            ))}
            {post.visibility === "students_only" && <span className="text-[12px] font-bold text-[#8a6d1b] bg-[#FFF3D6] rounded-full px-2.5 py-1">🔒 {locale === "fr" ? "Étudiants" : "Students"}</span>}
          </div>
        </div>

        {/* Média façon Instagram */}
        {gallery.length > 0 && (
          <div className="relative mt-3 mx-4 sm:mx-5 rounded-2xl overflow-hidden bg-[#0B1F14]" onDoubleClick={like}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[imgIdx % gallery.length]} alt="" className="w-full h-64 sm:h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
            {showHeart && <span className="heart-pop absolute inset-0 grid place-items-center text-7xl pointer-events-none">❤️</span>}
            {gallery.length > 1 && (
              <>
                <button onClick={() => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur" aria-label="prev">‹</button>
                <button onClick={() => setImgIdx((i) => (i + 1) % gallery.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur" aria-label="next">›</button>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {gallery.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === imgIdx % gallery.length ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* Barre d'actions IG + X + FB */}
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={like} className={`group flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold transition-all ${liked ? "text-red-500" : "text-[#33463a] hover:text-red-500 hover:bg-red-50"}`} aria-label="like">
              <span className={`text-[19px] ${liked ? "heart-pop inline-block" : "group-hover:scale-125 inline-block transition-transform"}`}>{liked ? "❤️" : "🤍"}</span>
              {(post.likes || 0) + (liked ? 1 : 0)}
            </button>
            <button onClick={() => setShowComments(true)} className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold text-[#33463a] hover:text-[#1A5632] hover:bg-green-50 transition-all" aria-label="comment">
              💬 {post.commentCount || 0}
            </button>
            <button onClick={() => setReposted((v) => !v)} className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold transition-all ${reposted ? "text-[#1A5632] bg-green-50" : "text-[#33463a] hover:text-[#1A5632] hover:bg-green-50"}`} aria-label="repost">
              🔁 {(post.reposts || 0) + (reposted ? 1 : 0)}
            </button>
            <span className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold text-[#5B6B5F]">👁️ {(post.views || 128) + (liked ? 1 : 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={share} className="w-9 h-9 grid place-items-center rounded-full text-[#33463a] hover:bg-[#EFF2EC] hover:text-[#1A5632] transition-all" aria-label="share">📤</button>
            <button onClick={() => setSaved((v) => !v)} className={`w-9 h-9 grid place-items-center rounded-full transition-all ${saved ? "text-[#B8922E] bg-[#FFF6DE]" : "text-[#33463a] hover:bg-[#EFF2EC]"}`} aria-label="save">{saved ? "🔖" : "📑"}</button>
          </div>
        </div>
      </article>

      {showComments && (
        <CommentsModal locale={locale as "fr" | "en"} postId={post.id} postTitle={title} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}
