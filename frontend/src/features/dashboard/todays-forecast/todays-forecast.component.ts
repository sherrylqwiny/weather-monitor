import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHighlight } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-todays-forecast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todays-forecast">
      <h3>Today's Highlights</h3>
      <div class="highlights-grid">
        <div *ngFor="let h of highlights" class="highlight-card">
          <div class="highlight-label">{{ h.label }}</div>
          <div class="highlight-value">{{ h.value }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`.todays-forecast { margin-bottom: 1rem; } .highlights-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; } .highlight-card { padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .5rem; background: rgba(255,255,255,.95); } .highlight-label { font-size: .875rem; color: rgba(0,0,0,.6); margin-bottom: .25rem; } .highlight-value { font-size: 1.5rem; font-weight: 600; }`]
})
export class TodaysForecastComponent {
  @Input() highlights: DashboardHighlight[] = [];
}