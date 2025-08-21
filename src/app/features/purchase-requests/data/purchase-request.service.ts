/**
 * Purchase Request Service
 *
 * Follows the established pattern:
 * - Mock data for development
 * - Observables → Signals conversion
 * - Error handling with graceful fallbacks
 * - CRUD operations with optimistic updates
 */

import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, throwError, tap } from 'rxjs';
import {
  PurchaseRequest,
  PurchaseRequestSummary,
  PurchaseRequestFilters,
  CreatePurchaseRequestRequest,
  UpdatePurchaseRequestRequest,
  PurchaseRequestStatus,
  AuditAction,
} from './purchase-request.model';
import {
  mockPurchaseRequests,
  mockFundingSources,
  mockUsers,
  generatePrNumber,
  getPurchaseRequestById,
} from './purchase-request.mock';

@Injectable({
  providedIn: 'root',
})
export class PurchaseRequestService {
  // Internal state signals
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _purchaseRequests = signal<PurchaseRequest[]>(mockPurchaseRequests);
  private _filters = signal<PurchaseRequestFilters>({});

  // Public readonly signals
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  // Computed signals for filtered and processed data
  purchaseRequests = computed(() => {
    const requests = this._purchaseRequests();
    const filters = this._filters();

    return this.applyFilters(requests, filters);
  });

  // Summary data for dashboards and quick views
  purchaseRequestSummaries = computed((): PurchaseRequestSummary[] => {
    return this.purchaseRequests().map((pr) => ({
      id: pr.id,
      prNumber: pr.prNumber,
      requester: pr.requester.name,
      organization: pr.organization,
      totalAmount: pr.totalAmount,
      status: pr.status,
      priority: pr.priority,
      needDate: pr.needDate,
      createdAt: pr.createdAt,
      lineItemCount: pr.lineItems.length,
    }));
  });

  // Statistics for dashboard
  stats = computed(() => {
    const requests = this.purchaseRequests();
    return {
      total: requests.length,
      draft: requests.filter((pr) => pr.status === PurchaseRequestStatus.DRAFT)
        .length,
      submitted: requests.filter(
        (pr) => pr.status === PurchaseRequestStatus.SUBMITTED
      ).length,
      underReview: requests.filter(
        (pr) => pr.status === PurchaseRequestStatus.UNDER_REVIEW
      ).length,
      approved: requests.filter(
        (pr) => pr.status === PurchaseRequestStatus.APPROVED
      ).length,
      rejected: requests.filter(
        (pr) => pr.status === PurchaseRequestStatus.REJECTED
      ).length,
      totalValue: requests.reduce((sum, pr) => sum + pr.totalAmount, 0),
      avgValue:
        requests.length > 0
          ? requests.reduce((sum, pr) => sum + pr.totalAmount, 0) /
            requests.length
          : 0,
    };
  });

  /**
   * Get all purchase requests with optional filtering
   */
  getPurchaseRequests(
    filters?: PurchaseRequestFilters
  ): Observable<PurchaseRequest[]> {
    this._isLoading.set(true);
    this._error.set(null);

    if (filters) {
      this._filters.set(filters);
    }

    // Simulate API call with delay
    return of(this._purchaseRequests()).pipe(
      delay(500), // Simulate network delay
      tap(() => this._isLoading.set(false)) // Set loading to false when done
    );
  }

  /**
   * Get a single purchase request by ID
   */
  getPurchaseRequestById(id: string): Observable<PurchaseRequest | null> {
    this._isLoading.set(true);
    this._error.set(null);

    const request = getPurchaseRequestById(id);

    if (!request) {
      this._error.set('Purchase request not found');
      this._isLoading.set(false);
      return throwError(() => new Error('Purchase request not found'));
    }

    return of(request).pipe(
      delay(300),
      tap(() => this._isLoading.set(false))
    );
  }

