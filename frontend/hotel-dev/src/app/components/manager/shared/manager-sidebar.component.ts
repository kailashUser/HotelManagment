import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manager-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar bg-dark text-white p-3">
      <h5>Manager Menu</h5>
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link text-white" routerLink="/manager/profile" routerLinkActive="active">
            Profile
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white" routerLink="/manager/manage-staff" routerLinkActive="active">
            Manage Staff
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white" routerLink="/manager/manage-rooms" routerLinkActive="active">
            Manage Rooms
          </a>
        </li>
         <li class="nav-item">
          <a class="nav-link text-white" routerLink="/manager/revenues" routerLinkActive="active">
            Revenues
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      flex-shrink: 0;
      height: 100vh; /* Full height */
      position: sticky;
      top: 0;
      padding-top: 1rem;
    }
    .nav-link.active {
      font-weight: bold;
      /* Add active state styles */
    }
  `]
})
export class ManagerSidebarComponent { } 