import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from '../../../interfaces/reservation.interface';
import { ClerkService } from '../../../services/clerk.service';

@Component({
  selector: 'app-paynow',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, RouterLink],
  templateUrl: './paynow.component.html'
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
    @Inject(MAT_DIALOG_DATA) public data: { reservation: Reservation; billing: any },
    private clerkService: ClerkService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<PaynowComponent>
  ) {
    console.log('PaynowComponent initialized with data:', data);
    console.log('billing', data.billing);
    this.totalAmount = data.billing.finalAmount;

  }

  completePayment() {
    const isCard = this.paymentMethod === 'card';

    if (isCard) {
      if (!this.cardNumber || !this.cardHolder || !this.cardExpiry) {
        alert('Please fill in all card details.');
        return;
      }

      if (this.cardNumber.length < 4) {
        alert('Card number seems too short.');
        return;
      }
    }

    if (!this.data.billing || !this.data.billing.id || this.data.billing.id <= 0) {
      alert('Invalid billing ID. Cannot process payment.');
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
      cardExpiryDate: isCard ? this.cardExpiry : ''
    };



    console.log('Submitting payment data:', paymentData);

    this.isLoading = true;
    this.clerkService.postPayment(paymentData).subscribe({
      next: () => {
        this.toastr.success('Payment completed successfully');
        this.router.navigate(['customer-reservations']);

        setTimeout(() => {
          this.comepleteCheckout()
        }, 3000);

      },
      error: (err) => {
        alert('Payment failed. Please try again.');
        console.error('Payment error:', err);
        this.isLoading = false;
      }
    });
  }


  comepleteCheckout() {
    if (!this.data.reservation) {
      console.error('No reservation data available');
      return;
    }

    const res = this.data.reservation;

    const reservationData = {
      id: 0,
      customerId: res.customerId,
      roomId: res.roomId,
      checkInDate: res.checkInDate || new Date().toISOString(),
      checkOutDate: res.checkOutDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      actualCheckIn: res.actualCheckIn || new Date().toISOString(),
      status: 3,
      totalAmount: res.totalAmount || 0,
      depositAmount: res.depositAmount || 0,
      specialRequests: res.specialRequests || '',
      customerName: res.customerName,
      roomName: res.roomName || '',
    };

    console.log('Mapped reservation data:', reservationData);

    this.clerkService.updateCheckout(reservationData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message || 'Status updated successfully');
        } else {
          this.toastr.error(response.message || 'Status update failed');
        }
      },
      error: (err) => {
        this.toastr.error('An error occurred during status update');
        console.error(err);
      }
    });

  }
}
