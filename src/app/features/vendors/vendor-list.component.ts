import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
import { BreadcrumbService } from '../../layout/breadcrumb.service';

interface Vendor {
  id: string;
  name: string;
  cageCode: string;
  duns: string;
  status: 'Active' | 'Inactive';
  lastActivity: string;
}

@Component({
  selector: 'at-vendor-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    // IconFieldModule,
    // InputIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-surface-900">Vendor Management</h1>
          <p class="text-surface-600 mt-2">
            Manage vendor information and relationships
          </p>
        </div>
        <p-button label="Add Vendor" icon="pi pi-plus" severity="primary" />
      </div>

      <!-- Search and Filters -->
      <p-card header="Search Vendors">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <i
              class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
            ></i>
            <input
              pInputText
              placeholder="Search by name, CAGE, or DUNS..."
              class="w-full pl-10"
            />
          </div>
          <p-button
            label="Advanced Filters"
            icon="pi pi-filter"
            severity="secondary"
            [outlined]="true"
          />
          <p-button
            label="Export"
            icon="pi pi-download"
            severity="secondary"
            [outlined]="true"
          />
        </div>
      </p-card>

      <!-- Vendors Table -->
      <p-card>
        <p-table
          [value]="vendors"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vendors"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Vendor Name</th>
              <th>CAGE Code</th>
              <th>DUNS</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-vendor>
            <tr>
              <td>
                <div class="font-semibold text-surface-900">
                  {{ vendor.name }}
                </div>
              </td>
              <td>
                <span class="font-mono text-sm">{{ vendor.cageCode }}</span>
              </td>
              <td>
                <span class="font-mono text-sm">{{ vendor.duns }}</span>
              </td>
              <td>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  [class]="
                    vendor.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ vendor.status }}
                </span>
              </td>
              <td>
                <span class="text-surface-600">{{ vendor.lastActivity }}</span>
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    icon="pi pi-eye"
                    size="small"
                    [text]="true"
                    severity="secondary"
                    pTooltip="View Details"
                  />
                  <p-button
                    icon="pi pi-pencil"
                    size="small"
                    [text]="true"
                    severity="secondary"
                    pTooltip="Edit"
                  />
                  <p-button
                    icon="pi pi-trash"
                    size="small"
                    [text]="true"
                    severity="danger"
                    pTooltip="Delete"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-8">
                <div class="text-surface-500">
                  <i class="pi pi-inbox text-4xl mb-4 block"></i>
                  <p class="text-lg">No vendors found</p>
                  <p class="text-sm">Start by adding your first vendor</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
})
export class VendorListComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  vendors: Vendor[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      cageCode: '12345',
      duns: '123456789',
      status: 'Active',
      lastActivity: '2025-08-15',
    },
    {
      id: '2',
      name: 'TechSolutions Inc.',
      cageCode: '67890',
      duns: '987654321',
      status: 'Active',
      lastActivity: '2025-08-10',
    },
    {
      id: '3',
      name: 'Global Services LLC',
      cageCode: '54321',
      duns: '456789123',
      status: 'Inactive',
      lastActivity: '2025-07-20',
    },
  ];

  ngOnInit(): void {
    // TODO: Implement breadcrumb service setItems method
    console.log('Vendor list component initialized');
  }
}
