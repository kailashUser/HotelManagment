import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClerkService } from '../../../services/clerk.service';

interface Reservation {
  id: number;
  customerName?: string;
  roomNumber?: number;
  roomName?: string;
  checkInDate: string;
  checkOutDate: string;
  status: string | number;
}

@Component({
  selector: 'app-clerk-customer-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4 d-flex flex-column min-vh-100">
      <h2 class="mb-4">Customer Reservations</h2>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search by customer name or room number"
              [(ngModel)]="searchTerm"
              (input)="filterReservations()" />
            <button class="btn btn-outline-secondary" type="button" (click)="filterReservations()">
              <i class="bi bi-search"></i> Search
            </button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="btn-group float-end">
            <button class="btn btn-outline-primary" [class.active]="currentFilter === 'all'" (click)="setFilter('all')">All</button>
            <button class="btn btn-outline-success" [class.active]="currentFilter === 'Confirmed'" (click)="setFilter('Confirmed')">Confirmed</button>
            <button class="btn btn-outline-warning" [class.active]="currentFilter === 'Pending'" (click)="setFilter('Pending')">Pending</button>
            <button class="btn btn-outline-danger" [class.active]="currentFilter === 'CheckedIn'" (click)="setFilter('CheckedIn')">CheckedIn</button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover  fw-semibold">
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
              <td>{{ reservation.id }}</td>
              <td>{{ reservation.customerName || '-' }}</td>
              <td>{{ reservation.roomName || '-' }}</td>
              <td>{{ reservation.checkInDate | date }}</td>
              <td>{{ reservation.checkOutDate | date }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-secondary opaity-75': reservation.status === 'Confirmed',
                  'bg-warning': reservation.status === 'Pending',
                  'bg-success': reservation.status === 'CheckedIn'
                }">{{ reservation.status }}</span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" [routerLink]="['/clerk/check-out', reservation.id]" *ngIf="reservation.status === 'Confirmed' && isCheckoutDue(reservation.checkOutDate)">
                    Check Out
                  </button>
                  <button class="btn btn-sm btn-outline-dark" [routerLink]="['/clerk/reservations', reservation.id]">
                    View Details
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex-grow-1"></div>
      <div *ngIf="filteredReservations.length === 0" class="alert alert-info mt-3 mt-auto">
        No reservations found matching your criteria.
      </div>
    </div>
  `,
  styles: [`
    .btn-group { gap: 0.5rem; }
    .btn-outline-primary.active { background-color: #007bff; color: #fff; }
    .btn-outline-success.active { background-color: #28a745; color: #fff; }
    .btn-outline-warning.active { background-color: #ffc107; color: #212529; }
    .btn-outline-danger.active { background-color: #dc3545; color: #fff; }
    .badge { padding: 0.5em 0.75em; font-size: 0.8em; }
  `]
})
export class CustomerReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  searchTerm: string = '';
  currentFilter: string = 'all';

  constructor(
    private clerkService: ClerkService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('[INIT] Component loaded');
    this.loadReservations();
  }

  loadReservations(): void {
    this.clerkService.getReservations().subscribe({
      next: (data: Reservation[]) => {
        console.log('[API] Raw reservations:', data);
        this.reservations = data.map(res => ({
          ...res,
          status: this.mapStatus(res.status)
        }));
        this.filterReservations();
      },
      error: err => {
        console.error('[ERROR] Failed to load reservations', err);
        this.toastr.error('Failed to load reservations');
      }
    });
  }

  filterReservations(): void {
    let filtered = [...this.reservations];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.customerName?.toLowerCase().includes(search) ||
        reservation.roomNumber?.toString().includes(search)
      );
    }

    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === this.currentFilter);
    }

    this.filteredReservations = filtered;
    console.log('[FILTERED] Reservations:', this.filteredReservations);
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    console.log('[FILTER] Changed to:', filter);
    this.filterReservations();
  }

  private mapStatus(status: string | number): string {
    const statusMap: Record<number, string> = {
      1: 'Confirmed',
      2: 'CheckedIn',
      3: 'CheckedOut',
      4: 'Cancelled',
      5: 'NoShow',
      0: 'Pending' // You can adjust this as needed
    };
    return typeof status === 'number' ? (statusMap[status] || 'unknown') : status;
  }

  isCheckoutDue(checkOutDate: string): boolean {
    return new Date(checkOutDate) <= new Date();
  }
}


