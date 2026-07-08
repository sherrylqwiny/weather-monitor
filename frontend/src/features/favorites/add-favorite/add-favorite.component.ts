import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-favorite',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Add Favorite</h2>
      <p>Choose a city to save to your favorites.</p>
      <div class="card">
        <input type="text" placeholder="City name" />
        <button type="button" routerLink="/favorites">Save</button>
      </div>
    </section>
  `,
  styles: [`.page { padding: 1rem; } .card { display: grid; gap: .75rem; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; } input { padding: .8rem; border: 1px solid rgba(0,0,0,.12); border-radius: .5rem; } button { padding: .8rem 1rem; border: none; border-radius: .5rem; background: #1e88e5; color: #fff; }`]
})
export class AddFavoriteComponent {}