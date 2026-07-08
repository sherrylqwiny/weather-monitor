import { Component } from '@angular/core';

@Component({
  selector: 'app-weather-trend-chart',
  standalone: true,
  template: `
    <div class="weather-trend-chart">
      <h3>Weather Trend</h3>
      <div class="chart-placeholder">[Chart]</div>
    </div>
  `,
  styles: [`.weather-trend-chart { margin-bottom: 1rem; } .chart-placeholder { height: 200px; border: 1px dashed rgba(0,0,0,.08); border-radius: .5rem; display:flex; align-items:center; justify-content:center; }`]
})
export class WeatherTrendChartComponent {}