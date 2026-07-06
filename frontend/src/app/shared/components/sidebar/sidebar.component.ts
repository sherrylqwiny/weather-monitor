import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent {
  links = [
    { label: 'Dashboard', icon: '◉' },
    { label: 'Weather', icon: '☁' },
    { label: 'Forecast', icon: '📅' },
    { label: 'Favorites', icon: '★' },
    { label: 'Alerts', icon: '⚠' },
    { label: 'Admin', icon: '⚙' },
  ];
}
