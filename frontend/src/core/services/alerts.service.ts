import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherAlert {
  id: number;
  user: string;
  city: string;
  alert_type: string;
  message: string;
  severity: string;
  details: Record<string, number | string>;
  is_read: boolean;
  expires_at: string | null;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private apiUrl = `${environment.apiBaseUrl}/alerts/alerts`;

  constructor(private http: HttpClient) {}

  list(unreadOnly = false): Observable<WeatherAlert[]> {
    const query = unreadOnly ? '?unread=true' : '';
    return this.http.get<WeatherAlert[]>(`${this.apiUrl}/${query}`);
  }

  unreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread_count/`);
  }

  markRead(id: number): Observable<WeatherAlert> {
    return this.http.post<WeatherAlert>(`${this.apiUrl}/${id}/mark_read/`, {});
  }

  markAllRead(): Observable<{ updated: number }> {
    return this.http.post<{ updated: number }>(`${this.apiUrl}/mark_all_read/`, {});
  }
}
