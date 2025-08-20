/**
 * Purchase Request Form Component
 *
 * This is a placeholder component for the purchase request form.
 * Full implementation will be added in a future iteration.
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { BreadcrumbService } from '../../../layout/breadcrumb.service';

@Component({
  selector: 'at-purchase-request-form',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-color">Purchase Request Form</h1>
          <p class="text-color-secondary mt-1">
            Create or edit a purchase request
          </p>
        </div>

        <p-button
          icon="pi pi-arrow-left"
          label="Back to List"
          severity="secondary"
          [outlined]="true"
          routerLink="/purchase-requests"
        />
      </div>

      <!-- Placeholder Content -->
      <p-card>
        <div class="text-center p-8">
          <i class="pi pi-wrench text-4xl text-primary-500 mb-4"></i>
          <h2 class="text-xl font-semibold text-color mb-2">
            Form Under Construction
          </h2>
          <p class="text-color-secondary mb-4">
            The purchase request form is being developed and will be available
            soon.
          </p>
          <p class="text-sm text-color-secondary">This form will include:</p>
          <ul class="text-sm text-color-secondary mt-2 space-y-1">
            <li>• Multi-step wizard interface</li>
            <li>• Line item management</li>
            <li>• File upload capability</li>
            <li>• Form validation</li>
            <li>• Draft save functionality</li>
          </ul>
        </div>
      </p-card>
    </div>
  `,
})
export class PurchaseRequestFormComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.setBreadcrumbs();
  }

  private setBreadcrumbs(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Purchase Requests', routerLink: '/purchase-requests' },
      { label: 'New Request', routerLink: '' },
    ]);
  }
}
