/**
 * Purchase Request List Component
 *
 * Features:
 * - PrimeNG Table with filtering, sorting, pagination
 * - Status badges and priority indicators
 * - Search and filter sidebar
 * - Pure Nora theme styling
 * - Responsive design
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Components (v20+ naming)
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { DrawerModule } from 'primeng/drawer';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';

import { PurchaseRequestService } from '../data/purchase-request.service';
import { BreadcrumbService } from '../../../layout/breadcrumb.service';
import {
  PurchaseRequestStatus,
  Priority,
} from '../data/purchase-request.model';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'at-purchase-request-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    SkeletonModule,
    DrawerModule,
    DatePickerModule,
    MultiSelectModule,
    PanelModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-color">Purchase Requests</h1>
          <p class="text-color-secondary mt-1">
            Manage procurement requests and track approval status
          </p>
        </div>

        <div class="flex items-center gap-3">
          <p-button
            icon="pi pi-filter"
            label="Filters"
            severity="secondary"
            [outlined]="true"
            (onClick)="toggleFilters()"
            class="sm:hidden"
          />
          <p-button
            icon="pi pi-refresh"
            severity="secondary"
            [text]="true"
            (onClick)="refresh()"
            pTooltip="Refresh data"
          />
          <p-button
            icon="pi pi-plus"
            label="New Request"
            routerLink="/purchase-requests/new"
          />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <p-card class="text-center">
          <div class="text-2xl font-bold text-primary-600 mb-1">
            {{ stats().total }}
          </div>
          <div class="text-sm text-color-secondary">Total Requests</div>
        </p-card>

        <p-card class="text-center">
          <div class="text-2xl font-bold text-orange-600 mb-1">
            {{ stats().underReview }}
          </div>
          <div class="text-sm text-color-secondary">Under Review</div>
        </p-card>

        <p-card class="text-center">
          <div class="text-2xl font-bold text-green-600 mb-1">
            {{ stats().approved }}
          </div>
          <div class="text-sm text-color-secondary">Approved</div>
        </p-card>

        <p-card class="text-center">
          <div class="text-2xl font-bold text-color mb-1">
            {{ formatCurrency(stats().totalValue) }}
          </div>
          <div class="text-sm text-color-secondary">Total Value</div>
        </p-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <p-card>
            <ng-template #header>
              <div class="p-4 border-b border-surface-200">
                <h3 class="text-lg font-semibold text-color">Filters</h3>
              </div>
            </ng-template>

            <div class="space-y-4">
              <!-- Search -->
              <div class="field">
                <label
                  for="search"
                  class="block text-sm font-medium text-color mb-2"
                >
                  Search
                </label>
                <p-inputtext
                  id="search"
                  [(ngModel)]="searchTerm"
                  placeholder="PR number, requester..."
                  class="w-full"
                  (input)="onSearchChange()"
                />
              </div>

              <!-- Status Filter -->
              <div class="field">
                <label
                  for="status"
                  class="block text-sm font-medium text-color mb-2"
                >
                  Status
                </label>
                <p-multiselect
                  id="status"
                  [(ngModel)]="selectedStatuses"
                  [options]="statusOptions"
                  placeholder="Select statuses"
                  class="w-full"
                  (onChange)="onFilterChange()"
                />
              </div>

              <!-- Priority Filter -->
              <div class="field">
                <label
                  for="priority"
                  class="block text-sm font-medium text-color mb-2"
                >
                  Priority
                </label>
                <p-multiselect
                  id="priority"
                  [(ngModel)]="selectedPriorities"
                  [options]="priorityOptions"
                  placeholder="Select priorities"
                  class="w-full"
                  (onChange)="onFilterChange()"
                />
              </div>

              <!-- Date Range -->
              <div class="field">
                <div class="block text-sm font-medium text-color mb-2">
                  Date Range
                </div>
                <div class="space-y-2">
                  <p-datepicker
                    [(ngModel)]="dateFrom"
                    placeholder="From date"
                    class="w-full"
                    (onSelect)="onFilterChange()"
                    inputId="dateFrom"
                    ariaLabel="From date"
                  />
                  <p-datepicker
                    [(ngModel)]="dateTo"
                    placeholder="To date"
                    class="w-full"
                    (onSelect)="onFilterChange()"
                    inputId="dateTo"
                    ariaLabel="To date"
                  />
                </div>
              </div>

              <!-- Amount Range -->
              <div class="field">
                <div class="block text-sm font-medium text-color mb-2">
                  Amount Range
                </div>
                <div class="space-y-2">
                  <p-inputtext
                    [(ngModel)]="amountMin"
                    placeholder="Min amount"
                    type="number"
                    class="w-full"
                    (input)="onFilterChange()"
                    ariaLabel="Minimum amount"
                  />
                  <p-inputtext
                    [(ngModel)]="amountMax"
                    placeholder="Max amount"
                    type="number"
                    class="w-full"
                    (input)="onFilterChange()"
                    ariaLabel="Maximum amount"
                  />
                </div>
              </div>

              <!-- Clear Filters -->
              <p-button
                label="Clear All Filters"
                severity="secondary"
                [text]="true"
                class="w-full"
                (onClick)="clearFilters()"
              />
            </div>
          </p-card>
        </div>

        <!-- Data Table -->
        <div class="lg:col-span-3">
          <p-card>
            <ng-template #header>
              <div
                class="p-4 border-b border-surface-200 flex items-center justify-between"
              >
                <h3 class="text-lg font-semibold text-color">
                  Purchase Requests ({{ filteredRequests().length }})
                </h3>
                <p-button
                  icon="pi pi-download"
                  label="Export"
                  severity="secondary"
                  [outlined]="true"
                  size="small"
                  (onClick)="exportData()"
                />
              </div>
            </ng-template>

            @if (isLoading()) {
              <!-- Loading Skeleton -->
              <div class="space-y-4">
                @for (item of [1, 2, 3, 4, 5]; track item) {
                  <div class="flex items-center gap-4 p-4">
                    <p-skeleton width="8rem" height="1.5rem" />
                    <p-skeleton width="12rem" height="1.5rem" />
                    <p-skeleton width="6rem" height="1.5rem" />
                    <p-skeleton width="4rem" height="1.5rem" />
                    <p-skeleton width="8rem" height="1.5rem" />
                  </div>
                }
              </div>
            } @else {
              <p-table
                [value]="filteredRequests()"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 25, 50]"
                [sortField]="'createdAt'"
                [sortOrder]="-1"
                [globalFilterFields]="['prNumber', 'requester', 'organization']"
                styleClass="p-datatable-sm"
                responsiveLayout="scroll"
              >
                <ng-template pTemplate="header">
                  <tr>
                    <th pSortableColumn="prNumber" class="text-left">
                      PR Number
                      <p-sortIcon field="prNumber" />
                    </th>
                    <th pSortableColumn="requester" class="text-left">
                      Requester
                      <p-sortIcon field="requester" />
                    </th>
                    <th pSortableColumn="organization" class="text-left">
                      Organization
                      <p-sortIcon field="organization" />
                    </th>
                    <th pSortableColumn="totalAmount" class="text-right">
                      Amount
                      <p-sortIcon field="totalAmount" />
                    </th>
                    <th pSortableColumn="status" class="text-center">
                      Status
                      <p-sortIcon field="status" />
                    </th>
                    <th pSortableColumn="priority" class="text-center">
                      Priority
                      <p-sortIcon field="priority" />
                    </th>
                    <th pSortableColumn="needDate" class="text-center">
                      Need Date
                      <p-sortIcon field="needDate" />
                    </th>
                    <th class="text-center">Actions</th>
                  </tr>
                </ng-template>

                <ng-template pTemplate="body" let-pr>
                  <tr>
                    <td>
                      <a
                        [routerLink]="['/purchase-requests', pr.id]"
                        class="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {{ pr.prNumber }}
                      </a>
                    </td>
                    <td>{{ pr.requester }}</td>
                    <td>{{ pr.organization }}</td>
                    <td class="text-right">
                      {{ formatCurrency(pr.totalAmount) }}
                    </td>
                    <td class="text-center">
                      <p-tag
                        [value]="getStatusLabel(pr.status)"
                        [severity]="getStatusSeverity(pr.status)"
                      />
                    </td>
                    <td class="text-center">
                      <p-tag
                        [value]="getPriorityLabel(pr.priority)"
                        [severity]="getPrioritySeverity(pr.priority)"
                      />
                    </td>
                    <td class="text-center">{{ formatDate(pr.needDate) }}</td>
                    <td class="text-center">
                      <div class="flex items-center justify-center gap-1">
                        <p-button
                          icon="pi pi-eye"
                          size="small"
                          [text]="true"
                          severity="secondary"
                          [routerLink]="['/purchase-requests', pr.id]"
                          pTooltip="View details"
                        />
                        <p-button
                          icon="pi pi-pencil"
                          size="small"
                          [text]="true"
                          severity="secondary"
                          [routerLink]="['/purchase-requests', pr.id, 'edit']"
                          pTooltip="Edit"
                          [disabled]="!canEdit(pr.status)"
                        />
                      </div>
                    </td>
                  </tr>
                </ng-template>

                <ng-template pTemplate="emptymessage">
                  <tr>
                    <td colspan="8" class="text-center p-8">
                      <div class="text-color-secondary">
                        <i class="pi pi-inbox text-4xl mb-3 block"></i>
                        <p class="text-lg">No purchase requests found</p>
                        <p class="text-sm mt-1">
                          @if (hasActiveFilters()) {
                            Try adjusting your filters or
                            <button
                              type="button"
                              class="text-primary-600 hover:text-primary-700 underline"
                              (click)="clearFilters()"
                            >
                              clear all filters
                            </button>
                          } @else {
                            Create your first purchase request to get started
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            }
          </p-card>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Drawer -->
    <p-drawer
      [(visible)]="showMobileFilters"
      position="right"
      header="Filters"
      [modal]="true"
      class="lg:hidden"
    >
      <!-- Same filter content as sidebar, optimized for mobile -->
      <div class="space-y-4">
        <!-- Simplified mobile filters here -->
        <div class="field">
          <label
            for="mobile-search"
            class="block text-sm font-medium text-color mb-2"
          >
            Search
          </label>
          <p-inputtext
            id="mobile-search"
            [(ngModel)]="searchTerm"
            placeholder="PR number, requester..."
            class="w-full"
            (input)="onSearchChange()"
          />
        </div>

        <p-button
          label="Apply Filters"
          class="w-full"
          (onClick)="toggleFilters()"
        />
      </div>
    </p-drawer>
  `,
})
export class PurchaseRequestListComponent implements OnInit {
  private purchaseRequestService = inject(PurchaseRequestService);
  private breadcrumbService = inject(BreadcrumbService);

  // Data signals
  isLoading = this.purchaseRequestService.isLoading;
  stats = this.purchaseRequestService.stats;
  purchaseRequests = this.purchaseRequestService.purchaseRequestSummaries;

  // Filter state
  searchTerm = signal('');
  selectedStatuses = signal<PurchaseRequestStatus[]>([]);
  selectedPriorities = signal<Priority[]>([]);
  dateFrom = signal<Date | null>(null);
  dateTo = signal<Date | null>(null);
  amountMin = signal<number | null>(null);
  amountMax = signal<number | null>(null);
  showMobileFilters = signal(false);

  // Filter options
  statusOptions: FilterOption[] = [
    { label: 'Draft', value: PurchaseRequestStatus.DRAFT },
    { label: 'Submitted', value: PurchaseRequestStatus.SUBMITTED },
    { label: 'Under Review', value: PurchaseRequestStatus.UNDER_REVIEW },
    {
      label: 'Pending Approval',
      value: PurchaseRequestStatus.PENDING_APPROVAL,
    },
    { label: 'Approved', value: PurchaseRequestStatus.APPROVED },
    { label: 'Rejected', value: PurchaseRequestStatus.REJECTED },
    { label: 'Cancelled', value: PurchaseRequestStatus.CANCELLED },
  ];

  priorityOptions: FilterOption[] = [
    { label: 'Low', value: Priority.LOW },
    { label: 'Medium', value: Priority.MEDIUM },
    { label: 'High', value: Priority.HIGH },
    { label: 'Urgent', value: Priority.URGENT },
  ];

  // Computed filtered results
  filteredRequests = computed(() => {
    let requests = this.purchaseRequests();

    // Apply search term
    const search = this.searchTerm().toLowerCase();
    if (search) {
      requests = requests.filter(
        (pr) =>
          pr.prNumber.toLowerCase().includes(search) ||
          pr.requester.toLowerCase().includes(search) ||
          pr.organization.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    const statuses = this.selectedStatuses();
    if (statuses.length > 0) {
      requests = requests.filter((pr) => statuses.includes(pr.status));
    }

    // Apply priority filter
    const priorities = this.selectedPriorities();
    if (priorities.length > 0) {
      requests = requests.filter((pr) => priorities.includes(pr.priority));
    }

    // Apply date range
    const fromDate = this.dateFrom();
    const toDate = this.dateTo();
    if (fromDate) {
      requests = requests.filter((pr) => pr.createdAt >= fromDate);
    }
    if (toDate) {
      requests = requests.filter((pr) => pr.createdAt <= toDate);
    }

    // Apply amount range
    const minAmount = this.amountMin();
    const maxAmount = this.amountMax();
    if (minAmount !== null) {
      requests = requests.filter((pr) => pr.totalAmount >= minAmount);
    }
    if (maxAmount !== null) {
      requests = requests.filter((pr) => pr.totalAmount <= maxAmount);
    }

    return requests;
  });

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.loadData();
  }

  private setBreadcrumbs(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Purchase Requests' },
    ]);
  }

  private loadData(): void {
    // Data is automatically loaded via service signals
    this.purchaseRequestService.getPurchaseRequests().subscribe();
  }

  onSearchChange(): void {
    // Filter updates automatically via computed signal
  }

  onFilterChange(): void {
    // Filter updates automatically via computed signal
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatuses.set([]);
    this.selectedPriorities.set([]);
    this.dateFrom.set(null);
    this.dateTo.set(null);
    this.amountMin.set(null);
    this.amountMax.set(null);
  }

  hasActiveFilters(): boolean {
    return (
      this.searchTerm() !== '' ||
      this.selectedStatuses().length > 0 ||
      this.selectedPriorities().length > 0 ||
      this.dateFrom() !== null ||
      this.dateTo() !== null ||
      this.amountMin() !== null ||
      this.amountMax() !== null
    );
  }

  toggleFilters(): void {
    this.showMobileFilters.update((show) => !show);
  }

  refresh(): void {
    this.purchaseRequestService.refresh();
  }

  exportData(): void {
    // TODO: Implement data export functionality
    console.log('Export functionality not yet implemented');
  }

  canEdit(status: PurchaseRequestStatus): boolean {
    return (
      status === PurchaseRequestStatus.DRAFT ||
      status === PurchaseRequestStatus.REJECTED
    );
  }

  // UI Helper Methods
  getStatusLabel(status: PurchaseRequestStatus): string {
    const statusMap: Record<PurchaseRequestStatus, string> = {
      [PurchaseRequestStatus.DRAFT]: 'Draft',
      [PurchaseRequestStatus.SUBMITTED]: 'Submitted',
      [PurchaseRequestStatus.UNDER_REVIEW]: 'Under Review',
      [PurchaseRequestStatus.PENDING_APPROVAL]: 'Pending Approval',
      [PurchaseRequestStatus.APPROVED]: 'Approved',
      [PurchaseRequestStatus.REJECTED]: 'Rejected',
      [PurchaseRequestStatus.CANCELLED]: 'Cancelled',
      [PurchaseRequestStatus.ON_HOLD]: 'On Hold',
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(
    status: PurchaseRequestStatus
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<
      PurchaseRequestStatus,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
    > = {
      [PurchaseRequestStatus.DRAFT]: 'secondary',
      [PurchaseRequestStatus.SUBMITTED]: 'info',
      [PurchaseRequestStatus.UNDER_REVIEW]: 'warn',
      [PurchaseRequestStatus.PENDING_APPROVAL]: 'warn',
      [PurchaseRequestStatus.APPROVED]: 'success',
      [PurchaseRequestStatus.REJECTED]: 'danger',
      [PurchaseRequestStatus.CANCELLED]: 'secondary',
      [PurchaseRequestStatus.ON_HOLD]: 'contrast',
    };
    return severityMap[status] || 'secondary';
  }

  getPriorityLabel(priority: Priority): string {
    const priorityMap: Record<Priority, string> = {
      [Priority.LOW]: 'Low',
      [Priority.MEDIUM]: 'Medium',
      [Priority.HIGH]: 'High',
      [Priority.URGENT]: 'Urgent',
    };
    return priorityMap[priority] || priority;
  }

  getPrioritySeverity(
    priority: Priority
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<
      Priority,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
    > = {
      [Priority.LOW]: 'secondary',
      [Priority.MEDIUM]: 'info',
      [Priority.HIGH]: 'warn',
      [Priority.URGENT]: 'danger',
    };
    return severityMap[priority] || 'secondary';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }
}
