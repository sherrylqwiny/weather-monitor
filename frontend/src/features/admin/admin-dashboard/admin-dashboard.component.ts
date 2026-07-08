import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <div class="page__header">
        <div>
          <p class="eyebrow">Admin</p>
          <h2>Admin Dashboard</h2>
          <p>Monitor platform operations and weather data health.</p>
        </div>
        <a routerLink="/admin/users">Open Users</a>
      </div>

      <div class="grid">
        <article class="card">
          <h3>Users</h3>
          <p>1,280 active accounts</p>
        </article>
        <article class="card">
          <h3>Weather Records</h3>
          <p>96,500 processed this week</p>
        </article>
        <article class="card">
          <h3>Alerts</h3>
          <p>14 active notifications</p>
        </article>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem}.page__header{display:flex;justify-content:space-between;align-items:center;gap:1rem}.eyebrow{font-size:.75rem;text-transform:uppercase;letter-spacing:.2em;color:#1e88e5;margin:0 0 .25rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.card{padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}a{padding:.6rem .9rem;border-radius:.5rem;background:#1e88e5;color:#fff;text-decoration:none}`]
})
export class AdminDashboardComponent {}
