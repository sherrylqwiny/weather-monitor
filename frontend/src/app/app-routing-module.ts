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
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminGuard } from '../core/guards/auth.guard';
import { PublicGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [PublicGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [PublicGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [PublicGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'weather/search', component: SearchCityComponent, canActivate: [AuthGuard] },
  { path: 'weather/current', component: CurrentWeatherComponent, canActivate: [AuthGuard] },
  { path: 'weather/detailed', component: DetailedWeatherComponent, canActivate: [AuthGuard] },
  { path: 'weather/history', component: WeatherHistoryComponent, canActivate: [AuthGuard] },
  { path: 'weather/hourly', component: HourlyForecastComponent, canActivate: [AuthGuard] },
  { path: 'weather/weekly', component: WeeklyForecastComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoritesListComponent, canActivate: [AuthGuard] },
  { path: 'favorites/add', component: AddFavoriteComponent, canActivate: [AuthGuard] },
  { path: 'favorites/remove', component: RemoveFavoriteComponent, canActivate: [AuthGuard] },
  { path: 'alerts', component: AlertsListComponent, canActivate: [AuthGuard] },
  { path: 'alerts/details', component: AlertDetailsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'admin/users/details', component: UserDetailsComponent, canActivate: [AdminGuard] },
  { path: 'admin/weather-records', component: WeatherRecordsComponent, canActivate: [AdminGuard] },
  { path: 'admin/analytics', component: AnalyticsPageComponent, canActivate: [AdminGuard] },
  { path: 'admin/reports', component: ReportsPageComponent, canActivate: [AdminGuard] },
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