  /**
   * Create a new purchase request
   */
  createPurchaseRequest(
    request: CreatePurchaseRequestRequest
  ): Observable<PurchaseRequest> {
    this._isLoading.set(true);
    this._error.set(null);

    // Get current user (mock)
    const currentUser = mockUsers[0]; // In real app, get from auth service

    // Calculate line item totals
    const lineItemsWithTotals = request.lineItems.map((item, index) => ({
      ...item,
      id: `line-${Date.now()}-${index}`,
      totalPrice: item.quantity * item.unitPrice,
    }));

    const totalAmount = lineItemsWithTotals.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const newPr: PurchaseRequest = {
      id: `pr-${Date.now()}`,
      prNumber: generatePrNumber(),
      requester: currentUser,
      organization: request.organization,
      needDate: request.needDate,
      totalAmount,
      lineItems: lineItemsWithTotals,
      fundingSource: mockFundingSources.find(
        (fs) => fs.id === request.fundingSourceId
      )!,
      status: PurchaseRequestStatus.DRAFT,
      priority: request.priority,
      justification: request.justification,
      history: [
        {
          id: `audit-${Date.now()}`,
          action: AuditAction.CREATED,
          actorId: currentUser.id,
          actorName: currentUser.name,
          timestamp: new Date(),
          details: 'Purchase request created',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update
    this._purchaseRequests.update((requests) => [...requests, newPr]);

    return of(newPr).pipe(delay(500));
  }

  /**
   * Update an existing purchase request
   */
  updatePurchaseRequest(
    request: UpdatePurchaseRequestRequest
  ): Observable<PurchaseRequest> {
    this._isLoading.set(true);
    this._error.set(null);

    const currentRequests = this._purchaseRequests();
    const existingIndex = currentRequests.findIndex(
      (pr) => pr.id === request.id
    );

    if (existingIndex === -1) {
      this._error.set('Purchase request not found');
      return throwError(() => new Error('Purchase request not found'));
    }

    const existing = currentRequests[existingIndex];
    const currentUser = mockUsers[0]; // In real app, get from auth service

    // Calculate new totals if line items changed
    let totalAmount = existing.totalAmount;
    let lineItems = existing.lineItems;

    if (request.lineItems) {
      lineItems = request.lineItems.map((item, index) => ({
        ...item,
        id: `line-${Date.now()}-${index}`,
        totalPrice: item.quantity * item.unitPrice,
      }));
      totalAmount = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    const updated: PurchaseRequest = {
      ...existing,
      ...request,
      id: existing.id, // Ensure ID doesn't change
      totalAmount,
      lineItems,
      updatedAt: new Date(),
      history: [
        ...existing.history,
        {
          id: `audit-${Date.now()}`,
          action: AuditAction.UPDATED,
          actorId: currentUser.id,
          actorName: currentUser.name,
          timestamp: new Date(),
          details: 'Purchase request updated',
        },
      ],
    };

    // Optimistic update
    this._purchaseRequests.update((requests) =>
      requests.map((pr) => (pr.id === request.id ? updated : pr))
    );

    return of(updated).pipe(delay(400));
  }

  /**
   * Submit a purchase request for approval
   */
  submitPurchaseRequest(id: string): Observable<PurchaseRequest> {
    this._isLoading.set(true);
    this._error.set(null);

    const currentRequests = this._purchaseRequests();
    const existing = currentRequests.find((pr) => pr.id === id);

    if (!existing) {
      this._error.set('Purchase request not found');
      return throwError(() => new Error('Purchase request not found'));
    }

    if (existing.status !== PurchaseRequestStatus.DRAFT) {
      this._error.set('Only draft purchase requests can be submitted');
      return throwError(
        () => new Error('Only draft purchase requests can be submitted')
      );
    }

    const currentUser = mockUsers[0]; // In real app, get from auth service

    const updated: PurchaseRequest = {
      ...existing,
      status: PurchaseRequestStatus.SUBMITTED,
      submittedAt: new Date(),
      updatedAt: new Date(),
      history: [
        ...existing.history,
        {
          id: `audit-${Date.now()}`,
          action: AuditAction.SUBMITTED,
          actorId: currentUser.id,
          actorName: currentUser.name,
          timestamp: new Date(),
          details: 'Purchase request submitted for approval',
        },
      ],
    };

    // Optimistic update
    this._purchaseRequests.update((requests) =>
      requests.map((pr) => (pr.id === id ? updated : pr))
    );

    return of(updated).pipe(delay(300));
  }

  /**
   * Cancel a purchase request
   */
  cancelPurchaseRequest(
    id: string,
    reason: string
  ): Observable<PurchaseRequest> {
    this._isLoading.set(true);
    this._error.set(null);

    const currentRequests = this._purchaseRequests();
    const existing = currentRequests.find((pr) => pr.id === id);

    if (!existing) {
      this._error.set('Purchase request not found');
      return throwError(() => new Error('Purchase request not found'));
    }

    const currentUser = mockUsers[0]; // In real app, get from auth service

    const updated: PurchaseRequest = {
      ...existing,
      status: PurchaseRequestStatus.CANCELLED,
      updatedAt: new Date(),
      history: [
        ...existing.history,
        {
          id: `audit-${Date.now()}`,
          action: AuditAction.CANCELLED,
          actorId: currentUser.id,
          actorName: currentUser.name,
          timestamp: new Date(),
          details: `Purchase request cancelled: ${reason}`,
        },
      ],
    };

    // Optimistic update
    this._purchaseRequests.update((requests) =>
      requests.map((pr) => (pr.id === id ? updated : pr))
    );

    return of(updated).pipe(delay(300));
  }

  /**
   * Apply filters to purchase requests
   */
  private applyFilters(
    requests: PurchaseRequest[],
    filters: PurchaseRequestFilters
  ): PurchaseRequest[] {
    return requests.filter((pr) => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(pr.status)) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(pr.priority)) return false;
      }

      // Requester filter
      if (filters.requester) {
        if (
          !pr.requester.name
            .toLowerCase()
            .includes(filters.requester.toLowerCase())
        )
          return false;
      }

      // Organization filter
      if (filters.organization) {
        if (
          !pr.organization
            .toLowerCase()
            .includes(filters.organization.toLowerCase())
        )
          return false;
      }

      // Date range filter
      if (filters.dateFrom && pr.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && pr.createdAt > filters.dateTo) return false;

      // Amount range filter
      if (filters.amountMin && pr.totalAmount < filters.amountMin) return false;
      if (filters.amountMax && pr.totalAmount > filters.amountMax) return false;

      // Category filter
      if (filters.category && filters.category.length > 0) {
        const prCategories = pr.lineItems.map((item) => item.category);
        if (!filters.category.some((cat) => prCategories.includes(cat)))
          return false;
      }

      return true;
    });
  }

  /**
   * Clear any error state
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Refresh data (simulate re-fetching from API)
   */
  refresh(): void {
    this._isLoading.set(true);
    this._error.set(null);

    // In real app, this would re-fetch from API
    setTimeout(() => {
      this._isLoading.set(false);
    }, 500);
  }

  /**
   * Get funding sources for dropdowns
   */
  getFundingSources(): Observable<typeof mockFundingSources> {
    return of(mockFundingSources).pipe(delay(200));
  }

  /**
   * Get users for dropdowns
   */
  getUsers(): Observable<typeof mockUsers> {
    return of(mockUsers).pipe(delay(200));
  }
}
