import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'at-minimal-dashboard',
  standalone: true,
  template: `
    <div>
      <h1>MINIMAL DASHBOARD WORKING</h1>
      <p>This is the dashboard content</p>
      <p>Time: {{ currentTime }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimalDashboardComponent {
  currentTime = new Date().toLocaleString();
}
