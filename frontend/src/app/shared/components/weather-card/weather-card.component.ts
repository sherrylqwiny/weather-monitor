import { Component } from '@angular/core';

@Component({
  selector: 'app-weather-card',
  template: `
    <div class="weather-card">
      <div class="weather-card__location">Location</div>
      <div class="weather-card__temperature">24°C</div>
      <div class="weather-card__details">Sunny • 15:00</div>
    </div>
  `,
  styles: [
    `.weather-card { display: block; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; background: rgba(255,255,255,.95); }
     .weather-card__location { font-weight: 700; margin-bottom: .5rem; }
     .weather-card__temperature { font-size: 2rem; margin-bottom: .25rem; }
     .weather-card__details { color: rgba(0,0,0,.6); }`
  ]
})
export class WeatherCardComponent {}
