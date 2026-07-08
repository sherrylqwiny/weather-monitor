import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <div class="search-bar">
      <input class="search-bar__input" type="search" placeholder="Search city" />
      <button class="search-bar__button" type="button">Search</button>
    </div>
  `,
  styles: [
    `.search-bar { display: flex; gap: .5rem; align-items: center; border: 1px solid rgba(0,0,0,.08); padding: .5rem; border-radius: .75rem; background: #fff; }`,
    `.search-bar__input { flex: 1; padding: .75rem; border: 1px solid rgba(0,0,0,.12); border-radius: .5rem; }`,
    `.search-bar__button { padding: .75rem 1rem; border: none; border-radius: .5rem; background: #1e88e5; color: white; cursor: pointer; }`
  ]
})
export class SearchBarComponent {}