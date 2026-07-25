import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCardComponent } from '../../../app/shared/components/weather-card/weather-card.component';
import { DashboardWeather } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-current-weather-card',
  standalone: true,
  imports: [CommonModule, WeatherCardComponent],
  template: `
    <div class="current-weather-card">
      <app-weather-card [weather]="weather"></app-weather-card>
    </div>
  `,
  styles: [`.current-weather-card { margin-bottom: 1rem; }`]
})
export class CurrentWeatherCardComponent {
  @Input() weather: DashboardWeather | null = null;
}