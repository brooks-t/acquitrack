/**
 * Reports Mock Data
 *
 * Mock data for reports functionality, following the established patterns
 * from purchase-request.mock.ts and vendor.mock.ts
 */

import {
  ReportData,
  ReportCategory,
  ReportFormat,
  ScheduleFrequency,
  ReportExport,
  AnalyticsData,
} from './reports.model';

// Mock reports data
export const MOCK_REPORTS: ReportData[] = [
  {
    id: 'vendor-performance',
    name: 'Vendor Performance Report',
    description:
      'Comprehensive analysis of vendor delivery and quality metrics',
    category: ReportCategory.VENDOR,
    format: [ReportFormat.PDF, ReportFormat.EXCEL],
    isScheduled: true,
    scheduleConfig: {
      frequency: ScheduleFrequency.MONTHLY,
      dayOfMonth: 1,
      time: '09:00',
      recipients: ['admin@agency.gov'],
      isActive: true,
    },
    lastGenerated: new Date('2025-08-18'),
  },
  {
    id: 'procurement-pipeline',
    name: 'Procurement Pipeline Report',
    description: 'Status of all active purchase requests and solicitations',
    category: ReportCategory.PROCUREMENT,
    format: [ReportFormat.PDF, ReportFormat.EXCEL],
    isScheduled: false,
    lastGenerated: new Date('2025-08-16'),
  },
  {
    id: 'spend-analysis',
    name: 'Spend Analysis Report',
    description: 'Detailed breakdown of spending by category and vendor',
    category: ReportCategory.FINANCIAL,
    format: [ReportFormat.EXCEL, ReportFormat.CSV],
    isScheduled: true,
    scheduleConfig: {
      frequency: ScheduleFrequency.WEEKLY,
      dayOfWeek: 1, // Monday
      time: '08:00',
      recipients: ['finance@agency.gov'],
      isActive: true,
    },
    lastGenerated: new Date('2025-08-15'),
  },
  {
    id: 'contract-utilization',
    name: 'Contract Utilization Report',
    description: 'Current contract usage and remaining balances',
    category: ReportCategory.FINANCIAL,
    format: [ReportFormat.EXCEL],
    isScheduled: false,
    lastGenerated: new Date('2025-08-17'),
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit Report',
    description: 'Regulatory compliance status and audit findings',
    category: ReportCategory.COMPLIANCE,
    format: [ReportFormat.PDF],
    isScheduled: true,
    scheduleConfig: {
      frequency: ScheduleFrequency.QUARTERLY,
      dayOfMonth: 15,
      time: '10:00',
      recipients: ['compliance@agency.gov'],
      isActive: true,
    },
    lastGenerated: new Date('2025-08-14'),
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis Report',
    description: 'Market trends and vendor landscape analysis',
    category: ReportCategory.VENDOR,
    format: [ReportFormat.PDF, ReportFormat.EXCEL],
    isScheduled: false,
    lastGenerated: new Date('2025-08-12'),
  },
  {
    id: 'budget-variance',
    name: 'Budget Variance Report',
    description: 'Comparison of actual vs. budgeted spending',
    category: ReportCategory.FINANCIAL,
    format: [ReportFormat.EXCEL, ReportFormat.PDF],
    isScheduled: true,
    scheduleConfig: {
      frequency: ScheduleFrequency.MONTHLY,
      dayOfMonth: 5,
      time: '07:30',
      recipients: ['budget@agency.gov'],
      isActive: true,
    },
    lastGenerated: new Date('2025-08-10'),
  },
  {
    id: 'emergency-procurement',
    name: 'Emergency Procurement Report',
    description: 'Analysis of emergency purchase requests and justifications',
    category: ReportCategory.PROCUREMENT,
    format: [ReportFormat.PDF],
    isScheduled: false,
    lastGenerated: new Date('2025-08-08'),
  },
];

