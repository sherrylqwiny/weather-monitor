import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alert-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Alert Details</h2>
      <p>Detailed explanation of the selected alert.</p>
      <div class="card">
        <p><strong>Heavy Rain</strong></p>
        <p>Expected rainfall of 45 mm in the next 3 hours.</p>
      </div>
    </section>
  `,
  styles: [`.page { padding: 1rem; } .card { padding: 1rem; border: 1px solid rgba(0,0,0,.08); border-radius: .75rem; margin-top: 1rem; }`]
})
export class AlertDetailsComponent {}