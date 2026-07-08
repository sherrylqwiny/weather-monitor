import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-spinner">
      <div class="loading-spinner__ring"></div>
      <span>Loading...</span>
    </div>
  `,
  styles: [
    `.loading-spinner { display: inline-flex; align-items: center; gap: .75rem; }`,
    `.loading-spinner__ring { width: 1rem; height: 1rem; border: 2px solid rgba(0,0,0,.2); border-top-color: #1976d2; border-radius: 50%; animation: spin 1s linear infinite; }`,
    `@keyframes spin { to { transform: rotate(360deg); } }`
  ]
})
export class LoadingSpinnerComponent {}