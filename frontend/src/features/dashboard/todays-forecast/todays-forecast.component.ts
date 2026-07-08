import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastCardComponent } from '../../../app/shared/components/forecast-card/forecast-card.component';

@Component({
  selector: 'app-todays-forecast',
  standalone: true,
  imports: [CommonModule, ForecastCardComponent],
  template: `
    <div class="todays-forecast">
      <h3>Today's Forecast</h3>
      <app-forecast-card></app-forecast-card>
    </div>
  `,
  styles: [`.todays-forecast { margin-bottom: 1rem; }`]
})
export class TodaysForecastComponent {}