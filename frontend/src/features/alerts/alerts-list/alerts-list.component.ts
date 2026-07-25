import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertsService, WeatherAlert } from '../../../core/services/alerts.service';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="page">
      <h2>Alerts</h2>
      <p>Current alerts, warnings, and alert history.</p>
      <div class="toolbar">
        <label><input type="checkbox" [(ngModel)]="unreadOnly" (change)="load()" /> Unread only</label>
        <button type="button" (click)="markAllRead()" [disabled]="!unreadCount">Mark all read</button>
      </div>
      <p *ngIf="error" class="error">{{ error }}</p>
      <div class="card" *ngIf="alerts.length">
        <article class="alert" *ngFor="let alert of alerts" [class.unread]="!alert.is_read">
          <div>
            <div class="meta"><strong>{{ alert.alert_type | titlecase }}</strong> · {{ alert.city }} · {{ alert.created_at | date:'short' }}</div>
            <p>{{ alert.message }}</p>
          </div>
          <button *ngIf="!alert.is_read" type="button" (click)="markRead(alert)">Mark read</button>
        </article>
      </div>
      <p *ngIf="!alerts.length && !loading" class="muted">No alerts found.</p>
      <div class="actions">
        <button type="button" routerLink="/alerts/details">View Details</button>
      </div>
    </section>
  `,
  styles: [`.page { padding:1rem; max-width:900px; margin:0 auto; } .toolbar { display:flex; justify-content:space-between; align-items:center; margin:1rem 0; } .card { padding:1rem; border:1px solid rgba(0,0,0,.08); border-radius:.75rem; margin-top:1rem; } .alert { display:flex; justify-content:space-between; gap:1rem; padding:1rem; border-bottom:1px solid rgba(0,0,0,.08); } .alert:last-child { border-bottom:0; } .alert.unread { border-left:4px solid #1e88e5; background:#f4f8ff; } .meta { font-size:.9rem; } .alert p { margin:.5rem 0 0; } .actions { margin-top:1rem; } button { padding:.65rem .9rem; border:none; border-radius:.5rem; background:#1e88e5; color:#fff; cursor:pointer; } button:disabled { opacity:.6; } .error { color:#c62828; } .muted { color:rgba(0,0,0,.6); }`]
})
export class AlertsListComponent implements OnInit, OnDestroy {
  alerts: WeatherAlert[] = [];
  unreadOnly = false;
  unreadCount = 0;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.alertsService.list(this.unreadOnly).pipe(takeUntil(this.destroy$)).subscribe({
      next: alerts => { this.alerts = alerts; this.loading = false; },
      error: () => { this.error = 'Unable to load alerts.'; this.loading = false; },
    });
    this.alertsService.unreadCount().pipe(takeUntil(this.destroy$)).subscribe(result => this.unreadCount = result.count);
  }

  markRead(alert: WeatherAlert): void {
    this.alertsService.markRead(alert.id).subscribe({
      next: updated => { alert.is_read = updated.is_read; this.unreadCount = Math.max(0, this.unreadCount - 1); },
      error: () => this.error = 'Unable to update this alert.',
    });
  }

  markAllRead(): void {
    this.alertsService.markAllRead().subscribe({
      next: () => { this.alerts.forEach(alert => alert.is_read = true); this.unreadCount = 0; },
      error: () => this.error = 'Unable to update alerts.',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}