/**
 * Purchase Request Mock Data
 *
 * Realistic government procurement scenarios for development and testing
 */

import {
  PurchaseRequest,
  PurchaseRequestStatus,
  Priority,
  ItemCategory,
  UserRole,
  AuditAction,
  ApprovalStatus,
  ApprovalDecision,
  LineItem,
  FundingSource,
  UserReference,
  AuditHistoryEntry,
  Approval,
} from './purchase-request.model';

// Mock Users
export const mockUsers: UserReference[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@agency.gov',
    organization: 'Information Technology Division',
    role: UserRole.REQUESTER,
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@agency.gov',
    organization: 'Operations Division',
    role: UserRole.CONTRACTING_OFFICER,
  },
  {
    id: 'user-3',
    name: 'Michael Chen',
    email: 'michael.chen@agency.gov',
    organization: 'Facilities Management',
    role: UserRole.REQUESTER,
  },
  {
    id: 'user-4',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@agency.gov',
    organization: 'Finance Division',
    role: UserRole.FINANCIAL_ANALYST,
  },
];

// Mock Funding Sources
export const mockFundingSources: FundingSource[] = [
  {
    id: 'fund-1',
    name: 'Operations and Maintenance',
    code: 'O&M-2025',
    availableBalance: 2500000,
    fiscalYear: 2025,
  },
  {
    id: 'fund-2',
    name: 'Information Technology Modernization',
    code: 'IT-MOD-2025',
    availableBalance: 1800000,
    fiscalYear: 2025,
  },
  {
    id: 'fund-3',
    name: 'Facilities and Infrastructure',
    code: 'FAC-2025',
    availableBalance: 950000,
    fiscalYear: 2025,
  },
];

// Mock Line Items
const mockLineItems: LineItem[] = [
  {
    id: 'line-1',
    description: 'Laptop computers - Dell Latitude 5000 series',
    quantity: 25,
    unitPrice: 1200,
    totalPrice: 30000,
    unitOfMeasure: 'each',
    partNumber: 'DELL-LAT-5000',
    vendor: 'Dell Technologies',
    category: ItemCategory.IT_EQUIPMENT,
  },
  {
    id: 'line-2',
    description: 'Office chairs - ergonomic task chairs',
    quantity: 50,
    unitPrice: 350,
    totalPrice: 17500,
    unitOfMeasure: 'each',
    category: ItemCategory.OFFICE_SUPPLIES,
  },
  {
    id: 'line-3',
    description: 'Professional cleaning services - 12 months',
    quantity: 1,
    unitPrice: 45000,
    totalPrice: 45000,
    unitOfMeasure: 'contract',
    category: ItemCategory.PROFESSIONAL_SERVICES,
  },
];

// Mock Audit History
const mockAuditHistory: AuditHistoryEntry[] = [
  {
    id: 'audit-1',
    action: AuditAction.CREATED,
    actorId: 'user-1',
    actorName: 'John Smith',
    timestamp: new Date('2025-08-15T09:00:00Z'),
    details: 'Purchase request created',
  },
  {
    id: 'audit-2',
    action: AuditAction.UPDATED,
    actorId: 'user-1',
    actorName: 'John Smith',
    timestamp: new Date('2025-08-15T10:30:00Z'),
    details: 'Added justification and funding source',
    changes: {
      justification: {
        from: '',
        to: 'Required for Q4 2025 office expansion project',
      },
    },
  },
  {
    id: 'audit-3',
    action: AuditAction.SUBMITTED,
    actorId: 'user-1',
    actorName: 'John Smith',
    timestamp: new Date('2025-08-15T11:45:00Z'),
    details: 'Purchase request submitted for approval',
  },
];

// Mock Approvals
const mockApprovals: Approval[] = [
  {
    id: 'approval-1',
    prId: 'pr-1',
    approverId: 'user-4',
    approverName: 'Lisa Rodriguez',
    step: 1,
    status: ApprovalStatus.APPROVED,
    decision: ApprovalDecision.APPROVE,
    comments: 'Funding available and justified',
    decidedAt: new Date('2025-08-16T14:30:00Z'),
    dueDate: new Date('2025-08-18T17:00:00Z'),
  },
  {
    id: 'approval-2',
    prId: 'pr-1',
    approverId: 'user-2',
    approverName: 'Sarah Johnson',
    step: 2,
    status: ApprovalStatus.PENDING,
    dueDate: new Date('2025-08-22T17:00:00Z'),
  },
];

