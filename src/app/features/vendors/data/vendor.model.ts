/**
 * Vendor Domain Model
 *
 * Following the domain model specified in copilot instructions:
 * - Vendor: id, name, cageCode, duns, pointOfContact, pastPerformance[], documents[]
 */

export interface Vendor {
  id: string;
  name: string;
  cageCode: string;
  duns: string;
  status: VendorStatus;
  pointOfContact: PointOfContact;
  address: VendorAddress;
  businessType: BusinessType;
  capabilities: string[];
  pastPerformance: PerformanceRating[];
  documents: VendorDocument[];
  certifications: Certification[];
  lastActivity: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  registeredAt: Date;
  lastReviewDate?: Date;
}

export interface PointOfContact {
  name: string;
  title: string;
  email: string;
  phone: string;
  alternateEmail?: string;
  alternatePhone?: string;
}

export interface VendorAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PerformanceRating {
  id: string;
  contractId: string;
  contractTitle: string;
  startDate: Date;
  endDate: Date;
  overallRating: number; // 1-5 scale
  qualityRating: number;
  scheduleRating: number;
  costRating: number;
  managementRating: number;
  comments?: string;
  reviewedBy: string;
  reviewDate: Date;
}

export interface VendorDocument {
  id: string;
  type: DocumentType;
  title: string;
  filename: string;
  size: number;
  uploadedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface Certification {
  id: string;
  type: CertificationType;
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expiresDate?: Date;
  certificateNumber?: string;
  isActive: boolean;
}

// Summary interface for list views
export interface VendorSummary {
  id: string;
  name: string;
  cageCode: string;
  duns: string;
  status: VendorStatus;
  businessType: BusinessType;
  lastActivity: Date;
  overallRating?: number;
  activeContracts: number;
}

// Filter interface for search functionality
export interface VendorFilters {
  searchTerm?: string;
  statuses?: VendorStatus[];
  businessTypes?: BusinessType[];
  capabilities?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  minRating?: number;
  maxRating?: number;
  certifications?: CertificationType[];
}

// Request/Response interfaces
export interface CreateVendorRequest {
  name: string;
  cageCode: string;
  duns: string;
  pointOfContact: PointOfContact;
  address: VendorAddress;
  businessType: BusinessType;
  capabilities: string[];
}

export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {
  id: string;
}

export interface VendorSearchResponse {
  vendors: VendorSummary[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

// Enums
export enum VendorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_REVIEW = 'pending_review',
  SUSPENDED = 'suspended',
  DEBARRED = 'debarred',
}

export enum BusinessType {
  SMALL_BUSINESS = 'small_business',
  LARGE_BUSINESS = 'large_business',
  SMALL_DISADVANTAGED = 'small_disadvantaged',
  WOMAN_OWNED = 'woman_owned',
  VETERAN_OWNED = 'veteran_owned',
  HUBZONE = 'hubzone',
  SERVICE_DISABLED_VETERAN = 'service_disabled_veteran',
  HISTORICALLY_BLACK = 'historically_black',
}

export enum DocumentType {
  W9 = 'w9',
  INSURANCE_CERTIFICATE = 'insurance_certificate',
  CAPABILITY_STATEMENT = 'capability_statement',
  PAST_PERFORMANCE = 'past_performance',
  FINANCIAL_STATEMENT = 'financial_statement',
  CERTIFICATIONS = 'certifications',
  OTHER = 'other',
}

export enum CertificationType {
  ISO_9001 = 'iso_9001',
  ISO_14001 = 'iso_14001',
  SOC_2 = 'soc_2',
  CMMI = 'cmmi',
  NIST_800_171 = 'nist_800_171',
  FedRAMP = 'fedramp',
  SMALL_BUSINESS = 'small_business',
  DISADVANTAGED_BUSINESS = 'disadvantaged_business',
  WOMAN_OWNED_BUSINESS = 'woman_owned_business',
  VETERAN_OWNED_BUSINESS = 'veteran_owned_business',
  OTHER = 'other',
}

// Utility type for form handling
export type VendorFormData = Omit<CreateVendorRequest, 'id'>;

// Display label mappings for UI
export const VendorStatusLabels: Record<VendorStatus, string> = {
  [VendorStatus.ACTIVE]: 'Active',
  [VendorStatus.INACTIVE]: 'Inactive',
  [VendorStatus.PENDING_REVIEW]: 'Pending Review',
  [VendorStatus.SUSPENDED]: 'Suspended',
  [VendorStatus.DEBARRED]: 'Debarred',
};

export const BusinessTypeLabels: Record<BusinessType, string> = {
  [BusinessType.SMALL_BUSINESS]: 'Small Business',
  [BusinessType.LARGE_BUSINESS]: 'Large Business',
  [BusinessType.SMALL_DISADVANTAGED]: 'Small Disadvantaged Business',
  [BusinessType.WOMAN_OWNED]: 'Woman-Owned Small Business',
  [BusinessType.VETERAN_OWNED]: 'Veteran-Owned Small Business',
  [BusinessType.HUBZONE]: 'HUBZone Small Business',
  [BusinessType.SERVICE_DISABLED_VETERAN]: 'Service-Disabled Veteran-Owned',
  [BusinessType.HISTORICALLY_BLACK]: 'Historically Black College/University',
};

export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.W9]: 'W-9 Tax Form',
  [DocumentType.INSURANCE_CERTIFICATE]: 'Insurance Certificate',
  [DocumentType.CAPABILITY_STATEMENT]: 'Capability Statement',
  [DocumentType.PAST_PERFORMANCE]: 'Past Performance Documentation',
  [DocumentType.FINANCIAL_STATEMENT]: 'Financial Statement',
  [DocumentType.CERTIFICATIONS]: 'Certifications',
  [DocumentType.OTHER]: 'Other',
};
