import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-add-favorite',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="page">
      <h2>Add Favorite</h2>
      <p>Choose a city to save to your favorites.</p>
      <div class="card">
        <input type="text" [(ngModel)]="city" placeholder="City name" (keyup.enter)="save()" />
        <p *ngIf="error" class="error">{{ error }}</p>
        <button type="button" (click)="save()" [disabled]="loading">{{ loading ? 'Saving...' : 'Save' }}</button>
      </div>
    </section>
  `,
  styles: [`.page { padding: 1rem; max-width: 600px; margin:0 auto; } .card { display: grid; gap: .75rem; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; } input { padding: .8rem; border: 1px solid rgba(0,0,0,.12); border-radius: .5rem; } button { padding: .8rem 1rem; border: none; border-radius: .5rem; background: #1e88e5; color: #fff; cursor:pointer; } button:disabled { opacity:.6; } .error { color:#c62828; }`]
})
export class AddFavoriteComponent {
  city = '';
  loading = false;
  error: string | null = null;

  constructor(private favoritesService: FavoritesService, private router: Router) {}

  save(): void {
    if (!this.city.trim()) { this.error = 'Enter a city name.'; return; }
    this.loading = true;
    this.favoritesService.add(this.city.trim()).subscribe({
      next: () => this.router.navigate(['/favorites']),
      error: error => { this.error = error.error?.city?.[0] || error.error?.detail || 'Unable to save this city.'; this.loading = false; },
    });
  }
}