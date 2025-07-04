import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from '../../../interfaces/reservation.interface';
import { ClerkService } from '../../../services/clerk.service';

@Component({
  selector: 'app-paynow',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './paynow.component.html',
})
export class PaynowComponent {
  totalAmount = 0;
  paymentMethod: 'cash' | 'card' = 'cash';
  cardNumber = '';
  cardHolder = '';
  cardExpiry = '';
  cardCvc = '';
  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { reservation: Reservation; billing: any },
    private clerkService: ClerkService,
    private toastr: ToastrService,
    private router: Router
  ) {
    console.log('PaynowComponent initialized with data:', data);
    console.log('billing', data.billing);
    this.totalAmount = data.billing.finalAmount;
  }

  completePayment() {
    const isCard = this.paymentMethod === 'card';

    if (isCard) {
      if (!this.cardNumber || !this.cardHolder || !this.cardExpiry) {
        this.toastr.error('Please fill in all card details.');
        return;
      }

      if (this.cardNumber.length < 4) {
        this.toastr.error('Card number seems too short.');
        return;
      }
    }

    if (
      !this.data.billing ||
      !this.data.billing.id ||
      this.data.billing.id <= 0
    ) {
      this.toastr.error('Invalid billing ID. Cannot process payment.');
      console.error('Invalid billing:', this.data.billing);
      return;
    }

    const paymentData = {
      billingId: this.data.billing.id,
      amount: this.data.billing.finalAmount,
      method: isCard ? 1 : 0, // 1 = card, 0 = cash
      status: 1, // e.g. 1 for paid
      transactionId: isCard ? 'TXN-' + Date.now() : '',
      cardNumber: isCard ? this.cardNumber.slice(-4) : '',
      cardHolderName: isCard ? this.cardHolder : '',
      cardExpiryDate: isCard ? this.cardExpiry : '',
    };

    console.log('Submitting payment data:', paymentData);

    this.isLoading = true;
    this.clerkService.postPayment(paymentData).subscribe({
      next: (response) => {
        this.toastr.success('Payment completed successfully');

        // Update reservation status to 3 (completed) after successful payment
        this.completeCheckout();

        // Navigate after a short delay to show success message
        setTimeout(() => {
          this.router.navigate(['/clerk/customer-reservations']);
        }, 2000);
      },
      error: (err) => {
        this.toastr.error('Payment failed. Please try again.');
        console.error('Payment error:', err);
        this.isLoading = false;
      },
    });
  }

  completeCheckout() {
    if (!this.data.reservation) {
      console.error('No reservation data available');
      this.toastr.error('Reservation data not found');
      return;
    }

    const res = this.data.reservation;

    const reservationData = {
      id: res.id, // Use the actual reservation ID instead of 0
      customerId: res.customerId,
      roomId: res.roomId,
      checkInDate: res.checkInDate || new Date().toISOString(),
      checkOutDate:
        res.checkOutDate ||
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      actualCheckIn: res.actualCheckIn || new Date().toISOString(),
      actualCheckOut: new Date().toISOString(), // Set actual checkout time
      status: 3, // Change status to 3 (completed)
      totalAmount: res.totalAmount || 0,
      depositAmount: res.depositAmount || 0,
      specialRequests: res.specialRequests || '',
    };

    console.log('Updating reservation status to completed:', reservationData);

    this.clerkService.updateCheckout(reservationData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Reservation completed successfully');
          console.log('Reservation status updated successfully:', response);
        } else {
          this.toastr.error(
            response.message || 'Failed to update reservation status'
          );
          console.error('Status update failed:', response);
        }
      },
      error: (err) => {
        this.toastr.error(
          'An error occurred while updating reservation status'
        );
        console.error('Status update error:', err);
      },
    });
  }
}
