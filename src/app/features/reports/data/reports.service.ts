/**
 * Reports Service
 *
 * Provides analytics and reporting functionality by integrating data from
 * existing services (PurchaseRequestService, VendorService, etc.)
 * Following the established signal-based pattern.
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

// Import existing services
import { PurchaseRequestService } from '../../purchase-requests/data/purchase-request.service';
import { VendorService } from '../../vendors/data/vendor.service';

// Import model types
import {
  ReportData,
  AnalyticsData,
  ProcurementMetrics,
  SpendingAnalysis,
  VendorPerformance,
  TimelineData,
  ReportFilters,
  GenerateReportRequest,
  ReportExport,
  ReportCategory,
  ReportFormat,
  MonthlySpending,
  CategorySpending,
  StatusBreakdown,
  PriorityBreakdown,
} from './reports.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  // Inject existing services
  private purchaseRequestService = inject(PurchaseRequestService);
  private vendorService = inject(VendorService);

  // Internal state signals
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _filters = signal<ReportFilters>({});

  // Public readonly signals
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  // Available reports
  private _availableReports = signal<ReportData[]>([
    {
      id: 'vendor-performance',
      name: 'Vendor Performance Report',
      description:
        'Comprehensive analysis of vendor delivery and quality metrics',
      category: ReportCategory.VENDOR,
      format: [ReportFormat.PDF, ReportFormat.EXCEL],
      isScheduled: true,
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
      lastGenerated: new Date('2025-08-14'),
    },
  ]);

  availableReports = this._availableReports.asReadonly();

  // Computed analytics data from existing services
  analyticsData = computed((): AnalyticsData => {
    const prStats = this.purchaseRequestService.stats();
    const vendorStats = this.vendorService.stats();
    const prSummaries = this.purchaseRequestService.purchaseRequestSummaries();

    return {
      procurementMetrics: this.calculateProcurementMetrics(
        prStats as Record<string, number>,
        prSummaries as unknown as Record<string, unknown>[]
      ),
      spendingAnalysis: this.calculateSpendingAnalysis(),
      vendorPerformance: this.calculateVendorPerformance(
        vendorStats as Record<string, number>
      ),
      timelineData: this.calculateTimelineData(),
    };
  });

  // Chart data for visualizations
  monthlySpendingChart = computed(() => {
    const analytics = this.analyticsData();
    const monthlyData = analytics.spendingAnalysis.monthlySpending;

    return {
      labels: monthlyData.map((d) => d.month),
      datasets: [
        {
          label: 'Monthly Spending ($000)',
          data: monthlyData.map((d) => Math.round(d.amount / 1000)),
          borderColor: 'rgb(var(--primary-500))',
          backgroundColor: 'rgba(var(--primary-500), 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  });

  categorySpendingChart = computed(() => {
    const analytics = this.analyticsData();
    const categoryData = analytics.spendingAnalysis.categoryBreakdown;

    return {
      labels: categoryData.map((d) => d.category),
      datasets: [
        {
          data: categoryData.map((d) => d.percentage),
          backgroundColor: [
            'rgb(var(--primary-500))',
            'rgb(var(--green-500))',
            'rgb(var(--orange-500))',
            'rgb(var(--red-500))',
            'rgb(var(--purple-500))',
            'rgb(var(--blue-500))',
          ],
          borderWidth: 2,
          borderColor: 'rgb(var(--surface-0))',
        },
      ],
    };
  });

  statusBreakdownChart = computed(() => {
    const analytics = this.analyticsData();
    const statusData = analytics.procurementMetrics.requestsByStatus;

    return {
      labels: statusData.map((d) => d.status),
      datasets: [
        {
          data: statusData.map((d) => d.count),
          backgroundColor: [
            'rgb(var(--gray-400))', // Draft
            'rgb(var(--blue-500))', // Submitted
            'rgb(var(--orange-500))', // Under Review
            'rgb(var(--yellow-500))', // Pending Approval
            'rgb(var(--green-500))', // Approved
            'rgb(var(--red-500))', // Rejected
          ],
        },
      ],
    };
  });

  // Key performance indicators
  kpis = computed(() => {
    const analytics = this.analyticsData();
    const procurementMetrics = analytics.procurementMetrics;
    const vendorMetrics = analytics.vendorPerformance;

    return {
      totalRequests: procurementMetrics.totalRequests,
      totalValue: procurementMetrics.totalValue,
      averageProcessingTime: procurementMetrics.averageProcessingTime,
      onTimeDelivery: vendorMetrics.onTimeDelivery,
      averageVendorRating: vendorMetrics.averageRating,
      activeVendors: vendorMetrics.activeVendors,
      completionRate:
        (procurementMetrics.completedRequests /
          procurementMetrics.totalRequests) *
        100,
      averageRequestValue: procurementMetrics.averageRequestValue,
    };
  });

  // Methods for calculating analytics
  private calculateProcurementMetrics(
    prStats: Record<string, number>,
    summaries: Record<string, unknown>[]
  ): ProcurementMetrics {
    const statusBreakdown: StatusBreakdown[] = [
      {
        status: 'Draft',
        count: prStats['draft'] || 0,
        percentage: ((prStats['draft'] || 0) / (prStats['total'] || 1)) * 100,
        value: 0,
      },
      {
        status: 'Submitted',
        count: prStats['submitted'] || 0,
        percentage:
          ((prStats['submitted'] || 0) / (prStats['total'] || 1)) * 100,
        value: 0,
      },
      {
        status: 'Under Review',
        count: prStats['underReview'] || 0,
        percentage:
          ((prStats['underReview'] || 0) / (prStats['total'] || 1)) * 100,
        value: 0,
      },
      {
        status: 'Approved',
        count: prStats['approved'] || 0,
        percentage:
          ((prStats['approved'] || 0) / (prStats['total'] || 1)) * 100,
        value: 0,
      },
      {
        status: 'Rejected',
        count: prStats['rejected'] || 0,
        percentage:
          ((prStats['rejected'] || 0) / (prStats['total'] || 1)) * 100,
        value: 0,
      },
    ];

    // Calculate priority breakdown
    const priorityCounts = summaries.reduce(
      (acc, pr) => {
        const priority = (pr['priority'] as string) || 'Medium';
        acc[priority] = ((acc[priority] as number) || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const priorityBreakdown: PriorityBreakdown[] = Object.entries(
      priorityCounts
    ).map(([priority, count]) => ({
      priority,
      count: count as number,
      percentage: ((count as number) / summaries.length) * 100,
      averageValue:
        summaries
          .filter((pr) => pr['priority'] === priority)
          .reduce((sum, pr) => sum + ((pr['totalAmount'] as number) || 0), 0) /
        (count as number),
    }));

    return {
      totalRequests: prStats['total'] || 0,
      activeRequests:
        (prStats['total'] || 0) -
        (prStats['approved'] || 0) -
        (prStats['rejected'] || 0),
      completedRequests: prStats['approved'] || 0,
      averageProcessingTime: 5.2, // Mock data
      totalValue: prStats['totalValue'] || 0,
      averageRequestValue: prStats['avgValue'] || 0,
      requestsByStatus: statusBreakdown,
      requestsByPriority: priorityBreakdown,
    };
  }

  private calculateSpendingAnalysis(): SpendingAnalysis {
    // Generate monthly spending data
    const monthlySpending: MonthlySpending[] = [
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
    ];

    // Calculate category breakdown
    const categorySpending: CategorySpending[] = [
      {
        category: 'IT Equipment',
        amount: 850000,
        percentage: 35,
        requestCount: 45,
        topVendors: ['TechForward Industries', 'Acme Defense Solutions'],
      },
      {
        category: 'Professional Services',
        amount: 607500,
        percentage: 25,
        requestCount: 32,
        topVendors: ['Excellence Engineering', 'Global Manufacturing Corp'],
      },
      {
        category: 'Office Supplies',
        amount: 486000,
        percentage: 20,
        requestCount: 28,
        topVendors: ['Office Supply Co', 'Business Essentials'],
      },
      {
        category: 'Construction',
        amount: 364500,
        percentage: 15,
        requestCount: 18,
        topVendors: ['HUBZone Construction Co'],
      },
      {
        category: 'Other',
        amount: 121500,
        percentage: 5,
        requestCount: 12,
        topVendors: ['Various Vendors'],
      },
    ];

    return {
      monthlySpending,
      categoryBreakdown: categorySpending,
      vendorSpending: [], // Will be calculated from vendor data
      fundingSourceUtilization: [], // Mock data
      yearOverYearComparison: [], // Mock data
    };
  }

  private calculateVendorPerformance(
    vendorStats: Record<string, number>
  ): VendorPerformance {
    return {
      totalVendors: vendorStats['total'] || 0,
      activeVendors: vendorStats['active'] || 0,
      averageRating: vendorStats['averageRating'] || 4.2,
      topPerformers: [], // Will be calculated from vendor data
      contractUtilization: [], // Mock data
      onTimeDelivery: 89.5, // Mock data
    };
  }

  private calculateTimelineData(): TimelineData {
    // Mock timeline data - in real implementation, this would be calculated from actual data
    return {
      dailyActivity: [],
      weeklyTrends: [],
      monthlyTrends: [],
    };
  }

  // Report generation methods
  generateReport(request: GenerateReportRequest): Observable<ReportExport> {
    this._isLoading.set(true);
    this._error.set(null);

    // Mock report generation
    const reportExport: ReportExport = {
      id: `export-${Date.now()}`,
      reportId: request.reportId,
      format: request.format,
      fileUrl: `/api/reports/exports/report-${Date.now()}.${request.format}`,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      fileSize: Math.floor(Math.random() * 1000000) + 100000, // Mock file size
    };

    return of(reportExport).pipe(
      delay(2000), // Simulate generation time
      tap(() => this._isLoading.set(false)),
      tap({
        error: (error) => {
          this._error.set('Failed to generate report');
          this._isLoading.set(false);
          console.error('Error generating report:', error);
        },
      })
    );
  }

  // Filter management
  updateFilters(filters: Partial<ReportFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({});
  }

  getCurrentFilters(): ReportFilters {
    return this._filters();
  }

  // Chart options for PrimeNG charts
  getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            color: 'rgb(var(--text-color))',
          },
        },
        tooltip: {
          backgroundColor: 'rgb(var(--surface-0))',
          titleColor: 'rgb(var(--text-color))',
          bodyColor: 'rgb(var(--text-color-secondary))',
          borderColor: 'rgb(var(--surface-border))',
          borderWidth: 1,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgb(var(--surface-border))',
          },
          ticks: {
            color: 'rgb(var(--text-color-secondary))',
          },
        },
        x: {
          grid: {
            color: 'rgb(var(--surface-border))',
          },
          ticks: {
            color: 'rgb(var(--text-color-secondary))',
          },
        },
      },
    };
  }

  getPieChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            color: 'rgb(var(--text-color))',
          },
        },
        tooltip: {
          backgroundColor: 'rgb(var(--surface-0))',
          titleColor: 'rgb(var(--text-color))',
          bodyColor: 'rgb(var(--text-color-secondary))',
          borderColor: 'rgb(var(--surface-border))',
          borderWidth: 1,
        },
      },
    };
  }
}
