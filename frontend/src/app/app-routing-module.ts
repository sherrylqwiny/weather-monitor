import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { ForgotPasswordComponent } from '../features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../features/auth/reset-password/reset-password.component';
import { ProfileComponent } from '../features/auth/profile/profile.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { SearchCityComponent } from '../features/weather/search-city/search-city.component';
import { CurrentWeatherComponent } from '../features/weather/current-weather/current-weather.component';
import { DetailedWeatherComponent } from '../features/weather/detailed-weather/detailed-weather.component';
import { WeatherHistoryComponent } from '../features/weather/weather-history/weather-history.component';
import { HourlyForecastComponent } from '../features/weather/hourly-forecast/hourly-forecast.component';
import { WeeklyForecastComponent } from '../features/weather/weekly-forecast/weekly-forecast.component';
import { FavoritesListComponent } from '../features/favorites/favorites-list/favorites-list.component';
import { AddFavoriteComponent } from '../features/favorites/add-favorite/add-favorite.component';
import { RemoveFavoriteComponent } from '../features/favorites/remove-favorite/remove-favorite.component';
import { AlertsListComponent } from '../features/alerts/alerts-list/alerts-list.component';
import { AlertDetailsComponent } from '../features/alerts/alert-details/alert-details.component';
import { AdminDashboardComponent } from '../features/admin/admin-dashboard/admin-dashboard.component';
import { UserListComponent } from '../features/admin/users/user-list/user-list.component';
import { UserDetailsComponent } from '../features/admin/users/user-details/user-details.component';
import { WeatherRecordsComponent } from '../features/admin/weather-records/weather-records.component';
import { AnalyticsPageComponent } from '../features/admin/analytics/analytics-page.component';
import { ReportsPageComponent } from '../features/admin/reports/reports-page.component';
import { OfflinePageComponent } from '../features/pwa/offline-page/offline-page.component';
import { InstallPromptComponent } from '../features/pwa/install-prompt/install-prompt.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'weather/search', component: SearchCityComponent },
  { path: 'weather/current', component: CurrentWeatherComponent },
  { path: 'weather/detailed', component: DetailedWeatherComponent },
  { path: 'weather/history', component: WeatherHistoryComponent },
  { path: 'weather/hourly', component: HourlyForecastComponent },
  { path: 'weather/weekly', component: WeeklyForecastComponent },
  { path: 'favorites', component: FavoritesListComponent },
  { path: 'favorites/add', component: AddFavoriteComponent },
  { path: 'favorites/remove', component: RemoveFavoriteComponent },
  { path: 'alerts', component: AlertsListComponent },
  { path: 'alerts/details', component: AlertDetailsComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/users', component: UserListComponent },
  { path: 'admin/users/details', component: UserDetailsComponent },
  { path: 'admin/weather-records', component: WeatherRecordsComponent },
  { path: 'admin/analytics', component: AnalyticsPageComponent },
  { path: 'admin/reports', component: ReportsPageComponent },
  { path: 'pwa/offline', component: OfflinePageComponent },
  { path: 'pwa/install', component: InstallPromptComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
