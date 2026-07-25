import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Login</h1>
        <p>Access your weather dashboard.</p>
        
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        
        <form (ngSubmit)="onLogin()" class="auth-form">
          <div>
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email"
              name="email"
              placeholder="name@example.com" 
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password" 
              required
            />
          </div>
          <button type="submit" class="btn-primary" [disabled]="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
        
        <div class="auth-actions">
          <a routerLink="/register">Create account</a>
          <a routerLink="/forgot-password">Forgot password?</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--surface-100, #f5f7fb); padding: 1rem; }`,
    `.auth-card { width: min(430px, 100%); padding: 2rem; border-radius: 1rem; box-shadow: 0 18px 70px rgba(15, 23, 42, 0.08); background: #fff; }`,
    `.auth-card h1 { margin: 0 0 .5rem; font-size: 2rem; }`,
    `.auth-card p { color: rgba(15, 23, 42, 0.7); margin-bottom: 1.5rem; }`,
    `.auth-form { display: grid; gap: 1rem; }`,
    `.auth-form div { display: grid; gap: .5rem; }`,
    `.auth-form label { font-weight: 600; }`,
    `.auth-form input { width: 100%; padding: .9rem 1rem; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: .75rem; }`,
    `.btn-primary { width: 100%; padding: .95rem 1rem; border: none; border-radius: .75rem; background: #1e88e5; color: #fff; font-weight: 600; cursor: pointer; }`,
    `.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }`,
    `.auth-actions { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; font-size: .95rem; }`,
    `.auth-actions a { color: #1e88e5; text-decoration: none; }`,
    `.auth-actions a:hover { text-decoration: underline; }`,
    `.error-message { padding: .75rem 1rem; background: #ffebee; border-left: 4px solid #c62828; color: #b71c1c; border-radius: .5rem; margin-bottom: 1rem; }`
  ]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
      }
    });
  }
}

