import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-card',
  template: `
    <div class="statistics-card">
      <div class="statistics-card__metric">Humidity</div>
      <div class="statistics-card__value">68%</div>
    </div>
  `,
  styles: [
    `.statistics-card { display: block; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; background: rgba(245,245,255,.95); }`
  ]
})
export class StatisticsCardComponent {}