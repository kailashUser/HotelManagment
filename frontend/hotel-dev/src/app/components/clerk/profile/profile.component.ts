import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClerkService } from '../../../services/clerk.service';
import { ClerkProfile } from '../../../interfaces/clerk-profile.interface';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-clerk-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">Clerk Profile</h4>
            </div>
            <div class="card-body">
              <form #profileForm="ngForm" (ngSubmit)="saveProfile()">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" class="form-control" id="name" 
                         [(ngModel)]="profile.name" name="name" required>
                  <div class="invalid-feedback" *ngIf="profileForm.submitted && !profile.name">
                    Name is required
                  </div>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" 
                         [(ngModel)]="profile.email" name="email" required email>
                  <div class="invalid-feedback" *ngIf="profileForm.submitted && profileForm.controls['email']?.errors?.['required']">
                    Email is required
                  </div>
                  <div class="invalid-feedback" *ngIf="profileForm.submitted && profileForm.controls['email']?.errors?.['email']">
                    Enter a valid email
                  </div>
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone</label>
                  <input type="text" class="form-control" id="phone" 
                         [(ngModel)]="profile.phone" name="phone">
                </div>
                <div class="mb-3">
                  <label for="role" class="form-label">Role</label>
                  <input type="text" class="form-control" id="role" 
                         [(ngModel)]="profile.role" name="role" disabled>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">New Password (Optional)</label>
                  <input type="password" class="form-control" id="password" 
                         [(ngModel)]="password" name="password">
                </div>

                <button type="submit" class="btn btn-primary" [disabled]="!profileForm.form.valid">
                  Save Profile
                </button>
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
    .form-control:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: ClerkProfile = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    role: 'Clerk'
  };
  password: '' | null = null; // Optional password field

  constructor(
    private clerkService: ClerkService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.clerkService.getClerkProfile().pipe(
      catchError((error: any) => {
        this.toastr.error('Failed to load profile.');
        return throwError(() => error);
      })
    ).subscribe((profile: ClerkProfile) => {
      this.profile = profile;
    });
  }

  saveProfile(): void {
    if (this.profile.name && this.profile.email) {
      const profileUpdate: Partial<ClerkProfile> = {
        name: this.profile.name,
        email: this.profile.email,
        phone: this.profile.phone
      };
      if (this.password !== null) {
        // In a real app, you would handle password changes securely, likely not sending the password directly here.
        // This is a simplified example for demonstration.
        // profileUpdate.password = this.password; 
      }

      this.clerkService.updateClerkProfile(profileUpdate).pipe(
        catchError((error: any) => {
          this.toastr.error('Failed to update profile.');
          return throwError(() => error);
        })
      ).subscribe((updatedProfile: ClerkProfile) => {
        // Service already shows success toast
        console.log('Profile updated:', updatedProfile);
        this.profile = updatedProfile; // Update local state
        this.password = null; // Clear password field
      });
    } else {
      this.toastr.warning('Please fill in required fields.');
    }
  }
} 