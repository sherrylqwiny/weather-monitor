import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="isAuthRoute; else dashboardLayout">
      <router-outlet></router-outlet>
    </ng-container>

    <ng-template #dashboardLayout>
      <app-dashboard-layout>
        <router-outlet></router-outlet>
      </app-dashboard-layout>
    </ng-template>
  `,
  standalone: false,
  styleUrl: './app.scss',
})
export class App {
  title = 'Online Weather Monitoring System';
  isAuthRoute = false;

  constructor(private themeService: ThemeService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        this.isAuthRoute = currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/forgot-password' || currentUrl === '/reset-password' || currentUrl === '/profile';
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
