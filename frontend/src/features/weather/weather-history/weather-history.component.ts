import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService, WeatherHistory } from '../../../core/services/weather.service';

@Component({
  selector: 'app-weather-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="weather-page">
      <div class="page-header">
        <h2>Weather History</h2>
        <p>Historical weather records for the last 30 days</p>
      </div>

      <div class="search-section">
        <input
          type="text"
          [(ngModel)]="searchCity"
          placeholder="Enter city name"
          (keyup.enter)="loadHistory()"
          class="search-input"
        />
        <select [(ngModel)]="days" (change)="loadHistory()" class="select-input">
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
        </select>
        <button (click)="loadHistory()" class="btn btn-primary" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
        <button (click)="clearError()" class="close-btn">✕</button>
      </div>

      <div *ngIf="history.length > 0" class="history-container">
        <div class="history-table">
          <div class="table-header">
            <div class="col date">Date</div>
            <div class="col temp">Temperatures</div>
            <div class="col humidity">Humidity</div>
            <div class="col pressure">Pressure</div>
            <div class="col wind">Wind</div>
            <div class="col precipitation">Precipitation</div>
            <div class="col condition">Condition</div>
          </div>

          <div class="table-body">
            <div *ngFor="let record of history" class="table-row">
              <div class="col date">
                <span class="value">{{ record.recorded_date | date: 'MMM dd, yyyy' }}</span>
                <span class="day">{{ record.recorded_date | date: 'EEE' }}</span>
              </div>
              <div class="col temp">
                <span class="max">{{ record.temperature_max | number: '1.0-0' }}°</span>
                <span class="avg">{{ record.temperature_avg | number: '1.0-0' }}°</span>
                <span class="min">{{ record.temperature_min | number: '1.0-0' }}°</span>
              </div>
              <div class="col humidity">
                {{ record.humidity_avg }}%
              </div>
              <div class="col pressure">
                {{ record.pressure_avg }} hPa
              </div>
              <div class="col wind">
                {{ record.wind_speed_avg | number: '1.1-1' }} m/s
              </div>
              <div class="col precipitation">
                {{ record.precipitation_total | number: '1.1-1' }} mm
              </div>
              <div class="col condition">
                {{ record.weather_condition }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="history.length === 0 && !loading" class="empty-state">
        <p>Search for a city to see weather history</p>
      </div>

      <div class="navigation-links">
        <a routerLink="/weather/current" class="link-btn">Current Weather</a>
        <a routerLink="/weather/weekly" class="link-btn">Weekly Forecast</a>
        <a routerLink="/weather/hourly" class="link-btn">Hourly Forecast</a>
      </div>
    </section>
  `,
  styles: [`
    .weather-page {
      padding: 1.5rem;
      max-width: 1400px;
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
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 150px;
      padding: 0.75rem 1rem;
      border: 1px solid var(--app-border);
      border-radius: 0.5rem;
      font-size: 1rem;
      background: var(--app-surface);
      color: var(--app-text);
    }

    .select-input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--app-border);
      border-radius: 0.5rem;
      font-size: 1rem;
      background: var(--app-surface);
      color: var(--app-text);
      cursor: pointer;
    }

    .search-input:focus,
    .select-input:focus {
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
      white-space: nowrap;
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

    .history-container {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 1rem;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .history-table {
      display: flex;
      flex-direction: column;
    }

    .table-header {
      display: grid;
      grid-template-columns: 120px 150px 100px 120px 120px 120px 150px;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--app-surface-muted);
      font-weight: 600;
      color: var(--app-text);
      border-bottom: 2px solid var(--app-border);
      position: sticky;
      top: 0;
    }

    .table-body {
      max-height: 600px;
      overflow-y: auto;
    }

    .table-row {
      display: grid;
      grid-template-columns: 120px 150px 100px 120px 120px 120px 150px;
      gap: 1rem;
      padding: 1.5rem;
      border-bottom: 1px solid var(--app-border);
      align-items: center;
    }

    .table-row:hover {
      background: var(--app-surface-muted);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .col {
      font-size: 0.95rem;
      color: var(--app-text);
    }

    .col.date {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .col.date .value {
      font-weight: 600;
    }

    .col.date .day {
      font-size: 0.85rem;
      color: var(--app-text-muted);
    }

    .col.temp {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .col.temp .max {
      color: var(--app-primary);
      font-weight: 600;
    }

    .col.temp .avg {
      color: var(--app-text);
    }

    .col.temp .min {
      color: var(--app-text-muted);
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

    @media (max-width: 1024px) {
      .table-header,
      .table-row {
        grid-template-columns: 100px 120px 80px 100px 100px 100px 130px;
      }
    }

    @media (max-width: 768px) {
      .search-section {
        flex-direction: column;
      }

      .table-header,
      .table-row {
        grid-template-columns: 80px 100px 70px 80px 80px 80px 100px;
        gap: 0.75rem;
        padding: 1rem;
      }

      .col {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .table-header,
      .table-row {
        grid-template-columns: 1fr;
      }

      .table-header {
        display: none;
      }

      .table-row {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
      }

      .col {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .col::before {
        content: attr(data-label);
        font-weight: 600;
        color: var(--app-text-muted);
      }
    }
  `]
})
export class WeatherHistoryComponent implements OnInit, OnDestroy {
  history: WeatherHistory[] = [];
  searchCity: string = 'Nairobi';
  days: number = 30;
  loading: boolean = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.weatherHistory$
      .pipe(takeUntil(this.destroy$))
      .subscribe(history => {
        this.history = history;
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

    this.loadHistory();
  }

  loadHistory(): void {
    if (this.searchCity.trim()) {
      this.weatherService.getWeatherHistoryByCity(this.searchCity, this.days).subscribe(
        () => {
          // Data updated through BehaviorSubject
        },
        (error) => {
          console.error('Error loading history:', error);
        }
      );
    }
  }

  clearError(): void {
    this.weatherService.clearError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}