import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbService } from '../../layout/breadcrumb.service';

@Component({
  selector: 'at-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- My Tasks Card -->
      <p-card header="My Tasks" class="h-fit">
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-primary">12</div>
          <i class="pi pi-list text-2xl text-color-secondary"></i>
        </div>
        <p class="text-color-secondary mb-4">
          Active tasks requiring your attention
        </p>
        <p-button label="View All" [text]="true" class="w-full" />
      </p-card>

      <!-- Pending Approvals Card -->
      <p-card header="Pending Approvals" class="h-fit">
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-orange-500">8</div>
          <i class="pi pi-clock text-2xl text-color-secondary"></i>
        </div>
        <p class="text-color-secondary mb-4">
          Purchase requests awaiting approval
        </p>
        <p-button label="Review" [text]="true" class="w-full" />
      </p-card>

      <!-- Recent Activity Card -->
      <p-card
        header="Recent Activity"
        class="h-fit md:col-span-2 lg:col-span-1"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-green-500">24</div>
          <i class="pi pi-history text-2xl text-color-secondary"></i>
        </div>
        <p class="text-color-secondary mb-4">Actions completed this week</p>
        <p-button label="View Log" [text]="true" class="w-full" />
      </p-card>
    </div>

    <!-- Welcome Section -->
    <div class="mt-8">
      <p-card>
        <div class="text-center py-8">
          <h2 class="text-2xl font-semibold text-color mb-4">
            Welcome to AcquiTrack
          </h2>
          <p class="text-color-secondary mb-6 max-w-2xl mx-auto">
            Your procurement and acquisitions management platform. Track
            purchase requests, manage vendors, oversee solicitations, and
            streamline the approval process.
          </p>
          <div class="flex gap-4 justify-center">
            <p-button label="New Purchase Request" icon="pi pi-plus" />
            <p-button
              label="View Vendors"
              icon="pi pi-building"
              severity="secondary"
              [outlined]="true"
            />
          </div>
        </div>
      </p-card>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([{ label: 'Dashboard' }]);
  }
}
