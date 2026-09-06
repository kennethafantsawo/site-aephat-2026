"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { SiteImage, SiteImageCategory } from "@/modules/content/types";

const CATEGORY_LABELS: Record<SiteImageCategory, Record<string, string>> = {
  hero: { fr: "Carousel hero", en: "Hero carousel" },
  about: { fr: "À propos", en: "About" },
  post: { fr: "Articles", en: "Posts" },
  general: { fr: "Général", en: "General" },
};

export default function AdminImagesPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null);
  const [filter, setFilter] = useState<SiteImageCategory | "all">("all");
  const [form, setForm] = useState({ url: "", alt: "", altEn: "", title: "", titleEn: "", category: "hero" as SiteImageCategory, isActive: true });

  useEffect(() => {
    fetch("/api/site-images").then((r) => r.json()).then((d) => { setImages(d); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? images : images.filter((img) => img.category === filter);

  const openAdd = () => {
    setEditingImage(null);
    setForm({ url: "", alt: "", altEn: "", title: "", titleEn: "", category: "hero", isActive: true });
    setShowForm(true);
  };

  const openEdit = (img: SiteImage) => {
    setEditingImage(img);
    setForm({ url: img.url, alt: img.alt, altEn: img.altEn || "", title: img.title || "", titleEn: img.titleEn || "", category: img.category, isActive: img.isActive });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImage) {
      await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingImage.id, ...form }) });
      setImages((prev) => prev.map((img) => img.id === editingImage.id ? { ...img, ...form, updatedAt: new Date().toISOString() } : img));
    } else {
      const res = await fetch("/api/site-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: images.length + 1 }) });
      const newImg = await res.json();
      setImages((prev) => [...prev, newImg]);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === "fr" ? "Supprimer cette image ?" : "Delete this image?")) return;
    await fetch(`/api/site-images?id=${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleToggleActive = async (img: SiteImage) => {
    const updated = { ...img, isActive: !img.isActive };
    await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setImages((prev) => prev.map((i) => i.id === img.id ? updated : i));
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = filtered.findIndex((img) => img.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= filtered.length) return;
    const a = filtered[idx];
    const b = filtered[swapIdx];
    await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, order: b.order }) });
    await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, order: a.order }) });
    setImages((prev) => prev.map((img) => {
      if (img.id === a.id) return { ...img, order: b.order };
      if (img.id === b.id) return { ...img, order: a.order };
      return img;
    }));
  };

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-12"><p className="text-gray-500">{t.common.loading}</p></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{locale === "fr" ? "Gestion des images" : "Image management"}</h1>
          <p className="text-sm text-gray-500 mt-1">{locale === "fr" ? "Gérez les images du site : carousel, articles, etc." : "Manage site images: carousel, posts, etc."}</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
          + {locale === "fr" ? "Ajouter" : "Add"}
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          {locale === "fr" ? "Toutes" : "All"}
        </button>
        {(Object.keys(CATEGORY_LABELS) as SiteImageCategory[]).map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === cat ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {CATEGORY_LABELS[cat][locale]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400">{locale === "fr" ? "Aucune image" : "No images"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.sort((a, b) => a.order - b.order).map((img) => (
            <div key={img.id} className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-colors ${img.isActive ? "border-gray-200" : "border-gray-100 opacity-50"}`}>
              <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {CATEGORY_LABELS[img.category][locale]}
                  </span>
                  <span className="text-xs text-gray-400">#{img.order}</span>
                </div>
                {(img.title || img.titleEn) && (
                  <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                    {locale === "en" && img.titleEn ? img.titleEn : img.title}
                  </p>
                )}
                <p className="text-xs text-gray-400 truncate">{img.alt}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleReorder(img.id, "up")} className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer" title="Up">↑</button>
                <button onClick={() => handleReorder(img.id, "down")} className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer" title="Down">↓</button>
                <button onClick={() => handleToggleActive(img)} className={`p-1.5 cursor-pointer ${img.isActive ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}`} title={img.isActive ? "Active" : "Inactive"}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={img.isActive ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"} /></svg>
                </button>
                <button onClick={() => openEdit(img)} className="p-1.5 text-gray-400 hover:text-primary cursor-pointer">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(img.id)} className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingImage ? (locale === "fr" ? "Modifier l'image" : "Edit image") : (locale === "fr" ? "Ajouter une image" : "Add image")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="https://..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt (FR)</label>
                  <input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt (EN)</label>
                  <input value={form.altEn} onChange={(e) => setForm({ ...form, altEn: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === "fr" ? "Titre sur l'image (FR)" : "Image title (FR)"}</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={locale === "fr" ? "Ex: Nouveau laboratoire" : "Ex: New laboratory"} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === "fr" ? "Titre sur l'image (EN)" : "Image title (EN)"}</label>
                  <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Ex: New laboratory" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === "fr" ? "Catégorie" : "Category"}</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SiteImageCategory })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  {(Object.keys(CATEGORY_LABELS) as SiteImageCategory[]).map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat][locale]}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="isActive" className="text-sm text-gray-700">{locale === "fr" ? "Active" : "Active"}</label>
              </div>
              {form.url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === "fr" ? "Aperçu" : "Preview"}</label>
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={form.url} alt={form.alt} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer">
                  {editingImage ? (locale === "fr" ? "Enregistrer" : "Save") : (locale === "fr" ? "Ajouter" : "Add")}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  {t.common.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
