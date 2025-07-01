import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.navigateByRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response?.success) {
          const token = response.data || response.token;

          if (rememberMe) {
            localStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
          }

          this.navigateByRole();
        } else {
          console.error('Login response did not indicate success.');
        }
      },
      error: (err) => {
        console.error('Login failed:', err.message);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private navigateByRole(): void {
    const role = this.authService.getRole();

    switch (role) {
      case 'Admin':
      case 'Manager':
        this.router.navigate(['/manager']);
        break;
      case 'Clerk':
        this.router.navigate(['/manage-room-states']);
        break;
      case 'Customer':
        this.router.navigate(['/customer']);
        break;
      case 'Travel Company':
        this.router.navigate(['/browse-rooms']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
