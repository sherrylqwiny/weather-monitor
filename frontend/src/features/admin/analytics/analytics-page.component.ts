import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, WeatherReport } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="page">
      <h2>Analytics Page</h2>
      <p>Historical temperature, rainfall, and weather statistics.</p>
      <div class="filters">
        <input [(ngModel)]="city" placeholder="City (optional)" />
        <input type="date" [(ngModel)]="startDate" />
        <input type="date" [(ngModel)]="endDate" />
        <button type="button" (click)="load()" [disabled]="loading">{{ loading ? 'Loading...' : 'Apply' }}</button>
      </div>
      <p *ngIf="error" class="error">{{ error }}</p>
      <div class="grid">
        <article class="card">
          <h3>Average Temperature</h3>
          <p>{{ report?.statistics?.average_temperature ?? '--' }}°C</p>
        </article>
        <article class="card">
          <h3>Temperature Range</h3>
          <p>{{ report?.statistics?.lowest_temperature ?? '--' }}°C to {{ report?.statistics?.highest_temperature ?? '--' }}°C</p>
        </article>
        <article class="card">
          <h3>Total Rainfall</h3>
          <p>{{ report?.statistics?.total_rainfall ?? '--' }} mm</p>
        </article>
        <article class="card">
          <h3>Average Wind</h3>
          <p>{{ report?.statistics?.average_wind_speed ?? '--' }} m/s</p>
        </article>
      </div>
      <div class="trend" *ngIf="report?.temperature_trends?.length">
        <h3>Temperature Trends</h3>
        <div class="row" *ngFor="let trend of report?.temperature_trends">
          <span>{{ trend.date | date:'MMM dd' }}</span><span>{{ trend.min }}° / {{ trend.average }}° / {{ trend.max }}°C</span>
        </div>
      </div>
      <div class="trend" *ngIf="report?.rainfall_trends?.length">
        <h3>Rainfall Trends</h3>
        <div class="row" *ngFor="let trend of report?.rainfall_trends">
          <span>{{ trend.date | date:'MMM dd' }}</span><span>{{ trend.rainfall }} mm</span>
        </div>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem;max-width:1100px;margin:0 auto}.filters{display:flex;gap:.75rem;flex-wrap:wrap}.filters input,.filters button{padding:.7rem;border:1px solid rgba(0,0,0,.12);border-radius:.5rem}.filters button{background:#1e88e5;color:#fff;border:0;cursor:pointer}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem}.card,.trend{padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}.card p{font-size:1.4rem;font-weight:600}.row{display:flex;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid rgba(0,0,0,.08)}.error{color:#c62828}`]
})
export class AnalyticsPageComponent implements OnInit {
  city = '';
  startDate = this.dateOffset(-30);
  endDate = this.dateOffset(0);
  report: WeatherReport | null = null;
  loading = false;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.analyticsService.getWeatherReport(this.city, this.startDate, this.endDate).subscribe({
      next: report => { this.report = report; this.loading = false; },
      error: () => { this.error = 'Unable to load analytics.'; this.loading = false; },
    });
  }

  private dateOffset(offset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }
}
