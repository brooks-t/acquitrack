import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/core-layout-simple.component').then(
        (m) => m.CoreLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'vendors',
        loadComponent: () =>
          import('./features/vendors/vendor-list.component').then(
            (m) => m.VendorListComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: 'purchase-requests',
        loadComponent: () =>
          import('./minimal-dashboard.component').then(
            (m) => m.MinimalDashboardComponent
          ),
      },
      {
        path: 'solicitations',
        loadComponent: () =>
          import('./minimal-dashboard.component').then(
            (m) => m.MinimalDashboardComponent
          ),
      },
      {
        path: 'approvals',
        loadComponent: () =>
          import('./minimal-dashboard.component').then(
            (m) => m.MinimalDashboardComponent
          ),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./minimal-dashboard.component').then(
            (m) => m.MinimalDashboardComponent
          ),
      },
    ],
  },
  {
    path: '__smoke',
    loadComponent: () =>
      import('./smoke.component').then((m) => m.SmokeComponent),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
