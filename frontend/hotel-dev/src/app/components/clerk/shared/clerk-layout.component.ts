import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClerkService } from '../../../services/clerk.service';

@Component({
  selector: 'app-clerk-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <div class="main-content flex-grow-1 container-fluid mt-3">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
    /* Add styles here if needed */
    .main-content {
      /* Optional: add padding or other styles specific to the main content area */
    }
    `
  ]
})
export class ClerkLayoutComponent { }