import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <h2>User List</h2>
      <p>Review registered users and their status.</p>
      <div class="list">
        <div class="row" *ngFor="let user of users">
          <div>
            <strong>{{ user.name }}</strong>
            <div class="meta">{{ user.email }} • {{ user.role }}</div>
          </div>
          <a [routerLink]="['/admin/users/details']">View</a>
        </div>
      </div>
    </section>
  `,
  styles: [`.page{padding:1rem;display:grid;gap:1rem}.list{display:grid;gap:.75rem}.row{display:flex;justify-content:space-between;align-items:center;padding:1rem;border:1px solid rgba(0,0,0,.08);border-radius:.75rem;background:rgba(255,255,255,.95)}.meta{color:rgba(0,0,0,.6);font-size:.9rem}a{padding:.5rem .8rem;border-radius:.5rem;background:#1e88e5;color:#fff;text-decoration:none}`]
})
export class UserListComponent {
  users = [
    { name: 'Amina Otieno', email: 'amina@example.com', role: 'Admin' },
    { name: 'Brian Kariuki', email: 'brian@example.com', role: 'Manager' },
    { name: 'Clare Wanjiku', email: 'clare@example.com', role: 'Viewer' }
  ];
}
