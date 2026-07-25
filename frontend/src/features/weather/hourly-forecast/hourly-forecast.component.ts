import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HourlyForecast, WeatherService } from '../../../core/services/weather.service';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="weather-page">
      <h2>Hourly Forecast</h2>
      <p>Hour-by-hour predictions for the next 24 hours.</p>
      <div class="search-row">
        <input [(ngModel)]="city" (keyup.enter)="loadForecast()" placeholder="Enter city name" />
        <button type="button" (click)="loadForecast()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>
      <p *ngIf="error" class="error">{{ error }}</p>
      <div *ngIf="forecast.length" class="forecast-list">
        <div class="item" *ngFor="let hour of forecast">
          <strong>{{ hour.forecast_time | date: 'EEE, HH:mm' }}</strong>
          <span>{{ hour.temperature | number: '1.0-0' }}°C</span>
          <span>{{ hour.weather_condition }}</span>
          <span>Rain {{ hour.precipitation_chance }}%</span>
        </div>
      </div>
      <p *ngIf="!forecast.length && !loading" class="empty">No hourly forecast available for this city.</p>
      <a routerLink="/weather/current">Current weather</a>
    </section>
  `,
  styles: [`
    .weather-page { padding: 1rem; max-width: 1000px; margin: 0 auto; }
    .search-row { display: flex; gap: .75rem; margin: 1rem 0; }
    input { flex: 1; padding: .75rem; border: 1px solid var(--app-border); border-radius: .5rem; }
    button { padding: .75rem 1rem; border: 0; border-radius: .5rem; background: var(--app-primary); color: white; cursor: pointer; }
    button:disabled { opacity: .6; cursor: wait; }
    .forecast-list { display: grid; gap: .5rem; margin-top: 1rem; }
    .item { display: grid; grid-template-columns: 1.4fr .8fr 1.2fr .8fr; gap: .75rem; padding: .9rem; border: 1px solid var(--app-border); border-radius: .5rem; background: var(--app-surface); }
    .error { color: #c62828; }
    .empty { color: var(--app-text-muted); }
    a { display: inline-block; margin-top: 1rem; color: var(--app-primary); }
    @media (max-width: 600px) { .item { grid-template-columns: 1fr 1fr; } }
  `]
})
export class HourlyForecastComponent implements OnInit, OnDestroy {
  city = 'Nairobi';
  forecast: HourlyForecast[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.hourlyForecast$.pipe(takeUntil(this.destroy$)).subscribe(data => this.forecast = data);
    this.weatherService.loading$.pipe(takeUntil(this.destroy$)).subscribe(value => this.loading = value);
    this.weatherService.error$.pipe(takeUntil(this.destroy$)).subscribe(value => this.error = value);
    this.loadForecast();
  }

  loadForecast(): void {
    if (!this.city.trim()) return;
    this.weatherService.getHourlyForecastByCity(this.city).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}