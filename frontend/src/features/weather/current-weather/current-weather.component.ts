import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService, CurrentWeather } from '../../../core/services/weather.service';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="weather-page">
      <div class="page-header">
        <h2>Current Weather</h2>
        <p>Real-time weather conditions</p>
      </div>

      <div class="search-section">
        <input
          type="text"
          [(ngModel)]="searchCity"
          placeholder="Enter city name"
          (keyup.enter)="loadWeatherByCity()"
          class="search-input"
        />
        <button (click)="loadWeatherByCity()" class="btn btn-primary" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
        <button (click)="clearError()" class="close-btn">✕</button>
      </div>

      <div *ngIf="currentWeather" class="weather-card large">
        <div class="weather-header">
          <div class="location">
            <h3>{{ currentWeather.station.city }}, {{ currentWeather.station.country }}</h3>
            <p class="updated">Updated: {{ currentWeather.updated_at | date: 'short' }}</p>
          </div>
          <div class="condition-icon" [ngClass]="'icon-' + currentWeather.weather_icon">
            {{ getWeatherEmoji(currentWeather.weather_condition) }}
          </div>
        </div>

        <div class="temperature-section">
          <div class="main-temp">
            <span class="temp-value">{{ currentWeather.temperature | number: '1.0-0' }}°C</span>
            <span class="condition">{{ currentWeather.weather_condition }}</span>
          </div>
          <div class="feels-like">
            Feels like {{ currentWeather.feels_like | number: '1.0-0' }}°C
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <span class="label">💧 Humidity</span>
            <span class="value">{{ currentWeather.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">💨 Wind Speed</span>
            <span class="value">{{ currentWeather.wind_speed | number: '1.1-1' }} m/s</span>
          </div>
          <div class="detail-item">
            <span class="label">🧭 Wind Direction</span>
            <span class="value">{{ getWindDirection(currentWeather.wind_direction) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">🔍 Visibility</span>
            <span class="value">{{ (currentWeather.visibility / 1000) | number: '1.1-1' }} km</span>
          </div>
          <div class="detail-item">
            <span class="label">☁️ Cloud Coverage</span>
            <span class="value">{{ currentWeather.cloud_coverage }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">🌡️ Pressure</span>
            <span class="value">{{ currentWeather.pressure }} hPa</span>
          </div>
          <div class="detail-item">
            <span class="label">☀️ UV Index</span>
            <span class="value" [ngClass]="'uv-' + getUVLevel(currentWeather.uv_index)">
              {{ currentWeather.uv_index | number: '1.1-1' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="label">🌅 Sunrise</span>
            <span class="value">{{ currentWeather.sunrise }}</span>
          </div>
        </div>

        <div class="sun-times">
          <div class="sunrise">
            <span class="label">🌅 Sunrise</span>
            <span class="time">{{ currentWeather.sunrise }}</span>
          </div>
          <div class="sunset">
            <span class="label">🌆 Sunset</span>
            <span class="time">{{ currentWeather.sunset }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="!currentWeather && !loading" class="empty-state">
        <p>Search for a city to see current weather conditions</p>
      </div>

      <div class="navigation-links">
        <a routerLink="/weather/hourly" class="link-btn">Hourly Forecast</a>
        <a routerLink="/weather/weekly" class="link-btn">Weekly Forecast</a>
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

    .weather-card {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .weather-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .location h3 {
      font-size: 1.5rem;
      margin: 0 0 0.25rem 0;
      color: var(--app-text);
    }

    .updated {
      font-size: 0.85rem;
      color: var(--app-text-muted);
      margin: 0;
    }

    .condition-icon {
      font-size: 4rem;
    }

    .temperature-section {
      margin-bottom: 2rem;
    }

    .main-temp {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .temp-value {
      font-size: 3.5rem;
      font-weight: 700;
      color: var(--app-primary);
    }

    .condition {
      font-size: 1.2rem;
      color: var(--app-text-muted);
    }

    .feels-like {
      font-size: 1rem;
      color: var(--app-text-muted);
      margin-top: 0.5rem;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .detail-item {
      background: var(--app-surface-muted);
      padding: 1rem;
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item .label {
      font-size: 0.85rem;
      color: var(--app-text-muted);
    }

    .detail-item .value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--app-text);
    }

    .uv-low {
      color: #43a047;
    }

    .uv-moderate {
      color: #fbc02d;
    }

    .uv-high {
      color: #f57c00;
    }

    .uv-very-high {
      color: #d32f2f;
    }

    .sun-times {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .sunrise, .sunset {
      background: var(--app-surface-muted);
      padding: 1.5rem;
      border-radius: 0.75rem;
      text-align: center;
    }

    .sunrise .label, .sunset .label {
      display: block;
      font-size: 1rem;
      color: var(--app-text-muted);
      margin-bottom: 0.5rem;
    }

    .time {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--app-text);
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
      .weather-card {
        padding: 1.5rem;
      }

      .temp-value {
        font-size: 2.5rem;
      }

      .weather-header {
        flex-direction: column;
        gap: 1rem;
      }

      .details-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .condition-icon {
        font-size: 3rem;
      }
    }
  `]
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  currentWeather: CurrentWeather | null = null;
  searchCity: string = 'Nairobi';
  loading: boolean = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Subscribe to weather service observables
    this.weatherService.currentWeather$
      .pipe(takeUntil(this.destroy$))
      .subscribe(weather => {
        this.currentWeather = weather;
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

    // Load default city
    this.loadWeatherByCity();
  }

  loadWeatherByCity(): void {
    if (this.searchCity.trim()) {
      this.weatherService.getCurrentWeatherByCity(this.searchCity).subscribe(
        () => {
          // Data is automatically updated through the BehaviorSubject
        },
        (error) => {
          console.error('Error loading weather:', error);
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

  getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  getUVLevel(uv: number): string {
    if (uv < 3) return 'low';
    if (uv < 6) return 'moderate';
    if (uv < 8) return 'high';
    return 'very-high';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}