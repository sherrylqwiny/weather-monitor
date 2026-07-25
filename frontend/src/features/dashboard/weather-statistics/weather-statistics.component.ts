import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsCardComponent } from '../../../app/shared/components/statistics-card/statistics-card.component';
import { DashboardData } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-weather-statistics',
  standalone: true,
  imports: [CommonModule, StatisticsCardComponent],
  template: `
    <div class="weather-statistics">
      <h4>Statistics</h4>
      <app-statistics-card [statistics]="statistics"></app-statistics-card>
    </div>
  `,
  styles: [`.weather-statistics { margin-bottom: 1rem; }`]
})
export class WeatherStatisticsComponent {
  @Input() statistics: DashboardData['weather_statistics'] | null = null;
}