import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <app-dashboard-layout>
      <section class="card" style="padding: 2rem;">
        <div class="flex justify-between align-center gap-4">
          <div>
            <h1>{{ title }}</h1>
            <p class="text-muted">A modern Progressive Web App for weather monitoring and forecasting.</p>
          </div>
          <button class="btn-primary" type="button" (click)="toggleTheme()">
            Toggle theme
          </button>
        </div>

        <div class="flex-column gap-3" style="margin-top: 1.5rem;">
          <div class="card p-4">
            <h2>Weather dashboard</h2>
            <p class="text-muted">Search cities, view current conditions, and track forecasts.</p>
          </div>
          <div class="card p-4">
            <h2>Features</h2>
            <p class="text-muted">Favorites, alerts, historical records, and admin analytics.</p>
          </div>
        </div>
      </section>
    </app-dashboard-layout>
  `,
  standalone: false,
  styleUrl: './app.scss',
})
export class App {
  title = 'Online Weather Monitoring System';

  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
