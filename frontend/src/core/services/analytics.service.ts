import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherReportRow {
  date: string;
  city: string;
  temperature_max: number;
  temperature_min: number;
  temperature_avg: number;
  rainfall: number;
  humidity: number;
  wind_speed: number;
  condition: string;
}

export interface WeatherReport {
  city: string;
  start_date: string;
  end_date: string;
  records: WeatherReportRow[];
  temperature_trends: Array<{ date: string; average: number; max: number; min: number }>;
  rainfall_trends: Array<{ date: string; rainfall: number }>;
  statistics: {
    average_temperature: number | null;
    highest_temperature: number | null;
    lowest_temperature: number | null;
    average_humidity: number | null;
    average_wind_speed: number | null;
    total_rainfall: number | null;
  };
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiBaseUrl}/analytics/reports`;

  constructor(private http: HttpClient) {}

  getWeatherReport(city: string, startDate: string, endDate: string): Observable<WeatherReport> {
    const params = new HttpParams()
      .set('city', city)
      .set('start_date', startDate)
      .set('end_date', endDate);
    return this.http.get<WeatherReport>(`${this.apiUrl}/weather/`, { params });
  }

  downloadCSV(city: string, startDate: string, endDate: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/weather.csv`, {
      params: { city, start_date: startDate, end_date: endDate },
      responseType: 'blob',
    });
  }

  downloadPDF(city: string, startDate: string, endDate: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/weather.pdf`, {
      params: { city, start_date: startDate, end_date: endDate },
      responseType: 'blob',
    });
  }
}
