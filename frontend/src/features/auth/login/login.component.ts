import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Login</h1>
        <p>Access your weather dashboard.</p>
        <form class="auth-form">
          <label>Email</label>
          <input type="email" placeholder="name@example.com" />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <button type="button" class="btn-primary">Sign in</button>
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
    `.auth-form label { font-weight: 600; }`,
    `.auth-form input { width: 100%; padding: .9rem 1rem; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: .75rem; }`,
    `.btn-primary { width: 100%; padding: .95rem 1rem; border: none; border-radius: .75rem; background: #1e88e5; color: #fff; font-weight: 600; cursor: pointer; }`,
    `.auth-actions { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; font-size: .95rem; }`,
    `.auth-actions a { color: #1e88e5; text-decoration: none; }
    .auth-actions a:hover { text-decoration: underline; }`
  ]
})
export class LoginComponent {}
