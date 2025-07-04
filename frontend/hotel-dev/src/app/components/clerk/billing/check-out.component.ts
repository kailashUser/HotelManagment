import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Reservation } from '../../../interfaces/reservation.interface';
import { ClerkService } from '../../../services/clerk.service';
import { PaynowComponent } from '../paynow/paynow.component';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  checkedInReservations: Reservation[] = [];
  loading = false;
  selectedReservation: Reservation | null = null;

  constructor(private clerkService: ClerkService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchCheckedInReservations();
  }

  fetchCheckedInReservations() {
    this.loading = true;
    this.clerkService.getReservations().subscribe({
      next: (reservations) => {

        this.checkedInReservations = reservations.filter(r => r.status === 2);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectReservation(reservation: Reservation) {
    this.clerkService.getBillings().subscribe({
      next: (billings) => {
        // Handle API response shape: { data: [...] }
        const billingArray = Array.isArray(billings) ? billings : (billings as any).data;
        if (!Array.isArray(billingArray)) {
          console.error('Failed to fetch billing data.');
          return;
        }
        const billing = billingArray.find(b => b.reservationId === reservation.id);
        if (!billing) {
          console.error('No billing found for this reservation. Cannot proceed to payment.');
          return;
        }
        console.log('Billing found for reservation:', reservation.id, 'Billing ID:', billing.id);
        const dialogRef = this.dialog.open(PaynowComponent, {
          data: { reservation, billing },
          width: '400px',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          // handle result if needed
        });
      },
      error: (err) => {
        console.error('Failed to fetch billing information:', err);
      }
    });
  }
}
