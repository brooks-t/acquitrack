import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { BreadcrumbService } from '../../layout/breadcrumb.service';

interface ReportData {
  name: string;
  description: string;
  lastGenerated: string;
  format: string;
}

@Component({
  selector: 'at-reports',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-surface-900">
            Reports & Analytics
          </h1>
          <p class="text-surface-600 mt-2">
            Generate insights from procurement data
          </p>
        </div>
        <p-button
          label="Create Custom Report"
          icon="pi pi-plus"
          severity="primary"
        />
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <p-card class="text-center">
          <div class="text-3xl font-bold text-primary-500 mb-2">42</div>
          <div class="text-surface-600">Active Solicitations</div>
        </p-card>
        <p-card class="text-center">
          <div class="text-3xl font-bold text-green-500 mb-2">$2.4M</div>
          <div class="text-surface-600">Contract Value (YTD)</div>
        </p-card>
        <p-card class="text-center">
          <div class="text-3xl font-bold text-blue-500 mb-2">156</div>
          <div class="text-surface-600">Purchase Requests</div>
        </p-card>
        <p-card class="text-center">
          <div class="text-3xl font-bold text-orange-500 mb-2">89%</div>
          <div class="text-surface-600">On-Time Performance</div>
        </p-card>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <p-card header="Monthly Spending Trend">
          <p-chart
            type="line"
            [data]="chartData"
            [options]="chartOptions"
            class="h-64"
          />
        </p-card>
        <p-card header="Procurement by Category">
          <p-chart
            type="doughnut"
            [data]="pieData"
            [options]="pieOptions"
            class="h-64"
          />
        </p-card>
      </div>

      <!-- Available Reports -->
      <p-card header="Available Reports">
        <div class="mb-4">
          <p-button
            label="Generate All"
            icon="pi pi-refresh"
            severity="secondary"
            [outlined]="true"
            class="mr-2"
          />
          <p-button
            label="Schedule Reports"
            icon="pi pi-calendar"
            severity="secondary"
            [outlined]="true"
          />
        </div>

        <p-table [value]="reports" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Report Name</th>
              <th>Description</th>
              <th>Last Generated</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-report>
            <tr>
              <td>
                <div class="font-semibold text-surface-900">
                  {{ report.name }}
                </div>
              </td>
              <td>
                <div class="text-surface-600">{{ report.description }}</div>
              </td>
              <td>
                <span class="text-surface-600">{{ report.lastGenerated }}</span>
              </td>
              <td>
                <span
                  class="px-2 py-1 bg-surface-100 rounded text-xs font-medium"
                >
                  {{ report.format }}
                </span>
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    label="Generate"
                    icon="pi pi-play"
                    size="small"
                    severity="primary"
                  />
                  <p-button
                    label="Download"
                    icon="pi pi-download"
                    size="small"
                    [outlined]="true"
                    severity="secondary"
                  />
                  <p-button
                    icon="pi pi-cog"
                    size="small"
                    [text]="true"
                    severity="secondary"
                    pTooltip="Configure"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
})
export class ReportsComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  reports: ReportData[] = [
    {
      name: 'Vendor Performance Report',
      description:
        'Comprehensive analysis of vendor delivery and quality metrics',
      lastGenerated: '2025-08-18',
      format: 'PDF/Excel',
    },
    {
      name: 'Contract Utilization Report',
      description: 'Current contract usage and remaining balances',
      lastGenerated: '2025-08-17',
      format: 'Excel',
    },
    {
      name: 'Procurement Pipeline Report',
      description: 'Status of all active purchase requests and solicitations',
      lastGenerated: '2025-08-16',
      format: 'PDF',
    },
    {
      name: 'Spend Analysis Report',
      description: 'Detailed breakdown of spending by category and vendor',
      lastGenerated: '2025-08-15',
      format: 'Excel/CSV',
    },
  ];

  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Spending ($000)',
        data: [420, 380, 450, 520, 480, 510],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  pieData = {
    labels: [
      'IT Services',
      'Professional Services',
      'Equipment',
      'Facilities',
      'Other',
    ],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
      },
    ],
  };

  pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  ngOnInit(): void {
    // TODO: Implement breadcrumb service setItems method
    console.log('Reports component initialized');
  }
}
