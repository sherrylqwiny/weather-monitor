import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-weather-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="weather-page">
      <h2>Weather History</h2>
      <p>Historical weather records for the selected city.</p>
      <ul>
        <li>Yesterday: 22°C</li>
        <li>2 days ago: 20°C</li>
        <li>3 days ago: 19°C</li>
      </ul>
    </section>
  `,
  styles: [`.weather-page { padding: 1rem; }`]
})
export class WeatherHistoryComponent {}