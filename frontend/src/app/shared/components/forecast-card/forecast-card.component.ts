import { Component } from '@angular/core';

@Component({
  selector: 'app-forecast-card',
  template: `
    <div class="forecast-card">
      <div class="forecast-card__day">Mon</div>
      <div class="forecast-card__icon">☀️</div>
      <div class="forecast-card__temp">22° / 16°</div>
    </div>
  `,
  styles: [
    `.forecast-card { display: block; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; background: rgba(255,255,255,.95); }`
  ]
})
export class ForecastCardComponent {}