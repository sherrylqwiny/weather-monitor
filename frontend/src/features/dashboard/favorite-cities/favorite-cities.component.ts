import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCardComponent } from '../../../app/shared/components/weather-card/weather-card.component';
import { FavoriteCityWeather } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-favorite-cities',
  standalone: true,
  imports: [CommonModule, WeatherCardComponent],
  template: `
    <div class="favorite-cities">
      <h4>Favorite Cities</h4>
      <app-weather-card *ngFor="let city of cities" [weather]="city.weather" [fallbackCity]="city.city"></app-weather-card>
    </div>
  `,
  styles: [`.favorite-cities { margin-bottom: 1rem; }`]
})
export class FavoriteCitiesComponent {
  @Input() cities: FavoriteCityWeather[] = [];
}