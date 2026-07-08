import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Alerts</h2>
      <p>Current alerts and warnings.</p>
      <div class="card">
        <p><strong>Heavy Rain</strong> — Nairobi</p>
        <p><strong>Wind Advisory</strong> — Mombasa</p>
      </div>
      <div class="actions">
        <button type="button" routerLink="/alerts/details">View Details</button>
      </div>
    </section>
  `,
  styles: [`.page { padding: 1rem; } .card { padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; } .actions { margin-top: 1rem; } button { padding: .8rem 1rem; border: none; border-radius: .5rem; background: #1e88e5; color: #fff; }`]
})
export class AlertsListComponent {}