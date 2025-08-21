/**
 * Vendor Mock Data
 *
 * Provides realistic test data for development and testing.
 * Following the same pattern as purchase-request.mock.ts
 */

import {
  Vendor,
  VendorSummary,
  VendorStatus,
  BusinessType,
  DocumentType,
  CertificationType,
} from './vendor.model';

// Mock Vendors for List/Search
export const MOCK_VENDOR_SUMMARIES: VendorSummary[] = [
  {
    id: 'vendor-001',
    name: 'Acme Defense Solutions',
    cageCode: '1A2B3',
    duns: '123456789',
    status: VendorStatus.ACTIVE,
    businessType: BusinessType.SMALL_BUSINESS,
    lastActivity: new Date('2025-08-15'),
    overallRating: 4.5,
    activeContracts: 3,
  },
  {
    id: 'vendor-002',
    name: 'TechForward Industries',
    cageCode: '4C5D6',
    duns: '987654321',
    status: VendorStatus.ACTIVE,
    businessType: BusinessType.WOMAN_OWNED,
    lastActivity: new Date('2025-08-12'),
    overallRating: 4.2,
    activeContracts: 2,
  },
  {
    id: 'vendor-003',
    name: 'Global Manufacturing Corp',
    cageCode: '7E8F9',
    duns: '456789123',
    status: VendorStatus.INACTIVE,
    businessType: BusinessType.LARGE_BUSINESS,
    lastActivity: new Date('2025-07-20'),
    overallRating: 3.8,
    activeContracts: 0,
  },
  {
    id: 'vendor-004',
    name: 'Veteran Solutions LLC',
    cageCode: '2G3H4',
    duns: '789123456',
    status: VendorStatus.ACTIVE,
    businessType: BusinessType.VETERAN_OWNED,
    lastActivity: new Date('2025-08-10'),
    overallRating: 4.7,
    activeContracts: 1,
  },
  {
    id: 'vendor-005',
    name: 'Minority Tech Enterprises',
    cageCode: '5I6J7',
    duns: '321654987',
    status: VendorStatus.PENDING_REVIEW,
    businessType: BusinessType.SMALL_DISADVANTAGED,
    lastActivity: new Date('2025-08-08'),
    overallRating: 4.0,
    activeContracts: 1,
  },
  {
    id: 'vendor-006',
    name: 'HUBZone Construction Co',
    cageCode: '8K9L0',
    duns: '654987321',
    status: VendorStatus.ACTIVE,
    businessType: BusinessType.HUBZONE,
    lastActivity: new Date('2025-08-05'),
    overallRating: 4.1,
    activeContracts: 2,
  },
  {
    id: 'vendor-007',
    name: 'Suspended Services Inc',
    cageCode: '3M4N5',
    duns: '147258369',
    status: VendorStatus.SUSPENDED,
    businessType: BusinessType.SMALL_BUSINESS,
    lastActivity: new Date('2025-06-15'),
    overallRating: 2.5,
    activeContracts: 0,
  },
  {
    id: 'vendor-008',
    name: 'Excellence Engineering',
    cageCode: '6O7P8',
    duns: '258369147',
    status: VendorStatus.ACTIVE,
    businessType: BusinessType.SERVICE_DISABLED_VETERAN,
    lastActivity: new Date('2025-08-14'),
    overallRating: 4.8,
    activeContracts: 4,
  },
];

