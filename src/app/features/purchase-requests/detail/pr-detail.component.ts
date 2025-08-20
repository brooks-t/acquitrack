/**
 * Purchase Request Detail Component
 *
 * Features:
 * - Full purchase request information display
 * - Audit timeline using PrimeNG Timeline
 * - Approval workflow visualization
 * - Action buttons based on status and permissions
 * - Pure Nora theme styling
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

import { PurchaseRequestService } from '../data/purchase-request.service';
import { BreadcrumbService } from '../../../layout/breadcrumb.service';
import {
  PurchaseRequest,
  PurchaseRequestStatus,
  Priority,
} from '../data/purchase-request.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'at-purchase-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    TagModule,
    TimelineModule,
    TabsModule,
    TableModule,
    SkeletonModule,
    TooltipModule,
    ConfirmDialogModule,
    DividerModule,
    PanelModule,
  ],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      @if (isLoading()) {
        <!-- Loading State -->
        <div class="space-y-6">
          <p-skeleton width="100%" height="4rem" />
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-4">
              <p-skeleton width="100%" height="20rem" />
            </div>
            <div class="space-y-4">
              <p-skeleton width="100%" height="15rem" />
            </div>
          </div>
        </div>
      } @else if (purchaseRequest()) {
        <!-- Page Header -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-color">
                {{ purchaseRequest()!.prNumber }}
              </h1>
              <p-tag
                [value]="getStatusLabel(purchaseRequest()!.status)"
                [severity]="getStatusSeverity(purchaseRequest()!.status)"
              />
              <p-tag
                [value]="getPriorityLabel(purchaseRequest()!.priority)"
                [severity]="getPrioritySeverity(purchaseRequest()!.priority)"
              />
            </div>
            <p class="text-color-secondary">
              Requested by {{ purchaseRequest()!.requester.name }} •
              {{ purchaseRequest()!.organization }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <p-button
              icon="pi pi-arrow-left"
              label="Back to List"
              severity="secondary"
              [outlined]="true"
              routerLink="/purchase-requests"
            />
            @if (canEdit()) {
              <p-button
                icon="pi pi-pencil"
                label="Edit"
                severity="secondary"
                [routerLink]="[
                  '/purchase-requests',
                  purchaseRequestId(),
                  'edit',
                ]"
              />
            }
            @if (canSubmit()) {
              <p-button
                icon="pi pi-send"
                label="Submit"
                (onClick)="submitRequest()"
              />
            }
            @if (canCancel()) {
              <p-button
                icon="pi pi-times"
                label="Cancel"
                severity="danger"
                [outlined]="true"
                (onClick)="cancelRequest()"
              />
            }
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Request Information -->
            <p-card>
              <ng-template #header>
                <div class="p-4 border-b border-surface-200">
                  <h3 class="text-lg font-semibold text-color">
                    Request Information
                  </h3>
                </div>
              </ng-template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-sm font-medium text-color-secondary mb-2">
                    Need Date
                  </h4>
                  <p class="text-color">
                    {{ formatDate(purchaseRequest()!.needDate) }}
                  </p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-color-secondary mb-2">
                    Total Amount
                  </h4>
                  <p class="text-color text-xl font-semibold">
                    {{ formatCurrency(purchaseRequest()!.totalAmount) }}
                  </p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-color-secondary mb-2">
                    Funding Source
                  </h4>
                  <p class="text-color">
                    {{ purchaseRequest()!.fundingSource.name }}
                  </p>
                  <p class="text-sm text-color-secondary">
                    {{ purchaseRequest()!.fundingSource.code }}
                  </p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-color-secondary mb-2">
                    Created
                  </h4>
                  <p class="text-color">
                    {{ formatDate(purchaseRequest()!.createdAt) }}
                  </p>
                  @if (purchaseRequest()!.submittedAt) {
                    <p class="text-sm text-color-secondary">
                      Submitted:
                      {{ formatDate(purchaseRequest()!.submittedAt!) }}
                    </p>
                  }
                </div>
              </div>

              <p-divider />

              <div>
                <h4 class="text-sm font-medium text-color-secondary mb-2">
                  Justification
                </h4>
                <p class="text-color">{{ purchaseRequest()!.justification }}</p>
              </div>
            </p-card>

            <!-- Line Items -->
            <p-card>
              <ng-template #header>
                <div class="p-4 border-b border-surface-200">
                  <h3 class="text-lg font-semibold text-color">
                    Line Items ({{ purchaseRequest()!.lineItems.length }})
                  </h3>
                </div>
              </ng-template>

              <p-table
                [value]="purchaseRequest()!.lineItems"
                styleClass="p-datatable-sm"
                responsiveLayout="scroll"
              >
                <ng-template pTemplate="header">
                  <tr>
                    <th class="text-left">Description</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                    <th class="text-center">Category</th>
                  </tr>
                </ng-template>

                <ng-template pTemplate="body" let-item>
                  <tr>
                    <td>
                      <div>
                        <p class="font-medium text-color">
                          {{ item.description }}
                        </p>
                        @if (item.partNumber) {
                          <p class="text-sm text-color-secondary">
                            Part #: {{ item.partNumber }}
                          </p>
                        }
                        @if (item.vendor) {
                          <p class="text-sm text-color-secondary">
                            Vendor: {{ item.vendor }}
                          </p>
                        }
                      </div>
                    </td>
                    <td class="text-center">
                      {{ item.quantity }} {{ item.unitOfMeasure }}
                    </td>
                    <td class="text-right">
                      {{ formatCurrency(item.unitPrice) }}
                    </td>
                    <td class="text-right font-medium">
                      {{ formatCurrency(item.totalPrice) }}
                    </td>
                    <td class="text-center">
                      <p-tag
                        [value]="getCategoryLabel(item.category)"
                        severity="secondary"
                      />
                    </td>
                  </tr>
                </ng-template>

                <ng-template pTemplate="footer">
                  <tr>
                    <td colspan="3" class="text-right font-medium">Total:</td>
                    <td class="text-right font-bold text-lg">
                      {{ formatCurrency(purchaseRequest()!.totalAmount) }}
                    </td>
                    <td></td>
                  </tr>
                </ng-template>
              </p-table>
            </p-card>

            <!-- Approvals (if any) -->
            @if (
              purchaseRequest()!.approvals &&
              purchaseRequest()!.approvals!.length > 0
            ) {
              <p-card>
                <ng-template #header>
                  <div class="p-4 border-b border-surface-200">
                    <h3 class="text-lg font-semibold text-color">
                      Approval Workflow
                    </h3>
                  </div>
                </ng-template>

                <div class="space-y-4">
                  @for (
                    approval of purchaseRequest()!.approvals!;
                    track approval.id
                  ) {
                    <div
                      class="flex items-center justify-between p-4 bg-surface-50 rounded-lg"
                    >
                      <div>
                        <p class="font-medium text-color">
                          Step {{ approval.step }}
                        </p>
                        <p class="text-sm text-color-secondary">
                          {{ approval.approverName }}
                        </p>
                        @if (approval.comments) {
                          <p class="text-sm text-color mt-1">
                            {{ approval.comments }}
                          </p>
                        }
                      </div>
                      <div class="text-right">
                        <p-tag
                          [value]="getApprovalStatusLabel(approval.status)"
                          [severity]="
                            getApprovalStatusSeverity(approval.status)
                          "
                        />
                        @if (approval.decidedAt) {
                          <p class="text-sm text-color-secondary mt-1">
                            {{ formatDate(approval.decidedAt) }}
                          </p>
                        } @else {
                          <p class="text-sm text-color-secondary mt-1">
                            Due: {{ formatDate(approval.dueDate) }}
                          </p>
                        }
                      </div>
                    </div>
                  }
                </div>
              </p-card>
            }
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Audit Timeline -->
            <p-card>
              <ng-template #header>
                <div class="p-4 border-b border-surface-200">
                  <h3 class="text-lg font-semibold text-color">
                    Activity Timeline
                  </h3>
                </div>
              </ng-template>

              <p-timeline
                [value]="purchaseRequest()!.history"
                align="left"
                styleClass="customized-timeline"
              >
                <ng-template pTemplate="marker" let-event>
                  <span
                    class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                    [ngClass]="getTimelineMarkerClass(event.action)"
                  >
                    <i [class]="getTimelineIcon(event.action)"></i>
                  </span>
                </ng-template>

                <ng-template pTemplate="content" let-event>
                  <div class="p-3 bg-surface-50 rounded-lg ml-3">
                    <p class="font-medium text-color">{{ event.details }}</p>
                    <p class="text-sm text-color-secondary">
                      by {{ event.actorName }} •
                      {{ formatDateTime(event.timestamp) }}
                    </p>
                  </div>
                </ng-template>
              </p-timeline>
            </p-card>

            <!-- Quick Stats -->
            <p-card>
              <ng-template #header>
                <div class="p-4 border-b border-surface-200">
                  <h3 class="text-lg font-semibold text-color">Quick Stats</h3>
                </div>
              </ng-template>

              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-color-secondary">Line Items</span>
                  <span class="font-medium text-color">{{
                    purchaseRequest()!.lineItems.length
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-color-secondary">Days Since Created</span>
                  <span class="font-medium text-color">{{
                    getDaysSinceCreated()
                  }}</span>
                </div>

                @if (purchaseRequest()!.submittedAt) {
                  <div class="flex justify-between items-center">
                    <span class="text-color-secondary"
                      >Days Since Submitted</span
                    >
                    <span class="font-medium text-color">{{
                      getDaysSinceSubmitted()
                    }}</span>
                  </div>
                }

                <div class="flex justify-between items-center">
                  <span class="text-color-secondary">Status Changes</span>
                  <span class="font-medium text-color">{{
                    purchaseRequest()!.history.length
                  }}</span>
                </div>
              </div>
            </p-card>
          </div>
        </div>
      } @else {
        <!-- Error State -->
        <div class="text-center p-8">
          <i
            class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"
          ></i>
          <h2 class="text-xl font-semibold text-color mb-2">
            Purchase Request Not Found
          </h2>
          <p class="text-color-secondary mb-4">
            The requested purchase request could not be found or you don't have
            permission to view it.
          </p>
          <p-button
            label="Back to List"
            icon="pi pi-arrow-left"
            routerLink="/purchase-requests"
          />
        </div>
      }
    </div>

    <!-- Confirmation Dialogs -->
    <p-confirmDialog />
  `,
})
export class PurchaseRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseRequestService = inject(PurchaseRequestService);
  private breadcrumbService = inject(BreadcrumbService);
  private confirmationService = inject(ConfirmationService);

  purchaseRequestId = signal<string>('');
  purchaseRequest = signal<PurchaseRequest | null>(null);
  isLoading = signal(false);

  canEdit = computed(() => {
    const pr = this.purchaseRequest();
    return (
      pr &&
      (pr.status === PurchaseRequestStatus.DRAFT ||
        pr.status === PurchaseRequestStatus.REJECTED)
    );
  });

  canSubmit = computed(() => {
    const pr = this.purchaseRequest();
    return pr && pr.status === PurchaseRequestStatus.DRAFT;
  });

  canCancel = computed(() => {
    const pr = this.purchaseRequest();
    return (
      pr &&
      (pr.status === PurchaseRequestStatus.DRAFT ||
        pr.status === PurchaseRequestStatus.SUBMITTED)
    );
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.purchaseRequestId.set(id);
        this.loadPurchaseRequest(id);
      }
    });
  }

  private loadPurchaseRequest(id: string): void {
    this.isLoading.set(true);

    this.purchaseRequestService.getPurchaseRequestById(id).subscribe({
      next: (pr) => {
        this.purchaseRequest.set(pr);
        this.setBreadcrumbs(pr);
        this.isLoading.set(false);
      },
      error: () => {
        this.purchaseRequest.set(null);
        this.isLoading.set(false);
      },
    });
  }

  private setBreadcrumbs(pr: PurchaseRequest | null): void {
    const breadcrumbs = [
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Purchase Requests', routerLink: '/purchase-requests' },
    ];

    if (pr) {
      breadcrumbs.push({ label: pr.prNumber, routerLink: '' });
    }

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  submitRequest(): void {
    const pr = this.purchaseRequest();
    if (!pr) return;

    this.confirmationService.confirm({
      message:
        'Are you sure you want to submit this purchase request for approval?',
      header: 'Confirm Submission',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.purchaseRequestService.submitPurchaseRequest(pr.id).subscribe({
          next: (updatedPr) => {
            this.purchaseRequest.set(updatedPr);
          },
        });
      },
    });
  }

  cancelRequest(): void {
    const pr = this.purchaseRequest();
    if (!pr) return;

    this.confirmationService.confirm({
      message:
        'Are you sure you want to cancel this purchase request? This action cannot be undone.',
      header: 'Confirm Cancellation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.purchaseRequestService
          .cancelPurchaseRequest(pr.id, 'Cancelled by user')
          .subscribe({
            next: (updatedPr) => {
              this.purchaseRequest.set(updatedPr);
            },
          });
      },
    });
  }

  // UI Helper Methods
  getStatusLabel(status: PurchaseRequestStatus): string {
    const statusMap: Record<PurchaseRequestStatus, string> = {
      [PurchaseRequestStatus.DRAFT]: 'Draft',
      [PurchaseRequestStatus.SUBMITTED]: 'Submitted',
      [PurchaseRequestStatus.UNDER_REVIEW]: 'Under Review',
      [PurchaseRequestStatus.PENDING_APPROVAL]: 'Pending Approval',
      [PurchaseRequestStatus.APPROVED]: 'Approved',
      [PurchaseRequestStatus.REJECTED]: 'Rejected',
      [PurchaseRequestStatus.CANCELLED]: 'Cancelled',
      [PurchaseRequestStatus.ON_HOLD]: 'On Hold',
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(
    status: PurchaseRequestStatus
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<
      PurchaseRequestStatus,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
    > = {
      [PurchaseRequestStatus.DRAFT]: 'secondary',
      [PurchaseRequestStatus.SUBMITTED]: 'info',
      [PurchaseRequestStatus.UNDER_REVIEW]: 'warn',
      [PurchaseRequestStatus.PENDING_APPROVAL]: 'warn',
      [PurchaseRequestStatus.APPROVED]: 'success',
      [PurchaseRequestStatus.REJECTED]: 'danger',
      [PurchaseRequestStatus.CANCELLED]: 'secondary',
      [PurchaseRequestStatus.ON_HOLD]: 'contrast',
    };
    return severityMap[status] || 'secondary';
  }

  getPriorityLabel(priority: Priority): string {
    const priorityMap: Record<Priority, string> = {
      [Priority.LOW]: 'Low',
      [Priority.MEDIUM]: 'Medium',
      [Priority.HIGH]: 'High',
      [Priority.URGENT]: 'Urgent',
    };
    return priorityMap[priority] || priority;
  }

  getPrioritySeverity(
    priority: Priority
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<
      Priority,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
    > = {
      [Priority.LOW]: 'secondary',
      [Priority.MEDIUM]: 'info',
      [Priority.HIGH]: 'warn',
      [Priority.URGENT]: 'danger',
    };
    return severityMap[priority] || 'secondary';
  }

  getCategoryLabel(category: string): string {
    return category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  getApprovalStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getApprovalStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<
      string,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
    > = {
      pending: 'warn',
      approved: 'success',
      rejected: 'danger',
      delegated: 'info',
    };
    return severityMap[status] || 'secondary';
  }

  getTimelineIcon(action: string): string {
    const iconMap: Record<string, string> = {
      created: 'pi pi-plus',
      updated: 'pi pi-pencil',
      submitted: 'pi pi-send',
      approved: 'pi pi-check',
      rejected: 'pi pi-times',
      cancelled: 'pi pi-ban',
      attachment_added: 'pi pi-paperclip',
      comment_added: 'pi pi-comment',
    };
    return iconMap[action] || 'pi pi-circle';
  }

  getTimelineMarkerClass(action: string): string {
    const classMap: Record<string, string> = {
      created: 'bg-blue-500',
      updated: 'bg-orange-500',
      submitted: 'bg-primary-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      cancelled: 'bg-gray-500',
      attachment_added: 'bg-purple-500',
      comment_added: 'bg-indigo-500',
    };
    return classMap[action] || 'bg-gray-400';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  }

  getDaysSinceCreated(): number {
    const pr = this.purchaseRequest();
    if (!pr) return 0;

    const now = new Date();
    const created = new Date(pr.createdAt);
    return Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  getDaysSinceSubmitted(): number {
    const pr = this.purchaseRequest();
    if (!pr || !pr.submittedAt) return 0;

    const now = new Date();
    const submitted = new Date(pr.submittedAt);
    return Math.floor(
      (now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
}
