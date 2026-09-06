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
  status: PostStatus;
  authorId: string;
  category?: PostCategory;
  tags?: string[];
  visibility?: PostVisibility;
  isDemo: boolean;
  scheduledAt?: string;
  likes: number;
  commentCount: number;
  pollId?: string;
  createdAt: string;
  updatedAt: string;
}

export type HealthCategory = "alerte" | "prevention" | "recherche" | "pharmacovigilance";
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
  readTimeMinutes?: number;
  verifiedBy?: string;
  publishedDate: string;
  language: "fr" | "en";
  importedBy: string;
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

export type SiteImageCategory = "hero" | "about" | "post" | "general";

export interface SiteImage {
  id: string;
  url: string;
  alt: string;
  altEn?: string;
  title?: string;
  titleEn?: string;
  category: SiteImageCategory;
  order: number;
  isActive: boolean;
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
