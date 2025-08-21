/**
 * Purchase Request Form Component
 *
 * Features:
 * - Multi-step wizard interface (Basic Info → Line Items → Review & Submit)
 * - Comprehensive form validation with Angular reactive forms
 * - Dynamic line item management (add/remove/edit)
 * - Auto-save draft functionality
 * - Real-time funding source validation
 * - Responsive design with Nora theme styling
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

// Application Imports
import { BreadcrumbService } from '../../../layout/breadcrumb.service';
import { PurchaseRequestService } from '../data/purchase-request.service';
import {
  CreatePurchaseRequestRequest,
  Priority,
  ItemCategory,
  FundingSource,
  PurchaseRequest,
} from '../data/purchase-request.model';

interface LineItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
  unitOfMeasure: string;
  partNumber: string;
  vendor: string;
  category: ItemCategory;
}

@Component({
  selector: 'at-purchase-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    // PrimeNG
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    MessageModule,
  ],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-color">
            {{
              isEditMode() ? 'Edit Purchase Request' : 'New Purchase Request'
            }}
          </h1>
          <p class="text-color-secondary mt-1">
            {{
              isEditMode()
                ? 'Update your purchase request details'
                : 'Create a new purchase request for approval'
            }}
          </p>
        </div>

        <div class="flex gap-2">
          @if (form.dirty && !isSubmitting()) {
            <p-button
              icon="pi pi-save"
              label="Save Draft"
              severity="secondary"
              [outlined]="true"
              (onClick)="saveDraft()"
              [loading]="isSaving()"
            />
          }

          <p-button
            icon="pi pi-arrow-left"
            label="Back to List"
            severity="secondary"
            [outlined]="true"
            routerLink="/purchase-requests"
            (onClick)="handleNavigation($event)"
          />
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="bg-surface-0 border border-surface-200 rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-color">Progress</span>
          <span class="text-sm text-color-secondary"
            >Step {{ activeStep() + 1 }} of 3</span
          >
        </div>
        <div class="w-full bg-surface-100 rounded-full h-2">
          <div
            class="bg-primary-500 h-2 rounded-full transition-all duration-300"
            [style.width.%]="progressPercentage()"
          ></div>
        </div>
      </div>

      <!-- Step Navigation Tabs -->
      <div class="flex border-b border-surface-200">
        <button
          *ngFor="let step of steps; let i = index"
          type="button"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          [class.border-primary-500]="i === activeStep()"
          [class.text-primary-600]="i === activeStep()"
          [class.border-transparent]="i !== activeStep()"
          [class.text-color-secondary]="i !== activeStep()"
          [disabled]="!canNavigateToStep(i)"
          (click)="goToStep(i)"
        >
          {{ step.title }}
        </button>
      </div>

      <!-- Step Content -->
      <div [formGroup]="form">
        @switch (activeStep()) {
          @case (0) {
            <!-- Step 1: Basic Information -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="flex items-center gap-2 p-4">
                  <i class="pi pi-info-circle text-primary-500"></i>
                  <span class="font-semibold">Basic Information</span>
                </div>
              </ng-template>

              <div class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Organization -->
                  <div class="space-y-2">
                    <label
                      for="organization"
                      class="block text-sm font-medium text-color"
                    >
                      Organization <span class="text-red-500">*</span>
                    </label>
                    <input
                      pInputText
                      id="organization"
                      formControlName="organization"
                      placeholder="Enter your organization/department"
                      class="w-full"
                      [class.ng-invalid]="isFieldInvalid('organization')"
                    />
                    @if (isFieldInvalid('organization')) {
                      <small class="text-red-500"
                        >Organization is required</small
                      >
                    }
                  </div>

                  <!-- Need Date -->
                  <div class="space-y-2">
                    <label
                      for="needDate"
                      class="block text-sm font-medium text-color"
                    >
                      Need Date <span class="text-red-500">*</span>
                    </label>
                    <p-datePicker
                      id="needDate"
                      formControlName="needDate"
                      [minDate]="minDate()"
                      placeholder="Select when you need this"
                      styleClass="w-full"
                      [class.ng-invalid]="isFieldInvalid('needDate')"
                    />
                    @if (isFieldInvalid('needDate')) {
                      <small class="text-red-500"
                        >Need date is required and must be in the future</small
                      >
                    }
                  </div>

                  <!-- Priority -->
                  <div class="space-y-2">
                    <label
                      for="priority"
                      class="block text-sm font-medium text-color"
                    >
                      Priority <span class="text-red-500">*</span>
                    </label>
                    <p-select
                      id="priority"
                      formControlName="priority"
                      [options]="priorityOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select priority level"
                      styleClass="w-full"
                      appendTo="body"
                      [class.ng-invalid]="isFieldInvalid('priority')"
                    />
                    @if (isFieldInvalid('priority')) {
                      <small class="text-red-500">Priority is required</small>
                    }
                  </div>

                  <!-- Funding Source -->
                  <div class="space-y-2">
                    <label
                      for="fundingSourceId"
                      class="block text-sm font-medium text-color"
                    >
                      Funding Source <span class="text-red-500">*</span>
                    </label>
                    <p-select
                      id="fundingSourceId"
                      formControlName="fundingSourceId"
                      [options]="fundingSourceOptions()"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select funding source"
                      styleClass="w-full"
                      appendTo="body"
                      [class.ng-invalid]="isFieldInvalid('fundingSourceId')"
                    />
                    @if (isFieldInvalid('fundingSourceId')) {
                      <small class="text-red-500"
                        >Funding source is required</small
                      >
                    }
                    @if (selectedFundingSource()) {
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-color-secondary"
                          >Available Balance:</span
                        >
                        <p-tag
                          [value]="
                            formatCurrency(
                              selectedFundingSource()!.availableBalance
                            )
                          "
                          [severity]="getBalanceSeverity()"
                        />
                      </div>
                    }
                  </div>
                </div>

                <!-- Justification -->
                <div class="space-y-2">
                  <label
                    for="justification"
                    class="block text-sm font-medium text-color"
                  >
                    Business Justification <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="justification"
                    pTextarea
                    formControlName="justification"
                    rows="4"
                    placeholder="Explain why this purchase is necessary and how it supports business objectives..."
                    class="w-full"
                    [class.ng-invalid]="isFieldInvalid('justification')"
                  ></textarea>
                  @if (isFieldInvalid('justification')) {
                    <small class="text-red-500"
                      >Business justification is required (minimum 10
                      characters)</small
                    >
                  }
                  <small class="text-color-secondary">
                    {{ form.get('justification')?.value?.length || 0 }}/500
                    characters
                  </small>
                </div>

                <!-- Step Navigation -->
                <div class="flex justify-between pt-4">
                  <div></div>
                  <p-button
                    label="Next: Add Items"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    (onClick)="nextStep()"
                    [disabled]="!isStep1Valid()"
                  />
                </div>
              </div>
            </p-card>
          }

          @case (1) {
            <!-- Step 2: Line Items -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="flex items-center justify-between p-4">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-shopping-cart text-primary-500"></i>
                    <span class="font-semibold">Purchase Items</span>
                  </div>
                  <p-button
                    label="Add Item"
                    icon="pi pi-plus"
                    (onClick)="addLineItem()"
                    size="small"
                  />
                </div>
              </ng-template>

              <div class="space-y-6">
                @if (lineItems.controls.length > 0) {
                  <div class="overflow-x-auto">
                    <p-table
                      [value]="lineItems.controls"
                      styleClass="p-datatable-sm"
                    >
                      <ng-template pTemplate="header">
                        <tr>
                          <th>Description</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Category</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </ng-template>
                      <ng-template
                        pTemplate="body"
                        let-control
                        let-i="rowIndex"
                      >
                        <tr [formGroup]="control">
                          <td>
                            <input
                              pInputText
                              formControlName="description"
                              placeholder="Item description"
                              class="w-full"
                            />
                          </td>
                          <td>
                            <p-inputNumber
                              formControlName="quantity"
                              [min]="1"
                              [max]="99999"
                              styleClass="w-20"
                            />
                          </td>
                          <td>
                            <p-inputNumber
                              formControlName="unitPrice"
                              mode="currency"
                              currency="USD"
                              [min]="0"
                              styleClass="w-32"
                            />
                          </td>
                          <td>
                            <p-select
                              formControlName="category"
                              [options]="categoryOptions"
                              optionLabel="label"
                              optionValue="value"
                              placeholder="Category"
                              styleClass="w-40"
                              appendTo="body"
                            />
                          </td>
                          <td>
                            <span class="font-semibold">
                              {{ formatCurrency(getLineItemTotal(i)) }}
                            </span>
                          </td>
                          <td>
                            <p-button
                              icon="pi pi-trash"
                              size="small"
                              severity="danger"
                              [outlined]="true"
                              (onClick)="removeLineItem(i)"
                              [disabled]="lineItems.controls.length === 1"
                            />
                          </td>
                        </tr>
                      </ng-template>
                    </p-table>
                  </div>

                  <!-- Total Summary -->
                  <div
                    class="bg-surface-50 border border-surface-200 rounded-lg p-4"
                  >
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-semibold text-color"
                        >Total Amount:</span
                      >
                      <span class="text-2xl font-bold text-primary-600">{{
                        formatCurrency(getTotalAmount())
                      }}</span>
                    </div>
                  </div>
                } @else {
                  <div class="text-center py-8">
                    <i
                      class="pi pi-shopping-cart text-4xl text-surface-400 mb-4"
                    ></i>
                    <p class="text-color-secondary">No items added yet</p>
                  </div>
                }

                <!-- Step Navigation -->
                <div class="flex justify-between pt-4">
                  <p-button
                    label="Previous"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    [outlined]="true"
                    (onClick)="previousStep()"
                  />
                  <p-button
                    label="Next: Review"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    (onClick)="nextStep()"
                    [disabled]="!isStep2Valid()"
                  />
                </div>
              </div>
            </p-card>
          }

          @case (2) {
            <!-- Step 3: Review & Submit -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="flex items-center gap-2 p-4">
                  <i class="pi pi-check-circle text-primary-500"></i>
                  <span class="font-semibold">Review & Submit</span>
                </div>
              </ng-template>

              <div class="space-y-6">
                <!-- Basic Information Review -->
                <div class="border border-surface-200 rounded-lg p-4">
                  <h4 class="font-medium text-color mb-3">Basic Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-color-secondary">Organization:</span>
                      <span class="ml-2 text-color font-medium">{{
                        form.get('organization')?.value
                      }}</span>
                    </div>
                    <div>
                      <span class="text-color-secondary">Need Date:</span>
                      <span class="ml-2 text-color font-medium">{{
                        formatDate(form.get('needDate')?.value)
                      }}</span>
                    </div>
                    <div>
                      <span class="text-color-secondary">Priority:</span>
                      <span class="ml-2">
                        <p-tag
                          [value]="
                            getPriorityLabel(form.get('priority')?.value)
                          "
                          [severity]="
                            getPrioritySeverity(form.get('priority')?.value)
                          "
                        />
                      </span>
                    </div>
                    <div>
                      <span class="text-color-secondary">Funding Source:</span>
                      <span class="ml-2 text-color font-medium">{{
                        selectedFundingSource()?.name
                      }}</span>
                    </div>
                  </div>
                  <div class="mt-3">
                    <span class="text-color-secondary"
                      >Business Justification:</span
                    >
                    <p class="mt-1 text-color">
                      {{ form.get('justification')?.value }}
                    </p>
                  </div>
                </div>

                <!-- Line Items Review -->
                <div class="border border-surface-200 rounded-lg p-4">
                  <h4 class="font-medium text-color mb-3">
                    Items ({{ lineItems.controls.length }})
                  </h4>
                  <div class="space-y-3">
                    @for (control of lineItems.controls; track $index) {
                      <div
                        class="flex justify-between items-center py-2 border-b border-surface-100 last:border-0"
                      >
                        <div>
                          <div class="font-medium text-color">
                            {{ control.get('description')?.value }}
                          </div>
                          <div class="text-sm text-color-secondary">
                            {{ control.get('quantity')?.value }} units at
                            {{
                              formatCurrency(
                                control.get('unitPrice')?.value || 0
                              )
                            }}
                            each
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="font-semibold text-color">
                            {{ formatCurrency(getLineItemTotal($index)) }}
                          </div>
                          <div class="text-sm text-color-secondary">
                            {{
                              getCategoryLabel(control.get('category')?.value)
                            }}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  <div
                    class="flex justify-between items-center pt-3 mt-3 border-t border-surface-200"
                  >
                    <span class="text-lg font-semibold text-color"
                      >Total Amount:</span
                    >
                    <span class="text-2xl font-bold text-primary-600">{{
                      formatCurrency(getTotalAmount())
                    }}</span>
                  </div>
                </div>

                <!-- Step Navigation -->
                <div class="flex justify-between pt-4">
                  <p-button
                    label="Previous"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    [outlined]="true"
                    (onClick)="previousStep()"
                  />

                  <div class="flex gap-2">
                    <p-button
                      label="Save as Draft"
                      icon="pi pi-save"
                      severity="secondary"
                      [outlined]="true"
                      (onClick)="saveDraft()"
                      [loading]="isSaving()"
                      [disabled]="isSubmitting()"
                    />
                    <p-button
                      label="Submit for Approval"
                      icon="pi pi-send"
                      (onClick)="submitRequest()"
                      [loading]="isSubmitting()"
                      [disabled]="!form.valid || isSaving()"
                    />
                  </div>
                </div>
              </div>
            </p-card>
          }
        }
      </div>
    </div>

    <!-- Toast Messages -->
    <p-toast />

    <!-- Confirmation Dialog -->
    <p-confirmDialog />
  `,
})
export class PurchaseRequestFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);
  private purchaseRequestService = inject(PurchaseRequestService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  // Form state
  form: FormGroup;

  // Component state signals
  activeStep = signal(0);
  isEditMode = signal(false);
  editingPrId = signal<string | null>(null);
  isSubmitting = signal(false);
  isSaving = signal(false);

  // Data signals
  fundingSources = signal<FundingSource[]>([]);
  fundingSourceId = signal<string>('');
  minDate = signal(new Date());

  // Step configuration
  steps = [
    { title: 'Basic Information', icon: 'pi-info-circle' },
    { title: 'Line Items', icon: 'pi-shopping-cart' },
    { title: 'Review & Submit', icon: 'pi-check-circle' },
  ];

  // Computed values
  progressPercentage = computed(() => ((this.activeStep() + 1) / 3) * 100);

  selectedFundingSource = computed(() => {
    const fundingSourceId = this.fundingSourceId();
    console.log('Computing selectedFundingSource:', {
      fundingSourceId,
      fundingSources: this.fundingSources(),
      formValue: this.form?.value,
    });
    const found = this.fundingSources().find((fs) => fs.id === fundingSourceId);
    console.log('Found funding source:', found);
    return found || null;
  });

  fundingSourceOptions = computed(() =>
    this.fundingSources().map((fs) => ({
      label: `${fs.name} (${this.formatCurrency(fs.availableBalance)} available)`,
      value: fs.id,
    }))
  );

  // Form options
  priorityOptions = [
    { label: 'Low', value: Priority.LOW },
    { label: 'Medium', value: Priority.MEDIUM },
    { label: 'High', value: Priority.HIGH },
    { label: 'Urgent', value: Priority.URGENT },
  ];

  categoryOptions = [
    { label: 'IT Equipment', value: ItemCategory.IT_EQUIPMENT },
    { label: 'Office Supplies', value: ItemCategory.OFFICE_SUPPLIES },
    {
      label: 'Professional Services',
      value: ItemCategory.PROFESSIONAL_SERVICES,
    },
    { label: 'Construction', value: ItemCategory.CONSTRUCTION },
    { label: 'Maintenance', value: ItemCategory.MAINTENANCE },
    { label: 'Vehicles', value: ItemCategory.VEHICLES },
    { label: 'Other', value: ItemCategory.OTHER },
  ];

  constructor() {
    this.form = this.createForm();
    this.setupAutoSave();
    this.loadFundingSources();

    // Debug form value changes
    this.form
      .get('fundingSourceId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('Funding source ID changed:', value);
        this.fundingSourceId.set(value || '');
      });
  }

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.checkEditMode();
  }

  get lineItems(): FormArray {
    return this.form.get('lineItems') as FormArray;
  }

  // Form Creation
  private createForm(): FormGroup {
    return this.fb.group({
      organization: ['', [Validators.required, Validators.minLength(2)]],
      needDate: [null, [Validators.required, this.futureDateValidator]],
      priority: [Priority.MEDIUM, [Validators.required]],
      fundingSourceId: ['', [Validators.required]],
      justification: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      lineItems: this.fb.array(
        [this.createLineItemForm()],
        [Validators.required]
      ),
    });
  }

  private createLineItemForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(99999)],
      ],
      unitPrice: [
        0,
        [Validators.required, Validators.min(0.01), Validators.max(999999)],
      ],
      unitOfMeasure: ['Each', [Validators.required]],
      partNumber: [''],
      vendor: [''],
      category: ['', [Validators.required]],
    });
  }

  // Custom Validators
  private futureDateValidator(control: {
    value: unknown;
  }): Record<string, boolean> | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value as string);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }

  // Auto-save functionality
  private setupAutoSave(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(30000), // Save draft every 30 seconds
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.form.dirty && !this.isSubmitting()) {
          this.saveDraftSilently();
        }
      });
  }

  // Data Loading
  private loadFundingSources(): void {
    this.purchaseRequestService
      .getFundingSources()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (sources) => this.fundingSources.set(sources),
        error: (error) => {
          console.error('Failed to load funding sources:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load funding sources',
          });
        },
      });
  }

  // Edit Mode Handling
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editingPrId.set(id);
      this.loadPurchaseRequest(id);
    }
  }

  private loadPurchaseRequest(id: string): void {
    this.purchaseRequestService
      .getPurchaseRequestById(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (pr) => {
          if (pr) {
            this.populateForm(pr);
          }
        },
        error: (error) => {
          console.error('Failed to load purchase request:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load purchase request',
          });
          this.router.navigate(['/purchase-requests']);
        },
      });
  }

  private populateForm(pr: PurchaseRequest): void {
    this.form.patchValue({
      organization: pr.organization,
      needDate: pr.needDate,
      priority: pr.priority,
      fundingSourceId: pr.fundingSource.id,
      justification: pr.justification,
    });

    // Clear existing line items and add the loaded ones
    this.lineItems.clear();
    pr.lineItems.forEach((item) => {
      this.lineItems.push(
        this.fb.group({
          description: [item.description, [Validators.required]],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          unitPrice: [
            item.unitPrice,
            [Validators.required, Validators.min(0.01)],
          ],
          unitOfMeasure: [item.unitOfMeasure, [Validators.required]],
          partNumber: [item.partNumber || ''],
          vendor: [item.vendor || ''],
          category: [item.category, [Validators.required]],
        })
      );
    });
  }

  // Breadcrumb Setup
  private setBreadcrumbs(): void {
    const breadcrumbs = [
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Purchase Requests', routerLink: '/purchase-requests' },
    ];

    if (this.isEditMode()) {
      breadcrumbs.push({ label: 'Edit Request', routerLink: '' });
    } else {
      breadcrumbs.push({ label: 'New Request', routerLink: '' });
    }

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  // Form Validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isStep1Valid(): boolean {
    const step1Fields = [
      'organization',
      'needDate',
      'priority',
      'fundingSourceId',
      'justification',
    ];
    return step1Fields.every((field) => {
      const control = this.form.get(field);
      return control && control.valid;
    });
  }

  isStep2Valid(): boolean {
    return this.lineItems.valid && this.lineItems.length > 0;
  }

  // Step Navigation
  canNavigateToStep(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0:
        return true;
      case 1:
        return this.isStep1Valid();
      case 2:
        return this.isStep1Valid() && this.isStep2Valid();
      default:
        return false;
    }
  }

  goToStep(stepIndex: number): void {
    if (this.canNavigateToStep(stepIndex)) {
      this.activeStep.set(stepIndex);
    }
  }

  nextStep(): void {
    if (this.activeStep() < 2) {
      this.activeStep.update((step) => step + 1);
    }
  }

  previousStep(): void {
    if (this.activeStep() > 0) {
      this.activeStep.update((step) => step - 1);
    }
  }

  // Line Item Management
  addLineItem(): void {
    this.lineItems.push(this.createLineItemForm());
  }

  removeLineItem(index: number): void {
    if (this.lineItems.length > 1) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove this item?',
        accept: () => {
          this.lineItems.removeAt(index);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item removed successfully',
          });
        },
      });
    }
  }

  // Calculations
  getLineItemTotal(index: number): number {
    const item = this.lineItems.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    return quantity * unitPrice;
  }

  getTotalAmount(): number {
    return this.lineItems.controls.reduce((total, item, index) => {
      return total + this.getLineItemTotal(index);
    }, 0);
  }

  // Display Helpers
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  getPriorityLabel(priority: Priority): string {
    const option = this.priorityOptions.find((opt) => opt.value === priority);
    return option?.label || priority;
  }

  getPrioritySeverity(
    priority: Priority
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (priority) {
      case Priority.LOW:
        return 'success';
      case Priority.MEDIUM:
        return 'info';
      case Priority.HIGH:
        return 'warn';
      case Priority.URGENT:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getCategoryLabel(category: ItemCategory): string {
    const option = this.categoryOptions.find((opt) => opt.value === category);
    return option?.label || category;
  }

  getBalanceSeverity():
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast' {
    const selectedFs = this.selectedFundingSource();
    if (!selectedFs) return 'secondary';

    const total = this.getTotalAmount();
    const balance = selectedFs.availableBalance;

    if (total > balance) return 'danger';
    if (total > balance * 0.8) return 'warn';
    return 'success';
  }

  // Form Actions
  saveDraft(): void {
    this.isSaving.set(true);
    const request = this.buildCreateRequest();

    if (this.isEditMode()) {
      const updateRequest = { ...request, id: this.editingPrId()! };
      this.purchaseRequestService
        .updatePurchaseRequest(updateRequest)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            this.isSaving.set(false);
            this.form.markAsPristine();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Draft saved successfully',
            });
          },
          error: (error) => {
            this.isSaving.set(false);
            console.error('Failed to save draft:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save draft',
            });
          },
        });
    } else {
      this.purchaseRequestService
        .createPurchaseRequest(request)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (pr) => {
            this.isSaving.set(false);
            this.form.markAsPristine();
            this.isEditMode.set(true);
            this.editingPrId.set(pr.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Draft saved successfully',
            });
          },
          error: (error) => {
            this.isSaving.set(false);
            console.error('Failed to save draft:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save draft',
            });
          },
        });
    }
  }

  private saveDraftSilently(): void {
    if (!this.form.valid) return;

    const request = this.buildCreateRequest();

    if (this.isEditMode()) {
      const updateRequest = { ...request, id: this.editingPrId()! };
      this.purchaseRequestService
        .updatePurchaseRequest(updateRequest)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => this.form.markAsPristine(),
          error: (error) => console.error('Auto-save failed:', error),
        });
    }
  }

  submitRequest(): void {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please correct all form errors before submitting',
      });
      return;
    }

    this.confirmationService.confirm({
      message:
        'Are you sure you want to submit this purchase request for approval?',
      accept: () => {
        this.isSubmitting.set(true);

        const request = this.buildCreateRequest();

        if (this.isEditMode()) {
          // Update and then submit
          const updateRequest = { ...request, id: this.editingPrId()! };
          this.purchaseRequestService
            .updatePurchaseRequest(updateRequest)
            .pipe(takeUntilDestroyed())
            .subscribe({
              next: (pr) => {
                // Now submit
                this.purchaseRequestService
                  .submitPurchaseRequest(pr.id)
                  .pipe(takeUntilDestroyed())
                  .subscribe({
                    next: () => {
                      this.isSubmitting.set(false);
                      this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Purchase request submitted successfully',
                      });
                      this.router.navigate(['/purchase-requests']);
                    },
                    error: (error) => {
                      this.isSubmitting.set(false);
                      console.error('Failed to submit request:', error);
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to submit purchase request',
                      });
                    },
                  });
              },
              error: (error) => {
                this.isSubmitting.set(false);
                console.error('Failed to update request:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to update purchase request',
                });
              },
            });
        } else {
          // Create and then submit
          this.purchaseRequestService
            .createPurchaseRequest(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (pr) => {
                // Now submit
                this.purchaseRequestService
                  .submitPurchaseRequest(pr.id)
                  .pipe(takeUntilDestroyed())
                  .subscribe({
                    next: () => {
                      this.isSubmitting.set(false);
                      this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Purchase request submitted successfully',
                      });
                      this.router.navigate(['/purchase-requests']);
                    },
                    error: (error) => {
                      this.isSubmitting.set(false);
                      console.error('Failed to submit request:', error);
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to submit purchase request',
                      });
                    },
                  });
              },
              error: (error) => {
                this.isSubmitting.set(false);
                console.error('Failed to create request:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create purchase request',
                });
              },
            });
        }
      },
    });
  }

  private buildCreateRequest(): CreatePurchaseRequestRequest {
    const formValue = this.form.value;
    return {
      organization: formValue.organization,
      needDate: formValue.needDate,
      priority: formValue.priority,
      fundingSourceId: formValue.fundingSourceId,
      justification: formValue.justification,
      lineItems: formValue.lineItems.map((item: LineItemForm) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        unitOfMeasure: item.unitOfMeasure,
        partNumber: item.partNumber,
        vendor: item.vendor,
        category: item.category,
      })),
    };
  }

  // Navigation Guard
  handleNavigation(event: Event): void {
    if (this.form.dirty) {
      event.preventDefault();
      this.confirmationService.confirm({
        message: 'You have unsaved changes. Are you sure you want to leave?',
        accept: () => {
          this.router.navigate(['/purchase-requests']);
        },
      });
    }
  }
}
