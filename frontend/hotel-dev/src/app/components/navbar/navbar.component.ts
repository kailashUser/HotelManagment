import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgbCollapseModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  isAuthenticated = false;
  userRole: string | null = null;
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Update UI on auth status change
    this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status;
      this.loadUserInfo();
    });

    // Initial load (e.g., on refresh)
    this.isAuthenticated = this.authService.isLoggedIn();
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    if (!this.isAuthenticated) return;

    // Get role from token
    this.userRole = this.authService.getRole();

    // Try getting username from token/local cache
    const cachedUsername = this.authService.getUsername();
    if (cachedUsername) {
      this.username = cachedUsername;
    } else {
      // Fallback: fetch user profile
      this.authService.getUserProfile().subscribe({
        next: profile => {
          this.username = profile?.firstName || profile?.username || 'User';
        },
        error: err => {
          console.error('Failed to fetch user info:', err.message);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
