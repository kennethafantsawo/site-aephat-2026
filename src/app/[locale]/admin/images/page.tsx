"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Plus, Upload, Download, Search, LayoutGrid, List, Star, Pause, Play, Copy,
  ChevronUp, ChevronDown, Trash2, Pencil, X, Check, ImagePlus, Clock, Info,
  ExternalLink, BookOpen,
} from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { SiteImage, SiteImageCategory } from "@/modules/content/types";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { isContentReadOnly } from "@/lib/site";

const CATS: { k: SiteImageCategory; fr: string; en: string }[] = [
  { k: "hero", fr: "Carousel hero", en: "Hero carousel" },
  { k: "banner", fr: "Bannières", en: "Banners" },
  { k: "gallery", fr: "Galerie", en: "Gallery" },
  { k: "post", fr: "Publications", en: "Posts" },
  { k: "event", fr: "Événements", en: "Events" },
  { k: "bureau", fr: "Bureau", en: "Board" },
  { k: "health", fr: "Santé", en: "Health" },
  { k: "partner", fr: "Partenaires", en: "Partners" },
  { k: "about", fr: "À propos", en: "About" },
  { k: "background", fr: "Fonds", en: "Backgrounds" },
  { k: "general", fr: "Général", en: "General" },
];

/** Légende : où s'affiche chaque section + format conseillé */
const SECTION_GUIDE: { k: SiteImageCategory; where: string; format: string }[] = [
  { k: "hero", where: "Grand carrousel en haut de la page d'accueil (1 image à la fois, rotation auto).", format: "Paysage 1600 × 900, sujet centré." },
  { k: "banner", where: "Bandeaux de titre des pages intérieures.", format: "Panoramique 1920 × 500." },
  { k: "gallery", where: "Galerie photo (page À propos / événements).", format: "Libre, 1200 px minimum." },
  { k: "post", where: "Illustrations des publications du fil Actualités AEPHAT (carrousel).", format: "Paysage 1200 × 750." },
  { k: "event", where: "Affiches et retours d'événements.", format: "Paysage 1200 × 750." },
  { k: "bureau", where: "Trombinoscope du bureau exécutif.", format: "Carré 600 × 600 (portrait)." },
  { k: "health", where: "Illustrations des fiches Santé OMS / VIDAL.", format: "Paysage 1200 × 630." },
  { k: "partner", where: "Logos des partenaires dans le pied de page.", format: "400 × 200, fond blanc ou transparent." },
  { k: "about", where: "Visuels de la page À propos.", format: "Paysage 1200 × 800." },
  { k: "background", where: "Images de fond des sections.", format: "Grand 1920 × 1080, sujet peu contrasté." },
  { k: "general", where: "Images diverses non rattachées à une section.", format: "Libre." },
];

