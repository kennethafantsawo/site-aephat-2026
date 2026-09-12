export type PostStatus = "draft" | "published" | "archived" | "scheduled";

export type UserRole = "visitor" | "student" | "doctor" | "healthcare_pro" | "citizen" | "admin";
export type AdminRole = "president" | "vice_president" | "comms_director";
export type PostCategory = "evenement" | "academique" | "humanitaire" | "vie_etudiante";

export type PostVisibility = "everyone" | "students_only";

export interface Post {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  excerpt: string;
  excerptEn?: string;
  imageUrl?: string;
  /** Galerie multi-images style Instagram (carrousel) */
  images?: string[];
  /** Auteur affiché façon réseau social */
  authorName?: string;
  authorAvatar?: string;
  authorHandle?: string;
  isVerifiedAuthor?: boolean;
  location?: string;
  status: PostStatus;
  authorId: string;
  category?: PostCategory;
  tags?: string[];
  visibility?: PostVisibility;
  isDemo: boolean;
  isPinned?: boolean;
  isSponsored?: boolean;
  scheduledAt?: string;
  likes: number;
  /** Compteurs sociaux */
  reposts?: number;
  shares?: number;
  bookmarks?: number;
  views?: number;
  commentCount: number;
  pollId?: string;
  createdAt: string;
  updatedAt: string;
}

export type HealthCategory = "alerte" | "prevention" | "recherche" | "pharmacovigilance" | "medicament" | "vaccination";
export type HealthSourceName = "OMS" | "VIDAL" | "MINISTERE_TOGO" | "AFRICA_CDC";

export interface HealthSource {
  id: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  content?: string;
  contentEn?: string;
  sourceUrl: string;
  sourceName: string;
  sourceType?: HealthSourceName;
  category?: HealthCategory;
  imageUrl?: string;
  readTimeMinutes?: number;
  verifiedBy?: string;
  publishedDate: string;
  language: "fr" | "en";
  importedBy: string;
  /** Import automatique (scraping) vs manuel */
  importMode?: "rss" | "scrape" | "manual" | "catalog";
  isApproved: boolean;
  createdAt: string;
}

export interface BureauMember {
  id: string;
  name: string;
  role: string;
  roleEn?: string;
  category?: "executif" | "scientifique" | "communication" | "pedagogique" | "general";
  email?: string;
  phone?: string;
  whatsapp?: string;
  imageUrl?: string;
  bio?: string;
  bioEn?: string;
  order: number;
}

export type SiteImageCategory =
  | "hero"
  | "about"
  | "post"
  | "gallery"
  | "bureau"
  | "event"
  | "partner"
  | "health"
  | "banner"
  | "background"
  | "general";

export type SiteImageVisibility = "everyone" | "students_only";
export type SiteImageStyle = "rounded" | "circle" | "square" | "blob";

/** Studio image pro : 20+ champs pour une gestion simple ET complète */
export interface SiteImage {
  id: string;
  url: string;
  alt: string;
  altEn?: string;
  title?: string;
  titleEn?: string;
  /** 1. Légende affichée sous l'image */
  caption?: string;
  captionEn?: string;
  /** 2. Crédit photo */
  credit?: string;
  /** 3. Lien au clic */
  linkUrl?: string;
  openInNewTab?: boolean;
  /** 4. Tags libres */
  tags?: string[];
  category: SiteImageCategory;
  order: number;
  isActive: boolean;
  /** 5. Mise en avant */
  isFeatured?: boolean;
  /** 6. Visibilité */
  visibility?: SiteImageVisibility;
  /** 7. Planification */
  publishAt?: string;
  expireAt?: string;
  /** 8. Style d'affichage */
  style?: SiteImageStyle;
  withShadow?: boolean;
  withBorder?: boolean;
  /** 9. Point focal (object-position) */
  focalX?: number; // 0-100
  focalY?: number; // 0-100
  /** 10. Opacité / overlay pour hero */
  overlayOpacity?: number; // 0-90
  /** 11. Dimensions d'origine (auto-remplies) */
  width?: number;
  height?: number;
  fileSizeKb?: number;
  /** 12. Source : upload / url / unsplash / ai */
  source?: "upload" | "url" | "unsplash" | "catalog";
  createdAt: string;
  updatedAt: string;
}

export interface CommentItem {
  id: string;
  targetType: "post" | "survey" | "suggestion";
  targetId: string;
  targetTitle?: string;
  authorName: string;
  authorEmail: string;
  authorRole?: UserRole;
  isVerifiedUser?: boolean;
  content: string;
  createdAt: string;
  visibility: "public" | "private";
  status: "published" | "hidden" | "unread" | "reviewed";
  adminReply?: string;
  isApproved?: boolean;
  postId?: string;
}

export interface SurveyOption {
  id: string;
  label: string;
  labelEn?: string;
  votesCount: number;
  percent: number;
}

export interface Survey {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  googleFormUrl: string;
  googleFormEmbedUrl?: string;
  googleSpreadsheetStatsUrl?: string;
  resultsAccessEmail: string;
  restriction: "all_with_email" | "verified_only";
  deadline?: string;
  responsesCount: number;
  isActive: boolean;
  resultsSummary?: {
    total: number;
    options: SurveyOption[];
  };
  createdBy?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facultyId?: string;
  academicYear?: string;
  studentCardPhoto?: string;
  isVerified: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
  avatar?: string;
  phone?: string;
  profileType?: string;
  createdAt: string;
}
