import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private _breadcrumbs = signal<MenuItem[]>([
    { label: 'Home', routerLink: '/dashboard' },
  ]);

  breadcrumbs = this._breadcrumbs.asReadonly();

  setBreadcrumbs(items: MenuItem[]): void {
    this._breadcrumbs.set([
      { label: 'Home', routerLink: '/dashboard' },
      ...items,
    ]);
  }

  reset(): void {
    this._breadcrumbs.set([{ label: 'Home', routerLink: '/dashboard' }]);
  }
}
