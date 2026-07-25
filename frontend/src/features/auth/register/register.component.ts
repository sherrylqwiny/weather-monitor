import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Create account</h1>
        <p>Start tracking weather and alerts.</p>
        
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        
        <form (ngSubmit)="onRegister()" class="auth-form">
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
            <label>Username</label>
            <input 
              type="text" 
              [(ngModel)]="username"
              name="username"
              placeholder="Choose a username" 
              required
            />
          </div>
          <div>
            <label>Full name (optional)</label>
            <input 
              type="text" 
              [(ngModel)]="fullName"
              name="fullName"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password"
              name="password"
              placeholder="Create a password" 
              required
            />
          </div>
          <button type="submit" class="btn-primary" [disabled]="isLoading">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </form>
        
        <div class="auth-actions">
          <span>Already have an account?</span>
          <a routerLink="/login">Login</a>
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
export class RegisterComponent implements OnInit {
  email = '';
  username = '';
  fullName = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onRegister(): void {
    if (!this.email || !this.username || !this.password) {
      this.errorMessage = 'Email, username, and password are required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const [firstName, lastName] = this.fullName.split(' ', 2);
    this.authService.register(
      this.email,
      this.username,
      this.password,
      firstName,
      lastName
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }
}

