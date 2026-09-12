import type { Post, HealthSource, BureauMember, SiteImage } from "@/modules/content/types";
import type { Poll } from "@/modules/polls/types";
import type { Comment } from "@/modules/moderation/types";
import type { User } from "@/modules/identity/types";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "src/lib/data-store.json");

interface DataStore {
  users: User[];
  posts: Post[];
  health: HealthSource[];
  polls: Poll[];
  comments: Comment[];
  bureau: BureauMember[];
  siteImages: SiteImage[];
}

const DEFAULT_DATA: DataStore = {
  users: [
    { id: "u1", name: "Admin Président", email: "president@aephat.tg", profileType: "student_pharma", status: "verified", role: "president", createdAt: "2025-09-01T10:00:00Z" },
    { id: "u2", name: "Vice-Président", email: "vp@aephat.tg", profileType: "student_pharma", status: "verified", role: "vice_president", createdAt: "2025-09-01T10:00:00Z" },
    { id: "u3", name: "Resp. Média", email: "media@aephat.tg", profileType: "student_pharma", status: "verified", role: "media_manager", createdAt: "2025-09-01T10:00:00Z" },
    { id: "u4", name: "Jean Dupont", email: "jean@example.com", profileType: "citizen", status: "pending", createdAt: "2026-01-15T14:30:00Z" },
  ],
  posts: [
    {
      id: "p1", title: "Journée de sensibilisation sur l'hygiène des mains", titleEn: "Hand hygiene awareness day",
      content: "L'AEPHAT a organisé une journée de sensibilisation à l'École de Pharmacie de Lomé. Les étudiants ont appris les bonnes pratiques d'hygiène des mains auprès des professeurs et des professionnels de santé.",
      contentEn: "AEPHAT organized an awareness day at the Lomé School of Pharmacy. Students learned proper hand hygiene practices from professors and health professionals.",
      excerpt: "Sensibilisation à l'hygiène des mains à l'École de Pharmacie de Lomé.",
      excerptEn: "Hand hygiene awareness at Lomé School of Pharmacy.",
      imageUrl: "/brand/aez.png", status: "published", authorId: "u1", isDemo: true, likes: 12, commentCount: 3,
      createdAt: "2026-08-20T09:00:00Z", updatedAt: "2026-08-20T09:00:00Z",
    },
    {
      id: "p2", title: "Colloque national sur la pharmacie au Togo", titleEn: "National symposium on pharmacy in Togo",
      content: "Un colloque réunissant étudiants et professionnels de la pharmacie s'est tenu à Lomé pour discuter des défis et des opportunités du secteur pharmaceutique au Togo.",
      contentEn: "A symposium bringing together students and pharmacy professionals was held in Lomé to discuss challenges and opportunities in the Togolese pharmaceutical sector.",
      excerpt: "Colloque réunissant étudiants et professionnels de la pharmacie.",
      excerptEn: "Symposium bringing together students and pharmacy professionals.",
      status: "published", authorId: "u2", isDemo: true, likes: 8, commentCount: 1,
      createdAt: "2026-07-15T14:00:00Z", updatedAt: "2026-07-15T14:00:00Z",
    },
    {
      id: "p3", title: "Campagne de vaccination antigrippale", titleEn: "Flu vaccination campaign",
      content: "L'AEPHAT participe à la campagne de vaccination antigrippale organisée par le ministère de la Santé. Des bénévoles de l'association sont présents dans les centres de santé de Lomé.",
      contentEn: "AEPHAT participates in the flu vaccination campaign organized by the Ministry of Health. Association volunteers are present in Lomé health centers.",
      excerpt: "Participation à la campagne de vaccination du ministère de la Santé.",
      excerptEn: "Participation in the Ministry of Health vaccination campaign.",
      imageUrl: "/brand/aez.png", status: "published", authorId: "u3", isDemo: true, likes: 15, commentCount: 5, pollId: "poll1",
      createdAt: "2026-06-10T08:00:00Z", updatedAt: "2026-06-10T08:00:00Z",
    },
  ],
  health: [
    { id: "h1", title: "Paludisme : les bonnes pratiques de prévention", titleEn: "Malaria: good prevention practices", summary: "Le paludisme reste une menace majeure au Togo. Utilisez des moustiquaires imprégnées, éliminez les eaux stagnantes et consultez rapidement en cas de fièvre.", summaryEn: "Malaria remains a major threat in Togo. Use treated bed nets, eliminate standing water, and seek medical care quickly in case of fever.", sourceUrl: "https://www.who.int/fr/news-room/fact-sheets/detail/malaria", sourceName: "OMS", publishedDate: "2026-03-15", language: "fr", importedBy: "u3", isApproved: true, createdAt: "2026-03-20T10:00:00Z" },
    { id: "h2", title: "Antibiorésistance : agir ensemble", titleEn: "Antibiotic resistance: acting together", summary: "La résistance aux antibiotiques est un problème mondial. N'utilisez les antibiotiques que sur prescription médicale et terminez toujours le traitement prescrit.", summaryEn: "Antibiotic resistance is a global problem. Only use antibiotics on medical prescription and always complete the prescribed treatment.", sourceUrl: "https://www.who.int/fr/news-room/fact-sheets/detail/antibiotic-resistance", sourceName: "OMS", publishedDate: "2026-02-10", language: "fr", importedBy: "u1", isApproved: true, createdAt: "2026-02-15T10:00:00Z" },
    { id: "h3", title: "Santé mentale des étudiants", titleEn: "Student mental health", summary: "Les étudiants en pharmacie font face à une pression intense. Il est essentiel de prendre soin de sa santé mentale.", summaryEn: "Pharmacy students face intense pressure. It is essential to take care of your mental health.", sourceUrl: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response", sourceName: "OMS", publishedDate: "2026-01-20", language: "fr", importedBy: "u2", isApproved: true, createdAt: "2026-01-25T10:00:00Z" },
  ],
  polls: [
    { id: "poll1", title: "Prochain événement AEPHAT", titleEn: "Next AEPHAT event", description: "Quel type d'événement souhaiteriez-vous ?", descriptionEn: "What type of event would you like?", googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd/example1/viewform", resultsEmail: "president@aephat.tg", eligibility: "email_required", isActive: true, createdBy: "u1", createdAt: "2026-08-25T10:00:00Z" },
    { id: "poll2", title: "Sujets de santé prioritaires", titleEn: "Priority health topics", description: "Quels sujets de santé souhaitez-vous que l'AEPHAT aborde ?", descriptionEn: "Which health topics should AEPHAT address?", googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd/example2/viewform", resultsEmail: "president@aephat.tg", eligibility: "verified_only", isActive: true, createdBy: "u1", createdAt: "2026-08-01T10:00:00Z" },
  ],
  comments: [
    { id: "c1", postId: "p1", authorName: "Marie K.", authorEmail: "marie@example.com", content: "Très bonne initiative ! J'aurais aimé participer.", isApproved: true, createdAt: "2026-08-21T12:00:00Z" },
    { id: "c2", postId: "p1", authorName: "Paul A.", authorEmail: "paul@example.com", content: "Merci pour cette action importante.", isApproved: false, createdAt: "2026-08-22T14:00:00Z" },
  ],
  bureau: [
    { id: "b1", name: "Kossi Agbeko", role: "Président", roleEn: "President", email: "president@aephat.tg", phone: "+228 90 12 34 56", order: 1 },
    { id: "b2", name: "Amina Djabatey", role: "Vice-Présidente", roleEn: "Vice-President", email: "vp@aephat.tg", phone: "+228 91 23 45 67", order: 2 },
    { id: "b3", name: "David Lawson", role: "Resp. Média & Communication", roleEn: "Media & Communication Manager", email: "media@aephat.tg", phone: "+228 92 34 56 78", order: 3 },
    { id: "b4", name: "Sophie Amega", role: "Secrétaire Générale", roleEn: "Secretary General", email: "secretary@aephat.tg", phone: "+228 93 45 67 89", order: 4 },
    { id: "b5", name: "Marc Tchagou", role: "Trésorier", roleEn: "Treasurer", email: "tresorerie@aephat.tg", phone: "+228 94 56 78 90", order: 5 },
  ],
  siteImages: [
    { id: "si1", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop", alt: "Étudiants en pharmacie au laboratoire", altEn: "Pharmacy students in laboratory", category: "hero", order: 1, isActive: true, createdAt: "2026-09-01T10:00:00Z", updatedAt: "2026-09-01T10:00:00Z" },
    { id: "si2", url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1600&h=900&fit=crop", alt: "Médicaments et produits pharmaceutiques", altEn: "Medicines and pharmaceutical products", category: "hero", order: 2, isActive: true, createdAt: "2026-09-01T10:00:00Z", updatedAt: "2026-09-01T10:00:00Z" },
    { id: "si3", url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1600&h=900&fit=crop", alt: "Recherche pharmaceutique", altEn: "Pharmaceutical research", category: "hero", order: 3, isActive: true, createdAt: "2026-09-01T10:00:00Z", updatedAt: "2026-09-01T10:00:00Z" },
    { id: "si4", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&h=900&fit=crop", alt: "Sciences de la santé", altEn: "Health sciences", category: "hero", order: 4, isActive: true, createdAt: "2026-09-01T10:00:00Z", updatedAt: "2026-09-01T10:00:00Z" },
  ],
};

export function getData(): DataStore {
  try {
    if (existsSync(DATA_FILE)) {
      const raw = readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return DEFAULT_DATA;
}

let memoryFallback: DataStore | null = null;

export function saveData(data: DataStore): void {
  memoryFallback = data;
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Filesystem en lecture seule (Netlify Functions) : on garde en mémoire
  }
}

export function resetData(): void {
  saveData(DEFAULT_DATA);
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
