import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>User Details</h2>
      <p>Account details and access management.</p>
      <div class="card">
        <h3>Amina Otieno</h3>
        <p><strong>Email:</strong> amina@example.com</p>
        <p><strong>Role:</strong> Administrator</p>
        <p><strong>Status:</strong> Active</p>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem}.card{padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}`]
})
export class UserDetailsComponent {}
