import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../models/Reservation';

type ReservationStatus = 'ongoing' | 'pending' | 'completed' | 'Cancelled';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css'],
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  activeTab: ReservationStatus = 'pending';
  isLoading = false;
  route: any;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  get filteredReservations(): Reservation[] {
    return this.reservations.filter(
      (r: Reservation) => r.status === this.activeTab
    );
  }

  getStatusClass(status: ReservationStatus): string {
    console.log(status, 'status');

    switch (status) {
      case 'ongoing':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'completed':
        return 'bg-secondary';
      case 'Cancelled':
        return 'bg-danger';
      default:
        return '';
    }
  }

  formatPrice(price: number): string {
    if (typeof price !== 'number') {
      return '0.00';
    }
    return price.toFixed(2);
  }

  private loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        console.log('getAllReservations', data);
        this.reservations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load reservations:', err);
        this.isLoading = false;
      },
    });
  }

  cancelReservation(id: number) {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.loadReservations(); // refresh
      },
      error: (err) => {
        console.error('Cancellation failed:', err);
      },
    });
  }
}
