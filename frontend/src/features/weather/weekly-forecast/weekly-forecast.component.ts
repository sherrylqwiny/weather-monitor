import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-weekly-forecast',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="weather-page">
      <h2>Weekly Forecast</h2>
      <p>7-day outlook for the selected city.</p>
      <div class="forecast-list">
        <div class="item">Mon • 21°C</div>
        <div class="item">Tue • 22°C</div>
        <div class="item">Wed • 24°C</div>
      </div>
    </section>
  `,
  styles: [`.weather-page { padding: 1rem; } .forecast-list { display: grid; gap: .5rem; margin-top: 1rem; } .item { padding: .75rem; border: 1px solid rgba(0,0,0,.08); border-radius: .5rem; }`]
})
export class WeeklyForecastComponent {}