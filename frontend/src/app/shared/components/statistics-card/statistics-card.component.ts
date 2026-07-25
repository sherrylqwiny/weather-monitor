import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="statistics-card">
      <div class="statistics-card__metric">Average humidity</div>
      <div class="statistics-card__value">{{ statistics?.average_humidity ?? '--' }}%</div>
      <div class="statistics-card__metric">Temperature range</div>
      <div class="statistics-card__value">{{ statistics?.lowest_temperature ?? '--' }}° to {{ statistics?.highest_temperature ?? '--' }}°</div>
    </div>
  `,
  styles: [
    `.statistics-card { display: block; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; background: rgba(245,245,255,.95); }`
  ]
})
export class StatisticsCardComponent {
  @Input() statistics: DashboardData['weather_statistics'] | null = null;
}