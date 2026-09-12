import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";
import type { HealthSourceName, HealthCategory } from "@/modules/content/types";

const RSS_FEEDS = [
  { url: "https://www.who.int/fr/rss-feeds/news-english.xml", name: "OMS" },
  { url: "https://www.who.int/rss-feeds/disease-outbreak-news.xml", name: "OMS - Outbreaks" },
  { url: "https://www.vidal.fr/rss/sante.xml", name: "VIDAL" },
];

/** Catalogue officiel OMS + VIDAL à importer en 1 clic (scraping ciblé) */
export const HEALTH_CATALOG: { title: string; url: string; sourceName: string; sourceType: HealthSourceName; category: HealthCategory; summary: string }[] = [
  { title: "Paludisme — Aide-mémoire OMS", url: "https://www.who.int/fr/news-room/fact-sheets/detail/malaria", sourceName: "OMS", sourceType: "OMS", category: "prevention", summary: "Symptômes, prévention (moustiquaires imprégnées), diagnostic et traitement du paludisme. Prioritaire au Togo." },
  { title: "Résistance aux antimicrobiens — OMS", url: "https://www.who.int/fr/news-room/fact-sheets/detail/antimicrobial-resistance", sourceName: "OMS", sourceType: "OMS", category: "pharmacovigilance", summary: "Bon usage des antibiotiques : prescription, observance, risques de l'automédication." },
  { title: "Vaccination — Programme élargi OMS", url: "https://www.who.int/fr/health-topics/vaccines-and-immunization", sourceName: "OMS", sourceType: "OMS", category: "vaccination", summary: "Calendriers vaccinaux, efficacité et sécurité des vaccins." },
  { title: "Santé mentale — OMS", url: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response", sourceName: "OMS", sourceType: "OMS", category: "prevention", summary: "Repères OMS pour étudiants : stress, sommeil, signaux d'alerte et recours." },
  { title: "Maladies tropicales négligées — OMS", url: "https://www.who.int/fr/health-topics/neglected-tropical-diseases", sourceName: "OMS", sourceType: "OMS", category: "alerte", summary: "Surveillance et prévention des MTN en Afrique de l'Ouest." },
  { title: "VIDAL — Actualités santé & médicaments", url: "https://www.vidal.fr/actualites.html", sourceName: "VIDAL", sourceType: "VIDAL", category: "medicament", summary: "Alertes, retraits de lots, nouvelles AMM et bon usage des médicaments (source VIDAL)." },
  { title: "VIDAL — Fiches médicaments", url: "https://www.vidal.fr/medicaments.html", sourceName: "VIDAL", sourceType: "VIDAL", category: "medicament", summary: "Posologies, interactions, contre-indications : toujours vérifier la fiche VIDAL officielle." },
  { title: "VIDAL — Vaccins", url: "https://www.vidal.fr/medicaments/vaccins.html", sourceName: "VIDAL", sourceType: "VIDAL", category: "vaccination", summary: "Fiches vaccins VIDAL : composition, schéma, conservation." },
];

function decodeEntities(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

async function fetchRSS(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 }, headers: { "User-Agent": "AEPHAT-HealthBot/1.0" } });
    if (!res.ok) return [];
    const text = await res.text();
    const items: { title: string; summary: string; link: string; date: string }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      const xml = match[1];
      const rawTitle = xml.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() || "";
      const rawDesc = xml.match(/<(description|content:encoded)[^>]*>([\s\S]*?)<\/(description|content:encoded)>/)?.[2]?.trim() || "";
      const link = (xml.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1]?.trim() || "").replace(/<!\[CDATA\[|\]\]>/g, "");
      const pubDate = xml.match(/<(pubDate|dc:date|updated)[^>]*>([\s\S]*?)<\/(pubDate|dc:date|updated)>/)?.[2]?.trim() || "";
      const title = decodeEntities(rawTitle.replace(/<[^>]+>/g, "").replace(/<!\[CDATA\[|\]\]>/g, "").trim());
      const summary = decodeEntities(rawDesc.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).slice(0, 600);
      if (title && summary) items.push({ title, summary, link, date: pubDate });
    }
    return items.slice(0, 12);
  } catch { return []; }
}

