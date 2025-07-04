import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Reservation } from '../../../models/Reservation';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css'],
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  activeTab: string = 'Pending';
  isLoading = false;
  customerId: number = 0;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.extractCustomerIdFromToken();
    this.loadReservations(this.customerId);
  }

  get filteredReservations(): Reservation[] {
    const filtered = this.reservations.filter(
      (r) => r.status === this.activeTab
    );
    console.log(`Filtered for tab "${this.activeTab}":`, filtered);
    return filtered;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmed':
      case 'CheckedIn':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning';
      case 'CheckedOut':
      case 'NoShow':
        return 'bg-secondary';
      case 'Cancelled':
        return 'bg-danger';
      default:
        return 'bg-dark';
    }
  }

  private extractCustomerIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.customerId = Number(
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]
      );
    }
  }

  formatPrice(price: number): string {
    if (typeof price !== 'number') {
      return '0.00';
    }
    return price.toFixed(2);
  }

  private loadReservations(customerId: number): void {
    this.isLoading = true;
    this.reservationService.getAllReservationsWithCustID(customerId).subscribe({
      next: (data) => {
        console.log('Received reservations:', data);
        this.reservations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load reservations:', err);
        this.isLoading = false;
      },
    });
  }

  private mapStatus(status: string | number): string {
    const statusMap: Record<number, string> = {
      0: 'Pending',
      1: 'Confirmed',
      2: 'CheckedIn',
      3: 'CheckedOut',
      4: 'Cancelled',
      5: 'NoShow',
    };

    const normalized =
      typeof status === 'string' ? parseInt(status.trim(), 10) : status;

    return statusMap[normalized] || 'Unknown';
  }

  cancelReservation(id: number) {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.loadReservations(this.customerId);
      },
      error: (err) => {
        console.error('Cancellation failed:', err);
      },
    });
  }

  addPaymentDetails(reservation: Reservation) {
    this.router.navigate(['/customer/payment'], {
      queryParams: { reservationId: reservation.id },
    });
  }
}
