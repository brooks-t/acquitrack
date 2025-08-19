import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'at-smoke',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">🧪 Smoke Test</h1>

      <!-- Test Tailwind utilities -->
      <div class="p-4 rounded bg-blue-500 text-white mb-4">
        ✅ Basic Tailwind: bg-blue-500 + text-white
      </div>

      <!-- Test PrimeUI plugin utilities -->
      <div class="p-4 rounded bg-primary-500 text-white mb-4">
        ✅ PrimeUI Plugin: bg-primary-500
      </div>

      <!-- Test semantic colors -->
      <div class="p-4 rounded bg-surface-100 text-color mb-4">
        ✅ Semantic: bg-surface-100 + text-color
      </div>

      <!-- Test more utilities -->
      <div class="p-4 rounded border-surface bg-surface-0 text-muted-color">
        ✅ Advanced: border-surface + bg-surface-0 + text-muted-color
      </div>
    </div>
  `,
})
export class SmokeComponent {}
