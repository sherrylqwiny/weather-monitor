import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FavoriteCity, FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Favorites</h2>
      <p>Saved cities and their latest available weather.</p>
      <p *ngIf="error" class="error">{{ error }}</p>
      <div class="card" *ngIf="favorites.length">
        <article class="favorite" *ngFor="let favorite of favorites">
          <div>
            <h3>{{ favorite.city }}</h3>
            <p *ngIf="favorite.weather">
              {{ favorite.weather.temperature | number: '1.0-0' }}°C · {{ favorite.weather.weather_condition }} ·
              {{ favorite.weather.humidity }}% humidity
            </p>
            <p *ngIf="!favorite.weather" class="muted">Weather is not available yet.</p>
          </div>
          <div class="actions">
            <button type="button" (click)="refreshWeather(favorite)" [disabled]="busyId === favorite.id">Refresh</button>
            <button type="button" class="danger" (click)="remove(favorite)" [disabled]="busyId === favorite.id">Remove</button>
          </div>
        </article>
      </div>
      <p *ngIf="!favorites.length && !loading" class="muted">You have no favorite cities yet.</p>
      <div class="actions">
        <button type="button" routerLink="/favorites/add">Add Favorite</button>
      </div>
    </section>
  `,
  styles: [`.page { padding: 1rem; max-width: 900px; margin: 0 auto; } .card { display: grid; gap: .75rem; padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; } .favorite { display:flex; justify-content:space-between; gap:1rem; align-items:center; padding:1rem; border-bottom:1px solid rgba(0,0,0,.08); } .favorite:last-child { border-bottom:0; } h3 { margin:0 0 .25rem; } p { margin:.25rem 0; } .actions { display:flex; gap:.5rem; margin-top:1rem; } .favorite .actions { margin-top:0; } button { padding: .65rem .9rem; border: none; border-radius: .5rem; background: #1e88e5; color: #fff; cursor:pointer; } button:disabled { opacity:.6; } button.danger { background:#c62828; } .error { color:#c62828; } .muted { color:rgba(0,0,0,.6); } @media(max-width:600px) { .favorite { align-items:flex-start; flex-direction:column; } }`]
})
export class FavoritesListComponent implements OnInit, OnDestroy {
  favorites: FavoriteCity[] = [];
  loading = true;
  busyId: number | null = null;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.favoritesService.list().pipe(takeUntil(this.destroy$)).subscribe({
      next: favorites => { this.favorites = favorites; this.loading = false; },
      error: error => { this.error = error.error?.detail || 'Unable to load favorites.'; this.loading = false; },
    });
  }

  remove(favorite: FavoriteCity): void {
    this.busyId = favorite.id;
    this.favoritesService.remove(favorite.id).subscribe({
      next: () => { this.favorites = this.favorites.filter(item => item.id !== favorite.id); this.busyId = null; },
      error: () => { this.error = 'Unable to remove this city.'; this.busyId = null; },
    });
  }

  refreshWeather(favorite: FavoriteCity): void {
    this.busyId = favorite.id;
    this.favoritesService.refreshWeather(favorite.id).subscribe({
      next: weather => { favorite.weather = weather; this.busyId = null; },
      error: () => { this.error = 'Unable to refresh weather for this city.'; this.busyId = null; },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}