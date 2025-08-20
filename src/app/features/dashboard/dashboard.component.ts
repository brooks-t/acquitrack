import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG v20 Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';

import { BreadcrumbService } from '../../layout/breadcrumb.service';
import {
  DashboardService,
  DashboardStats,
  TaskItem,
  ActivityItem,
} from './dashboard.service';

@Component({
  selector: 'at-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    ChartModule,
    DataViewModule,
    TagModule,
    ProgressBarModule,
    SkeletonModule,
    AvatarModule,
    BadgeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Stats Cards Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- My Tasks Card -->
        <p-card class="h-full">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-color mb-1">
                {{ stats().myTasks }}
              </div>
              <div class="text-sm text-muted-color font-medium">My Tasks</div>
            </div>
            <div
              class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-list text-primary-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4">
            <p-button
              label="View All"
              [text]="true"
              class="w-full"
              routerLink="/approvals"
            />
          </div>
        </p-card>

        <!-- Pending Approvals Card -->
        <p-card class="h-full">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-color mb-1">
                {{ stats().pendingApprovals }}
              </div>
              <div class="text-sm text-muted-color font-medium">
                Pending Approvals
              </div>
            </div>
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-clock text-orange-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4">
            <p-button
              label="Review"
              [text]="true"
              class="w-full"
              routerLink="/approvals"
            />
          </div>
        </p-card>

        <!-- Total PRs Card -->
        <p-card class="h-full">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-color mb-1">
                {{ stats().totalPurchaseRequests }}
              </div>
              <div class="text-sm text-muted-color font-medium">
                Purchase Requests
              </div>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-file-edit text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4">
            <p-button
              label="View All"
              [text]="true"
              class="w-full"
              routerLink="/purchase-requests"
            />
          </div>
        </p-card>

        <!-- Monthly Spend Card -->
        <p-card class="h-full">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-color mb-1">
                \${{ formatCurrency(stats().monthlySpend) }}
              </div>
              <div class="text-sm text-muted-color font-medium">
                Monthly Spend
              </div>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-dollar text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4">
            <p-button
              label="View Reports"
              [text]="true"
              class="w-full"
              routerLink="/reports"
            />
          </div>
        </p-card>
      </div>

      <!-- Main Content Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- My Tasks List -->
        <div class="lg:col-span-2">
          <p-card>
            <ng-template #header>
              <div
                class="flex items-center justify-between p-4 border-b border-surface-200"
              >
                <h3 class="text-lg font-semibold text-color">My Tasks</h3>
                <p-badge [value]="myTasks().length.toString()" />
              </div>
            </ng-template>

            <div class="space-y-3">
              @if (isLoading()) {
                @for (_ of [1, 2, 3]; track $index) {
                  <div class="flex items-center gap-3 p-3">
                    <p-skeleton width="2rem" height="2rem" borderRadius="50%" />
                    <div class="flex-1">
                      <p-skeleton width="60%" height="1rem" class="mb-2" />
                      <p-skeleton width="40%" height="0.875rem" />
                    </div>
                  </div>
                }
              } @else {
                @for (task of myTasks(); track task.id) {
                  <div
                    class="flex items-center gap-3 p-3 hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      [class]="getTaskIconClass(task.type)"
                    >
                      <i [class]="getTaskIcon(task.type)"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-medium text-color truncate">{{
                          task.title
                        }}</span>
                        <p-tag
                          [value]="task.priority"
                          [severity]="getPrioritySeverity(task.priority)"
                          class="text-xs"
                        />
                      </div>
                      <div class="text-sm text-muted-color">
                        Due {{ formatRelativeDate(task.dueDate) }}
                      </div>
                    </div>
                    <p-button
                      icon="pi pi-arrow-right"
                      [text]="true"
                      aria-label="View task"
                    />
                  </div>
                }
              }
            </div>

            @if (!isLoading() && myTasks().length === 0) {
              <div class="text-center py-8">
                <i class="pi pi-check-circle text-4xl text-green-500 mb-4"></i>
                <h4 class="text-lg font-medium text-color mb-2">
                  All caught up!
                </h4>
                <p class="text-muted-color">You have no pending tasks.</p>
              </div>
            }

            <ng-template #footer>
              @if (myTasks().length > 0) {
                <div class="p-4 border-t border-surface-200">
                  <p-button
                    label="View All Tasks"
                    [text]="true"
                    class="w-full"
                    routerLink="/approvals"
                  />
                </div>
              }
            </ng-template>
          </p-card>
        </div>

        <!-- Sidebar Content -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <p-card>
            <ng-template #header>
              <div class="p-4 border-b border-surface-200">
                <h3 class="text-lg font-semibold text-color">Quick Actions</h3>
              </div>
            </ng-template>

            <div class="flex flex-col gap-4">
              <p-button
                label="New Purchase Request"
                icon="pi pi-plus"
                class="w-full"
                routerLink="/purchase-requests"
              />
              <p-button
                label="Add Vendor"
                icon="pi pi-building"
                severity="secondary"
                [outlined]="true"
                class="w-full"
                routerLink="/vendors"
              />
              <p-button
                label="View Reports"
                icon="pi pi-chart-bar"
                severity="secondary"
                [outlined]="true"
                class="w-full"
                routerLink="/reports"
              />
            </div>
          </p-card>

          <!-- Recent Activity -->
          <p-card>
            <ng-template #header>
              <div class="p-4 border-b border-surface-200">
                <h3 class="text-lg font-semibold text-color">
                  Recent Activity
                </h3>
              </div>
            </ng-template>

            <div class="space-y-3">
              @if (isLoading()) {
                @for (_ of [1, 2, 3]; track $index) {
                  <div class="flex items-start gap-3">
                    <p-skeleton width="2rem" height="2rem" borderRadius="50%" />
                    <div class="flex-1">
                      <p-skeleton width="80%" height="0.875rem" class="mb-1" />
                      <p-skeleton width="50%" height="0.75rem" />
                    </div>
                  </div>
                }
              } @else {
                @for (activity of recentActivity(); track activity.id) {
                  <div class="flex items-start gap-3">
                    <p-avatar
                      [label]="getInitials(activity.user)"
                      size="normal"
                      shape="circle"
                      styleClass="bg-primary-500 text-white text-xs"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-color">
                        <span class="font-medium">{{ activity.user }}</span>
                        {{ activity.action }}
                        <span class="font-medium">{{ activity.entity }}</span>
                      </div>
                      <div class="text-xs text-muted-color">
                        {{ formatRelativeDate(activity.timestamp) }}
                      </div>
                    </div>
                    <div
                      class="w-2 h-2 rounded-full"
                      [class]="getActivityTypeColor(activity.type)"
                    ></div>
                  </div>
                }
              }
            </div>

            @if (!isLoading() && recentActivity().length > 3) {
              <ng-template #footer>
                <div class="p-4 border-t border-surface-200">
                  <p-button
                    label="View All Activity"
                    [text]="true"
                    class="w-full"
                  />
                </div>
              </ng-template>
            }
          </p-card>

          <!-- Progress Overview -->
          <p-card>
            <ng-template #header>
              <div class="p-4 border-b border-surface-200">
                <h3 class="text-lg font-semibold text-color">This Month</h3>
              </div>
            </ng-template>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-color"
                    >Approvals Completed</span
                  >
                  <span class="text-sm text-muted-color">18/25</span>
                </div>
                <p-progressBar [value]="72" [showValue]="false" />
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-color"
                    >Budget Utilized</span
                  >
                  <span class="text-sm text-muted-color">65%</span>
                </div>
                <p-progressBar [value]="65" [showValue]="false" />
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-color"
                    >Vendor Onboarding</span
                  >
                  <span class="text-sm text-muted-color">4/6</span>
                </div>
                <p-progressBar [value]="67" [showValue]="false" />
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);
  private dashboardService = inject(DashboardService);

  // Signals for state management
  isLoading = signal(true);
  stats = signal<DashboardStats>({
    myTasks: 0,
    pendingApprovals: 0,
    recentActivity: 0,
    totalPurchaseRequests: 0,
    totalVendors: 0,
    monthlySpend: 0,
  });

  myTasks = signal<TaskItem[]>([]);
  recentActivity = signal<ActivityItem[]>([]);

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([{ label: 'Dashboard' }]);
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load all dashboard data concurrently
    Promise.all([
      this.loadStats(),
      this.loadTasks(),
      this.loadActivity(),
    ]).finally(() => {
      this.isLoading.set(false);
    });
  }

  private async loadStats(): Promise<void> {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err) => console.error('Error loading stats:', err),
    });
  }

  private async loadTasks(): Promise<void> {
    this.dashboardService.getMyTasks().subscribe({
      next: (tasks) => this.myTasks.set(tasks),
      error: (err) => console.error('Error loading tasks:', err),
    });
  }

  private async loadActivity(): Promise<void> {
    this.dashboardService.getRecentActivity().subscribe({
      next: (activity) => this.recentActivity.set(activity),
      error: (err) => console.error('Error loading activity:', err),
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours > 0) {
      if (diffInHours < 24) {
        return `in ${Math.ceil(diffInHours)} hours`;
      } else {
        return `in ${Math.ceil(diffInHours / 24)} days`;
      }
    } else {
      if (Math.abs(diffInHours) < 24) {
        return `${Math.ceil(Math.abs(diffInHours))} hours ago`;
      } else {
        return `${Math.ceil(Math.abs(diffInHours) / 24)} days ago`;
      }
    }
  }

  getTaskIcon(type: string): string {
    switch (type) {
      case 'approval':
        return 'pi pi-check-circle';
      case 'review':
        return 'pi pi-eye';
      case 'action':
        return 'pi pi-cog';
      default:
        return 'pi pi-info-circle';
    }
  }

  getTaskIconClass(type: string): string {
    switch (type) {
      case 'approval':
        return 'bg-green-100 text-green-600';
      case 'review':
        return 'bg-blue-100 text-blue-600';
      case 'action':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-surface-100 text-color-secondary';
    }
  }

  getPrioritySeverity(
    priority: string
  ): 'success' | 'warn' | 'danger' | 'info' {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warn';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getActivityTypeColor(type: string): string {
    switch (type) {
      case 'approved':
        return 'bg-green-500';
      case 'created':
        return 'bg-blue-500';
      case 'updated':
        return 'bg-orange-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-surface-400';
    }
  }
}
