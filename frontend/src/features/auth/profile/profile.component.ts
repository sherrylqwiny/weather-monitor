import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="profile-page">
      <div class="profile-card">
        <h1>Profile</h1>
        <p>Manage your account details.</p>
        <div class="profile-grid">
          <div>
            <label>Name</label>
            <p>Jane Doe</p>
          </div>
          <div>
            <label>Email</label>
            <p>jane.doe@example.com</p>
          </div>
          <div>
            <label>Location</label>
            <p>New York, NY</p>
          </div>
          <div>
            <label>Account type</label>
            <p>Standard user</p>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn-primary" type="button">Edit profile</button>
          <button class="btn-secondary" type="button">Change password</button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `.profile-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--surface-100, #f5f7fb); padding: 1rem; }`,
    `.profile-card { width: min(700px, 100%); padding: 2rem; border-radius: 1rem; box-shadow: 0 18px 70px rgba(15, 23, 42, 0.08); background: #fff; }`,
    `.profile-card h1 { margin: 0 0 .5rem; font-size: 2rem; }`,
    `.profile-card p { color: rgba(15, 23, 42, 0.7); margin-bottom: 1.5rem; }`,
    `.profile-grid { display: grid; gap: 1rem; margin-top: 1.5rem; }
    @media (min-width: 640px) { .profile-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }`,
    `.profile-grid label { display: block; font-weight: 600; margin-bottom: .35rem; }`,
    `.profile-grid p { padding: .9rem 1rem; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: .75rem; background: #f7f9fc; }`,
    `.profile-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.5rem; }`,
    `.btn-primary { padding: .95rem 1.3rem; border: none; border-radius: .75rem; background: #1e88e5; color: #fff; font-weight: 600; cursor: pointer; }`,
    `.btn-secondary { padding: .95rem 1.3rem; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: .75rem; background: transparent; color: rgba(15, 23, 42, 0.9); cursor: pointer; }`
  ]
})
export class ProfileComponent {}
