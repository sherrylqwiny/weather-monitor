import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableButtonComponent } from '../../../app/shared/components/reusable-button/reusable-button.component';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, ReusableButtonComponent],
  template: `
    <div class="quick-actions">
      <h4>Quick Actions</h4>
      <app-reusable-button></app-reusable-button>
      <app-reusable-button></app-reusable-button>
    </div>
  `,
  styles: [`.quick-actions { display:flex; gap:.5rem; flex-wrap:wrap; }`]
})
export class QuickActionsComponent {}