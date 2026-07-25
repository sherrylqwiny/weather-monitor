import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertsService, WeatherAlert } from '../../../core/services/alerts.service';

@Component({
  selector: 'app-alert-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Alert Details</h2>
      <p>Detailed alert history and thresholds.</p>
      <div class="card" *ngIf="alert">
        <p><strong>{{ alert.alert_type | titlecase }}</strong> · {{ alert.city }}</p>
        <p>{{ alert.message }}</p>
        <p>Severity: {{ alert.severity }}</p>
        <p>Created: {{ alert.created_at | date:'medium' }}</p>
        <p *ngIf="alert.expires_at">Expires: {{ alert.expires_at | date:'medium' }}</p>
      </div>
      <p *ngIf="!alert">Select an alert from the alerts list to view its details.</p>
    </section>
  `,
  styles: [`.page { padding: 1rem; } .card { padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; }`]
})
export class AlertDetailsComponent implements OnInit {
  alert: WeatherAlert | null = null;

  constructor(private alertsService: AlertsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (id) {
      this.alertsService.list().subscribe(alerts => this.alert = alerts.find(alert => alert.id === id) || null);
    }
  }
}