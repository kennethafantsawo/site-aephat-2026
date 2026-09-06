export type PollEligibility = "all" | "email_required" | "verified_only";

export interface Poll {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  googleFormUrl: string;
  resultsEmail?: string;
  eligibility: PollEligibility;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}
