import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

// Standalone/UI components (imported directly into the module)
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { ForecastCardComponent } from './components/forecast-card/forecast-card.component';
import { AlertCardComponent } from './components/alert-card/alert-card.component';
import { StatisticsCardComponent } from './components/statistics-card/statistics-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { WeatherIconComponent } from './components/weather-icon/weather-icon.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ErrorCardComponent } from './components/error-card/error-card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ReusableButtonComponent } from './components/reusable-button/reusable-button.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    // Standalone components are added to imports so they can be used/templates compiled
    WeatherCardComponent,
    ForecastCardComponent,
    AlertCardComponent,
    StatisticsCardComponent,
    SearchBarComponent,
    WeatherIconComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorCardComponent,
    ConfirmDialogComponent,
    ReusableButtonComponent,
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    WeatherCardComponent,
    ForecastCardComponent,
    AlertCardComponent,
    StatisticsCardComponent,
    SearchBarComponent,
    WeatherIconComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorCardComponent,
    ConfirmDialogComponent,
    ReusableButtonComponent,
    RouterModule,
  ],
})
export class SharedModule {}
