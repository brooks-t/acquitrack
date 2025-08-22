/**
 * Reports Domain Model
 *
 * Provides analytics and reporting data structures for the reports feature.
 * Integrates with existing services to provide comprehensive reporting capabilities.
 */

export interface ReportData {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  lastGenerated?: Date;
  format: ReportFormat[];
  isScheduled: boolean;
  scheduleConfig?: ReportSchedule;
  parameters?: ReportParameter[];
}

export interface ReportSchedule {
  frequency: ScheduleFrequency;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  recipients: string[];
  isActive: boolean;
}

export interface ReportParameter {
  key: string;
  label: string;
  type: ParameterType;
  required: boolean;
  defaultValue?: unknown;
  options?: ReportParameterOption[];
}

export interface ReportParameterOption {
  label: string;
  value: unknown;
}

export interface AnalyticsData {
  procurementMetrics: ProcurementMetrics;
  spendingAnalysis: SpendingAnalysis;
  vendorPerformance: VendorPerformance;
  timelineData: TimelineData;
}

export interface ProcurementMetrics {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  averageProcessingTime: number; // days
  totalValue: number;
  averageRequestValue: number;
  requestsByStatus: StatusBreakdown[];
  requestsByPriority: PriorityBreakdown[];
}

export interface SpendingAnalysis {
  monthlySpending: MonthlySpending[];
  categoryBreakdown: CategorySpending[];
  vendorSpending: VendorSpending[];
  fundingSourceUtilization: FundingUtilization[];
  yearOverYearComparison: YearOverYearData[];
}

export interface VendorPerformance {
  totalVendors: number;
  activeVendors: number;
  averageRating: number;
  topPerformers: VendorRating[];
  contractUtilization: ContractUtilization[];
  onTimeDelivery: number; // percentage
}

export interface TimelineData {
  dailyActivity: ActivityPoint[];
  weeklyTrends: TrendPoint[];
  monthlyTrends: TrendPoint[];
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
  value: number;
}

export interface PriorityBreakdown {
  priority: string;
  count: number;
  percentage: number;
  averageValue: number;
}

export interface MonthlySpending {
  month: string;
  year: number;
  amount: number;
  requestCount: number;
  averageValue: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  requestCount: number;
  topVendors: string[];
}

export interface VendorSpending {
  vendorId: string;
  vendorName: string;
  totalSpent: number;
  requestCount: number;
  averageOrderValue: number;
  performance: number; // rating
}

export interface FundingUtilization {
  sourceId: string;
  sourceName: string;
  totalBudget: number;
  utilized: number;
  remaining: number;
  utilizationPercentage: number;
}

export interface YearOverYearData {
  period: string;
  currentYear: number;
  previousYear: number;
  percentageChange: number;
}

export interface VendorRating {
  vendorId: string;
  vendorName: string;
  overallRating: number;
  contractCount: number;
  totalValue: number;
  onTimePercentage: number;
}

export interface ContractUtilization {
  contractId: string;
  vendorName: string;
  totalValue: number;
  utilized: number;
  remaining: number;
  utilizationPercentage: number;
}

export interface ActivityPoint {
  date: Date;
  requestsCreated: number;
  requestsApproved: number;
  requestsRejected: number;
  totalValue: number;
}

export interface TrendPoint {
  period: string;
  value: number;
  change: number; // percentage change from previous period
  count: number;
}

// Filter interfaces for reports
export interface ReportFilters {
  dateFrom?: Date;
  dateTo?: Date;
  categories?: string[];
  statuses?: string[];
  vendors?: string[];
  fundingSources?: string[];
  minAmount?: number;
  maxAmount?: number;
  includeArchived?: boolean;
}

export interface GenerateReportRequest {
  reportId: string;
  format: ReportFormat;
  filters?: ReportFilters;
  parameters?: Record<string, unknown>;
}

export interface ReportExport {
  id: string;
  reportId: string;
  format: ReportFormat;
  fileUrl: string;
  generatedAt: Date;
  expiresAt: Date;
  fileSize: number;
}

// Enums
export enum ReportCategory {
  PROCUREMENT = 'procurement',
  FINANCIAL = 'financial',
  VENDOR = 'vendor',
  COMPLIANCE = 'compliance',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

export enum ParameterType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
}

// Display labels
export const ReportCategoryLabels: Record<ReportCategory, string> = {
  [ReportCategory.PROCUREMENT]: 'Procurement',
  [ReportCategory.FINANCIAL]: 'Financial',
  [ReportCategory.VENDOR]: 'Vendor Management',
  [ReportCategory.COMPLIANCE]: 'Compliance',
  [ReportCategory.PERFORMANCE]: 'Performance',
  [ReportCategory.CUSTOM]: 'Custom Reports',
};

export const ReportFormatLabels: Record<ReportFormat, string> = {
  [ReportFormat.PDF]: 'PDF',
  [ReportFormat.EXCEL]: 'Excel',
  [ReportFormat.CSV]: 'CSV',
  [ReportFormat.JSON]: 'JSON',
};

export const ScheduleFrequencyLabels: Record<ScheduleFrequency, string> = {
  [ScheduleFrequency.DAILY]: 'Daily',
  [ScheduleFrequency.WEEKLY]: 'Weekly',
  [ScheduleFrequency.MONTHLY]: 'Monthly',
  [ScheduleFrequency.QUARTERLY]: 'Quarterly',
  [ScheduleFrequency.ANNUALLY]: 'Annually',
};
