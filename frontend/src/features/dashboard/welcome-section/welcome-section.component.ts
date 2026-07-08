import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  template: `
    <div class="welcome-section">
      <h1>Welcome back</h1>
      <p>Here's the latest weather for your locations.</p>
    </div>
  `,
  styles: [`.welcome-section { margin-bottom: 1rem; } .welcome-section h1 { margin: 0; }`]
})
export class WelcomeSectionComponent {}