import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  user: any;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_picture?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/accounts`;
  private userSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  public user$ = this.userSubject.asObservable();

  private tokenRefreshSubject = new BehaviorSubject<void>(void 0);

  constructor(private http: HttpClient) {
    this.initializeUser();
  }

  /**
   * Initialize user from local storage if token exists
   */
  private initializeUser(): void {
    const token = this.getAccessToken();
    if (token) {
      this.getProfile().subscribe({
        next: (user) => this.userSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  /**
   * Register a new user
   */
  register(email: string, username: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/register/`, {
      email,
      username,
      password,
      password_confirm: password,
      first_name: firstName || '',
      last_name: lastName || ''
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Login user
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/login/`, {
      email,
      password
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout/logout/`, {
        refresh: refreshToken
      }).subscribe({
        complete: () => this.clearTokens()
      });
    } else {
      this.clearTokens();
    }
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile/me/`).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(this.handleError)
    );
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/profile/update_profile/`, updates).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(this.handleError)
    );
  }

  /**
   * Change password
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-change/change_password/`, {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset/request_reset/`, {
      email
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Confirm password reset
   */
  confirmPasswordReset(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset/confirm_reset/`, {
      token,
      new_password: newPassword,
      new_password_confirm: newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get access token from local storage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token from local storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === 'admin' : false;
  }

  /**
   * Handle successful authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('access_token', response.tokens.access);
    localStorage.setItem('refresh_token', response.tokens.refresh);
    this.userSubject.next(response.user);
  }

  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userSubject.next(null);
  }

  /**
   * Get user from local storage
   */
  private getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && typeof error.error === 'object') {
        const messages = Object.values(error.error).flat() as string[];
        errorMessage = messages.length > 0 ? messages[0] : errorMessage;
      } else if (error.statusText) {
        errorMessage = error.statusText;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
