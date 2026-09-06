"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale, getDictionary } from "@/lib/i18n";

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const locale: Locale = (pathname.split("/")[1] as Locale) || "fr";
  const t = getDictionary(locale);
  const [stats, setStats] = useState({ posts: 0, polls: 0, members: 0, comments: 0, health: 0 });
  const [pending, setPending] = useState({ members: 0, comments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then((r) => r.json()),
      fetch("/api/polls").then((r) => r.json()),
      fetch("/api/members").then((r) => r.json()),
      fetch("/api/comments").then((r) => r.json()),
      fetch("/api/health").then((r) => r.json()),
    ]).then(([posts, polls, members, comments, health]) => {
      setStats({ posts: posts.length, polls: polls.length, members: members.length, comments: comments.length, health: health.length });
      setPending({ members: members.filter((m: { status: string }) => m.status === "pending").length, comments: comments.filter((c: { isApproved: boolean }) => !c.isApproved).length });
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-muted-foreground">{t.common.loading}</p>;

  const cards = [
    { label: t.admin.posts, value: stats.posts, color: "bg-accent/10 text-accent" },
    { label: t.admin.polls, value: stats.polls, color: "bg-primary/10 text-primary" },
    { label: t.admin.members, value: stats.members, color: "bg-secondary/10 text-secondary" },
    { label: t.admin.comments, value: stats.comments, color: "bg-muted text-muted-foreground" },
    { label: t.admin.health, value: stats.health, color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">{t.admin.dashboard}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`border border-border rounded-lg p-4 ${card.color}`}>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm opacity-80">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-lg p-5">
          <h2 className="font-semibold text-foreground mb-3">
            {locale === "fr" ? "Membres en attente" : "Pending members"} ({pending.members})
          </h2>
          {pending.members === 0 ? (
            <p className="text-sm text-muted-foreground">{locale === "fr" ? "Aucun" : "None"}</p>
          ) : (
            <p className="text-sm text-primary font-medium">
              {pending.members} {locale === "fr" ? "en attente de validation" : "awaiting approval"}
            </p>
          )}
        </div>
        <div className="bg-white border border-border rounded-lg p-5">
          <h2 className="font-semibold text-foreground mb-3">
            {locale === "fr" ? "Commentaires en attente" : "Pending comments"} ({pending.comments})
          </h2>
          {pending.comments === 0 ? (
            <p className="text-sm text-muted-foreground">{locale === "fr" ? "Aucun" : "None"}</p>
          ) : (
            <p className="text-sm text-primary font-medium">
              {pending.comments} {locale === "fr" ? "à modérer" : "to moderate"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
