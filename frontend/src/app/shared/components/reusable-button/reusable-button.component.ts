import { Component } from '@angular/core';

@Component({
  selector: 'app-reusable-button',
  template: `
    <button class="reusable-button" type="button">Button</button>
  `,
  styles: [
    `.reusable-button { padding: .75rem 1rem; border: none; border-radius: .5rem; background: #1976d2; color: #fff; cursor: pointer; }`
  ]
})
export class ReusableButtonComponent {}