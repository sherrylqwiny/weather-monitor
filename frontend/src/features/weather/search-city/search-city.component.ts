import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-city',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="weather-page">
      <h2>Search City</h2>
      <p>Search for a city to view weather details.</p>
      <div class="search-box">
        <input type="text" placeholder="Enter city name" />
        <button type="button" routerLink="/weather/current">Search</button>
      </div>
    </section>
  `,
  styles: [
    `.weather-page { padding: 1rem; } .search-box { display: flex; gap: .75rem; margin-top: 1rem; } input { flex: 1; padding: .8rem; border: 1px solid rgba(0,0,0,.12); border-radius: .5rem; } button { padding: .8rem 1rem; border: none; border-radius: .5rem; background: #1e88e5; color: #fff; }`
  ]
})
export class SearchCityComponent {}