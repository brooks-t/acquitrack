/**
 * Purchase Request Service Unit Tests
 */

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PurchaseRequestService } from './purchase-request.service';
import {
  PurchaseRequestStatus,
  Priority,
  CreatePurchaseRequestRequest,
  ItemCategory,
} from './purchase-request.model';

describe('PurchaseRequestService', () => {
  let service: PurchaseRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseRequestService],
    });
    service = TestBed.inject(PurchaseRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial loading state as false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should return purchase requests', (done) => {
    service.getPurchaseRequests().subscribe((requests) => {
      expect(requests).toBeDefined();
      expect(Array.isArray(requests)).toBe(true);
      expect(requests.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should calculate stats correctly', () => {
    const stats = service.stats();
    expect(stats).toBeDefined();
    expect(typeof stats.total).toBe('number');
    expect(typeof stats.totalValue).toBe('number');
    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.totalValue).toBeGreaterThanOrEqual(0);
  });

  it('should create a new purchase request', (done) => {
    const newRequest: CreatePurchaseRequestRequest = {
      organization: 'Test Organization',
      needDate: new Date('2025-12-31'),
      justification: 'Test justification',
      priority: Priority.MEDIUM,
      fundingSourceId: 'fund-1',
      lineItems: [
        {
          description: 'Test item',
          quantity: 1,
          unitPrice: 100,
          unitOfMeasure: 'each',
          category: ItemCategory.OFFICE_SUPPLIES,
        },
      ],
    };

    service.createPurchaseRequest(newRequest).subscribe((pr) => {
      expect(pr).toBeDefined();
      expect(pr.organization).toBe(newRequest.organization);
      expect(pr.status).toBe(PurchaseRequestStatus.DRAFT);
      expect(pr.totalAmount).toBe(100);
      done();
    });
  });

  it('should submit a draft purchase request', (done) => {
    // First create a request
    const newRequest: CreatePurchaseRequestRequest = {
      organization: 'Test Organization',
      needDate: new Date('2025-12-31'),
      justification: 'Test justification',
      priority: Priority.MEDIUM,
      fundingSourceId: 'fund-1',
      lineItems: [
        {
          description: 'Test item',
          quantity: 1,
          unitPrice: 100,
          unitOfMeasure: 'each',
          category: ItemCategory.OFFICE_SUPPLIES,
        },
      ],
    };

    service.createPurchaseRequest(newRequest).subscribe((createdPr) => {
      // Then submit it
      service.submitPurchaseRequest(createdPr.id).subscribe((submittedPr) => {
        expect(submittedPr.status).toBe(PurchaseRequestStatus.SUBMITTED);
        expect(submittedPr.submittedAt).toBeDefined();
        done();
      });
    });
  });

  it('should return funding sources', (done) => {
    service.getFundingSources().subscribe((sources) => {
      expect(sources).toBeDefined();
      expect(Array.isArray(sources)).toBe(true);
      expect(sources.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return users', (done) => {
    service.getUsers().subscribe((users) => {
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should clear error state', () => {
    service.clearError();
    expect(service.error()).toBeNull();
  });
});
