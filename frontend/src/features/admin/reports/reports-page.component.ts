import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>Reports Page</h2>
      <p>Exportable summaries for operations and public safety.</p>
      <div class="card">
        <p>Daily weather summary report</p>
        <p>Monthly alert performance report</p>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem}.card{padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}`]
})
export class ReportsPageComponent {}
