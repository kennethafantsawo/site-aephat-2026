import type { ReactElement } from "react";

declare global {
  interface Window {
    CMS?: {
      registerPreviewStyle: (url: string) => void;
      registerPreviewTemplate: (name: string, comp: (props: unknown) => ReactElement | null) => void;
    };
  }
}

type Entry = {
  getIn?: (path: string[]) => { toJS?: () => unknown } | null | undefined;
};

function asArray(entry: Entry | null | undefined, key: string): Record<string, unknown>[] {
  try {
    const v = entry?.getIn?.(["data", key]);
    if (!v) return [];
    if (typeof v.toJS === "function") {
      const arr = v.toJS();
      return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
    }
    return [];
  } catch {
    return [];
  }
}

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="pv-section">
      <h2>{title}</h2>
      <p className="pv-count">
        {count} élément{count > 1 ? "s" : ""}
      </p>
      {children}
    </section>
  );
}

function statusBadge(status: unknown): { cls: string; label: string } {
  switch (status) {
    case "published": return { cls: "green", label: "Publié" };
    case "scheduled": return { cls: "amber", label: "Programmé" };
    case "archived": return { cls: "red", label: "Archivé" };
    default: return { cls: "grey", label: "Brouillon" };
  }
}

function accountBadge(status: unknown): { cls: string; label: string } {
  switch (status) {
    case "verified": return { cls: "green", label: "Vérifié" };
    case "pending": return { cls: "amber", label: "En attente" };
    case "suspended": return { cls: "red", label: "Suspendu" };
    case "refused": return { cls: "red", label: "Refusé" };
    default: return { cls: "grey", label: String(status ?? "") };
  }
}

/** Aperçu du fichier "donnees" : chaque liste rendue comme sur le site. */
function DonneesPreview({ entry }: { entry: Entry }) {
  const posts = asArray(entry, "posts");
  const health = asArray(entry, "health");
  const bureau = asArray(entry, "bureau");
  const siteImages = asArray(entry, "siteImages");
  const polls = asArray(entry, "polls");
  const users = asArray(entry, "users");
  const comments = asArray(entry, "comments");

  return (
    <div className="pv-wrap">
      <div className="pv-header">
        <img src="/brand/aez.png" alt="AEPHAT" />
        <div>
          <h1>Aperçu du contenu AEPHAT</h1>
          <p>Rendu fidèle au site public — Lomé, Togo</p>
        </div>
      </div>

      <Section title="Publications" count={posts.length}>
        {posts.length === 0 ? (
          <p className="pv-empty">Aucune publication.</p>
        ) : (
          <div className="pv-grid">
            {posts.slice(0, 12).map((p, i) => {
              const b = statusBadge(p.status);
              return (
                <article className="pv-card" key={str(p.id, String(i))}>
                  {str(p.imageUrl) && <img className="pv-thumb" src={str(p.imageUrl)} alt="" />}
                  <span className={`pv-badge ${b.cls}`}>{b.label}</span>
                  <h3>{str(p.title, "(Sans titre)")}</h3>
                  <p>{str(p.excerpt)}</p>
                  <p className="pv-meta">
                    {str(p.authorName)} · {str(p.category)} · {str(p.createdAt).slice(0, 10)}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Veille santé (OMS / VIDAL)" count={health.length}>
        {health.length === 0 ? (
          <p className="pv-empty">Aucune fiche santé.</p>
        ) : (
          <div className="pv-grid">
            {health.slice(0, 12).map((h, i) => (
              <article className="pv-card" key={str(h.id, String(i))}>
                {str(h.imageUrl) && <img className="pv-thumb" src={str(h.imageUrl)} alt="" />}
                <span className={`pv-badge ${String(h.sourceType).includes("VIDAL") ? "dark" : "green"}`}>
                  {str(h.sourceName, "Source")}
                </span>{" "}
                {h.isApproved ? (
                  <span className="pv-badge green">Approuvé</span>
                ) : (
                  <span className="pv-badge amber">À valider</span>
                )}
                <h3>{str(h.title, "(Sans titre)")}</h3>
                <p>{str(h.summary)}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section title="Bureau exécutif" count={bureau.length}>
        {bureau.length === 0 ? (
          <p className="pv-empty">Aucun membre.</p>
        ) : (
          <div className="pv-grid">
            {bureau.map((m, i) => (
              <article className="pv-card" key={str(m.id, String(i))}>
                <div className="pv-row">
                  {str(m.imageUrl) && <img className="pv-avatar" src={str(m.imageUrl)} alt="" />}
                  <div>
                    <h3 style={{ margin: 0 }}>{str(m.name)}</h3>
                    <p>{str(m.role)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section title="Images du site" count={siteImages.length}>
        {siteImages.length === 0 ? (
          <p className="pv-empty">Aucune image.</p>
        ) : (
          <div className="pv-grid">
            {siteImages.slice(0, 12).map((im, i) => (
              <article className="pv-card" key={str(im.id, String(i))}>
                {str(im.url) && <img className="pv-thumb" src={str(im.url)} alt={str(im.alt)} />}
                <h3>{str(im.title) || str(im.alt, "(Sans texte)")}</h3>
                <p className="pv-meta">
                  {str(im.category)} · {im.isActive ? "Active" : "Inactive"}
                  {im.isFeatured ? " · En avant" : ""}
                </p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section title="Sondages" count={polls.length}>
        {polls.length === 0 ? (
          <p className="pv-empty">Aucun sondage.</p>
        ) : (
          <div className="pv-grid">
            {polls.map((s, i) => (
              <article className="pv-card" key={str(s.id, String(i))}>
                <span className={`pv-badge ${s.isActive ? "green" : "grey"}`}>
                  {s.isActive ? "Actif" : "Inactif"}
                </span>
                <h3>{str(s.title, "(Sans titre)")}</h3>
                <p>{str(s.description)}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section title="Membres" count={users.length}>
        {users.length === 0 ? (
          <p className="pv-empty">Aucun membre.</p>
        ) : (
          <div className="pv-grid">
            {users.slice(0, 12).map((u, i) => {
              const b = accountBadge(u.status);
              return (
                <article className="pv-card" key={str(u.id, String(i))}>
                  <span className={`pv-badge ${b.cls}`}>{b.label}</span>
                  <h3>{str(u.name)}</h3>
                  <p>
                    {str(u.email)} · {str(u.profileType)}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Commentaires" count={comments.length}>
        {comments.length === 0 ? (
          <p className="pv-empty">Aucun commentaire.</p>
        ) : (
          <div className="pv-grid">
            {comments.slice(0, 12).map((c, i) => (
              <article className="pv-card" key={str(c.id, String(i))}>
                <span className={`pv-badge ${c.isApproved ? "green" : "amber"}`}>
                  {c.isApproved ? "Approuvé" : "En attente"}
                </span>
                <h3>{str(c.authorName)}</h3>
                <p>{str(c.content)}</p>
              </article>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

/** Enregistre l'habillage AEPHAT auprès de Decap (appel après chargement du CDN). */
export function setupDecapCms(): void {
  const cms = window.CMS;
  if (!cms) return;
  cms.registerPreviewStyle("/admin/preview.css");
  cms.registerPreviewTemplate("donnees", (props: unknown) =>
    DonneesPreview(props as { entry: Entry })
  );
}
