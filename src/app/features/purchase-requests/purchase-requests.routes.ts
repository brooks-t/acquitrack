/**
 * Purchase Requests Feature Routes
 *
 * Lazy-loaded routing configuration for the purchase requests feature module
 */

import { Routes } from '@angular/router';

export const purchaseRequestRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/pr-list.component').then(
        (m) => m.PurchaseRequestListComponent
      ),
    data: { breadcrumb: 'Purchase Requests' },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./form/pr-form.component').then(
        (m) => m.PurchaseRequestFormComponent
      ),
    data: { breadcrumb: 'New Request' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detail/pr-detail.component').then(
        (m) => m.PurchaseRequestDetailComponent
      ),
    data: { breadcrumb: 'Request Details' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./form/pr-form.component').then(
        (m) => m.PurchaseRequestFormComponent
      ),
    data: { breadcrumb: 'Edit Request' },
  },
];
