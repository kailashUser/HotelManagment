import { Component } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Optional but recommended for user feedback

@Component({
  selector: 'app-reservation-automatic-canel',
  standalone: true,
  templateUrl: './reservation-automatic-canel.component.html',
  styleUrls: ['./reservation-automatic-canel.component.css'],
})
export class ReservationAutomaticCanelComponent {
  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private toastr: ToastrService // Show success/error messages
  ) {}

  onAutoCancel(): void {
    if (!confirm('Are you sure you want to cancel unconfirmed reservations?'))
      return;

    this.reservationService.autocancel().subscribe({
      next: () => {
        this.toastr.success(
          'Unconfirmed reservations were automatically cancelled.'
        );
        //this.router.navigate(['/customer/my-reservations']); // redirect to reservations
      },
      error: (err) => {
        console.error('Auto cancel failed:', err);
        this.toastr.error('Failed to cancel reservations.');
      },
    });
  }
}
