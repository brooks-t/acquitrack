import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'at-debug',
  standalone: true,
  template: `
    <div style="background: red; color: white; padding: 20px; font-size: 24px;">
      DEBUG COMPONENT IS WORKING!
      <p>If you can see this, Angular is rendering components.</p>
      <p>Current time: {{ currentTime }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugComponent {
  currentTime = new Date().toLocaleString();
}
