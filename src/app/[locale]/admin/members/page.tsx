"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";
import type { User } from "@/modules/content/types";

export default function AdminMembersPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/members").then((r) => r.json()).then((u) => { setUsers(u); setLoading(false); });
  }, []);

  const handleStatus = async (user: User, status: User["status"]) => {
    const res = await fetch("/api/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, status }),
    });
    if (res.ok) setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status } : u));
  };

  const filtered = filter === "all" ? users : users.filter((u) => u.status === filter);

  const statusColors: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-orange-100 text-orange-700",
  };

  const statusLabels: Record<string, Record<string, string>> = {
    approved: { fr: "Approuvé", en: "Approved" },
    pending: { fr: "En attente", en: "Pending" },
    rejected: { fr: "Refusé", en: "Rejected" },
    suspended: { fr: "Suspendu", en: "Suspended" },
  };

  if (loading) return <p className="text-gray-500">{t.common.loading}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.admin.members}</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          {locale === "fr" ? "Tous" : "All"} ({users.length})
        </button>
        <button onClick={() => setFilter("pending")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          {locale === "fr" ? "En attente" : "Pending"} ({users.filter((u) => u.status === "pending").length})
        </button>
        <button onClick={() => setFilter("approved")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === "approved" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          {locale === "fr" ? "Approuvés" : "Approved"} ({users.filter((u) => u.status === "approved").length})
        </button>
        <button onClick={() => setFilter("suspended")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === "suspended" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          {locale === "fr" ? "Suspendus" : "Suspended"} ({users.filter((u) => u.status === "suspended").length})
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{locale === "fr" ? "Membre" : "Member"}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">E-mail</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{locale === "fr" ? "Rôle" : "Role"}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{locale === "fr" ? "Carte étudiant" : "Student card"}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{locale === "fr" ? "Statut" : "Status"}</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">{locale === "fr" ? "Actions" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  {user.phone && <div className="text-xs text-gray-400">{user.phone}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-gray-600 text-sm capitalize">{user.role || user.profileType}</td>
                <td className="px-4 py-3">
                  {user.studentCardPhoto ? (
                    <a href={user.studentCardPhoto} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                      {locale === "fr" ? "Voir la carte" : "View card"}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[user.status]?.[locale] || user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {user.status === "pending" && (
                    <>
                      <button onClick={() => handleStatus(user, "approved")} className="text-green-600 hover:underline text-xs font-medium">
                        {t.admin.approve}
                      </button>
                      <button onClick={() => handleStatus(user, "rejected")} className="text-red-600 hover:underline text-xs font-medium">
                        {t.admin.reject}
                      </button>
                    </>
                  )}
                  {user.status === "approved" && (
                    <button onClick={() => handleStatus(user, "suspended")} className="text-orange-600 hover:underline text-xs font-medium">
                      {locale === "fr" ? "Suspendre" : "Suspend"}
                    </button>
                  )}
                  {user.status === "suspended" && (
                    <button onClick={() => handleStatus(user, "approved")} className="text-green-600 hover:underline text-xs font-medium">
                      {locale === "fr" ? "Réautoriser" : "Re-authorize"}
                    </button>
                  )}
                  {user.status === "rejected" && (
                    <button onClick={() => handleStatus(user, "approved")} className="text-green-600 hover:underline text-xs font-medium">
                      {locale === "fr" ? "Approuver" : "Approve"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