/** Scraping ciblé d'une page OMS/VIDAL : title + meta description + og:image */
async function scrapeUrl(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (AEPHAT-HealthBot)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const pick = (re: RegExp) => decodeEntities((html.match(re)?.[1] || "").replace(/\s+/g, " ").trim()).slice(0, 300);
  const title = pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || pick(/<title[^>]*>([^<]+)<\/title>/i) || url;
  const summary = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || "";
  const image = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";
  return { title, summary: summary || "Fiche officielle — consulter la source pour le contenu complet et vérifié.", imageUrl: image };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("catalog") === "1") return NextResponse.json(HEALTH_CATALOG);
  const data = getData();
  return NextResponse.json(data.health);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = getData();

  if (body.action === "import_feeds") {
    let imported = 0;
    for (const feed of RSS_FEEDS) {
      const items = await fetchRSS(feed.url);
      for (const item of items) {
        if (data.health.some((h) => h.sourceUrl === item.link)) continue;
        data.health.unshift({
          id: generateId("h"),
          title: item.title,
          summary: item.summary,
          sourceUrl: item.link,
          sourceName: feed.name,
          sourceType: feed.name.includes("VIDAL") ? "VIDAL" : "OMS",
          category: feed.name.includes("Outbreak") ? "alerte" : "prevention",
          readTimeMinutes: Math.max(2, Math.round(item.summary.length / 900)),
          publishedDate: item.date ? new Date(item.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          language: "fr",
          importedBy: body.importedBy || "u1",
          importMode: "rss",
          isApproved: false,
          createdAt: new Date().toISOString(),
        });
        imported++;
      }
    }
    saveData(data);
    return NextResponse.json({ imported, total: data.health.length });
  }

  if (body.action === "import_catalog") {
    const urls: string[] = body.urls || HEALTH_CATALOG.map((c) => c.url);
    let imported = 0;
    for (const url of urls) {
      if (data.health.some((h) => h.sourceUrl === url)) continue;
      const ref = HEALTH_CATALOG.find((c) => c.url === url);
      try {
        const s = await scrapeUrl(url);
        data.health.unshift({
          id: generateId("h"),
          title: ref?.title || s.title,
          summary: s.summary || ref?.summary || "",
          imageUrl: s.imageUrl || undefined,
          sourceUrl: url,
          sourceName: ref?.sourceName || (url.includes("vidal") ? "VIDAL" : "OMS"),
          sourceType: ref?.sourceType || (url.includes("vidal") ? "VIDAL" : "OMS"),
          category: ref?.category || "prevention",
          readTimeMinutes: 4,
          publishedDate: new Date().toISOString().split("T")[0],
          language: "fr",
          importedBy: body.importedBy || "u1",
          importMode: "catalog",
          isApproved: false,
          createdAt: new Date().toISOString(),
        });
        imported++;
      } catch { /* on garde la fiche catalogue même si le scraping échoue */ 
        if (ref) {
          data.health.unshift({
            id: generateId("h"), title: ref.title, summary: ref.summary, sourceUrl: url,
            sourceName: ref.sourceName, sourceType: ref.sourceType, category: ref.category,
            readTimeMinutes: 3, publishedDate: new Date().toISOString().split("T")[0],
            language: "fr", importedBy: body.importedBy || "u1", importMode: "catalog",
            isApproved: false, createdAt: new Date().toISOString(),
          });
          imported++;
        }
      }
    }
    saveData(data);
    return NextResponse.json({ imported, total: data.health.length });
  }

  if (body.action === "scrape_url") {
    const url = String(body.url || "").trim();
    if (!/^https?:\/\//.test(url)) return NextResponse.json({ error: "URL invalide" }, { status: 400 });
    try {
      const s = await scrapeUrl(url);
      return NextResponse.json({ ok: true, preview: { ...s, sourceUrl: url, sourceName: url.includes("vidal") ? "VIDAL" : url.includes("who.int") ? "OMS" : "Source officielle" } });
    } catch (e) {
      return NextResponse.json({ error: "Scraping impossible (site protégé). Copiez le titre et le résumé manuellement." }, { status: 502 });
    }
  }

  if (body.action === "create") {
    const h = {
      id: generateId("h"),
      title: body.title || "Sans titre",
      titleEn: body.titleEn || "",
      summary: body.summary || "",
      summaryEn: body.summaryEn || "",
      content: body.content || "",
      sourceUrl: body.sourceUrl || "",
      sourceName: body.sourceName || "OMS",
      sourceType: (body.sourceType || "OMS") as HealthSourceName,
      category: (body.category || "prevention") as HealthCategory,
      imageUrl: body.imageUrl || undefined,
      readTimeMinutes: body.readTimeMinutes || 3,
      publishedDate: body.publishedDate || new Date().toISOString().split("T")[0],
      language: body.language || "fr",
      importedBy: body.importedBy || "u1",
      importMode: body.importMode || "manual",
      isApproved: body.isApproved ?? false,
      createdAt: new Date().toISOString(),
    };
    data.health.unshift(h);
    saveData(data);
    return NextResponse.json(h, { status: 201 });
  }

  if (body.action === "approve") {
    const idx = data.health.findIndex((h) => h.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data.health[idx].isApproved = true;
    saveData(data);
    return NextResponse.json(data.health[idx]);
  }

  if (body.action === "delete") {
    data.health = data.health.filter((h) => h.id !== body.id);
    saveData(data);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
