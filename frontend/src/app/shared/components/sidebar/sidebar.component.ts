import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent {
  links = [
    { label: 'Dashboard', icon: '◉', route: '/dashboard' },
    { label: 'Weather', icon: '☁', route: '/weather/search' },
    { label: 'Forecast', icon: '📅', route: '/weather/weekly' },
    { label: 'Favorites', icon: '★', route: '/favorites' },
    { label: 'Alerts', icon: '⚠', route: '/alerts' },
    { label: 'Admin', icon: '⚙', route: '/admin' },
  ];
}
