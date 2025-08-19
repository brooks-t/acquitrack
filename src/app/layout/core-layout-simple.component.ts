import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'at-core-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ToastModule],
  template: `
    <div class="min-h-screen bg-surface-0">
      <!-- Simple Header -->
      <header class="bg-primary-500 text-white p-4">
        <h1 class="text-2xl font-bold">AcquiTrack</h1>
      </header>

      <!-- Simple Navigation -->
      <nav class="bg-surface-100 p-4">
        <div class="flex gap-4">
          <a
            routerLink="/dashboard"
            class="text-primary-500 hover:text-primary-600 px-3 py-2 rounded"
            >Dashboard</a
          >
          <a
            routerLink="/vendors"
            class="text-primary-500 hover:text-primary-600 px-3 py-2 rounded"
            >Vendors</a
          >
          <a
            routerLink="/reports"
            class="text-primary-500 hover:text-primary-600 px-3 py-2 rounded"
            >Reports</a
          >
        </div>
      </nav>

      <!-- Main Content -->
      <main class="p-6">
        <router-outlet />
      </main>

      <!-- Toast Container -->
      <p-toast />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreLayoutComponent {
  private breadcrumbService = inject(BreadcrumbService);
}
