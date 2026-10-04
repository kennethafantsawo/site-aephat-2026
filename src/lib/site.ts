/**
 * Régime d'édition du site.
 *
 * - Développement (`npm run dev`) : écriture libre, le JSON est modifiable.
 * - Production (Netlify, serverless) : le système de fichiers est éphémère,
 *   les écritures JSON seraient perdues. Le contenu durable se modifie donc
 *   via Decap CMS (/admin), qui commite sur GitHub.
 *
 * `process.env.NODE_ENV` est substitué au build côté client et évalué au
 * runtime côté serveur : ce module fonctionne des deux côtés sans
 * import serveur (pas de `next/server` ici, importable par les composants).
 */

export const CMS_URL = "/admin";

/** Vrai quand les écritures JSON ne persisteraient pas (production). */
export function isContentReadOnly(): boolean {
  return process.env.NODE_ENV === "production";
}

export const READ_ONLY_ERROR =
  "Modifications désactivées en production : le contenu durable se modifie via le CMS (/admin), chaque publication est versionnée sur GitHub.";
