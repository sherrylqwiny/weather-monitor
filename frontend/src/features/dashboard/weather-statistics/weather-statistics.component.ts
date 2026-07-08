import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsCardComponent } from '../../../app/shared/components/statistics-card/statistics-card.component';

@Component({
  selector: 'app-weather-statistics',
  standalone: true,
  imports: [CommonModule, StatisticsCardComponent],
  template: `
    <div class="weather-statistics">
      <h4>Statistics</h4>
      <app-statistics-card></app-statistics-card>
    </div>
  `,
  styles: [`.weather-statistics { margin-bottom: 1rem; }`]
})
export class WeatherStatisticsComponent {}