const UNSPLASH_PRESETS = [
  { label: "Labo pharmacie", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop" },
  { label: "Médicaments", url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1600&h=900&fit=crop" },
  { label: "Recherche", url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1600&h=900&fit=crop" },
  { label: "Santé", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&h=900&fit=crop" },
  { label: "Vaccination", url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&h=900&fit=crop" },
  { label: "Équipe médicale", url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=900&fit=crop" },
];

function seoScore(img: SiteImage): { score: number; tips: string[] } {
  let s = 0; const tips: string[] = [];
  if (img.alt?.length > 5) s += 30; else tips.push("Ajouter un texte Alt FR");
  if (img.title) s += 20; else tips.push("Ajouter un titre");
  if (img.caption) s += 20; else tips.push("Ajouter une légende");
  if ((img.tags || []).length > 0) s += 15; else tips.push("Ajouter des tags");
  if (img.credit) s += 15; else tips.push("Ajouter le crédit");
  return { score: s, tips };
}

const emptyForm = {
  url: "", alt: "", altEn: "", title: "", titleEn: "", caption: "", captionEn: "",
  credit: "", linkUrl: "", openInNewTab: true, tags: "" as string,
  category: "hero" as SiteImageCategory, isActive: true, isFeatured: false,
  visibility: "everyone" as "everyone" | "students_only",
  publishAt: "", expireAt: "", style: "rounded" as "rounded" | "circle" | "square" | "blob",
  withShadow: true, withBorder: false, focalX: 50, focalY: 50, overlayOpacity: 45,
};

export default function AdminImagesPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [editing, setEditing] = useState<SiteImage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [cat, setCat] = useState<SiteImageCategory | "all">("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive" | "featured" | "scheduled">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"order" | "recent" | "name" | "seo">("order");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<SiteImage | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [imgMeta, setImgMeta] = useState<{ w?: number; h?: number; kb?: number }>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const readOnly = isContentReadOnly();

  const reload = () => fetch("/api/site-images").then((r) => r.json()).then((d) => { setImages(d); setLoading(false); });
  useEffect(() => { reload(); }, []);

  const log = (msg: string) => setHistory((h) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...h].slice(0, 20));

  const filtered = useMemo(() => {
    let list = [...images];
    if (cat !== "all") list = list.filter((i) => i.category === cat);
    if (status === "active") list = list.filter((i) => i.isActive);
    if (status === "inactive") list = list.filter((i) => !i.isActive);
    if (status === "featured") list = list.filter((i) => i.isFeatured);
    if (status === "scheduled") list = list.filter((i) => i.publishAt || i.expireAt);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => `${i.alt} ${i.title || ""} ${i.caption || ""} ${i.credit || ""} ${(i.tags || []).join(" ")}`.toLowerCase().includes(q));
    }
    if (sort === "order") list.sort((a, b) => a.order - b.order);
    if (sort === "recent") list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "name") list.sort((a, b) => (a.alt || "").localeCompare(b.alt || ""));
    if (sort === "seo") list.sort((a, b) => seoScore(b).score - seoScore(a).score);
    return list;
  }, [images, cat, status, query, sort]);

  const totalKb = images.reduce((s, i) => s + (i.fileSizeKb || 120), 0);

  const openAdd = () => { if (readOnly) return; setEditing(null); setForm(emptyForm); setImgMeta({}); setShowForm(true); };
  const openEdit = (img: SiteImage) => {
    if (readOnly) return;
    setEditing(img);
    setForm({
      url: img.url, alt: img.alt, altEn: img.altEn || "", title: img.title || "", titleEn: img.titleEn || "",
      caption: img.caption || "", captionEn: img.captionEn || "", credit: img.credit || "",
      linkUrl: img.linkUrl || "", openInNewTab: img.openInNewTab ?? true, tags: (img.tags || []).join(", "),
      category: img.category, isActive: img.isActive, isFeatured: !!img.isFeatured,
      visibility: img.visibility || "everyone", publishAt: img.publishAt ? img.publishAt.slice(0, 16) : "",
      expireAt: img.expireAt ? img.expireAt.slice(0, 16) : "", style: img.style || "rounded",
      withShadow: img.withShadow ?? true, withBorder: !!img.withBorder,
      focalX: img.focalX ?? 50, focalY: img.focalY ?? 50, overlayOpacity: img.overlayOpacity ?? 45,
    });
    setImgMeta({ w: img.width, h: img.height, kb: img.fileSizeKb });
    setShowForm(true);
  };

  const payload = () => ({
    ...form, tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
    publishAt: form.publishAt ? new Date(form.publishAt).toISOString() : undefined,
    expireAt: form.expireAt ? new Date(form.expireAt).toISOString() : undefined,
    width: imgMeta.w, height: imgMeta.h, fileSizeKb: imgMeta.kb,
    source: editing?.source || (form.url.startsWith("data:") ? "upload" : form.url.includes("unsplash") ? "unsplash" : "url"),
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const r = await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...payload() }) });
      const u = await r.json();
      setImages((p) => p.map((x) => (x.id === editing.id ? u : x)));
      log(`Modifiée : ${u.alt}`);
    } else {
      const r = await fetch("/api/site-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload(), order: images.length + 1 }) });
      const n = await r.json();
      setImages((p) => [...p, n]);
      log(`Ajoutée : ${n.alt}`);
    }
    setShowForm(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch(`/api/site-images?id=${id}`, { method: "DELETE" });
    setImages((p) => p.filter((x) => x.id !== id));
    log("Image supprimée");
  };

  const toggle = async (img: SiteImage) => {
    const r = await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: img.id, isActive: !img.isActive }) });
    const u = await r.json();
    setImages((p) => p.map((x) => (x.id === img.id ? u : x)));
  };

  const duplicate = async (img: SiteImage) => {
    const r = await fetch("/api/site-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...img, id: undefined, alt: img.alt + " (copie)", order: images.length + 1 }) });
    const n = await r.json();
    setImages((p) => [...p, n]);
    log(`Dupliquée : ${img.alt}`);
  };

  const move = async (img: SiteImage, dir: "up" | "down") => {
    const arr = [...images].sort((a, b) => a.order - b.order);
    const i = arr.findIndex((x) => x.id === img.id);
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= arr.length) return;
    const a = arr[i], b = arr[j];
    await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, order: b.order }) });
    await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, order: a.order }) });
    setImages((p) => p.map((x) => (x.id === a.id ? { ...x, order: b.order } : x.id === b.id ? { ...x, order: a.order } : x)));
  };

  const bulk = async (action: "activate" | "deactivate" | "delete" | "feature") => {
    if (selected.length === 0) return;
    if (action === "delete" && !confirm(`Supprimer ${selected.length} images ?`)) return;
    for (const id of selected) {
      if (action === "delete") await fetch(`/api/site-images?id=${id}`, { method: "DELETE" });
      else {
        const patch = action === "activate" ? { isActive: true } : action === "deactivate" ? { isActive: false } : { isFeatured: true };
        await fetch("/api/site-images", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) });
      }
    }
    log(`Action groupée ${action} : ${selected.length} image(s)`);
    setSelected([]);
    reload();
  };

  const onFile = (f: File) => {
    const rd = new FileReader();
    rd.onload = () => {
      const url = String(rd.result);
      const im = new Image();
      im.onload = () => setImgMeta({ w: im.width, h: im.height, kb: Math.round(f.size / 1024) });
      im.src = url;
      setForm((x) => ({ ...x, url, alt: x.alt || f.name.replace(/\.[^.]+$/, "") }));
      setShowForm(true);
    };
    rd.readAsDataURL(f);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(images, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "aephat-images.json";
    a.click();
  };

  const importJSON = (f: File) => {
    const rd = new FileReader();
    rd.onload = async () => {
      try {
        const arr = JSON.parse(String(rd.result));
        for (const it of (Array.isArray(arr) ? arr : []).slice(0, 100)) {
          await fetch("/api/site-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...it, id: undefined }) });
        }
        log("Import JSON terminé");
        reload();
      } catch { alert("Fichier invalide"); }
    };
    rd.readAsText(f);
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">{t.common.loading}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <ReadOnlyBanner />
      <div className="card-soft overflow-hidden mb-5">
        <div className="mesh-bg grain p-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5AC878]">Studio photo professionnel</p>
            <h1 className="font-display text-white text-2xl sm:text-3xl font-extrabold">Gestion des images</h1>
            <p className="text-white/60 text-[13px] mt-1">{images.length} images · {(totalKb / 1024).toFixed(1)} Mo · {images.filter((i) => i.isFeatured).length} en avant</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!readOnly && (
              <>
                <button onClick={openAdd} className="btn-primary !bg-none !bg-white !text-[#0A2E18] !shadow-none text-sm"><Plus className="w-4 h-4" /> Ajouter</button>
                <button onClick={() => fileRef.current?.click()} className="btn-ghost !bg-white/10 !text-white !border-white/25 text-sm"><Upload className="w-4 h-4" /> Importer</button>
              </>
            )}
            <button onClick={exportJSON} className="btn-ghost !bg-white/10 !text-white !border-white/25 text-sm"><Download className="w-4 h-4" /> Exporter</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </div>
        </div>

        {/* Légende des sections */}
        <div className="border-t border-[#E2E8E6]">
          <button onClick={() => setShowGuide((v) => !v)} className="w-full flex items-center gap-2.5 px-5 py-3.5 text-left hover:bg-[#F2F5F3] transition-colors">
            <BookOpen className="w-4 h-4 text-[#0C6B2D] shrink-0" />
            <span className="text-[13.5px] font-extrabold text-[#101418]">Guide des sections : où s'affiche chaque catégorie d'image</span>
            <ChevronDown className={`w-4 h-4 ml-auto text-[#5A6570] transition-transform ${showGuide ? "rotate-180" : ""}`} />
          </button>
          {showGuide && (
            <div className="px-5 pb-5 grid sm:grid-cols-2 gap-2">
              {SECTION_GUIDE.map((g) => (
                <div key={g.k} className="rounded-xl border border-[#E2E8E6] bg-[#F2F5F3] p-3 flex gap-2.5">
                  <Info className="w-4 h-4 text-[#0C6B2D] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-extrabold text-[#101418]">{CATS.find((c) => c.k === g.k)?.fr}</p>
                    <p className="text-[12px] text-[#3A454E] mt-0.5">{g.where}</p>
                    <p className="text-[11.5px] text-[#5A6570] font-semibold mt-0.5">Format conseillé : {g.format}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 grid lg:grid-cols-[1fr_auto] gap-3 border-t border-[#E2E8E6]">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative min-w-[220px] flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6570]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher (titre, tag, crédit...)" className="w-full bg-[#F2F5F3] border border-[#E2E8E6] rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-[#1FA34A]" />
            </div>
            <select value={cat} onChange={(e) => setCat(e.target.value as SiteImageCategory | "all")} className="bg-white border border-[#E2E8E6] rounded-full px-3 py-2 text-[13px] font-bold">
              <option value="all">Toutes catégories</option>
              {CATS.map((c) => <option key={c.k} value={c.k}>{locale === "fr" ? c.fr : c.en}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="bg-white border border-[#E2E8E6] rounded-full px-3 py-2 text-[13px] font-bold">
              <option value="all">Tous statuts</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
              <option value="featured">En avant</option>
              <option value="scheduled">Planifiées</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="bg-white border border-[#E2E8E6] rounded-full px-3 py-2 text-[13px] font-bold">
              <option value="order">Tri : ordre</option>
              <option value="recent">Tri : récentes</option>
              <option value="name">Tri : nom</option>
              <option value="seo">Tri : score SEO</option>
            </select>
            <div className="flex bg-[#EFF3F1] rounded-full p-1">
              <button onClick={() => setView("grid")} className={`p-2 rounded-full transition-all ${view === "grid" ? "bg-[#101418] text-white" : "text-[#5A6570]"}`} aria-label="Grille"><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 rounded-full transition-all ${view === "list" ? "bg-[#101418] text-white" : "text-[#5A6570]"}`} aria-label="Liste"><List className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {!readOnly && (
              <label className="text-[12px] font-bold text-[#5A6570] cursor-pointer hover:text-[#0C6B2D]">Importer JSON <input type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} /></label>
            )}
            {!readOnly && selected.length > 0 && (
              <span className="flex gap-1.5">
                <button onClick={() => bulk("activate")} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-green-100 text-green-800 rounded-full px-3 py-1.5"><Play className="w-3 h-3" /> {selected.length}</button>
                <button onClick={() => bulk("deactivate")} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-gray-100 rounded-full px-3 py-1.5"><Pause className="w-3 h-3" /></button>
                <button onClick={() => bulk("feature")} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-gray-900 text-white rounded-full px-3 py-1.5"><Star className="w-3 h-3" /></button>
                <button onClick={() => bulk("delete")} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-red-100 text-red-700 rounded-full px-3 py-1.5"><Trash2 className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        </div>
        {!readOnly && (
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
            className={`mx-4 mb-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-center py-4 text-[13px] font-bold transition-all ${dragOver ? "border-[#1FA34A] bg-green-50 text-[#0C6B2D]" : "border-[#E2E8E6] text-[#5A6570]"}`}>
            <ImagePlus className="w-4 h-4" /> Glisser-déposer une image ici pour l'ajouter instantanément
          </div>
        )}
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img) => {
            const seo = seoScore(img);
            return (
              <div key={img.id} className={`card-soft card-hover overflow-hidden ${selected.includes(img.id) ? "!border-[#1FA34A] ring-2 ring-[#1FA34A]/20" : ""}`}>
                <div className="relative h-44 bg-[#0A2E18] cursor-pointer" onClick={() => setLightbox(img)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" style={{ objectPosition: `${img.focalX ?? 50}% ${img.focalY ?? 50}%` }} />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {img.isFeatured && <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#101418] text-white rounded-full px-2.5 py-1"><Star className="w-3 h-3" /></span>}
                    {!img.isActive && <span className="text-[11px] font-extrabold bg-black/60 text-white rounded-full px-2.5 py-1">Inactive</span>}
                    <span className="text-[11px] font-extrabold bg-black/60 text-white rounded-full px-2.5 py-1">SEO {seo.score}</span>
                  </div>
                  {!readOnly && (
                    <input type="checkbox" checked={selected.includes(img.id)} onChange={() => setSelected((s) => (s.includes(img.id) ? s.filter((x) => x !== img.id) : [...s, img.id]))} onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 w-5 h-5 accent-[#1FA34A]" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-extrabold text-[14px] truncate">{img.title || img.alt}</p>
                  <p className="text-[12px] text-[#5A6570] truncate">{CATS.find((c) => c.k === img.category)?.fr} · N°{img.order} · {(img.tags || []).slice(0, 3).join(", ")}</p>
                  {readOnly ? (
                    <p className="text-[12px] text-gray-400 mt-3">Lecture seule — modifications via le CMS</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <button onClick={() => openEdit(img)} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-[#EFF3F1] rounded-full px-3 py-1.5 hover:bg-[#101418] hover:text-white transition-all"><Pencil className="w-3 h-3" /> Modifier</button>
                      <button onClick={() => toggle(img)} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-[#EFF3F1] rounded-full px-3 py-1.5" aria-label="Activer/pause">{img.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}</button>
                      <button onClick={() => duplicate(img)} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-[#EFF3F1] rounded-full px-3 py-1.5" aria-label="Dupliquer"><Copy className="w-3 h-3" /></button>
                      <button onClick={() => move(img, "up")} className="p-1.5 text-[12px] font-extrabold bg-[#EFF3F1] rounded-full px-2.5" aria-label="Monter"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => move(img, "down")} className="p-1.5 text-[12px] font-extrabold bg-[#EFF3F1] rounded-full px-2.5" aria-label="Descendre"><ChevronDown className="w-3.5 h-3.5" /></button>
                      <button onClick={() => remove(img.id)} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-red-50 text-red-600 rounded-full px-3 py-1.5" aria-label="Supprimer"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-2.5">
          {filtered.map((img) => (
            <div key={img.id} className="card-soft p-3 flex items-center gap-3">
              {!readOnly && (
                <input type="checkbox" checked={selected.includes(img.id)} onChange={() => setSelected((s) => (s.includes(img.id) ? s.filter((x) => x !== img.id) : [...s, img.id]))} className="w-5 h-5 accent-[#1FA34A]" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-20 h-14 rounded-xl object-cover cursor-pointer" onClick={() => setLightbox(img)} />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-[13.5px] truncate">{img.title || img.alt}</p>
                <p className="text-[12px] text-[#5A6570] truncate">{img.category} · N°{img.order} · {img.isActive ? "Active" : "Inactive"} · SEO {seoScore(img).score}</p>
              </div>
              {!readOnly && (
                <>
                  <button onClick={() => openEdit(img)} className="p-2 bg-[#EFF3F1] rounded-full" aria-label="Modifier"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => duplicate(img)} className="p-2 bg-[#EFF3F1] rounded-full" aria-label="Dupliquer"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(img.id)} className="p-2 bg-red-50 text-red-600 rounded-full" aria-label="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="card-soft p-5 mt-5">
        <h3 className="font-display font-extrabold text-[15px] flex items-center gap-2"><Clock className="w-4 h-4 text-[#0C6B2D]" /> Historique de session</h3>
        <ul className="mt-2 text-[12.5px] text-[#5A6570] grid gap-1">{history.length === 0 ? <li>—</li> : history.map((h, i) => <li key={i}>· {h}</li>)}</ul>
      </div>

      {!readOnly && showForm && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl max-w-4xl mx-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="mesh-bg grain p-5 flex items-center justify-between">
              <h2 className="font-display text-white font-extrabold text-lg">{editing ? "Modifier l'image" : "Nouvelle image"}</h2>
              <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-white/15 text-white grid place-items-center" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="p-5 grid lg:grid-cols-[1fr_320px] gap-5">
              <div className="grid gap-4">
                <div>
                  <label className="text-[13px] font-extrabold">01 · URL de l'image *</label>
                  <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required placeholder="https://... ou import depuis l'appareil" className="mt-1 w-full border border-[#E2E8E6] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1FA34A]" />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {UNSPLASH_PRESETS.map((p) => (
                      <button type="button" key={p.url} onClick={() => setForm({ ...form, url: p.url, alt: form.alt || p.label })} className="text-[11.5px] font-bold bg-[#EFF3F1] rounded-full px-2.5 py-1.5 hover:bg-[#101418] hover:text-white transition-all">{p.label}</button>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="text-[13px] font-extrabold">02 · Texte Alt FR *</label><input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} required className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">03 · Texte Alt EN</label><input value={form.altEn} onChange={(e) => setForm({ ...form, altEn: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">04 · Titre FR</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">05 · Titre EN</label><input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">06 · Légende FR</label><input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">07 · Légende EN</label><input value={form.captionEn} onChange={(e) => setForm({ ...form, captionEn: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="text-[13px] font-extrabold">08 · Crédit photo</label><input value={form.credit} onChange={(e) => setForm({ ...form, credit: e.target.value })} placeholder="© AEPHAT / Nom" className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">09 · Tags (virgules)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="labo, congrès, lomé" className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">10 · Lien au clic</label><input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://..." className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">11 · Catégorie (voir guide)</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SiteImageCategory })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm">
                      {CATS.map((c) => <option key={c.k} value={c.k}>{c.fr}</option>)}
                    </select>
                  </div>
                  <div><label className="text-[13px] font-extrabold">12 · Publier le</label><input type="datetime-local" value={form.publishAt} onChange={(e) => setForm({ ...form, publishAt: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                  <div><label className="text-[13px] font-extrabold">13 · Expirer le</label><input type="datetime-local" value={form.expireAt} onChange={(e) => setForm({ ...form, expireAt: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="text-[13px] font-extrabold">14 · Style d'affichage</label>
                    <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value as typeof form.style })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm">
                      <option value="rounded">Arrondi</option><option value="circle">Cercle</option><option value="square">Carré</option><option value="blob">Organique</option>
                    </select>
                  </div>
                  <div><label className="text-[13px] font-extrabold">15 · Visibilité</label>
                    <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as typeof form.visibility })} className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm">
                      <option value="everyone">Tout le monde</option><option value="students_only">Étudiants uniquement</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-extrabold">16 · Cadrage et overlay : {form.focalX}% / {form.focalY}% · voile {form.overlayOpacity}%</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <input type="range" min={0} max={100} value={form.focalX} onChange={(e) => setForm({ ...form, focalX: +e.target.value })} aria-label="Focal X" />
                    <input type="range" min={0} max={100} value={form.focalY} onChange={(e) => setForm({ ...form, focalY: +e.target.value })} aria-label="Focal Y" />
                    <input type="range" min={0} max={90} value={form.overlayOpacity} onChange={(e) => setForm({ ...form, overlayOpacity: +e.target.value })} aria-label="Overlay" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-[13px] font-bold">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-[#1FA34A]" /> 17 · Active</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-[#101418]" /> 18 · En avant</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.withShadow} onChange={(e) => setForm({ ...form, withShadow: e.target.checked })} className="w-4 h-4 accent-[#1FA34A]" /> 19 · Ombre</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.withBorder} onChange={(e) => setForm({ ...form, withBorder: e.target.checked })} className="w-4 h-4 accent-[#1FA34A]" /> 20 · Bordure</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.openInNewTab} onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })} className="w-4 h-4 accent-[#1FA34A]" /> Nouvel onglet</label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary flex-1 justify-center">{editing ? "Enregistrer" : "Ajouter l'image"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">{t.common.cancel}</button>
                </div>
              </div>
              <div className="lg:sticky lg:top-0 self-start">
                <p className="text-[13px] font-extrabold mb-2">Aperçu en direct {imgMeta.w ? `· ${imgMeta.w}×${imgMeta.h}px · ${imgMeta.kb} Ko` : ""}</p>
                <div className={`overflow-hidden bg-[#0A2E18] ${form.style === "circle" ? "rounded-full aspect-square" : form.style === "square" ? "rounded-lg" : form.style === "blob" ? "rounded-[40%_60%_60%_40%/50%] aspect-square" : "rounded-2xl"} ${form.withShadow ? "shadow-2xl" : ""} ${form.withBorder ? "border-4 border-white" : ""}`}>
                  {form.url ? (
                    <div className="relative h-64">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.url} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${form.focalX}% ${form.focalY}%` }}
                        onLoad={(e) => { const im = e.currentTarget; setImgMeta({ w: im.naturalWidth, h: im.naturalHeight, kb: imgMeta.kb }); }} onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(7,26,16,${form.overlayOpacity / 100}), transparent 65%)` }} />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="font-extrabold text-[14px] truncate">{form.title || form.alt || "Titre..."}</p>
                        <p className="text-[12px] text-white/70 truncate">{form.caption || "Légende..."}</p>
                      </div>
                    </div>
                  ) : <div className="h-64 grid place-items-center text-white/40 text-sm">Aucune image</div>}
                </div>
                <div className="mt-3 rounded-2xl bg-[#F2F5F3] border border-[#E2E8E6] p-3 text-[12px]">
                  <p className="font-extrabold">Liste de contrôle qualité</p>
                  <ul className="mt-1.5 grid gap-1 font-semibold text-[#5A6570]">
                    <li className="flex items-center gap-1.5">{form.alt.length > 5 ? <Check className="w-3.5 h-3.5 text-[#1FA34A]" /> : <span className="w-3.5 h-3.5 rounded border border-gray-300 inline-block" />} Alt FR renseigné</li>
                    <li className="flex items-center gap-1.5">{form.title ? <Check className="w-3.5 h-3.5 text-[#1FA34A]" /> : <span className="w-3.5 h-3.5 rounded border border-gray-300 inline-block" />} Titre affiché</li>
                    <li className="flex items-center gap-1.5">{form.caption ? <Check className="w-3.5 h-3.5 text-[#1FA34A]" /> : <span className="w-3.5 h-3.5 rounded border border-gray-300 inline-block" />} Légende</li>
                    <li className="flex items-center gap-1.5">{form.tags.trim() ? <Check className="w-3.5 h-3.5 text-[#1FA34A]" /> : <span className="w-3.5 h-3.5 rounded border border-gray-300 inline-block" />} Tags</li>
                    <li className="flex items-center gap-1.5">{form.credit ? <Check className="w-3.5 h-3.5 text-[#1FA34A]" /> : <span className="w-3.5 h-3.5 rounded border border-gray-300 inline-block" />} Crédit</li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[90] bg-black/85 backdrop-blur p-4 grid place-items-center" onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.url} alt={lightbox.alt} className="w-full max-h-[75vh] object-contain rounded-2xl" />
            <div className="glass rounded-2xl mt-3 p-4 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-extrabold text-[14px]">{lightbox.title || lightbox.alt}</p><p className="text-[12px] text-[#5A6570]">{lightbox.caption} {lightbox.credit && `· © ${lightbox.credit}`}</p></div>
              <div className="flex gap-2">
                {!readOnly && (
                  <button onClick={() => { openEdit(lightbox); setLightbox(null); }} className="btn-primary !py-2 text-[13px]"><Pencil className="w-3.5 h-3.5" /> Modifier</button>
                )}
                <button onClick={() => setLightbox(null)} className="btn-ghost !py-2 text-[13px]">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
