import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/customer">Hotel Booking</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/customer/profile">
                <i class="bi bi-person-circle"></i> Profile
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/customer/my-reservations">
                <i class="bi bi-calendar-check"></i> My Reservations
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/auth/logout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .navbar-text {
      color: rgba(255, 255, 255, 0.85); /* Default Bootstrap navbar text color */
    }
  `]
})
export class CustomerNavbarComponent {} 