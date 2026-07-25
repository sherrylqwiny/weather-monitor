import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardWeather {
  id: number;
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_condition: string;
  weather_description: string;
  weather_icon: string;
  updated_at: string;
}

export interface DashboardSummary {
  favorite_count: number;
  alert_count: number;
  forecast_days: number;
  last_updated: string | null;
}

export interface FavoriteCityWeather {
  city: string;
  favorite_id: number;
  weather: DashboardWeather | null;
}

export interface DashboardHighlight {
  label: string;
  value: string;
}

export interface WeeklyTrend {
  date: string;
  city: string;
  temperature_max: number;
  temperature_min: number;
  precipitation_chance: number;
  weather_condition: string;
}

export interface DashboardAlert {
  id: number;
  city: string;
  alert_type: string;
  message: string;
  severity: string;
  created_at: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  current_weather: DashboardWeather | null;
  favorite_cities: FavoriteCityWeather[];
  todays_highlights: DashboardHighlight[];
  weekly_trends: WeeklyTrend[];
  weather_statistics: {
    average_temperature: number | null;
    highest_temperature: number | null;
    lowest_temperature: number | null;
    total_precipitation: number | null;
    average_humidity: number | null;
  };
  recent_alerts: DashboardAlert[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/summary/`);
  }
}
