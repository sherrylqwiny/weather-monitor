import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCardComponent } from '../../../app/shared/components/weather-card/weather-card.component';

@Component({
  selector: 'app-favorite-cities',
  standalone: true,
  imports: [CommonModule, WeatherCardComponent],
  template: `
    <div class="favorite-cities">
      <h4>Favorite Cities</h4>
      <app-weather-card *ngFor="let c of [1,2,3]"></app-weather-card>
    </div>
  `,
  styles: [`.favorite-cities { margin-bottom: 1rem; }`]
})
export class FavoriteCitiesComponent {}