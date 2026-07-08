import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Analytics Page</h2>
      <p>Usage patterns and trend insights for the platform.</p>
      <div class="grid">
        <article class="card">
          <h3>Peak Traffic</h3>
          <p>3.8k visitors in the last 24h</p>
        </article>
        <article class="card">
          <h3>Forecast Accuracy</h3>
          <p>92% average accuracy</p>
        </article>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.card{padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}`]
})
export class AnalyticsPageComponent {}
