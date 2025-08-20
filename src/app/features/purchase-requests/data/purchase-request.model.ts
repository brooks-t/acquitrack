/**
 * Purchase Request Domain Model
 *
 * Following the domain model specified in copilot instructions:
 * - PurchaseRequest: id, requester, org, needDate, amount, lineItems[], fundingSource, status, history[]
 */

export interface PurchaseRequest {
  id: string;
  prNumber: string; // Auto-generated PR number (e.g., PR-2025-001)
  requester: UserReference;
  organization: string;
  needDate: Date;
  totalAmount: number;
  lineItems: LineItem[];
  fundingSource: FundingSource;
  status: PurchaseRequestStatus;
  priority: Priority;
  justification: string;
  attachments?: Attachment[];
  approvals?: Approval[];
  history: AuditHistoryEntry[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitOfMeasure: string;
  partNumber?: string;
  vendor?: string;
  category: ItemCategory;
}

export interface FundingSource {
  id: string;
  name: string;
  code: string;
  availableBalance: number;
  fiscalYear: number;
}

export interface UserReference {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
  uploadedBy: UserReference;
}

export interface Approval {
  id: string;
  prId: string;
  approverId: string;
  approverName: string;
  step: number;
  status: ApprovalStatus;
  decision?: ApprovalDecision;
  comments?: string;
  decidedAt?: Date;
  dueDate: Date;
}

export interface AuditHistoryEntry {
  id: string;
  action: AuditAction;
  actorId: string;
  actorName: string;
  timestamp: Date;
  details: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
}

// Enums
export enum PurchaseRequestStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ItemCategory {
  OFFICE_SUPPLIES = 'office_supplies',
  IT_EQUIPMENT = 'it_equipment',
  PROFESSIONAL_SERVICES = 'professional_services',
  CONSTRUCTION = 'construction',
  MAINTENANCE = 'maintenance',
  VEHICLES = 'vehicles',
  OTHER = 'other',
}

export enum UserRole {
  REQUESTER = 'requester',
  CONTRACTING_OFFICER = 'contracting_officer',
  CONTRACTING_SPECIALIST = 'contracting_specialist',
  PROGRAM_MANAGER = 'program_manager',
  FINANCIAL_ANALYST = 'financial_analyst',
  ADMIN = 'admin',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELEGATED = 'delegated',
}

export enum ApprovalDecision {
  APPROVE = 'approve',
  REJECT = 'reject',
  REQUEST_CHANGES = 'request_changes',
  DELEGATE = 'delegate',
}

export enum AuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ATTACHMENT_ADDED = 'attachment_added',
  ATTACHMENT_REMOVED = 'attachment_removed',
  COMMENT_ADDED = 'comment_added',
}

// Utility Types
export interface PurchaseRequestFilters {
  status?: PurchaseRequestStatus[];
  priority?: Priority[];
  requester?: string;
  organization?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  category?: ItemCategory[];
}

export interface PurchaseRequestSummary {
  id: string;
  prNumber: string;
  requester: string;
  organization: string;
  totalAmount: number;
  status: PurchaseRequestStatus;
  priority: Priority;
  needDate: Date;
  createdAt: Date;
  lineItemCount: number;
}

// Form Data Types
export interface CreatePurchaseRequestRequest {
  organization: string;
  needDate: Date;
  justification: string;
  priority: Priority;
  fundingSourceId: string;
  lineItems: Omit<LineItem, 'id' | 'totalPrice'>[];
}

export interface UpdatePurchaseRequestRequest
  extends Partial<CreatePurchaseRequestRequest> {
  id: string;
}
