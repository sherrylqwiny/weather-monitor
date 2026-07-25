import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FavoriteWeather {
  city: string;
  country?: string;
  temperature?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  weather_condition?: string;
  weather_icon?: string;
  updated_at?: string;
}

export interface FavoriteCity {
  id: number;
  user: string;
  city: string;
  created_at: string;
  weather: FavoriteWeather | null;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private apiUrl = `${environment.apiBaseUrl}/favorites/favorites`;

  constructor(private http: HttpClient) {}

  list(): Observable<FavoriteCity[]> {
    return this.http.get<FavoriteCity[]>(`${this.apiUrl}/`);
  }

  add(city: string): Observable<FavoriteCity> {
    return this.http.post<FavoriteCity>(`${this.apiUrl}/add/`, { city });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  getWeather(id: number): Observable<FavoriteWeather> {
    return this.http.get<FavoriteWeather>(`${this.apiUrl}/${id}/weather/`);
  }

  refreshWeather(id: number): Observable<FavoriteWeather> {
    return this.http.post<FavoriteWeather>(`${this.apiUrl}/${id}/refresh_weather/`, {});
  }
}
