import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertCardComponent } from '../../../app/shared/components/alert-card/alert-card.component';

@Component({
  selector: 'app-recent-alerts',
  standalone: true,
  imports: [CommonModule, AlertCardComponent],
  template: `
    <div class="recent-alerts">
      <h4>Recent Alerts</h4>
      <app-alert-card *ngFor="let a of [1,2]"></app-alert-card>
    </div>
  `,
  styles: [`.recent-alerts { margin-bottom: 1rem; }`]
})
export class RecentAlertsComponent {}