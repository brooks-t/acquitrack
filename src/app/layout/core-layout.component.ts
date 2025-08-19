import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'at-core-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    BreadcrumbModule,
    ToastModule,
  ],
  template: `
    <div class="min-h-screen bg-surface-0">
      <!-- Top Navigation Bar -->
      <header
        class="bg-surface-0 border-b border-surface-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40"
      >
        <!-- Left Section: Logo + Menu Toggle -->
        <div class="flex items-center gap-4">
          <!-- Mobile menu toggle -->
          <p-button
            (onClick)="toggleMobileSidebar()"
            icon="pi pi-bars"
            severity="secondary"
            [text]="true"
            class="lg:hidden"
            aria-label="Toggle navigation menu"
          />

          <!-- Logo/Brand -->
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-shopping-cart text-white text-sm"></i>
            </div>
            <h1 class="text-xl font-bold text-color hidden sm:block">
              AcquiTrack
            </h1>
          </div>
        </div>

        <!-- Right Section: User Menu -->
        <div class="flex items-center gap-3">
          <!-- Notifications -->
          <p-button
            icon="pi pi-bell"
            severity="secondary"
            [text]="true"
            [badge]="notificationCount().toString()"
            [badgeClass]="'p-badge-danger'"
            aria-label="Notifications"
          />

          <!-- User Menu -->
          <p-button
            (onClick)="userMenu.toggle($event)"
            severity="secondary"
            [text]="true"
            aria-label="User menu"
          >
            <p-avatar
              label="JD"
              size="normal"
              shape="circle"
              styleClass="bg-primary-500 text-white"
            />
          </p-button>

          <p-menu #userMenu [model]="userMenuItems()" [popup]="true" />
        </div>
      </header>

      <div class="flex">
        <!-- Desktop Sidebar -->
        <aside
          class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:bg-surface-50 lg:border-r lg:border-surface-200"
        >
          <nav class="flex-1 p-4 space-y-2">
            @for (item of navigationItems(); track item.label) {
              <a
                [routerLink]="item.routerLink"
                class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-color-secondary hover:text-color hover:bg-surface-100 transition-colors"
              >
                <i [class]="item.icon" class="text-lg"></i>
                {{ item.label }}
              </a>
            }
          </nav>
        </aside>

        <!-- Mobile Drawer -->
        <p-drawer
          [(visible)]="mobileMenuOpen"
          position="left"
          styleClass="w-80"
          [modal]="true"
        >
          <ng-template pTemplate="header">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-shopping-cart text-white text-sm"></i>
              </div>
              <h2 class="text-lg font-semibold">AcquiTrack</h2>
            </div>
          </ng-template>

          <nav class="space-y-2">
            @for (item of navigationItems(); track item.label) {
              <a
                [routerLink]="item.routerLink"
                (click)="closeMobileSidebar()"
                class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-color-secondary hover:text-color hover:bg-surface-100 transition-colors"
              >
                <i [class]="item.icon" class="text-lg"></i>
                {{ item.label }}
              </a>
            }
          </nav>
        </p-drawer>

        <!-- Main Content -->
        <main class="flex-1 lg:ml-64">
          <!-- Breadcrumb -->
          <div class="bg-surface-0 border-b border-surface-200 px-4 py-3">
            <p-breadcrumb [model]="breadcrumbItems()" />
          </div>

          <!-- Page Content -->
          <div class="p-6">
            <router-outlet />
          </div>
        </main>
      </div>

      <!-- Toast Container -->
      <p-toast />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreLayoutComponent {
  private breadcrumbService = inject(BreadcrumbService);

  mobileMenuOpen = signal(false);
  notificationCount = signal(3);

  navigationItems = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
    },
    {
      label: 'Purchase Requests',
      icon: 'pi pi-shopping-cart',
      routerLink: '/purchase-requests',
    },
    {
      label: 'Vendors',
      icon: 'pi pi-building',
      routerLink: '/vendors',
    },
    {
      label: 'Contracts',
      icon: 'pi pi-file-edit',
      routerLink: '/contracts',
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      routerLink: '/reports',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: '/settings',
    },
  ]);

  userMenuItems = signal<MenuItem[]>([
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.handleUserAction('profile'),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.handleUserAction('settings'),
    },
    {
      separator: true,
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: () => this.handleUserAction('logout'),
    },
  ]);

  breadcrumbItems = this.breadcrumbService.breadcrumbs;

  toggleMobileSidebar(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileSidebar(): void {
    this.mobileMenuOpen.set(false);
  }

  private handleUserAction(action: string): void {
    console.log('User action:', action);
    // TODO: Implement user actions (profile, settings, logout)
  }
}