// Detailed vendor data
export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'vendor-001',
    name: 'Acme Defense Solutions',
    cageCode: '1A2B3',
    duns: '123456789',
    status: VendorStatus.ACTIVE,
    pointOfContact: {
      name: 'John Smith',
      title: 'Business Development Manager',
      email: 'j.smith@acmedefense.com',
      phone: '(555) 123-4567',
      alternateEmail: 'john.smith@acmedefense.com',
      alternatePhone: '(555) 123-4568',
    },
    address: {
      street: '123 Defense Boulevard',
      city: 'Arlington',
      state: 'VA',
      zipCode: '22201',
      country: 'USA',
    },
    businessType: BusinessType.SMALL_BUSINESS,
    capabilities: [
      'IT Services',
      'Cybersecurity',
      'Software Development',
      'System Integration',
    ],
    pastPerformance: [
      {
        id: 'perf-001',
        contractId: 'CONTRACT-2024-001',
        contractTitle: 'Network Security Implementation',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-15'),
        overallRating: 4.5,
        qualityRating: 4.8,
        scheduleRating: 4.2,
        costRating: 4.5,
        managementRating: 4.6,
        comments: 'Excellent performance on all deliverables',
        reviewedBy: 'Jane Doe, Contracting Officer',
        reviewDate: new Date('2024-12-20'),
      },
    ],
    documents: [
      {
        id: 'doc-001',
        type: DocumentType.W9,
        title: 'W-9 Tax Form 2025',
        filename: 'acme-w9-2025.pdf',
        size: 245760,
        uploadedAt: new Date('2025-01-15'),
        expiresAt: new Date('2025-12-31'),
        isActive: true,
      },
      {
        id: 'doc-002',
        type: DocumentType.CAPABILITY_STATEMENT,
        title: 'Capability Statement',
        filename: 'acme-capabilities-2025.pdf',
        size: 1048576,
        uploadedAt: new Date('2025-02-01'),
        isActive: true,
      },
    ],
    certifications: [
      {
        id: 'cert-001',
        type: CertificationType.ISO_9001,
        name: 'ISO 9001:2015 Quality Management',
        issuedBy: 'ISO Certification Body',
        issuedDate: new Date('2024-03-15'),
        expiresDate: new Date('2027-03-15'),
        certificateNumber: 'ISO-9001-2024-ACM',
        isActive: true,
      },
      {
        id: 'cert-002',
        type: CertificationType.SMALL_BUSINESS,
        name: 'Small Business Certification',
        issuedBy: 'SBA',
        issuedDate: new Date('2024-01-01'),
        expiresDate: new Date('2025-12-31'),
        certificateNumber: 'SB-2024-001',
        isActive: true,
      },
    ],
    lastActivity: new Date('2025-08-15'),
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2025-08-15'),
    registeredAt: new Date('2023-05-15'),
    lastReviewDate: new Date('2025-06-01'),
  },
  {
    id: 'vendor-002',
    name: 'TechForward Industries',
    cageCode: '4C5D6',
    duns: '987654321',
    status: VendorStatus.ACTIVE,
    pointOfContact: {
      name: 'Sarah Johnson',
      title: 'CEO',
      email: 's.johnson@techforward.com',
      phone: '(555) 987-6543',
    },
    address: {
      street: '456 Innovation Drive',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
    },
    businessType: BusinessType.WOMAN_OWNED,
    capabilities: [
      'Software Development',
      'Cloud Solutions',
      'Data Analytics',
      'Mobile Applications',
    ],
    pastPerformance: [
      {
        id: 'perf-002',
        contractId: 'CONTRACT-2024-002',
        contractTitle: 'Enterprise Software Modernization',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        overallRating: 4.2,
        qualityRating: 4.5,
        scheduleRating: 4.0,
        costRating: 4.2,
        managementRating: 4.3,
        comments: 'Strong technical delivery with minor schedule adjustments',
        reviewedBy: 'Mike Wilson, Technical Lead',
        reviewDate: new Date('2025-03-05'),
      },
    ],
    documents: [
      {
        id: 'doc-003',
        type: DocumentType.W9,
        title: 'W-9 Tax Form 2025',
        filename: 'techforward-w9-2025.pdf',
        size: 198432,
        uploadedAt: new Date('2025-01-10'),
        expiresAt: new Date('2025-12-31'),
        isActive: true,
      },
    ],
    certifications: [
      {
        id: 'cert-003',
        type: CertificationType.WOMAN_OWNED_BUSINESS,
        name: 'Women-Owned Small Business',
        issuedBy: 'SBA',
        issuedDate: new Date('2024-01-01'),
        expiresDate: new Date('2025-12-31'),
        certificateNumber: 'WOSB-2024-002',
        isActive: true,
      },
    ],
    lastActivity: new Date('2025-08-12'),
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2025-08-12'),
    registeredAt: new Date('2023-09-01'),
    lastReviewDate: new Date('2025-05-15'),
  },
];

// Available capabilities for filtering
export const AVAILABLE_CAPABILITIES = [
  'IT Services',
  'Cybersecurity',
  'Software Development',
  'System Integration',
  'Cloud Solutions',
  'Data Analytics',
  'Mobile Applications',
  'Construction',
  'Engineering Services',
  'Consulting',
  'Training',
  'Maintenance',
  'Professional Services',
  'Manufacturing',
  'Logistics',
  'Research & Development',
];

// Helper function to get vendor by ID
export function getMockVendorById(id: string): Vendor | undefined {
  return MOCK_VENDORS.find((vendor) => vendor.id === id);
}

// Helper function to filter vendors
export function filterMockVendors(
  vendors: VendorSummary[],
  filters: {
    searchTerm?: string;
    statuses?: VendorStatus[];
    businessTypes?: BusinessType[];
    minRating?: number;
    maxRating?: number;
  }
): VendorSummary[] {
  let filtered = [...vendors];

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(term) ||
        vendor.cageCode.toLowerCase().includes(term) ||
        vendor.duns.includes(term)
    );
  }

  if (filters.statuses && filters.statuses.length > 0) {
    filtered = filtered.filter((vendor) =>
      filters.statuses!.includes(vendor.status)
    );
  }

  if (filters.businessTypes && filters.businessTypes.length > 0) {
    filtered = filtered.filter((vendor) =>
      filters.businessTypes!.includes(vendor.businessType)
    );
  }

  if (filters.minRating !== undefined && filters.minRating > 0) {
    filtered = filtered.filter(
      (vendor) =>
        vendor.overallRating !== undefined &&
        vendor.overallRating >= filters.minRating!
    );
  }

  if (filters.maxRating !== undefined && filters.maxRating < 5) {
    filtered = filtered.filter(
      (vendor) =>
        vendor.overallRating !== undefined &&
        vendor.overallRating <= filters.maxRating!
    );
  }

  return filtered;
}
