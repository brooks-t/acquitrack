import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG v20 Components (using correct naming)
import { ToastModule } from 'primeng/toast';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';

import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'at-core-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastModule,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    BreadcrumbModule,
    MenuModule,
    BadgeModule,
    RippleModule,
  ],
  template: `
    <div class="min-h-screen bg-surface-0 flex">
      <!-- Mobile Overlay for Sidebar -->
      <button
        *ngIf="mobileMenuOpen()"
        class="fixed inset-0 bg-surface-900/50 z-40 lg:hidden cursor-pointer"
        (click)="toggleMobileSidebar()"
        (keydown.enter)="toggleMobileSidebar()"
        (keydown.space)="toggleMobileSidebar()"
        aria-label="Close navigation menu"
        type="button"
      ></button>

      <!-- Left Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-surface-50 border-r border-surface-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
        [class.translate-x-0]="mobileMenuOpen()"
        [class.-translate-x-full]="!mobileMenuOpen()"
      >
        <!-- Sidebar Header -->
        <div
          class="flex items-center justify-between h-16 px-6 border-b border-surface-200"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-shopping-cart text-white text-sm"></i>
            </div>
            <h1 class="text-xl font-bold text-color">AcquiTrack</h1>
          </div>
          <!-- Mobile Close Button -->
          <p-button
            *ngIf="mobileMenuOpen()"
            (onClick)="toggleMobileSidebar()"
            icon="pi pi-times"
            [text]="true"
            class="lg:hidden"
            aria-label="Close navigation menu"
          />
        </div>

        <!-- Navigation Menu -->
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-transparent text-color-secondary hover:bg-surface-100 hover:text-color transition-colors"
              (click)="closeMobileMenu()"
            >
              <i class="pi pi-home text-lg"></i>
              Dashboard
            </a>
            <a
              routerLink="/vendors"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-transparent text-color-secondary hover:bg-surface-100 hover:text-color transition-colors"
              (click)="closeMobileMenu()"
            >
              <i class="pi pi-building text-lg"></i>
              Vendors
            </a>
            <a
              routerLink="/reports"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-transparent text-color-secondary hover:bg-surface-100 hover:text-color transition-colors"
              (click)="closeMobileMenu()"
            >
              <i class="pi pi-chart-bar text-lg"></i>
              Reports
            </a>
            <!-- Future Navigation Items -->
            <a
              routerLink="/purchase-requests"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-transparent text-color-secondary hover:bg-surface-100 hover:text-color transition-colors"
              (click)="closeMobileMenu()"
            >
              <i class="pi pi-file-edit text-lg"></i>
              Purchase Requests
            </a>
            <a
              routerLink="/solicitations"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-transparent text-color-secondary hover:bg-surface-100 hover:text-color transition-colors"
              (click)="closeMobileMenu()"
            >
              <i class="pi pi-megaphone text-lg"></i>
              Solicitations
            </a>
            <a
              routerLink="/approvals"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-transparent text-color-secondary hover:bg-surface-100 hover:text-color transition-colors"
              (click)="closeMobileMenu()"
            >
              <i class="pi pi-check-circle text-lg"></i>
              Approvals
              <p-badge
                *ngIf="pendingApprovalsCount() > 0"
                [value]="pendingApprovalsCount().toString()"
                severity="danger"
                class="ml-auto"
              />
            </a>
            <a
              routerLink="/admin"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-transparent text-color-secondary hover:bg-surface-100 hover:text-color transition-colors"
              (click)="closeMobileMenu()"
            >
              <i class="pi pi-cog text-lg"></i>
              Admin
            </a>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col lg:ml-0">
        <!-- Top Header -->
        <header
          class="h-16 bg-surface-0 border-b border-surface-200 flex items-center justify-between px-4 lg:px-6"
        >
          <!-- Left Section: Mobile Menu + Breadcrumbs -->
          <div class="flex items-center gap-4">
            <!-- Mobile Menu Toggle -->
            <p-button
              (onClick)="toggleMobileSidebar()"
              icon="pi pi-bars"
              [text]="true"
              class="lg:hidden"
              aria-label="Toggle navigation menu"
            />

            <!-- Breadcrumbs -->
            <p-breadcrumb
              [model]="breadcrumbService.breadcrumbs()"
              class="hidden sm:block"
            />
          </div>

          <!-- Right Section: Notifications + User Menu -->
          <div class="flex items-center gap-3">
            <!-- Notifications -->
            <p-button
              (onClick)="toggleNotifications()"
              icon="pi pi-bell"
              [text]="true"
              [badge]="notificationCount().toString()"
              [badgeClass]="'p-badge-danger'"
              aria-label="Notifications"
            />

            <!-- User Menu -->
            <div class="relative">
              <p-button
                (onClick)="toggleUserMenu()"
                [text]="true"
                class="flex items-center gap-2"
                aria-label="User menu"
              >
                <p-avatar
                  label="JD"
                  size="normal"
                  shape="circle"
                  styleClass="bg-primary-500 text-white"
                />
                <span class="hidden sm:inline text-sm font-medium text-color"
                  >John Doe</span
                >
                <i class="pi pi-chevron-down text-xs text-color-secondary"></i>
              </p-button>

              <!-- User Menu Dropdown -->
              <p-menu #userMenu [model]="userMenuItems" [popup]="true" />
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 p-4 lg:p-6 bg-surface-50">
          <router-outlet />
        </main>
      </div>

      <!-- Toast Container -->
      <p-toast />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreLayoutComponent {
  breadcrumbService = inject(BreadcrumbService);

  // Mobile menu state
  mobileMenuOpen = signal(false);

  // Notification state
  notificationCount = signal(3);

  // Pending approvals count
  pendingApprovalsCount = signal(5);

  // User menu items
  userMenuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.goToProfile(),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.goToSettings(),
    },
    { separator: true },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: () => this.signOut(),
    },
  ];

  toggleMobileSidebar(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleNotifications(): void {
    // TODO: Implement notifications panel
    console.log('Toggle notifications');
  }

  toggleUserMenu(): void {
    // The menu will be handled by PrimeNG's menu component
  }

  private goToProfile(): void {
    // TODO: Navigate to profile
    console.log('Go to profile');
  }

  private goToSettings(): void {
    // TODO: Navigate to settings
    console.log('Go to settings');
  }

  private signOut(): void {
    // TODO: Implement sign out
    console.log('Sign out');
  }
}
