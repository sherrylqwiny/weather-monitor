import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offline-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h2>You are offline</h2>
      <p>The weather dashboard is cached and will reconnect when you are back online.</p>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:.75rem;place-items:center;min-height:40vh;text-align:center}`]
})
export class OfflinePageComponent {}
