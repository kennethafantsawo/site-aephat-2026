"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { Post } from "@/modules/content/types";
import type { Poll } from "@/modules/polls/types";

export default function AdminPostsPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [posts, setPosts] = useState<Post[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then((r) => r.json()),
      fetch("/api/polls").then((r) => r.json()),
    ]).then(([p, pl]) => { setPosts(p); setPolls(pl); setLoading(false); });
  }, []);

  const emptyPost: Post = {
    id: "", title: "", titleEn: "", content: "", contentEn: "",
    excerpt: "", excerptEn: "", status: "draft", authorId: "u1",
    isDemo: false, likes: 0, commentCount: 0, createdAt: "", updatedAt: "",
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.posts}</h1>
        <button onClick={() => { setEditing(emptyPost); setShowForm(true); }} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">{t.admin.newPost}</button>
      </div>

      {showForm && editing && (
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
                    <button onClick={() => { setEditing(post); setShowForm(true); }} className="text-primary hover:underline text-xs font-medium">{t.admin.editPost}</button>
                    {post.status !== "published" && <button onClick={() => handlePublishNow(post)} className="text-green-600 hover:underline text-xs font-medium">{t.admin.publishNow}</button>}
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline text-xs font-medium">{t.admin.deletePost}</button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.imageUrl_label}</label><input value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
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
