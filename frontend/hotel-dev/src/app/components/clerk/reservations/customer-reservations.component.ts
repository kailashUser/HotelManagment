import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClerkService } from '../../../services/clerk.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clerk-customer-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4 d-flex flex-column min-vh-100">
      <h2 class="mb-4">Customer Reservations</h2>
      
      <!-- Search and Filter Section -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Search by customer name or room number" 
                   [(ngModel)]="searchTerm" (input)="filterReservations()">
            <button class="btn btn-outline-secondary" type="button" (click)="filterReservations()">
              <i class="bi bi-search"></i> Search
            </button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="btn-group float-end">
            <button class="btn btn-outline-primary" [class.active]="currentFilter === 'all'" 
                    (click)="setFilter('all')">All</button>
            <button class="btn btn-outline-success" [class.active]="currentFilter === 'active'" 
                    (click)="setFilter('active')">Active</button>
            <button class="btn btn-outline-warning" [class.active]="currentFilter === 'upcoming'" 
                    (click)="setFilter('upcoming')">Upcoming</button>
            <button class="btn btn-outline-danger" [class.active]="currentFilter === 'completed'" 
                    (click)="setFilter('completed')">Completed</button>
          </div>
        </div>
      </div>

      <!-- Reservations Table -->
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Customer Name</th>
              <th>Room Number</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reservation of filteredReservations">
              <td>{{reservation.id}}</td>
              <td>{{reservation.customerName}}</td>
              <td>{{reservation.roomNumber}}</td>
              <td>{{reservation.checkInDate | date}}</td>
              <td>{{reservation.checkOutDate | date}}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': reservation.status === 'active',
                  'bg-warning': reservation.status === 'upcoming',
                  'bg-secondary': reservation.status === 'completed'
                }">{{reservation.status}}</span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" 
                          [routerLink]="['/clerk/check-out', reservation.id]"
                          *ngIf="reservation.status === 'active'">
                    Check Out
                  </button>
                  <button class="btn btn-sm btn-info" 
                          [routerLink]="['/clerk/reservations', reservation.id]">
                    View Details
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex-grow-1"></div>
      <!-- No Results Message -->
      <div *ngIf="filteredReservations.length === 0" class="alert alert-info mt-3 mt-auto">
        No reservations found matching your criteria.
      </div>
    </div>
  `,
  styles: [`
    .btn-group {
      gap: 0.5rem;
    }
    .btn-outline-primary.active {
      background-color: #007bff;
      color: #fff;
    }
    .btn-outline-success.active {
      background-color: #28a745;
      color: #fff;
    }
    .btn-outline-warning.active {
      background-color: #ffc107;
      color: #212529;
    }
    .btn-outline-danger.active {
      background-color: #dc3545;
      color: #fff;
    }
    .badge {
      padding: 0.5em 0.75em;
      font-size: 0.8em;
    }
  `]
})
export class CustomerReservationsComponent implements OnInit {
  reservations: any[] = [];
  filteredReservations: any[] = [];
  searchTerm: string = '';
  currentFilter: string = 'all';

  constructor(
    private clerkService: ClerkService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.clerkService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.filterReservations();
      },
      error: (error) => {
        this.toastr.error('Failed to load reservations');
        console.error('Error loading reservations:', error);
      }
    });
  }

  filterReservations(): void {
    let filtered = [...this.reservations];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(reservation => 
        reservation.customerName.toLowerCase().includes(search) ||
        reservation.roomNumber.toString().includes(search)
      );
    }

    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(reservation => 
        reservation.status === this.currentFilter
      );
    }

    this.filteredReservations = filtered;
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.filterReservations();
  }
} 