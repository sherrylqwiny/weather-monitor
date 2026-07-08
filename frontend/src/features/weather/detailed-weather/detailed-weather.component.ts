import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-detailed-weather',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="weather-page">
      <h2>Detailed Weather</h2>
      <p>More detailed information such as visibility, UV index, and pressure.</p>
      <div class="card">
        <p>Visibility: 10km</p>
        <p>Pressure: 1012 hPa</p>
        <p>UV Index: 5</p>
      </div>
    </section>
  `,
  styles: [`.weather-page { padding: 1rem; } .card { margin-top: 1rem; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; }`]
})
export class DetailedWeatherComponent {}