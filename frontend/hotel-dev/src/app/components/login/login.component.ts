import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { getRoleName } from '../../helper/role-helper'; // adjust path if needed

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      this.showValidationErrors();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;

        const token = response?.data;
        if (!token) {
          this.toastr.error('Login failed', 'Error');
          return;
        }

        // Save token in local storage
        localStorage.setItem('token', token);

        // Decode role from JWT
        const decoded: any = jwtDecode(token);
        const roleId = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log('User role from token:', roleId);

        let redirectTo = '/';
        switch (roleId) {
          case '0':
            redirectTo = '/admin';
            break;
          case '1':
            redirectTo = '/manager';
            break;
          case '2':
            redirectTo = '/clerk';
            break;
          case '3':
            redirectTo = '/customer';
            break;
          default:
            this.toastr.error('Unknown role', 'Access Denied');
            return;
        }

        const roleName = getRoleName(roleId);
        this.toastr.success(`Welcome back, ${roleName}!`, 'Login Successful');
        this.router.navigate([redirectTo]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'An error occurred during login';
        this.toastr.error(this.errorMessage, 'Login Failed');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showValidationErrors(): void {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (emailControl?.errors?.['required']) {
      this.toastr.error('Email is required', 'Validation Error');
    }

    if (emailControl?.errors?.['email']) {
      this.toastr.error('Invalid email format', 'Validation Error');
    }

    if (passwordControl?.errors?.['required']) {
      this.toastr.error('Password is required', 'Validation Error');
    }
  }

  // Template getter methods
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
