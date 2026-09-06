"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { Poll } from "@/modules/polls/types";

export default function AdminPollsPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/polls").then((r) => r.json()).then((p) => { setPolls(p); setLoading(false); }); }, []);

  const emptyPoll: Poll = { id: "", title: "", titleEn: "", description: "", descriptionEn: "", googleFormUrl: "", resultsEmail: "", eligibility: "email_required", isActive: true, createdBy: "u1", createdAt: "" };

  const handleSave = async (poll: Poll) => {
    const method = poll.id ? "PUT" : "POST";
    const res = await fetch("/api/polls", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(poll) });
    if (res.ok) {
      const saved = await res.json();
      setPolls((prev) => poll.id ? prev.map((p) => p.id === poll.id ? saved : p) : [saved, ...prev]);
      setShowForm(false); setEditing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`/api/polls?id=${id}`, { method: "DELETE" });
    setPolls((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <p className="text-gray-500">{t.common.loading}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.polls}</h1>
        <button onClick={() => { setEditing(emptyPoll); setShowForm(true); }} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">{locale === "fr" ? "Nouveau sondage" : "New poll"}</button>
      </div>
      {showForm && editing && <PollForm poll={editing} locale={locale} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}
      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Éligibilité</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email résultats</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {polls.map((poll) => (
              <tr key={poll.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{locale === "en" && poll.titleEn ? poll.titleEn : poll.title}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">{poll.eligibility === "all" ? t.admin.all : poll.eligibility === "email_required" ? t.admin.emailRequired : t.admin.verifiedOnly}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{poll.resultsEmail || "-"}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <a href={poll.googleFormUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs font-medium">{t.admin.viewResults}</a>
                  <button onClick={() => { setEditing(poll); setShowForm(true); }} className="text-gray-600 hover:underline text-xs font-medium">{t.admin.editPost}</button>
                  <button onClick={() => handleDelete(poll.id)} className="text-red-600 hover:underline text-xs font-medium">{t.admin.deletePost}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PollForm({ poll, locale, onSave, onCancel }: { poll: Poll; locale: Locale; onSave: (p: Poll) => void; onCancel: () => void }) {
  const t = getDictionary(locale);
  const [form, setForm] = useState({ ...poll });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-lg border border-border p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.title_label}</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.titleEn_label}</label><input value={form.titleEn || ""} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.content_label}</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.googleFormUrl}</label><input value={form.googleFormUrl} onChange={(e) => setForm({ ...form, googleFormUrl: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required placeholder="https://docs.google.com/forms/..." /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.resultsEmail}</label><input type="email" value={form.resultsEmail || ""} onChange={(e) => setForm({ ...form, resultsEmail: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="email@exemple.com" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.eligibility}</label>
        <select value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value as Poll["eligibility"] })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="all">{t.admin.all}</option><option value="email_required">{t.admin.emailRequired}</option><option value="verified_only">{t.admin.verifiedOnly}</option>
        </select></div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">{t.admin.cancel}</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">{t.admin.save}</button>
      </div>
    </form>
  );
}
