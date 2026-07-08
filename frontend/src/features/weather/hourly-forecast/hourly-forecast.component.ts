import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="weather-page">
      <h2>Hourly Forecast</h2>
      <p>Hour-by-hour predictions for the day.</p>
      <div class="forecast-list">
        <div class="item">06:00 • 18°C</div>
        <div class="item">09:00 • 22°C</div>
        <div class="item">12:00 • 25°C</div>
      </div>
    </section>
  `,
  styles: [`.weather-page { padding: 1rem; } .forecast-list { display: grid; gap: .5rem; margin-top: 1rem; } .item { padding: .75rem; border: 1px solid rgba(0,0,0,.08); border-radius: .5rem; }`]
})
export class HourlyForecastComponent {}