import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-weather-records',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Weather Records</h2>
      <p>Historical station and sensor observations.</p>
      <div class="grid">
        <article class="card">
          <h3>Nairobi Station</h3>
          <p>Temp: 22°C • Humidity: 64%</p>
        </article>
        <article class="card">
          <h3>Kisumu Station</h3>
          <p>Temp: 24°C • Humidity: 72%</p>
        </article>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.card{padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}`]
})
export class WeatherRecordsComponent {}
