import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClerkService } from '../../../services/clerk.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TravelCompany {
  id: number;
  name: string;
}

@Component({
  selector: 'app-clerk-add-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <h4>Add New Reservation</h4>
      <div class="row">
        <!-- Customer Selection -->
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Select Existing Customer</h5>
              <div class="mb-3">
                <label for="customerSelect" class="form-label">Customer</label>
                <select class="form-select" id="customerSelect" [(ngModel)]="selectedCustomerId" name="customerSelect">
                  <option [ngValue]="null">Select a customer</option>
                  <option *ngFor="let customer of customers" [ngValue]="customer.id">
                    {{ customer.firstName }} {{ customer.lastName }}
                  </option>
                </select>
              </div>
              <button class="btn btn-primary" [disabled]="selectedCustomerId === null" (click)="selectCustomer()">Continue with Customer</button>
            </div>
          </div>
        </div>

        <!-- Travel Company Selection -->
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Select Travel Company</h5>
              <div class="mb-3">
                <label for="companySelect" class="form-label">Travel Company</label>
                <select class="form-select" id="companySelect" [(ngModel)]="selectedCompanyId" name="companySelect">
                  <option [ngValue]="null">Select a travel company</option>
                  <option *ngFor="let company of travelCompanies" [ngValue]="company.id">
                    {{ company.name }}
                  </option>
                </select>
              </div>
              <button class="btn btn-primary" [disabled]="selectedCompanyId === null" (click)="selectTravelCompany()">Continue with Travel Company</button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <button class="btn btn-secondary" (click)="goBack()">Back</button>
      </div>
    </div>
  `,
  styles: []
})
export class AddReservationComponent implements OnInit {
  customers: Customer[] = [];
  travelCompanies: TravelCompany[] = [];
  selectedCustomerId: number | null = null;
  selectedCompanyId: number | null = null;

  constructor(
    private clerkService: ClerkService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadTravelCompanies();
  }

  loadCustomers(): void {
    this.clerkService.getCustomers().pipe(
      catchError((error: any) => {
        this.toastr.error('Failed to load customers.');
        return throwError(() => error);
      })
    ).subscribe((customers: Customer[]) => {
      this.customers = customers;
    });
  }

  loadTravelCompanies(): void {
    this.clerkService.getTravelCompanies().pipe(
      catchError((error: any) => {
        this.toastr.error('Failed to load travel companies.');
        return throwError(() => error);
      })
    ).subscribe((companies: TravelCompany[]) => {
      this.travelCompanies = companies;
    });
  }

  selectCustomer(): void {
    if (this.selectedCustomerId !== null) {
      this.router.navigate(['/clerk/reservations/new'], {
        queryParams: { type: 'customer', id: this.selectedCustomerId }
      });
    }
  }

  selectTravelCompany(): void {
    if (this.selectedCompanyId !== null) {
      this.router.navigate(['/clerk/reservations/new'], {
        queryParams: { type: 'travelCompany', id: this.selectedCompanyId }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/clerk/dashboard']);
  }
}
