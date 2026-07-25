import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWeather } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-card">
      <div class="weather-card__location">{{ weather?.city || fallbackCity || 'No city selected' }}</div>
      <div class="weather-card__temperature">{{ weather ? (weather.temperature | number: '1.0-0') + '°C' : '--' }}</div>
      <div class="weather-card__details">{{ weather?.weather_condition || 'No live data available' }}<span *ngIf="weather"> • {{ weather.humidity }}% humidity</span></div>
    </div>
  `,
  styles: [
    `.weather-card { display: block; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; background: rgba(255,255,255,.95); }
     .weather-card__location { font-weight: 700; margin-bottom: .5rem; }
     .weather-card__temperature { font-size: 2rem; margin-bottom: .25rem; }
     .weather-card__details { color: rgba(0,0,0,.6); }`
  ]
})
export class WeatherCardComponent {
  @Input() weather: DashboardWeather | null = null;
  @Input() fallbackCity = '';
}
