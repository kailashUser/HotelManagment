import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-clerk-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <div class="d-flex min-vh-100">
      <!-- Sidebar -->
      <nav class="sidebar bg-light border-end p-3" style="width: 220px;">
        <h5 class="mb-4">Clerk Panel</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <a class="nav-link" routerLink="/clerk/reservations/add" routerLinkActive="active">Add Reservation</a>
          </li>
          <li class="nav-item mb-2">
            <a class="nav-link" routerLink="/clerk/check-in" routerLinkActive="active">Check-in</a>
          </li>
          <li class="nav-item mb-2">
            <a class="nav-link" routerLink="/clerk/customer-reservations" routerLinkActive="active">Customer Reservations</a>
          </li>
          <li class="nav-item mb-2">
            <a class="nav-link" routerLink="/clerk/manage-room-states" routerLinkActive="active">Manage Room States</a>
          </li>
        </ul>
      </nav>
      <!-- Main Content -->
      <div class="main-content flex-grow-1 container-fluid mt-3">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
    .sidebar {
      min-height: 100vh;
      box-shadow: 2px 0 5px rgba(0,0,0,0.03);
    }
    .nav-link {
      color: #212529 !important;
    }
    .nav-link.active {
      font-weight: bold;
      color: #212529 !important;
      background: #e7f1ff;
      border-radius: 4px;
    }
    .main-content {
      /* Optional: add padding or other styles specific to the main content area */
    }
    `
  ]
})
export class ClerkLayoutComponent { }
