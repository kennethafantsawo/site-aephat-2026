export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export type AuditAction = "create" | "update" | "delete" | "approve" | "reject" | "login";

export interface AuditEvent {
  id: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  details?: string;
  timestamp: string;
}
