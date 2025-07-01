import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Add this import
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-manager-add-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {
  addStaffForm: FormGroup;
  isSubmitting = false;
  Roles = [
    'Admin',
    'Manager',
    'Clerk',
    'Travel Company'
  ];

  staffRole: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userServices: UserService,
    private toastr: ToastrService,

  ) {
    this.addStaffForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.staffRole = this.Roles;
    console.log(this.staffRole);
  }

  onSubmit() {

    this.markFormGroupTouched();

    if (this.addStaffForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly.', 'Validation Error');
      return;
    }

    this.isSubmitting = true;
    const formData = { ...this.addStaffForm.value };


    const backendFormData = {
      Username: formData.username.trim(),
      Email: formData.email.trim(),
      PasswordHash: formData.password.trim(),
      FirstName: formData.firstName.trim(),
      LastName: formData.lastName.trim(),
      PhoneNumber: formData.phone.trim(),
      RoleId: this.getRoleId(formData.role),
      IsActive: true
    };

    console.log('Submitting staff registration data:', backendFormData);

    this.userServices.create(backendFormData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        console.log('Staff registration response:', response);

        if (response?.success === true) {
          this.toastr.success('Staff member created successfully!', 'Success');
          this.addStaffForm.reset();

        } else {
          this.toastr.error(response?.message || 'Staff registration failed. Please try again.', 'Registration Failed');
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Staff registration error:', error);

        let errorMessage = 'Staff registration failed. Please try again.';

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

    this.router.navigate(['/manager/manage-staff'])

  }

  onCancel() {
    this.addStaffForm.reset();
    console.log('Form cancelled and reset');
  }

  getRoleId(role: string): number {
    switch (role) {
      case 'Admin':
        return 0;
      case 'Manager':
        return 1;
      case 'Clerk':
        return 2;
      case 'Customer':
        return 3;
      case 'Travel Company':
        return 4;
      default:
        return -1;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addStaffForm.controls).forEach(key => {
      const control = this.addStaffForm.get(key);
      control?.markAsTouched();
    });
  }


  getFieldError(fieldName: string): string {
    const field = this.addStaffForm.get(fieldName);

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
      phone: 'Phone',
      role: 'Role'
    };

    return displayNames[fieldName] || fieldName;
  }
}