// Mock Purchase Requests
export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr-1',
    prNumber: 'PR-2025-001',
    requester: mockUsers[0],
    organization: 'Information Technology Division',
    needDate: new Date('2025-09-15'),
    totalAmount: 30000,
    lineItems: [mockLineItems[0]],
    fundingSource: mockFundingSources[1],
    status: PurchaseRequestStatus.UNDER_REVIEW,
    priority: Priority.HIGH,
    justification:
      'Required for Q4 2025 office expansion project. Current laptops are 5+ years old and no longer supported.',
    approvals: mockApprovals,
    history: mockAuditHistory,
    createdAt: new Date('2025-08-15T09:00:00Z'),
    updatedAt: new Date('2025-08-16T14:30:00Z'),
    submittedAt: new Date('2025-08-15T11:45:00Z'),
  },
  {
    id: 'pr-2',
    prNumber: 'PR-2025-002',
    requester: mockUsers[2],
    organization: 'Facilities Management',
    needDate: new Date('2025-08-30'),
    totalAmount: 17500,
    lineItems: [mockLineItems[1]],
    fundingSource: mockFundingSources[2],
    status: PurchaseRequestStatus.APPROVED,
    priority: Priority.MEDIUM,
    justification:
      'Ergonomic chairs needed for new office space to meet workplace safety requirements.',
    history: [
      {
        id: 'audit-4',
        action: AuditAction.CREATED,
        actorId: 'user-3',
        actorName: 'Michael Chen',
        timestamp: new Date('2025-08-10T14:00:00Z'),
        details: 'Purchase request created',
      },
      {
        id: 'audit-5',
        action: AuditAction.SUBMITTED,
        actorId: 'user-3',
        actorName: 'Michael Chen',
        timestamp: new Date('2025-08-10T15:30:00Z'),
        details: 'Purchase request submitted for approval',
      },
      {
        id: 'audit-6',
        action: AuditAction.APPROVED,
        actorId: 'user-2',
        actorName: 'Sarah Johnson',
        timestamp: new Date('2025-08-12T10:15:00Z'),
        details: 'Purchase request approved by contracting officer',
      },
    ],
    createdAt: new Date('2025-08-10T14:00:00Z'),
    updatedAt: new Date('2025-08-12T10:15:00Z'),
    submittedAt: new Date('2025-08-10T15:30:00Z'),
    approvedAt: new Date('2025-08-12T10:15:00Z'),
  },
  {
    id: 'pr-3',
    prNumber: 'PR-2025-003',
    requester: mockUsers[0],
    organization: 'Operations Division',
    needDate: new Date('2025-10-01'),
    totalAmount: 45000,
    lineItems: [mockLineItems[2]],
    fundingSource: mockFundingSources[0],
    status: PurchaseRequestStatus.DRAFT,
    priority: Priority.LOW,
    justification: 'Annual cleaning services contract renewal for FY 2025.',
    history: [
      {
        id: 'audit-7',
        action: AuditAction.CREATED,
        actorId: 'user-1',
        actorName: 'John Smith',
        timestamp: new Date('2025-08-18T16:00:00Z'),
        details: 'Purchase request created as draft',
      },
    ],
    createdAt: new Date('2025-08-18T16:00:00Z'),
    updatedAt: new Date('2025-08-18T16:00:00Z'),
  },
  {
    id: 'pr-4',
    prNumber: 'PR-2025-004',
    requester: mockUsers[2],
    organization: 'Facilities Management',
    needDate: new Date('2025-09-01'),
    totalAmount: 8500,
    lineItems: [
      {
        id: 'line-4',
        description: 'Printer paper - 20lb bond, case of 10 reams',
        quantity: 25,
        unitPrice: 85,
        totalPrice: 2125,
        unitOfMeasure: 'case',
        category: ItemCategory.OFFICE_SUPPLIES,
      },
      {
        id: 'line-5',
        description: 'Toner cartridges - HP LaserJet compatible',
        quantity: 50,
        unitPrice: 127.5,
        totalPrice: 6375,
        unitOfMeasure: 'each',
        partNumber: 'HP-83A-CF283A',
        category: ItemCategory.OFFICE_SUPPLIES,
      },
    ],
    fundingSource: mockFundingSources[0],
    status: PurchaseRequestStatus.REJECTED,
    priority: Priority.LOW,
    justification: 'Office supplies for Q4 2025 operations.',
    history: [
      {
        id: 'audit-8',
        action: AuditAction.CREATED,
        actorId: 'user-3',
        actorName: 'Michael Chen',
        timestamp: new Date('2025-08-05T11:00:00Z'),
        details: 'Purchase request created',
      },
      {
        id: 'audit-9',
        action: AuditAction.SUBMITTED,
        actorId: 'user-3',
        actorName: 'Michael Chen',
        timestamp: new Date('2025-08-05T14:30:00Z'),
        details: 'Purchase request submitted for approval',
      },
      {
        id: 'audit-10',
        action: AuditAction.REJECTED,
        actorId: 'user-4',
        actorName: 'Lisa Rodriguez',
        timestamp: new Date('2025-08-07T09:15:00Z'),
        details:
          'Purchase request rejected - insufficient justification for quantity',
      },
    ],
    createdAt: new Date('2025-08-05T11:00:00Z'),
    updatedAt: new Date('2025-08-07T09:15:00Z'),
    submittedAt: new Date('2025-08-05T14:30:00Z'),
    rejectedAt: new Date('2025-08-07T09:15:00Z'),
  },
];

// Utility functions for mock data
export function getPurchaseRequestById(
  id: string
): PurchaseRequest | undefined {
  return mockPurchaseRequests.find((pr) => pr.id === id);
}

export function getUserById(id: string): UserReference | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function getFundingSourceById(id: string): FundingSource | undefined {
  return mockFundingSources.find((fund) => fund.id === id);
}

export function generatePrNumber(): string {
  const year = new Date().getFullYear();
  const nextNumber = mockPurchaseRequests.length + 1;
  return `PR-${year}-${nextNumber.toString().padStart(3, '0')}`;
}
