import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-remove-favorite',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Remove Favorite</h2>
      <p>Confirm removing a saved city.</p>
      <div class="card">
        <p>Remove Nairobi?</p>
        <div class="actions">
          <button type="button" routerLink="/favorites">Cancel</button>
          <button type="button" routerLink="/favorites">Remove</button>
        </div>
      </div>
    </section>
  `,
  styles: [`.page { padding: 1rem; } .card { padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; } .actions { display: flex; gap: .75rem; margin-top: 1rem; } button { padding: .8rem 1rem; border: none; border-radius: .5rem; background: #1e88e5; color: #fff; } button:first-child { background: #666; }`]
})
export class RemoveFavoriteComponent {}