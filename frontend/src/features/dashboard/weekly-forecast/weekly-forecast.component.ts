import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastCardComponent } from '../../../app/shared/components/forecast-card/forecast-card.component';
import { WeeklyTrend } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-weekly-forecast',
  standalone: true,
  imports: [CommonModule, ForecastCardComponent],
  template: `
    <div class="weekly-forecast">
      <h3>Weekly Forecast</h3>
      <div class="week-grid">
        <app-forecast-card *ngFor="let trend of trends" [trend]="trend"></app-forecast-card>
      </div>
    </div>
  `,
  styles: [`.weekly-forecast { margin-bottom: 1rem; } .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: .5rem; }`]
})
export class WeeklyForecastComponent {
  @Input() trends: WeeklyTrend[] = [];
}