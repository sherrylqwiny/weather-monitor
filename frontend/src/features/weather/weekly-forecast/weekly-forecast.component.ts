import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService, DailyForecast } from '../../../core/services/weather.service';

@Component({
  selector: 'app-weekly-forecast',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="weather-page">
      <div class="page-header">
        <h2>7-Day Forecast</h2>
        <p>Weather outlook for the next 7 days</p>
      </div>

      <div class="search-section">
        <input
          type="text"
          [(ngModel)]="searchCity"
          placeholder="Enter city name"
          (keyup.enter)="loadForecast()"
          class="search-input"
        />
        <button (click)="loadForecast()" class="btn btn-primary" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
        <button (click)="clearError()" class="close-btn">✕</button>
      </div>

      <div *ngIf="forecast.length > 0" class="forecast-grid">
        <div *ngFor="let day of forecast" class="forecast-card">
          <div class="day-name">
            {{ day.forecast_date | date: 'EEE' }}
          </div>
          <div class="date">
            {{ day.forecast_date | date: 'MMM dd' }}
          </div>
          <div class="weather-icon">
            {{ getWeatherEmoji(day.weather_condition) }}
          </div>
          <div class="condition">
            {{ day.weather_condition }}
          </div>
          <div class="temperature-range">
            <span class="temp-max">{{ day.temp_max | number: '1.0-0' }}°</span>
            <span class="temp-min">{{ day.temp_min | number: '1.0-0' }}°</span>
          </div>
          <div class="details">
            <div class="detail">
              <span class="icon">💧</span>
              <span class="value">{{ day.humidity_avg }}%</span>
            </div>
            <div class="detail">
              <span class="icon">💨</span>
              <span class="value">{{ day.wind_speed_avg | number: '1.1-1' }}m/s</span>
            </div>
            <div class="detail">
              <span class="icon">🌧️</span>
              <span class="value">{{ day.precipitation_chance }}%</span>
            </div>
          </div>
          <div class="sun-times">
            <span class="sunrise">🌅 {{ day.sunrise }}</span>
            <span class="sunset">🌆 {{ day.sunset }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="forecast.length === 0 && !loading" class="empty-state">
        <p>Search for a city to see the 7-day forecast</p>
      </div>

      <div class="navigation-links">
        <a routerLink="/weather/current" class="link-btn">Current Weather</a>
        <a routerLink="/weather/hourly" class="link-btn">Hourly Forecast</a>
        <a routerLink="/weather/history" class="link-btn">Weather History</a>
      </div>
    </section>
  `,
  styles: [`
    .weather-page {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: var(--app-text);
    }

    .page-header p {
      color: var(--app-text-muted);
      margin: 0;
    }

    .search-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--app-border);
      border-radius: 0.5rem;
      font-size: 1rem;
      background: var(--app-surface);
      color: var(--app-text);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--app-primary);
      box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background: var(--app-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .alert-error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }

    .close-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
    }

    .forecast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .forecast-card {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 1rem;
      padding: 1rem;
      text-align: center;
      transition: all 0.2s;
    }

    .forecast-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .day-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--app-text);
      margin-bottom: 0.25rem;
    }

    .date {
      font-size: 0.85rem;
      color: var(--app-text-muted);
      margin-bottom: 0.75rem;
    }

    .weather-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .condition {
      font-size: 0.9rem;
      color: var(--app-text-muted);
      margin-bottom: 1rem;
      min-height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .temperature-range {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .temp-max {
      font-weight: 600;
      color: var(--app-primary);
    }

    .temp-min {
      color: var(--app-text-muted);
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem 0;
      border-top: 1px solid var(--app-border);
      border-bottom: 1px solid var(--app-border);
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
    }

    .detail {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }

    .detail .icon {
      font-size: 1rem;
    }

    .detail .value {
      color: var(--app-text);
    }

    .sun-times {
      font-size: 0.8rem;
      color: var(--app-text-muted);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sunrise, .sunset {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--app-text-muted);
    }

    .navigation-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .link-btn {
      padding: 0.75rem 1.5rem;
      background: var(--app-surface-muted);
      border: 1px solid var(--app-border);
      border-radius: 0.5rem;
      text-decoration: none;
      color: var(--app-primary);
      font-weight: 500;
      transition: all 0.2s;
    }

    .link-btn:hover {
      background: var(--app-primary);
      color: white;
      border-color: var(--app-primary);
    }

    @media (max-width: 768px) {
      .forecast-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .forecast-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WeeklyForecastComponent implements OnInit, OnDestroy {
  forecast: DailyForecast[] = [];
  searchCity: string = 'Nairobi';
  loading: boolean = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.dailyForecast$
      .pipe(takeUntil(this.destroy$))
      .subscribe(forecast => {
        this.forecast = forecast;
      });

    this.weatherService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.weatherService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
      });

    this.loadForecast();
  }

  loadForecast(): void {
    if (this.searchCity.trim()) {
      this.weatherService.getWeeklyForecast(this.searchCity).subscribe(
        () => {
          // Data updated through BehaviorSubject
        },
        (error) => {
          console.error('Error loading forecast:', error);
        }
      );
    }
  }

  clearError(): void {
    this.weatherService.clearError();
  }

  getWeatherEmoji(condition: string): string {
    const conditions: { [key: string]: string } = {
      'clear': '☀️',
      'sunny': '☀️',
      'clouds': '☁️',
      'cloudy': '☁️',
      'rain': '🌧️',
      'rainy': '🌧️',
      'snow': '❄️',
      'snowy': '❄️',
      'thunderstorm': '⛈️',
      'mist': '🌫️',
      'fog': '🌫️'
    };
    
    const key = condition.toLowerCase();
    return Object.keys(conditions).find(k => key.includes(k))
      ? conditions[Object.keys(conditions).find(k => key.includes(k)) || 'clear']
      : '🌤️';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}