// Mock report exports
export const MOCK_REPORT_EXPORTS: ReportExport[] = [
  {
    id: 'export-001',
    reportId: 'vendor-performance',
    format: ReportFormat.PDF,
    fileUrl: '/api/reports/exports/vendor-performance-2025-08-18.pdf',
    generatedAt: new Date('2025-08-18T10:30:00Z'),
    expiresAt: new Date('2025-08-25T10:30:00Z'),
    fileSize: 2500000,
  },
  {
    id: 'export-002',
    reportId: 'spend-analysis',
    format: ReportFormat.EXCEL,
    fileUrl: '/api/reports/exports/spend-analysis-2025-08-15.xlsx',
    generatedAt: new Date('2025-08-15T14:15:00Z'),
    expiresAt: new Date('2025-08-22T14:15:00Z'),
    fileSize: 890000,
  },
  {
    id: 'export-003',
    reportId: 'procurement-pipeline',
    format: ReportFormat.PDF,
    fileUrl: '/api/reports/exports/procurement-pipeline-2025-08-16.pdf',
    generatedAt: new Date('2025-08-16T09:45:00Z'),
    expiresAt: new Date('2025-08-23T09:45:00Z'),
    fileSize: 1200000,
  },
];

// Mock analytics data (high-level summary)
export const MOCK_ANALYTICS_SUMMARY: AnalyticsData = {
  procurementMetrics: {
    totalRequests: 127,
    activeRequests: 34,
    completedRequests: 78,
    averageProcessingTime: 5.2,
    totalValue: 2429500,
    averageRequestValue: 19129,
    requestsByStatus: [
      { status: 'Draft', count: 8, percentage: 6.3, value: 125000 },
      { status: 'Submitted', count: 12, percentage: 9.4, value: 287500 },
      { status: 'Under Review', count: 14, percentage: 11.0, value: 356000 },
      { status: 'Approved', count: 78, percentage: 61.4, value: 1425000 },
      { status: 'Rejected', count: 15, percentage: 11.8, value: 236000 },
    ],
    requestsByPriority: [
      { priority: 'Low', count: 35, percentage: 27.6, averageValue: 12500 },
      { priority: 'Medium', count: 67, percentage: 52.8, averageValue: 18750 },
      { priority: 'High', count: 20, percentage: 15.7, averageValue: 28900 },
      { priority: 'Critical', count: 5, percentage: 3.9, averageValue: 45000 },
    ],
  },
  spendingAnalysis: {
    monthlySpending: [
      {
        month: 'Jan 2025',
        year: 2025,
        amount: 420000,
        requestCount: 15,
        averageValue: 28000,
      },
      {
        month: 'Feb 2025',
        year: 2025,
        amount: 380000,
        requestCount: 12,
        averageValue: 31667,
      },
      {
        month: 'Mar 2025',
        year: 2025,
        amount: 450000,
        requestCount: 18,
        averageValue: 25000,
      },
      {
        month: 'Apr 2025',
        year: 2025,
        amount: 520000,
        requestCount: 22,
        averageValue: 23636,
      },
      {
        month: 'May 2025',
        year: 2025,
        amount: 480000,
        requestCount: 19,
        averageValue: 25263,
      },
      {
        month: 'Jun 2025',
        year: 2025,
        amount: 510000,
        requestCount: 21,
        averageValue: 24286,
      },
      {
        month: 'Jul 2025',
        year: 2025,
        amount: 470000,
        requestCount: 20,
        averageValue: 23500,
      },
      {
        month: 'Aug 2025',
        year: 2025,
        amount: 390000,
        requestCount: 16,
        averageValue: 24375,
      },
    ],
    categoryBreakdown: [
      {
        category: 'IT Equipment',
        amount: 850000,
        percentage: 35.0,
        requestCount: 45,
        topVendors: ['TechForward Industries', 'Acme Defense Solutions'],
      },
      {
        category: 'Professional Services',
        amount: 607500,
        percentage: 25.0,
        requestCount: 32,
        topVendors: ['Excellence Engineering', 'Global Manufacturing Corp'],
      },
      {
        category: 'Office Supplies',
        amount: 486000,
        percentage: 20.0,
        requestCount: 28,
        topVendors: ['Office Supply Co', 'Business Essentials Inc'],
      },
      {
        category: 'Construction',
        amount: 364500,
        percentage: 15.0,
        requestCount: 18,
        topVendors: ['HUBZone Construction Co', 'BuildRight LLC'],
      },
      {
        category: 'Medical Supplies',
        amount: 121500,
        percentage: 5.0,
        requestCount: 12,
        topVendors: ['MedSupply Corp', 'Healthcare Solutions'],
      },
    ],
    vendorSpending: [
      {
        vendorId: 'vendor-001',
        vendorName: 'TechForward Industries',
        totalSpent: 325000,
        requestCount: 18,
        averageOrderValue: 18056,
        performance: 4.8,
      },
      {
        vendorId: 'vendor-002',
        vendorName: 'Excellence Engineering',
        totalSpent: 287500,
        requestCount: 12,
        averageOrderValue: 23958,
        performance: 4.7,
      },
      {
        vendorId: 'vendor-003',
        vendorName: 'Office Supply Co',
        totalSpent: 245000,
        requestCount: 15,
        averageOrderValue: 16333,
        performance: 4.5,
      },
      {
        vendorId: 'vendor-004',
        vendorName: 'Acme Defense Solutions',
        totalSpent: 198000,
        requestCount: 9,
        averageOrderValue: 22000,
        performance: 4.3,
      },
      {
        vendorId: 'vendor-005',
        vendorName: 'Global Manufacturing Corp',
        totalSpent: 189500,
        requestCount: 8,
        averageOrderValue: 23688,
        performance: 4.2,
      },
    ],
    fundingSourceUtilization: [
      {
        sourceId: 'fund-001',
        sourceName: 'Operations',
        totalBudget: 1200000,
        utilized: 890000,
        remaining: 310000,
        utilizationPercentage: 74.2,
      },
      {
        sourceId: 'fund-002',
        sourceName: 'IT Modernization',
        totalBudget: 800000,
        utilized: 645000,
        remaining: 155000,
        utilizationPercentage: 80.6,
      },
      {
        sourceId: 'fund-003',
        sourceName: 'Facility Maintenance',
        totalBudget: 400000,
        utilized: 285000,
        remaining: 115000,
        utilizationPercentage: 71.3,
      },
      {
        sourceId: 'fund-004',
        sourceName: 'Emergency Fund',
        totalBudget: 200000,
        utilized: 45000,
        remaining: 155000,
        utilizationPercentage: 22.5,
      },
    ],
    yearOverYearComparison: [
      {
        period: 'IT Equipment',
        currentYear: 850000,
        previousYear: 720000,
        percentageChange: 18.1,
      },
      {
        period: 'Professional Services',
        currentYear: 607500,
        previousYear: 580000,
        percentageChange: 4.7,
      },
      {
        period: 'Office Supplies',
        currentYear: 486000,
        previousYear: 520000,
        percentageChange: -6.5,
      },
      {
        period: 'Construction',
        currentYear: 364500,
        previousYear: 340000,
        percentageChange: 7.2,
      },
      {
        period: 'Medical Supplies',
        currentYear: 121500,
        previousYear: 98000,
        percentageChange: 24.0,
      },
    ],
  },
  vendorPerformance: {
    totalVendors: 47,
    activeVendors: 32,
    averageRating: 4.2,
    onTimeDelivery: 89.5,
    topPerformers: [
      {
        vendorId: 'vendor-001',
        vendorName: 'TechForward Industries',
        overallRating: 4.8,
        contractCount: 3,
        totalValue: 325000,
        onTimePercentage: 95.2,
      },
      {
        vendorId: 'vendor-002',
        vendorName: 'Excellence Engineering',
        overallRating: 4.7,
        contractCount: 2,
        totalValue: 287500,
        onTimePercentage: 92.1,
      },
      {
        vendorId: 'vendor-003',
        vendorName: 'Office Supply Co',
        overallRating: 4.5,
        contractCount: 2,
        totalValue: 245000,
        onTimePercentage: 94.7,
      },
      {
        vendorId: 'vendor-004',
        vendorName: 'Reliable Solutions Inc',
        overallRating: 4.6,
        contractCount: 1,
        totalValue: 156000,
        onTimePercentage: 91.8,
      },
      {
        vendorId: 'vendor-005',
        vendorName: 'Quality First Corp',
        overallRating: 4.4,
        contractCount: 2,
        totalValue: 189500,
        onTimePercentage: 88.9,
      },
    ],
    contractUtilization: [
      {
        contractId: 'contract-001',
        vendorName: 'TechForward Industries',
        totalValue: 500000,
        utilized: 325000,
        remaining: 175000,
        utilizationPercentage: 65.0,
      },
      {
        contractId: 'contract-002',
        vendorName: 'Excellence Engineering',
        totalValue: 400000,
        utilized: 287500,
        remaining: 112500,
        utilizationPercentage: 71.9,
      },
      {
        contractId: 'contract-003',
        vendorName: 'Office Supply Co',
        totalValue: 300000,
        utilized: 245000,
        remaining: 55000,
        utilizationPercentage: 81.7,
      },
      {
        contractId: 'contract-004',
        vendorName: 'Global Manufacturing',
        totalValue: 250000,
        utilized: 189500,
        remaining: 60500,
        utilizationPercentage: 75.8,
      },
    ],
  },
  timelineData: {
    dailyActivity: [
      {
        date: new Date('2025-08-01'),
        requestsCreated: 3,
        requestsApproved: 2,
        requestsRejected: 0,
        totalValue: 45000,
      },
      {
        date: new Date('2025-08-02'),
        requestsCreated: 5,
        requestsApproved: 3,
        requestsRejected: 1,
        totalValue: 78000,
      },
      {
        date: new Date('2025-08-03'),
        requestsCreated: 2,
        requestsApproved: 4,
        requestsRejected: 0,
        totalValue: 23000,
      },
      {
        date: new Date('2025-08-04'),
        requestsCreated: 4,
        requestsApproved: 1,
        requestsRejected: 2,
        totalValue: 67000,
      },
      {
        date: new Date('2025-08-05'),
        requestsCreated: 6,
        requestsApproved: 5,
        requestsRejected: 0,
        totalValue: 89000,
      },
    ],
    weeklyTrends: [
      { period: 'Week 1', value: 234000, change: 12.5, count: 18 },
      { period: 'Week 2', value: 287000, change: 22.6, count: 22 },
      { period: 'Week 3', value: 198000, change: -31.0, count: 15 },
      { period: 'Week 4', value: 245000, change: 23.7, count: 19 },
    ],
    monthlyTrends: [
      { period: 'January', value: 890000, change: 15.2, count: 78 },
      { period: 'February', value: 745000, change: -16.3, count: 65 },
      { period: 'March', value: 924000, change: 24.0, count: 82 },
      { period: 'April', value: 812000, change: -12.1, count: 71 },
      { period: 'May', value: 856000, change: 5.4, count: 77 },
      { period: 'June', value: 792000, change: -7.5, count: 69 },
      { period: 'July', value: 834000, change: 5.3, count: 74 },
      { period: 'August', value: 701000, change: -15.9, count: 63 },
    ],
  },
};

// Helper function to get report by ID
export function getReportById(id: string): ReportData | undefined {
  return MOCK_REPORTS.find((report) => report.id === id);
}

// Helper function to get reports by category
export function getReportsByCategory(category: ReportCategory): ReportData[] {
  return MOCK_REPORTS.filter((report) => report.category === category);
}

// Helper function to get scheduled reports
export function getScheduledReports(): ReportData[] {
  return MOCK_REPORTS.filter((report) => report.isScheduled);
}
