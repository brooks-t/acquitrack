import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'at-minimal-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="background-color: red; color: white; padding: 20px;">
      <h1 style="font-size: 24px; font-weight: bold;">INLINE STYLES TEST</h1>
      <p>This tests if basic styling works at all</p>

      <!-- Testing TailwindCSS Classes -->
      <div class="bg-green-500 text-white p-4 mt-4 rounded">
        <p>
          If this div is GREEN with rounded corners, TailwindCSS is working!
        </p>
      </div>

      <div
        style="background-color: blue; color: white; margin-top: 10px; padding: 15px;"
      >
        <h2>Content Area (should be blue):</h2>
        <router-outlet />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimalLayoutComponent {}
