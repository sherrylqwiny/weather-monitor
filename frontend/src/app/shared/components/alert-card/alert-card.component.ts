import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardAlert } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-card">
      <div class="alert-card__severity">{{ alert?.severity || 'Info' }}</div>
      <div class="alert-card__message">{{ alert?.city }}: {{ alert?.message || 'No recent alerts' }}</div>
    </div>
  `,
  styles: [
    `.alert-card { display: block; padding: 1rem; border: 1px solid rgba(255,0,0,.2); border-radius: .75rem; background: rgba(255,240,240,.95); }`
  ]
})
export class AlertCardComponent {
  @Input() alert: DashboardAlert | null = null;
}