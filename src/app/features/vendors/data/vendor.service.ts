/**
 * Vendor Service
 *
 * Follows the established pattern from PurchaseRequestService:
 * - Mock data for development
 * - Observables → Signals conversion
 * - Error handling with graceful fallbacks
 * - CRUD operations with optimistic updates
 */

import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, throwError, tap } from 'rxjs';
import {
  Vendor,
  VendorSummary,
  VendorFilters,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorStatus,
  BusinessType,
  VendorSearchResponse,
} from './vendor.model';
import {
  MOCK_VENDOR_SUMMARIES,
  AVAILABLE_CAPABILITIES,
  getMockVendorById,
  filterMockVendors,
} from './vendor.mock';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  // Internal state signals
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _vendors = signal<VendorSummary[]>(MOCK_VENDOR_SUMMARIES);
  private _filters = signal<VendorFilters>({});

  // Public readonly signals
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  // Computed signals for filtered and processed data
  vendors = computed(() => {
    const vendors = this._vendors();
    const filters = this._filters();

    return filterMockVendors(vendors, {
      searchTerm: filters.searchTerm,
      statuses: filters.statuses,
      businessTypes: filters.businessTypes,
      minRating: filters.minRating,
      maxRating: filters.maxRating,
    });
  });

  // Available filter options
  availableCapabilities = signal(AVAILABLE_CAPABILITIES);

  // Statistics for dashboard
  stats = computed(() => {
    const vendors = this.vendors();
    return {
      total: vendors.length,
      active: vendors.filter((v) => v.status === VendorStatus.ACTIVE).length,
      inactive: vendors.filter((v) => v.status === VendorStatus.INACTIVE)
        .length,
      pendingReview: vendors.filter(
        (v) => v.status === VendorStatus.PENDING_REVIEW
      ).length,
      suspended: vendors.filter((v) => v.status === VendorStatus.SUSPENDED)
        .length,
      averageRating:
        vendors.reduce((sum, v) => sum + (v.overallRating || 0), 0) /
        vendors.length,
      totalActiveContracts: vendors.reduce(
        (sum, v) => sum + v.activeContracts,
        0
      ),
    };
  });

  // Filter options for UI dropdowns
  statusOptions = computed(() =>
    Object.values(VendorStatus).map((status) => ({
      label: this.getStatusLabel(status),
      value: status,
    }))
  );

  businessTypeOptions = computed(() =>
    Object.values(BusinessType).map((type) => ({
      label: this.getBusinessTypeLabel(type),
      value: type,
    }))
  );

  // CRUD Operations

  /**
   * Get all vendors with optional filtering
   */
  getVendors(filters?: VendorFilters): Observable<VendorSummary[]> {
    this._isLoading.set(true);
    this._error.set(null);

    if (filters) {
      this.updateFilters(filters);
    }

    return of(this.vendors()).pipe(
      delay(300), // Simulate API delay
      tap(() => this._isLoading.set(false)),
      tap({
        error: (error) => {
          this._error.set('Failed to load vendors');
          this._isLoading.set(false);
          console.error('Error loading vendors:', error);
        },
      })
    );
  }

  /**
   * Get vendor by ID with full details
   */
  getVendorById(id: string): Observable<Vendor | null> {
    this._isLoading.set(true);
    this._error.set(null);

    const vendor = getMockVendorById(id);

    if (!vendor) {
      return throwError(() => new Error(`Vendor with ID ${id} not found`));
    }

    return of(vendor).pipe(
      delay(200),
      tap(() => this._isLoading.set(false)),
      tap({
        error: (error) => {
          this._error.set('Failed to load vendor details');
          this._isLoading.set(false);
          console.error('Error loading vendor:', error);
        },
      })
    );
  }

  /**
   * Create a new vendor
   */
  createVendor(request: CreateVendorRequest): Observable<Vendor> {
    this._isLoading.set(true);
    this._error.set(null);

    // Simulate validation
    if (!request.name || !request.cageCode || !request.duns) {
      return throwError(
        () => new Error('Name, CAGE Code, and DUNS are required')
      );
    }

    // Check for duplicate CAGE code or DUNS
    const existing = this._vendors().find(
      (v) => v.cageCode === request.cageCode || v.duns === request.duns
    );

    if (existing) {
      return throwError(
        () => new Error('Vendor with this CAGE Code or DUNS already exists')
      );
    }

    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      name: request.name,
      cageCode: request.cageCode,
      duns: request.duns,
      status: VendorStatus.PENDING_REVIEW,
      pointOfContact: request.pointOfContact,
      address: request.address,
      businessType: request.businessType,
      capabilities: request.capabilities,
      pastPerformance: [],
      documents: [],
      certifications: [],
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      registeredAt: new Date(),
    };

    return of(newVendor).pipe(
      delay(500),
      tap((vendor) => {
        // Add to vendors list (optimistic update)
        const newSummary: VendorSummary = {
          id: vendor.id,
          name: vendor.name,
          cageCode: vendor.cageCode,
          duns: vendor.duns,
          status: vendor.status,
          businessType: vendor.businessType,
          lastActivity: vendor.lastActivity,
          activeContracts: 0,
        };

        this._vendors.update((vendors) => [...vendors, newSummary]);
        this._isLoading.set(false);
      }),
      tap({
        error: (error) => {
          this._error.set('Failed to create vendor');
          this._isLoading.set(false);
          console.error('Error creating vendor:', error);
        },
      })
    );
  }

  /**
   * Update an existing vendor
   */
  updateVendor(request: UpdateVendorRequest): Observable<Vendor> {
    this._isLoading.set(true);
    this._error.set(null);

    const existingVendor = getMockVendorById(request.id);
    if (!existingVendor) {
      return throwError(
        () => new Error(`Vendor with ID ${request.id} not found`)
      );
    }

    const updatedVendor: Vendor = {
      ...existingVendor,
      ...request,
      updatedAt: new Date(),
    };

    return of(updatedVendor).pipe(
      delay(400),
      tap((vendor) => {
        // Update vendors list (optimistic update)
        this._vendors.update((vendors) =>
          vendors.map((v) =>
            v.id === vendor.id
              ? {
                  ...v,
                  name: vendor.name,
                  cageCode: vendor.cageCode,
                  duns: vendor.duns,
                  status: vendor.status,
                  businessType: vendor.businessType,
                  lastActivity: vendor.lastActivity,
                }
              : v
          )
        );
        this._isLoading.set(false);
      }),
      tap({
        error: (error) => {
          this._error.set('Failed to update vendor');
          this._isLoading.set(false);
          console.error('Error updating vendor:', error);
        },
      })
    );
  }

  /**
   * Delete a vendor
   */
  deleteVendor(id: string): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    const vendor = this._vendors().find((v) => v.id === id);
    if (!vendor) {
      return throwError(() => new Error(`Vendor with ID ${id} not found`));
    }

    return of(void 0).pipe(
      delay(300),
      tap(() => {
        // Remove from vendors list (optimistic update)
        this._vendors.update((vendors) => vendors.filter((v) => v.id !== id));
        this._isLoading.set(false);
      }),
      tap({
        error: (error) => {
          this._error.set('Failed to delete vendor');
          this._isLoading.set(false);
          console.error('Error deleting vendor:', error);
        },
      })
    );
  }

  /**
   * Search vendors with pagination
   */
  searchVendors(
    searchTerm: string,
    filters?: Partial<VendorFilters>,
    page = 1,
    pageSize = 25
  ): Observable<VendorSearchResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    const allFilters: VendorFilters = {
      searchTerm,
      ...filters,
    };

    const filteredVendors = filterMockVendors(this._vendors(), allFilters);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

    const response: VendorSearchResponse = {
      vendors: paginatedVendors,
      totalCount: filteredVendors.length,
      pageSize,
      currentPage: page,
    };

    return of(response).pipe(
      delay(250),
      tap(() => this._isLoading.set(false)),
      tap({
        error: (error) => {
          this._error.set('Failed to search vendors');
          this._isLoading.set(false);
          console.error('Error searching vendors:', error);
        },
      })
    );
  }

  // Filter management
  updateFilters(filters: Partial<VendorFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({});
  }

  getCurrentFilters(): VendorFilters {
    return this._filters();
  }

  // Utility methods
  private getStatusLabel(status: VendorStatus): string {
    const labels: Record<VendorStatus, string> = {
      [VendorStatus.ACTIVE]: 'Active',
      [VendorStatus.INACTIVE]: 'Inactive',
      [VendorStatus.PENDING_REVIEW]: 'Pending Review',
      [VendorStatus.SUSPENDED]: 'Suspended',
      [VendorStatus.DEBARRED]: 'Debarred',
    };
    return labels[status];
  }

  private getBusinessTypeLabel(type: BusinessType): string {
    const labels: Record<BusinessType, string> = {
      [BusinessType.SMALL_BUSINESS]: 'Small Business',
      [BusinessType.LARGE_BUSINESS]: 'Large Business',
      [BusinessType.SMALL_DISADVANTAGED]: 'Small Disadvantaged Business',
      [BusinessType.WOMAN_OWNED]: 'Woman-Owned Small Business',
      [BusinessType.VETERAN_OWNED]: 'Veteran-Owned Small Business',
      [BusinessType.HUBZONE]: 'HUBZone Small Business',
      [BusinessType.SERVICE_DISABLED_VETERAN]: 'Service-Disabled Veteran-Owned',
      [BusinessType.HISTORICALLY_BLACK]:
        'Historically Black College/University',
    };
    return labels[type];
  }

  // Status severity for PrimeNG tags
  getStatusSeverity(status: VendorStatus): string {
    switch (status) {
      case VendorStatus.ACTIVE:
        return 'success';
      case VendorStatus.INACTIVE:
        return 'secondary';
      case VendorStatus.PENDING_REVIEW:
        return 'warning';
      case VendorStatus.SUSPENDED:
      case VendorStatus.DEBARRED:
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
