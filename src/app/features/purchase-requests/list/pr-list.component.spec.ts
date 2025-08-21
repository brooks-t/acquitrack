/**
 * Purchase Request List Component Unit Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { PurchaseRequestListComponent } from './pr-list.component';
import { PurchaseRequestService } from '../data/purchase-request.service';
import { BreadcrumbService } from '../../../layout/breadcrumb.service';
import {
  PurchaseRequestStatus,
  Priority,
} from '../data/purchase-request.model';

describe('PurchaseRequestListComponent', () => {
  let component: PurchaseRequestListComponent;
  let fixture: ComponentFixture<PurchaseRequestListComponent>;
  let mockPurchaseRequestService: Partial<PurchaseRequestService>;
  let mockBreadcrumbService: Partial<BreadcrumbService>;

  const mockStats = {
    total: 4,
    draft: 1,
    submitted: 1,
    underReview: 1,
    approved: 1,
    rejected: 1,
    totalValue: 100000,
    avgValue: 25000,
  };

  const mockPurchaseRequestSummaries = [
    {
      id: 'pr-1',
      prNumber: 'PR-2025-001',
      requester: 'John Smith',
      organization: 'IT Division',
      totalAmount: 30000,
      status: PurchaseRequestStatus.UNDER_REVIEW,
      priority: Priority.HIGH,
      needDate: new Date('2025-09-15'),
      createdAt: new Date('2025-08-15'),
      lineItemCount: 1,
    },
  ];

  beforeEach(async () => {
    mockPurchaseRequestService = {
      getPurchaseRequests: jest.fn().mockReturnValue(of([])),
      refresh: jest.fn(),
      isLoading: signal(false),
      stats: signal(mockStats),
      purchaseRequestSummaries: signal(mockPurchaseRequestSummaries),
    };

    mockBreadcrumbService = {
      setBreadcrumbs: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        PurchaseRequestListComponent,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: PurchaseRequestService,
          useValue: mockPurchaseRequestService,
        },
        { provide: BreadcrumbService, useValue: mockBreadcrumbService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseRequestListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set breadcrumbs on init', () => {
    component.ngOnInit();
    expect(mockBreadcrumbService.setBreadcrumbs).toHaveBeenCalledWith([
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Purchase Requests' },
    ]);
  });

  it('should display stats', () => {
    expect(component.stats()).toEqual(mockStats);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(30000);
    expect(formatted).toBe('$30,000');
  });

  it('should format date correctly', () => {
    const testDate = new Date('2025-08-15T12:00:00Z');
    const formatted = component.formatDate(testDate);
    expect(formatted).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
  });

  it('should determine if request can be edited', () => {
    expect(component.canEdit(PurchaseRequestStatus.DRAFT)).toBe(true);
    expect(component.canEdit(PurchaseRequestStatus.REJECTED)).toBe(true);
    expect(component.canEdit(PurchaseRequestStatus.APPROVED)).toBe(false);
    expect(component.canEdit(PurchaseRequestStatus.SUBMITTED)).toBe(false);
  });

  it('should get correct status label', () => {
    expect(component.getStatusLabel(PurchaseRequestStatus.DRAFT)).toBe('Draft');
    expect(component.getStatusLabel(PurchaseRequestStatus.UNDER_REVIEW)).toBe(
      'Under Review'
    );
    expect(component.getStatusLabel(PurchaseRequestStatus.APPROVED)).toBe(
      'Approved'
    );
  });

  it('should get correct priority label', () => {
    expect(component.getPriorityLabel(Priority.LOW)).toBe('Low');
    expect(component.getPriorityLabel(Priority.HIGH)).toBe('High');
    expect(component.getPriorityLabel(Priority.URGENT)).toBe('Urgent');
  });

  it('should clear filters', () => {
    // Set up filter values using regular property assignment (modern approach)
    component.searchTerm = 'test';
    component.selectedStatuses = [PurchaseRequestStatus.DRAFT];
    component.dateFrom = new Date();

    component.clearFilters();

    // Verify all filters are cleared
    expect(component.searchTerm).toBe('');
    expect(component.selectedStatuses).toEqual([]);
    expect(component.dateFrom).toBeNull();
  });

  it('should detect active filters', () => {
    expect(component.hasActiveFilters()).toBe(false);

    // Test with search term
    component.searchTerm = 'test';
    expect(component.hasActiveFilters()).toBe(true);

    // Clear and test with status filter
    component.clearFilters();
    component.selectedStatuses = [PurchaseRequestStatus.DRAFT];
    expect(component.hasActiveFilters()).toBe(true);
  });

  it('should refresh data', () => {
    component.refresh();
    expect(mockPurchaseRequestService.refresh).toHaveBeenCalled();
  });
});
