"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { HealthSource } from "@/modules/content/types";

export default function AdminHealthPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [items, setItems] = useState<HealthSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => { fetch("/api/health").then((r) => r.json()).then((h) => { setItems(h); setLoading(false); }); }, []);

  const handleImport = async () => {
    setImporting(true);
    const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "import_feeds", importedBy: "u1" }) });
    if (res.ok) {
      const { imported } = await res.json();
      const updated = await fetch("/api/health").then((r) => r.json());
      setItems(updated);
      alert(imported > 0 ? `${imported} article(s) importé(s)` : "Aucun nouvel article");
    }
    setImporting(false);
  };

  const handleApprove = async (item: HealthSource) => {
    const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve", id: item.id }) });
    if (res.ok) setItems((prev) => prev.map((h) => h.id === item.id ? { ...h, isApproved: true } : h));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
    if (res.ok) setItems((prev) => prev.filter((h) => h.id !== id));
  };

  if (loading) return <p className="text-gray-500">{t.common.loading}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.health}</h1>
        <button onClick={handleImport} disabled={importing} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
          {importing ? t.admin.importing : t.admin.importFeeds}
        </button>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{locale === "en" && item.titleEn ? item.titleEn : item.title}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{item.sourceName}</span></td>
                <td className="px-4 py-3 text-gray-500">{new Date(item.publishedDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{item.isApproved ? t.admin.posted : t.admin.pendingReview}</span></td>
                <td className="px-4 py-3 text-right space-x-2">
                  {!item.isApproved && <button onClick={() => handleApprove(item)} className="text-green-600 hover:underline text-xs font-medium">{t.admin.approve}</button>}
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs font-medium">Source</a>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs font-medium">{t.admin.deletePost}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
