import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Customer Dashboard</h3>
      </div>
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link" routerLink="/customer/book-rooms" routerLinkActive="active">
            <i class="bi bi-house-door"></i> Book Rooms
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/customer/my-reservations" routerLinkActive="active">
            <i class="bi bi-calendar-check"></i> My Reservations
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/customer/profile" routerLinkActive="active">
            <i class="bi bi-person"></i> Profile
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #fff;
      border-right: 1px solid #dee2e6;
      height: 100%;
      padding: 1rem;
    }
    .sidebar-header {
      padding: 1rem 0;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 1rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #495057;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
    }
    .nav-link:hover {
      background-color: #f8f9fa;
    }
    .nav-link.active {
      background-color: #e9ecef;
      color: #0d6efd;
    }
  `]
})
export class CustomerSidebarComponent {} 