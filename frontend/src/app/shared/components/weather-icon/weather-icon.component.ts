import { Component } from '@angular/core';

@Component({
  selector: 'app-weather-icon',
  template: `
    <div class="weather-icon">
      <span>☁️</span>
    </div>
  `,
  styles: [
    `.weather-icon { display: inline-flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; border-radius: 50%; background: rgba(0,0,0,.05); font-size: 1.5rem; }`
  ]
})
export class WeatherIconComponent {}