import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="weather-page">
      <h2>Current Weather</h2>
      <p>Temperature, humidity, wind, and current conditions.</p>
      <div class="card">
        <h3>Nairobi</h3>
        <p>24°C • Sunny</p>
      </div>
      <div class="actions">
        <a routerLink="/weather/detailed">Detailed View</a>
        <a routerLink="/weather/hourly">Hourly Forecast</a>
      </div>
    </section>
  `,
  styles: [
    `.weather-page { padding: 1rem; } .card { margin-top: 1rem; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; } .actions { display: flex; gap: 1rem; margin-top: 1rem; } a { color: #1e88e5; text-decoration: none; }`
  ]
})
export class CurrentWeatherComponent {}