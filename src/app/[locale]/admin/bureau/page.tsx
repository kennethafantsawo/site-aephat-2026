"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { BureauMember } from "@/modules/content/types";

export default function AdminBureauPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [members, setMembers] = useState<BureauMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BureauMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/bureau").then((r) => r.json()).then((m) => { setMembers(m); setLoading(false); }); }, []);

  const emptyMember: BureauMember = { id: "", name: "", role: "", roleEn: "", email: "", phone: "", order: members.length + 1 };

  const handleSave = async (member: BureauMember) => {
    const method = member.id ? "PUT" : "POST";
    const res = await fetch("/api/bureau", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(member) });
    if (res.ok) {
      const saved = await res.json();
      setMembers((prev) => member.id ? prev.map((m) => m.id === member.id ? saved : m) : [...prev, saved].sort((a, b) => a.order - b.order));
      setShowForm(false); setEditing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`/api/bureau?id=${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  if (loading) return <p className="text-gray-500">{t.common.loading}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.bureau}</h1>
        <button onClick={() => { setEditing(emptyMember); setShowForm(true); }} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">{t.admin.addMember}</button>
      </div>
      {showForm && editing && <BureauForm member={editing} locale={locale} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg border border-border p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{locale === "en" && member.roleEn ? member.roleEn : member.role}</p>
                {member.email && <p className="text-sm text-gray-500 mt-1">{member.email}</p>}
                {member.phone && <p className="text-sm text-gray-500">{member.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(member); setShowForm(true); }} className="text-primary text-xs hover:underline">{t.admin.editMember}</button>
                <button onClick={() => handleDelete(member.id)} className="text-red-600 text-xs hover:underline">{t.admin.deleteMember}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BureauForm({ member, locale, onSave, onCancel }: { member: BureauMember; locale: Locale; onSave: (m: BureauMember) => void; onCancel: () => void }) {
  const t = getDictionary(locale);
  const [form, setForm] = useState({ ...member });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-lg border border-border p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.name_label}</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.role_label}</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.roleEn_label}</label><input value={form.roleEn || ""} onChange={(e) => setForm({ ...form, roleEn: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.email_label}</label><input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.phone_label}</label><input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">{t.admin.cancel}</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">{t.admin.save}</button>
      </div>
    </form>
  );
}
