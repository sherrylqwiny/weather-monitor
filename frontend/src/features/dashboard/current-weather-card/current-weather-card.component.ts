import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCardComponent } from '../../../app/shared/components/weather-card/weather-card.component';

@Component({
  selector: 'app-current-weather-card',
  standalone: true,
  imports: [CommonModule, WeatherCardComponent],
  template: `
    <div class="current-weather-card">
      <app-weather-card></app-weather-card>
    </div>
  `,
  styles: [`.current-weather-card { margin-bottom: 1rem; }`]
})
export class CurrentWeatherCardComponent {}