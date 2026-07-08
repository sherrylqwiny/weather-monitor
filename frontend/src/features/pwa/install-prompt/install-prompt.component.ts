import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h2>Install the app</h2>
      <p>Use the browser install option to add Weather Monitor to your home screen.</p>
      <button type="button">Install</button>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:.75rem;place-items:center;min-height:40vh;text-align:center}button{padding:.8rem 1rem;border:none;border-radius:.5rem;background:#1e88e5;color:#fff}`]
})
export class InstallPromptComponent {}
