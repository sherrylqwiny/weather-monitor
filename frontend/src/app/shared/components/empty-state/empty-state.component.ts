import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">📭</div>
      <p class="empty-state__text">No data available.</p>
    </div>
  `,
  styles: [
    `.empty-state { display: flex; flex-direction: column; align-items: center; gap: .75rem; padding: 1.5rem; border: 1px dashed rgba(0,0,0,.12); border-radius: .75rem; background: rgba(245,245,255,.7); }`,
    `.empty-state__icon { font-size: 2rem; }`
  ]
})
export class EmptyStateComponent {}