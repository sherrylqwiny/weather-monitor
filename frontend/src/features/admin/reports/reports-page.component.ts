import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, WeatherReport } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="page">
      <h2>Reports Page</h2>
      <p>Export historical weather reports for operations and public safety.</p>
      <div class="card filters">
        <input [(ngModel)]="city" placeholder="City (optional)" />
        <input type="date" [(ngModel)]="startDate" />
        <input type="date" [(ngModel)]="endDate" />
        <button type="button" (click)="load()">Preview</button>
        <button type="button" (click)="download('csv')" [disabled]="downloading">Export CSV</button>
        <button type="button" (click)="download('pdf')" [disabled]="downloading">Export PDF</button>
      </div>
      <p *ngIf="error" class="error">{{ error }}</p>
      <div class="card" *ngIf="report">
        <h3>{{ report.city }} · {{ report.start_date }} to {{ report.end_date }}</h3>
        <p>{{ report.records.length }} historical records</p>
        <div class="record" *ngFor="let record of report.records">
          <span>{{ record.date | date:'mediumDate' }}</span>
          <span>{{ record.temperature_min }}° to {{ record.temperature_max }}°C</span>
          <span>{{ record.rainfall }} mm rain</span>
          <span>{{ record.condition }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem;max-width:1100px;margin:0 auto}.card{padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}.filters{display:flex;gap:.75rem;flex-wrap:wrap}.filters input,.filters button{padding:.7rem;border:1px solid rgba(0,0,0,.12);border-radius:.5rem}.filters button{background:#1e88e5;color:#fff;border:0;cursor:pointer}.filters button:disabled{opacity:.6}.record{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:.75rem;padding:.7rem 0;border-bottom:1px solid rgba(0,0,0,.08)}.error{color:#c62828}@media(max-width:700px){.record{grid-template-columns:1fr 1fr}}`]
})
export class ReportsPageComponent implements OnInit {
  city = '';
  startDate = this.dateOffset(-30);
  endDate = this.dateOffset(0);
  report: WeatherReport | null = null;
  downloading = false;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.analyticsService.getWeatherReport(this.city, this.startDate, this.endDate).subscribe({
      next: report => this.report = report,
      error: () => this.error = 'Unable to load this report.',
    });
  }

  download(format: 'csv' | 'pdf'): void {
    this.downloading = true;
    const request = format === 'csv'
      ? this.analyticsService.downloadCSV(this.city, this.startDate, this.endDate)
      : this.analyticsService.downloadPDF(this.city, this.startDate, this.endDate);
    request.subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weather-report.${format}`;
        link.click();
        URL.revokeObjectURL(url);
        this.downloading = false;
      },
      error: () => { this.error = `Unable to export ${format.toUpperCase()} report.`; this.downloading = false; },
    });
  }

  private dateOffset(offset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }
}
