import { Component, Input } from '@angular/core';import { CommonModule } from '@angular/common';import { WeeklyTrend } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-forecast-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forecast-card">
      <div class="forecast-card__day">{{ trend?.date | date: 'EEE' }}</div>
      <div class="forecast-card__icon">{{ trend ? getEmoji(trend.weather_condition) : '－' }}</div>
      <div class="forecast-card__temp">{{ trend?.temperature_max ?? '--' }}° / {{ trend?.temperature_min ?? '--' }}°</div>
    </div>
  `,
  styles: [
    `.forecast-card { display: block; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; background: rgba(255,255,255,.95); }`
  ]
})
export class ForecastCardComponent {
  @Input() trend: WeeklyTrend | null = null;

  getEmoji(condition: string): string {
    const value = condition.toLowerCase();
    if (value.includes('rain')) return '🌧️';
    if (value.includes('cloud')) return '☁️';
    if (value.includes('storm')) return '⛈️';
    return '☀️';
  }
}