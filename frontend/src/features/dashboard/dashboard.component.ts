import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeSectionComponent } from './welcome-section/welcome-section.component';
import { CurrentWeatherCardComponent } from './current-weather-card/current-weather-card.component';
import { TodaysForecastComponent } from './todays-forecast/todays-forecast.component';
import { WeeklyForecastComponent } from './weekly-forecast/weekly-forecast.component';
import { WeatherTrendChartComponent } from './weather-trend-chart/weather-trend-chart.component';
import { FavoriteCitiesComponent } from './favorite-cities/favorite-cities.component';
import { RecentAlertsComponent } from './recent-alerts/recent-alerts.component';
import { WeatherStatisticsComponent } from './weather-statistics/weather-statistics.component';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeSectionComponent,
    CurrentWeatherCardComponent,
    TodaysForecastComponent,
    WeeklyForecastComponent,
    WeatherTrendChartComponent,
    FavoriteCitiesComponent,
    RecentAlertsComponent,
    WeatherStatisticsComponent,
    QuickActionsComponent,
  ],
  template: `
    <section class="dashboard-page">
      <div class="dashboard-welcome">
        <app-welcome-section></app-welcome-section>
      </div>

      <div class="dashboard-grid">
        <div class="col col-main">
          <app-current-weather-card></app-current-weather-card>
          <app-todays-forecast></app-todays-forecast>
          <app-weekly-forecast></app-weekly-forecast>
          <app-weather-trend-chart></app-weather-trend-chart>
        </div>
        <aside class="col col-side">
          <app-favorite-cities></app-favorite-cities>
          <app-recent-alerts></app-recent-alerts>
          <app-weather-statistics></app-weather-statistics>
          <app-quick-actions></app-quick-actions>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `.dashboard-page { padding: 1.5rem; }`,
    `.dashboard-grid { display: grid; gap: 1rem; grid-template-columns: 2fr 1fr; align-items: start; }`,
    `@media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }`
  ]
})
export class DashboardComponent {}