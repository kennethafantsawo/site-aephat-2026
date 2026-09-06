import { NextResponse } from "next/server";
import { getData, saveData, generateId } from "@/lib/store";

const RSS_FEEDS = [
  { url: "https://www.who.int/fr/rss-feeds/news-english.xml", name: "OMS" },
  { url: "https://www.who.int/rss-feeds/disease-outbreak-news.xml", name: "OMS - Outbreaks" },
  { url: "https://www.vidal.fr/rss/sante.xml", name: "Vidal" },
];

async function fetchRSS(url: string): Promise<{ title: string; summary: string; link: string; date: string }[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const text = await res.text();
    const items: { title: string; summary: string; link: string; date: string }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      const itemXml = match[1];
      const title = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() || "";
      const description = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1]?.trim() || "";
      const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1]?.trim() || "";
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || "";
      const cleanSummary = description.replace(/<[^>]+>/g, "").trim().slice(0, 500);
      const cleanTitle = title.replace(/<[^>]+>/g, "").trim();
      if (cleanTitle && cleanSummary) {
        items.push({ title: cleanTitle, summary: cleanSummary, link, date: pubDate });
      }
    }
    return items.slice(0, 10);
  } catch {
    return [];
  }
}

export async function GET() {
  const data = getData();
  return NextResponse.json(data.health);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "import_feeds") {
    const data = getData();
    let imported = 0;
    for (const feed of RSS_FEEDS) {
      const items = await fetchRSS(feed.url);
      for (const item of items) {
        const exists = data.health.some((h) => h.sourceUrl === item.link);
        if (!exists) {
          data.health.unshift({
            id: generateId("h"),
            title: item.title,
            summary: item.summary,
            sourceUrl: item.link,
            sourceName: feed.name,
            publishedDate: item.date ? new Date(item.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            language: "fr",
            importedBy: body.importedBy || "u1",
            isApproved: false,
            createdAt: new Date().toISOString(),
          });
          imported++;
        }
      }
    }
    saveData(data);
    return NextResponse.json({ imported, total: data.health.length });
  }

  if (body.action === "approve") {
    const data = getData();
    const idx = data.health.findIndex((h) => h.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data.health[idx].isApproved = true;
    saveData(data);
    return NextResponse.json(data.health[idx]);
  }

  if (body.action === "delete") {
    const data = getData();
    data.health = data.health.filter((h) => h.id !== body.id);
    saveData(data);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
