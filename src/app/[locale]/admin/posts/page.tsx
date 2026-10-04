"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { Post } from "@/modules/content/types";
import type { Poll } from "@/modules/polls/types";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { isContentReadOnly } from "@/lib/site";

export default function AdminPostsPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [posts, setPosts] = useState<Post[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const readOnly = isContentReadOnly();

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then((r) => r.json()),
      fetch("/api/polls").then((r) => r.json()),
    ]).then(([p, pl]) => { setPosts(p); setPolls(pl); setLoading(false); });
  }, []);

  const emptyPost: Post = {
    id: "", title: "", titleEn: "", content: "", contentEn: "",
    excerpt: "", excerptEn: "", status: "draft", authorId: "u1",
    images: [], isDemo: false, likes: 0, commentCount: 0, createdAt: "", updatedAt: "",
  };

  const handleSave = async (post: Post) => {
    const method = post.id ? "PUT" : "POST";
    const url = post.id ? `/api/posts/${post.id}` : "/api/posts";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(post) });
    if (res.ok) {
      const saved = await res.json();
      setPosts((prev) => post.id ? prev.map((p) => p.id === post.id ? saved : p) : [saved, ...prev]);
      setShowForm(false); setEditing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePublishNow = async (post: Post) => {
    await handleSave({ ...post, status: "published", scheduledAt: undefined });
  };

  if (loading) return <p className="text-gray-500">{t.common.loading}</p>;

  return (
    <div>
      <ReadOnlyBanner />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.posts}</h1>
        {!readOnly && (
          <button onClick={() => { setEditing(emptyPost); setShowForm(true); }} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">{t.admin.newPost}</button>
        )}
      </div>

      {!readOnly && showForm && editing && (
        <PostForm post={editing} polls={polls} locale={locale} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => {
              const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
              return (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{title || "(Sans titre)"}</div>
                    {post.scheduledAt && <span className="text-xs text-orange-500">{t.admin.scheduled}: {new Date(post.scheduledAt).toLocaleDateString()}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.status === "published" ? "bg-green-100 text-green-700" : post.status === "scheduled" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>{post.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(post.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {readOnly ? (
                      <span className="text-xs text-gray-400">Lecture seule</span>
                    ) : (
                      <>
                        <button onClick={() => { setEditing(post); setShowForm(true); }} className="text-primary hover:underline text-xs font-medium">{t.admin.editPost}</button>
                        {post.status !== "published" && <button onClick={() => handlePublishNow(post)} className="text-green-600 hover:underline text-xs font-medium">{t.admin.publishNow}</button>}
                        <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline text-xs font-medium">{t.admin.deletePost}</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PostForm({ post, polls, locale, onSave, onCancel }: {
  post: Post; polls: Poll[]; locale: Locale; onSave: (p: Post) => void; onCancel: () => void;
}) {
  const t = getDictionary(locale);
  const [form, setForm] = useState({ ...post });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-lg border border-border p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.title_label}</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.titleEn_label}</label><input value={form.titleEn || ""} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.excerpt_label}</label><input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.content_label}</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required /></div>
      <PhotoManager
        images={form.images && form.images.length ? form.images : form.imageUrl ? [form.imageUrl] : []}
        onChange={(images) => setForm({ ...form, images, imageUrl: images[0] })}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.status_label}</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Post["status"] })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="draft">Brouillon</option><option value="published">Publié</option><option value="scheduled">{t.admin.scheduled}</option>
          </select></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">{locale === "fr" ? "Visibilité" : "Visibility"}</label>
        <select value={form.visibility || "everyone"} onChange={(e) => setForm({ ...form, visibility: e.target.value as "everyone" | "students_only" })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="everyone">{locale === "fr" ? "Tout le monde" : "Everyone"}</option>
          <option value="students_only">{locale === "fr" ? "Étudiants uniquement" : "Students only"}</option>
        </select></div>
      {form.status === "scheduled" && (
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.scheduledAt_label}</label><input type="datetime-local" value={form.scheduledAt || ""} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
      )}
      <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.poll_label}</label>
        <select value={form.pollId || ""} onChange={(e) => setForm({ ...form, pollId: e.target.value || undefined })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">{t.admin.noPoll}</option>{polls.map((p) => <option key={p.id} value={p.id}>{locale === "en" && p.titleEn ? p.titleEn : p.title}</option>)}
        </select></div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">{t.admin.cancel}</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">{post.id ? t.admin.updatePost : t.admin.createPost}</button>
      </div>
    </form>
  );
}

function PhotoManager({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    const u = url.trim();
    if (!u) return;
    onChange([...images, u]);
    setUrl("");
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 8 - images.length).forEach((f) => {
      const rd = new FileReader();
      rd.onload = () => onChange([...images, String(rd.result)]);
      rd.readAsDataURL(f);
    });
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-sm font-semibold text-gray-800">
          Photos de la publication <span className="font-normal text-gray-500">({images.length}/8 — la 1ʳᵉ = couverture)</span>
        </label>
        <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-[#101418] text-white text-xs font-bold rounded-full hover:bg-black">
          + Ajouter depuis l'appareil
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </div>
      <div className="flex gap-2 mt-3">
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }} placeholder="Coller une URL d'image puis Entrée..." className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" />
        <button type="button" onClick={addUrl} className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-dark">Ajouter</button>
      </div>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
          {images.map((src, i) => (
            <div key={`${i}-${src.slice(0, 24)}`} className={`relative rounded-xl overflow-hidden border-2 bg-white ${i === 0 ? "border-[#1FA34A]" : "border-transparent"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-28 object-cover" />
              {i === 0 && <span className="absolute top-1.5 left-1.5 text-[10px] font-extrabold bg-[#1FA34A] text-white rounded-full px-2 py-0.5">Couverture</span>}
              <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="w-6 h-6 rounded-full bg-black/60 text-white text-xs disabled:opacity-30">‹</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="w-6 h-6 rounded-full bg-black/60 text-white text-xs disabled:opacity-30">›</button>
                <button type="button" onClick={() => onChange(images.filter((_, x) => x !== i))} className="w-6 h-6 rounded-full bg-red-600 text-white text-xs">×</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 mt-3">Aucune photo. Ajoutez jusqu'à 8 photos : elles s'afficheront en carrousel façon réseau social.</p>
      )}
    </div>
  );
}
