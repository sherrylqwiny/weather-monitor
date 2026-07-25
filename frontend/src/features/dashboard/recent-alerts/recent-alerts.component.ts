import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertCardComponent } from '../../../app/shared/components/alert-card/alert-card.component';
import { DashboardAlert } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-recent-alerts',
  standalone: true,
  imports: [CommonModule, AlertCardComponent],
  template: `
    <div class="recent-alerts">
      <h4>Recent Alerts</h4>
      <app-alert-card *ngFor="let alert of alerts" [alert]="alert"></app-alert-card>
    </div>
  `,
  styles: [`.recent-alerts { margin-bottom: 1rem; }`]
})
export class RecentAlertsComponent {
  @Input() alerts: DashboardAlert[] = [];
}