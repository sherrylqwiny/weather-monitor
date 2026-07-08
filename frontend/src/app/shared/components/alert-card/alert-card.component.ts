import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-card',
  template: `
    <div class="alert-card">
      <div class="alert-card__severity">High</div>
      <div class="alert-card__message">Severe weather warning</div>
    </div>
  `,
  styles: [
    `.alert-card { display: block; padding: 1rem; border: 1px solid rgba(255,0,0,.2); border-radius: .75rem; background: rgba(255,240,240,.95); }`
  ]
})
export class AlertCardComponent {}