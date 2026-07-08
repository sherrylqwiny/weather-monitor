import { Component } from '@angular/core';

@Component({
  selector: 'app-error-card',
  template: `
    <div class="error-card">
      <div class="error-card__title">Error</div>
      <p class="error-card__message">Unable to load data.</p>
    </div>
  `,
  styles: [
    `.error-card { display: block; padding: 1rem; border: 1px solid rgba(255,0,0,.25); border-radius: .75rem; background: rgba(255,240,240,.95); }`,
    `.error-card__title { font-weight: 700; margin-bottom: .5rem; }`
  ]
})
export class ErrorCardComponent {}