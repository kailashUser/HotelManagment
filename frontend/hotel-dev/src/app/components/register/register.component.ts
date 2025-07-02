import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: [' ', [Validators.required, Validators.minLength(3)]],
      email: [' ', [Validators.required, Validators.email]],
      password: [' ', [Validators.required, Validators.minLength(6)]],
      firstName: [' ', [Validators.required, Validators.minLength(2)]],
      lastName: [' ', [Validators.required, Validators.minLength(2)]],
      phone: [' ', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  // Getter methods for form controls
  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched(this.registerForm);

    if (this.registerForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly.', 'Validation Error');
      return;
    }

    this.isSubmitting = true;
    const formData = this.registerForm.value;

    // Map to backend properties with correct names
    const backendFormData = {
      Username: formData.username,
      Email: formData.email,
      PasswordHash: formData.password,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      PhoneNumber: formData.phone,
      RoleId: 3,
      IsActive: true
    };

    console.log('Submitting registration data:', backendFormData);

    this.authService.register(backendFormData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        console.log('Registration response:', response);

        if (response?.success === true) {
          this.toastr.success('Registration successful! Please login.', 'Success');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(response?.message || 'Registration failed. Please try again.', 'Registration Failed');
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Registration error:', error);

        let errorMessage = 'Registration failed. Please try again.';

        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.error?.errors) {
          // Handle validation errors from server
          const errors = Object.values(error.error.errors).flat();
          errorMessage = errors.join(', ');
        }

        this.toastr.error(errorMessage, 'Registration Failed');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to get form control errors
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phone') {
          return 'Please enter a valid 10-digit phone number';
        }
      }
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone'
    };

    return displayNames[fieldName] || fieldName;
  }
}
