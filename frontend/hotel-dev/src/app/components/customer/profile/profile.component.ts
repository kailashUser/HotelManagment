import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../../interfaces/customer.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">My Profile</h4>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()" #profileForm="ngForm">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" [(ngModel)]="profile.firstName" 
                           name="firstName" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" [(ngModel)]="profile.lastName" 
                           name="lastName" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="profile.email" 
                         name="email" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" [(ngModel)]="profile.phoneNumber" 
                         name="phoneNumber" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">Address</label>
                  <input type="text" class="form-control" [(ngModel)]="profile.address" 
                         name="address">
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!profileForm.form.valid">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Change Password Section -->
          <div class="card mt-4">
            <div class="card-header">
              <h4 class="mb-0">Change Password</h4>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onPasswordChange()" #passwordForm="ngForm">
                <div class="mb-3">
                  <label class="form-label">Current Password</label>
                  <input type="password" class="form-control" [(ngModel)]="password.current" 
                         name="current" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">New Password</label>
                  <input type="password" class="form-control" [(ngModel)]="password.new" 
                         name="new" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">Confirm New Password</label>
                  <input type="password" class="form-control" [(ngModel)]="password.confirm" 
                         name="confirm" required>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" [disabled]="!passwordForm.form.valid">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: Customer = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  };

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(private customerService: CustomerService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.customerService.getCustomerProfile().subscribe({
      next: (data) => {
        console.log('Fetched profile data:', data);
        this.profile = data;
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.toastr.error('Failed to load profile.');
      }
    });
  }

  onSubmit() {
    // Only send fields that are present (not empty)
    const updatePayload: Partial<Customer> = {};
    if (this.profile.firstName) updatePayload.firstName = this.profile.firstName;
    if (this.profile.lastName) updatePayload.lastName = this.profile.lastName;
    if (this.profile.email) updatePayload.email = this.profile.email;
    if (this.profile.phoneNumber) updatePayload.phoneNumber = this.profile.phoneNumber;
    if (this.profile.address) updatePayload.address = this.profile.address;

    this.customerService.updateCustomerProfile(updatePayload).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.toastr.success('Profile updated successfully!');
          this.profile = { ...this.profile, ...response.data };
        } else {
          this.toastr.error('Failed to update profile.');
        }
      },
      error: () => {
        this.toastr.error('Failed to update profile.');
      }
    });
  }

  onPasswordChange() {
    if (this.password.new !== this.password.confirm) {
      alert('New passwords do not match!');
      return;
    }
    // TODO: Implement password change
    console.log('Password changed');
  }
} 