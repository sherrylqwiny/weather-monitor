import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Favorites</h2>
      <p>Your saved locations.</p>
      <div class="card">
        <p>Nairobi</p>
        <p>Kisumu</p>
        <p>Mombasa</p>
      </div>
      <div class="actions">
        <button type="button" routerLink="/favorites/add">Add Favorite</button>
      </div>
    </section>
  `,
  styles: [`.page { padding: 1rem; } .card { padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; } .actions { margin-top: 1rem; } button { padding: .8rem 1rem; border: none; border-radius: .5rem; background: #1e88e5; color: #fff; }`]
})
export class FavoritesListComponent {}