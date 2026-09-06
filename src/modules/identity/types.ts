export type ProfileType = "student_pharma" | "doctor_pharma" | "health_pro" | "citizen";
export type AccountStatus = "pending" | "verified" | "refused" | "suspended";
export type AdminRole = "president" | "vice_president" | "media_manager";

export interface User {
  id: string;
  name: string;
  email: string;
  profileType: ProfileType;
  status: AccountStatus;
  role?: AdminRole;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  profileType: ProfileType;
  evidence: string;
  status: "pending" | "approved" | "refused";
  reviewedBy?: string;
  createdAt: string;
}
