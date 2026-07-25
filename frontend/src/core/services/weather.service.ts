import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherStation {
  id: number;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CurrentWeather {
  id: number;
  station: WeatherStation;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  visibility: number;
  uv_index: number;
  cloud_coverage: number;
  weather_condition: string;
  weather_description: string;
  weather_icon: string;
  sunrise: string;
  sunset: string;
  updated_at: string;
}

export interface HourlyForecast {
  id: number;
  station: WeatherStation;
  forecast_time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  cloud_coverage: number;
  precipitation_chance: number;
  precipitation_amount: number;
  weather_condition: string;
  weather_description: string;
  weather_icon: string;
  created_at: string;
}

export interface DailyForecast {
  id: number;
  station: WeatherStation;
  forecast_date: string;
  temp_max: number;
  temp_min: number;
  humidity_avg: number;
  wind_speed_avg: number;
  precipitation_chance: number;
  precipitation_amount: number;
  weather_condition: string;
  weather_description: string;
  weather_icon: string;
  sunrise: string;
  sunset: string;
  uv_index: number;
  created_at: string;
}

export interface WeatherHistory {
  id: number;
  station: WeatherStation;
  recorded_date: string;
  temperature_max: number;
  temperature_min: number;
  temperature_avg: number;
  humidity_avg: number;
  pressure_avg: number;
  wind_speed_avg: number;
  precipitation_total: number;
  weather_condition: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = `${environment.apiBaseUrl}/weather`;

  // Observable data
  private currentWeatherSubject = new BehaviorSubject<CurrentWeather | null>(null);
  public currentWeather$ = this.currentWeatherSubject.asObservable();

  private hourlyForecastSubject = new BehaviorSubject<HourlyForecast[]>([]);
  public hourlyForecast$ = this.hourlyForecastSubject.asObservable();

  private dailyForecastSubject = new BehaviorSubject<DailyForecast[]>([]);
  public dailyForecast$ = this.dailyForecastSubject.asObservable();

  private weatherHistorySubject = new BehaviorSubject<WeatherHistory[]>([]);
  public weatherHistory$ = this.weatherHistorySubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all weather stations
   */
  getStations(): Observable<WeatherStation[]> {
    return this.http.get<WeatherStation[]>(`${this.apiUrl}/stations/`);
  }

  /**
   * Search weather stations
   */
  searchStations(query: string): Observable<WeatherStation[]> {
    return this.http.get<WeatherStation[]>(`${this.apiUrl}/stations/search/?q=${query}`);
  }

  /**
   * Get weather station by city
   */
  getStationByCity(city: string): Observable<WeatherStation> {
    return this.http.get<WeatherStation>(`${this.apiUrl}/stations/by_city/?city=${city}`);
  }

  /**
   * Get current weather by city
   */
  getCurrentWeatherByCity(city: string): Observable<CurrentWeather> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return new Observable(observer => {
      this.http.get<CurrentWeather>(`${this.apiUrl}/current/by_city/?city=${city}`).subscribe(
        (data: CurrentWeather) => {
          this.currentWeatherSubject.next(data);
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load weather data');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get current weather by station ID
   */
  getCurrentWeatherByStation(stationId: number): Observable<CurrentWeather> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return new Observable(observer => {
      this.http.get<CurrentWeather>(`${this.apiUrl}/current/by_station/?station_id=${stationId}`).subscribe(
        (data: CurrentWeather) => {
          this.currentWeatherSubject.next(data);
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load weather data');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get hourly forecast by city
   */
  getHourlyForecastByCity(city: string, hours: number = 24): Observable<HourlyForecast[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return new Observable(observer => {
      this.http.get<HourlyForecast[]>(`${this.apiUrl}/hourly/by_city/?city=${city}&hours=${hours}`).subscribe(
        (data: HourlyForecast[]) => {
          this.hourlyForecastSubject.next(data);
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load hourly forecast');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get daily forecast by city
   */
  getDailyForecastByCity(city: string, days: number = 7): Observable<DailyForecast[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return new Observable(observer => {
      this.http.get<DailyForecast[]>(`${this.apiUrl}/daily/by_city/?city=${city}&days=${days}`).subscribe(
        (data: DailyForecast[]) => {
          this.dailyForecastSubject.next(data);
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load daily forecast');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get weekly forecast
   */
  getWeeklyForecast(city?: string, stationId?: number): Observable<DailyForecast[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    let url = `${this.apiUrl}/daily/weekly/`;
    const params: string[] = [];
    
    if (city) params.push(`city=${city}`);
    if (stationId) params.push(`station_id=${stationId}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return new Observable(observer => {
      this.http.get<DailyForecast[]>(url).subscribe(
        (data: DailyForecast[]) => {
          this.dailyForecastSubject.next(data);
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load weekly forecast');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get weather history by city
   */
  getWeatherHistoryByCity(city: string, days: number = 30): Observable<WeatherHistory[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return new Observable(observer => {
      this.http.get<WeatherHistory[]>(`${this.apiUrl}/history/by_city/?city=${city}&days=${days}`).subscribe(
        (data: WeatherHistory[]) => {
          this.weatherHistorySubject.next(data);
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load weather history');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get latest weather history for all stations
   */
  getLatestWeatherHistory(): Observable<WeatherHistory[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return new Observable(observer => {
      this.http.get<WeatherHistory[]>(`${this.apiUrl}/history/latest/`).subscribe(
        (data: WeatherHistory[]) => {
          this.weatherHistorySubject.next(data);
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load latest weather history');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get all current weather records
   */
  getAllCurrentWeather(): Observable<CurrentWeather[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return new Observable(observer => {
      this.http.get<CurrentWeather[]>(`${this.apiUrl}/current/`).subscribe(
        (data: CurrentWeather[]) => {
          this.loadingSubject.next(false);
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.errorSubject.next(error.error?.error || 'Failed to load weather data');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      );
    });
  }

  /**
   * Get current weather state
   */
  getCurrentWeather(): CurrentWeather | null {
    return this.currentWeatherSubject.value;
  }

  /**
   * Get hourly forecast state
   */
  getHourlyForecast(): HourlyForecast[] {
    return this.hourlyForecastSubject.value;
  }

  /**
   * Get daily forecast state
   */
  getDailyForecast(): DailyForecast[] {
    return this.dailyForecastSubject.value;
  }

  /**
   * Get weather history state
   */
  getWeatherHistory(): WeatherHistory[] {
    return this.weatherHistorySubject.value;
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
