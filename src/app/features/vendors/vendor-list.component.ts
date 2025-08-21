/**
 * Vendor List Component - Enhanced with Filtering & Search
 *
 * Features:
 * - PrimeNG v20 components with proper accessibility
 * - Reactive forms with signal integration (following PR form patterns)
 * - Advanced filtering (status, business type, rating, search)
 * - Pure Nora theme styling - zero custom CSS
 * - Responsive design with Nora design tokens
 */

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// PrimeNG v20 Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { DrawerModule } from 'primeng/drawer';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';

// Application imports
import { BreadcrumbService } from '../../layout/breadcrumb.service';
import { VendorService } from './data/vendor.service';
import {
  VendorStatus,
  BusinessType,
  VendorStatusLabels,
  BusinessTypeLabels,
} from './data/vendor.model';

@Component({
  selector: 'at-vendor-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    DrawerModule,
    InputNumberModule,
    MessageModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-color">Vendor Management</h1>
          <p class="text-color-secondary mt-1">
            Manage vendor information and relationships
          </p>
        </div>
        <div class="flex gap-2">
          <p-button
            label="Advanced Filters"
            icon="pi pi-filter"
            severity="secondary"
            [outlined]="true"
            (onClick)="toggleFilterDrawer()"
          />
          <p-button
            label="Export"
            icon="pi pi-download"
            severity="secondary"
            [outlined]="true"
            pTooltip="Export vendor list"
          />
          <p-button
            label="Add Vendor"
            icon="pi pi-plus"
            severity="primary"
            pTooltip="Create new vendor"
          />
        </div>
      </div>

      <!-- Search Bar -->
      <p-card>
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <label for="search" class="sr-only">Search vendors</label>
            <input
              id="search"
              pInputText
              placeholder="Search by name, CAGE code, or DUNS number..."
              class="w-full"
              [formControl]="searchControl"
              aria-label="Search vendors"
            />
          </div>
          @if (hasActiveFilters()) {
            <p-button
              label="Clear Filters"
              icon="pi pi-times"
              severity="secondary"
              [outlined]="true"
              size="small"
              (onClick)="clearAllFilters()"
            />
          }
        </div>
      </p-card>

      <!-- Vendor Statistics -->
      @if (vendorService.stats(); as stats) {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <p-card class="text-center">
            <div class="text-2xl font-bold text-color mb-1">
              {{ stats.total }}
            </div>
            <div class="text-sm text-color-secondary">Total Vendors</div>
          </p-card>
          <p-card class="text-center">
            <div class="text-2xl font-bold text-green-600 mb-1">
              {{ stats.active }}
            </div>
            <div class="text-sm text-color-secondary">Active</div>
          </p-card>
          <p-card class="text-center">
            <div class="text-2xl font-bold text-primary-600 mb-1">
              {{ stats.totalActiveContracts }}
            </div>
            <div class="text-sm text-color-secondary">Active Contracts</div>
          </p-card>
          <p-card class="text-center">
            <div class="text-2xl font-bold text-orange-600 mb-1">
              {{ stats.averageRating.toFixed(1) }}
            </div>
            <div class="text-sm text-color-secondary">Avg Rating</div>
          </p-card>
        </div>
      }

      <!-- Vendors Table -->
      <p-card>
        <p-table
          [value]="vendorService.vendors()"
          [paginator]="true"
          [rows]="25"
          [rowsPerPageOptions]="[10, 25, 50, 100]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vendors"
          [loading]="vendorService.isLoading()"
          styleClass="p-datatable-sm"
          [globalFilterFields]="['name', 'cageCode', 'duns']"
          responsiveLayout="scroll"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="name">
                Vendor Name
                <p-sortIcon field="name" />
              </th>
              <th pSortableColumn="cageCode">
                CAGE Code
                <p-sortIcon field="cageCode" />
              </th>
              <th>DUNS</th>
              <th pSortableColumn="status">
                Status
                <p-sortIcon field="status" />
              </th>
              <th pSortableColumn="businessType">
                Business Type
                <p-sortIcon field="businessType" />
              </th>
              <th pSortableColumn="overallRating">
                Rating
                <p-sortIcon field="overallRating" />
              </th>
              <th pSortableColumn="lastActivity">
                Last Activity
                <p-sortIcon field="lastActivity" />
              </th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-vendor>
            <tr>
              <td>
                <div class="font-semibold text-color">
                  {{ vendor.name }}
                </div>
              </td>
              <td>
                <span class="font-mono text-sm text-color">{{
                  vendor.cageCode
                }}</span>
              </td>
              <td>
                <span class="font-mono text-sm text-color">{{
                  vendor.duns
                }}</span>
              </td>
              <td>
                <p-tag
                  [value]="getStatusLabel(vendor.status)"
                  [severity]="vendorService.getStatusSeverity(vendor.status)"
                />
              </td>
              <td>
                <span class="text-sm text-color">{{
                  getBusinessTypeLabel(vendor.businessType)
                }}</span>
              </td>
              <td>
                @if (vendor.overallRating) {
                  <div class="flex items-center gap-1">
                    <span class="font-semibold text-color">{{
                      vendor.overallRating.toFixed(1)
                    }}</span>
                    <i class="pi pi-star-fill text-yellow-500 text-sm"></i>
                  </div>
                } @else {
                  <span class="text-color-secondary text-sm">Not rated</span>
                }
              </td>
              <td>
                <span class="text-sm text-color-secondary">
                  {{ formatDate(vendor.lastActivity) }}
                </span>
              </td>
              <td>
                <div class="flex gap-1">
                  <p-button
                    icon="pi pi-eye"
                    size="small"
                    [text]="true"
                    severity="secondary"
                    pTooltip="View Details"
                    ariaLabel="View vendor details"
                  />
                  <p-button
                    icon="pi pi-pencil"
                    size="small"
                    [text]="true"
                    severity="secondary"
                    pTooltip="Edit Vendor"
                    ariaLabel="Edit vendor"
                  />
                  <p-button
                    icon="pi pi-trash"
                    size="small"
                    [text]="true"
                    severity="danger"
                    pTooltip="Delete Vendor"
                    ariaLabel="Delete vendor"
                  />
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-8">
                <div class="flex flex-col items-center text-color-secondary">
                  <i class="pi pi-inbox text-4xl mb-4"></i>
                  <p class="text-lg mb-2">No vendors found</p>
                  @if (hasActiveFilters()) {
                    <p class="text-sm mb-4">
                      Try adjusting your search criteria
                    </p>
                    <p-button
                      label="Clear Filters"
                      icon="pi pi-times"
                      severity="secondary"
                      [outlined]="true"
                      size="small"
                      (onClick)="clearAllFilters()"
                    />
                  } @else {
                    <p class="text-sm">Start by adding your first vendor</p>
                  }
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="loadingbody">
            <tr>
              <td colspan="8">
                <div class="p-4">
                  <p-skeleton height="2rem" class="mb-2" />
                  <p-skeleton height="2rem" class="mb-2" />
                  <p-skeleton height="2rem" />
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Error Message -->
      @if (vendorService.error()) {
        <p-message
          severity="error"
          [text]="vendorService.error()!"
          [closable]="true"
        />
      }
    </div>

    <!-- Advanced Filters Drawer -->
    <p-drawer
      [(visible)]="filterDrawerVisible"
      position="right"
      header="Advanced Filters"
      [style]="{ width: '25rem' }"
      [modal]="true"
    >
      <ng-template pTemplate="content">
        <div [formGroup]="filterForm" class="space-y-6">
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
              formControlName="statuses"
              [options]="statusOptions()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select statuses"
              class="w-full"
              appendTo="body"
              ariaLabel="Filter by vendor status"
            />
          </div>

          <!-- Business Type Filter -->
          <div class="field">
            <label
              for="businessType"
              class="block text-sm font-medium text-color mb-2"
            >
              Business Type
            </label>
            <p-multiselect
              id="businessType"
              formControlName="businessTypes"
              [options]="businessTypeOptions()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select business types"
              class="w-full"
              appendTo="body"
              ariaLabel="Filter by business type"
            />
          </div>

          <!-- Rating Range -->
          <div class="field">
            <div class="block text-sm font-medium text-color mb-2">
              Rating Range
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label
                  for="minRating"
                  class="block text-xs text-color-secondary mb-1"
                >
                  Minimum
                </label>
                <p-inputNumber
                  id="minRating"
                  formControlName="minRating"
                  [min]="0"
                  [max]="5"
                  [step]="0.1"
                  placeholder="0.0"
                  styleClass="w-full"
                />
              </div>
              <div>
                <label
                  for="maxRating"
                  class="block text-xs text-color-secondary mb-1"
                >
                  Maximum
                </label>
                <p-inputNumber
                  id="maxRating"
                  formControlName="maxRating"
                  [min]="0"
                  [max]="5"
                  [step]="0.1"
                  placeholder="5.0"
                  styleClass="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex gap-2 pt-4">
            <p-button
              label="Apply Filters"
              icon="pi pi-check"
              severity="primary"
              class="flex-1"
              (onClick)="applyFilters()"
            />
            <p-button
              label="Reset"
              icon="pi pi-refresh"
              severity="secondary"
              [outlined]="true"
              (onClick)="resetFilters()"
            />
          </div>
        </div>
      </ng-template>
    </p-drawer>
  `,
})
export class VendorListComponent implements OnInit {
  // Injected services
  private breadcrumbService = inject(BreadcrumbService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  // Make vendorService public for template access
  vendorService = inject(VendorService);

  // Component state signals
  filterDrawerVisible = signal(false);

  // Forms following the reactive pattern from PR form
  searchControl = this.fb.control('');
  filterForm: FormGroup;

  // Filter options for UI dropdowns
  statusOptions = computed(() =>
    Object.values(VendorStatus).map((status) => ({
      label: VendorStatusLabels[status],
      value: status,
    }))
  );

  businessTypeOptions = computed(() =>
    Object.values(BusinessType).map((type) => ({
      label: BusinessTypeLabels[type],
      value: type,
    }))
  );

  // Check if any filters are active
  hasActiveFilters = computed(() => {
    const currentFilters = this.vendorService.getCurrentFilters();
    return !!(
      currentFilters.searchTerm ||
      (currentFilters.statuses && currentFilters.statuses.length > 0) ||
      (currentFilters.businessTypes &&
        currentFilters.businessTypes.length > 0) ||
      currentFilters.minRating ||
      currentFilters.maxRating
    );
  });

  constructor() {
    // Initialize filter form
    this.filterForm = this.fb.group({
      statuses: [[]],
      businessTypes: [[]],
      minRating: [null],
      maxRating: [null],
    });

    // Set up reactive search following PR form pattern
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm) => {
        this.vendorService.updateFilters({
          searchTerm: searchTerm || undefined,
        });
      });

    // Set up reactive filters
    this.filterForm.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((filters) => {
        this.vendorService.updateFilters({
          statuses: filters.statuses?.length > 0 ? filters.statuses : undefined,
          businessTypes:
            filters.businessTypes?.length > 0
              ? filters.businessTypes
              : undefined,
          minRating: filters.minRating || undefined,
          maxRating: filters.maxRating || undefined,
        });
      });
  }

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.loadVendors();
  }

  // Filter management methods
  toggleFilterDrawer(): void {
    this.filterDrawerVisible.update((visible) => !visible);
  }

  applyFilters(): void {
    // Filters are applied automatically via reactive form
    this.filterDrawerVisible.set(false);
  }

  resetFilters(): void {
    this.filterForm.reset({
      statuses: [],
      businessTypes: [],
      minRating: null,
      maxRating: null,
    });
  }

  clearAllFilters(): void {
    this.searchControl.setValue('');
    this.resetFilters();
    this.vendorService.clearFilters();
  }

  // Data loading
  private loadVendors(): void {
    this.vendorService.getVendors().subscribe({
      next: () => {
        // Data loaded successfully - handled by service signals
      },
      error: (error) => {
        console.error('Failed to load vendors:', error);
      },
    });
  }

  // Utility methods for template
  getStatusLabel(status: VendorStatus): string {
    return VendorStatusLabels[status];
  }

  getBusinessTypeLabel(type: BusinessType): string {
    return BusinessTypeLabels[type];
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  }

  // Breadcrumb setup
  private setBreadcrumbs(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Vendor Management', routerLink: '/vendors' },
    ]);
  }
}
