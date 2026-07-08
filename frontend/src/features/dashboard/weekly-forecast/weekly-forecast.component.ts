import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastCardComponent } from '../../../app/shared/components/forecast-card/forecast-card.component';

@Component({
  selector: 'app-weekly-forecast',
  standalone: true,
  imports: [CommonModule, ForecastCardComponent],
  template: `
    <div class="weekly-forecast">
      <h3>Weekly Forecast</h3>
      <div class="week-grid">
        <app-forecast-card *ngFor="let d of [1,2,3,4,5,6,7]"></app-forecast-card>
      </div>
    </div>
  `,
  styles: [`.weekly-forecast { margin-bottom: 1rem; } .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: .5rem; }`]
})
export class WeeklyForecastComponent {}