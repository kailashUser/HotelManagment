import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { BillingService } from '../../../services/billing.service';
import { CustomerService } from '../../../services/customer.service';

interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

interface BookingState {
  booking: {
    roomId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests: string;
    paymentMethod: string;
  };
  total: number;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  payment: PaymentForm = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    amount: 0,
  };

  public paymentSuccessful = false; // Property to track payment status
  public processing = false; // Property to indicate if payment is being processed

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private billingService: BillingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const state = history.state as BookingState;
    if (!state?.booking || !state?.total) {
      this.router.navigate(['/customer/book-rooms']);
      return;
    }
    this.payment.amount = state.total;
  }

  formatPrice(price: number): string {
    if (typeof price !== 'number') {
      return '0.00';
    }
    return price.toFixed(2);
  }

  // onSubmit(): void {
  //   this.processing = true;

  //   const state = history.state as any;
  //   let reservationId = state.reservationId;
  //   if (!reservationId) {
  //     reservationId = this.route.snapshot.queryParamMap.get('reservationId');
  //   }

  //   if (!reservationId) {
  //     this.toastr.error('Reservation ID not found');
  //     this.processing = false;
  //     return;
  //   }

  //   this.billingService.getBillings().subscribe((response) => {
  //     const billings = response.data;
  //     const billing = billings.find((b) => b.reservationId === +reservationId);

  //     if (!billing || typeof billing.id !== 'number') {
  //       this.toastr.error('Billing not found or invalid.');
  //       this.processing = false;
  //       return;
  //     }

  //     // Construct payment details
  //     const paymentDetails: PaymentDetails = {
  //       amount: this.payment.amount,
  //       cardNumber: this.payment.cardNumber,
  //       cardHolderName: this.payment.cardHolder,
  //       expiryDate: this.payment.expiryDate,
  //       cvv: this.payment.cvv,
  //     };

  //     this.customerService.makePayment(billing.id, paymentDetails).subscribe({
  //       next: () => {
  //         this.customerService.getReservationById(+reservationId).subscribe({
  //           next: (reservation) => {
  //             const updatedReservation = {
  //               ...reservation,
  //               status: 1,
  //             };

  //             this.customerService.updateReservation(updatedReservation).subscribe({
  //               next: () => {
  //                 this.processing = false;
  //                 this.paymentSuccessful = true;
  //                 this.toastr.success('Payment successful and reservation updated!');
  //                 setTimeout(() => {
  //                   this.router.navigate(['/customer/my-reservations']);
  //                 }, 1500);
  //               },
  //               error: () => {
  //                 this.toastr.error('Failed to update reservation status');
  //                 this.processing = false;
  //               },
  //             });
  //           },
  //           error: () => {
  //             this.toastr.error('Failed to fetch reservation');
  //             this.processing = false;
  //           },
  //         });
  //       },
  //       error: () => {
  //         this.toastr.error('Payment failed');
  //         this.processing = false;
  //       },
  //     });
  //   });
  // }

  onSubmit(): void {
    this.processing = true;

    const state = history.state as any;
    let reservationId = state.reservationId;
    if (!reservationId) {
      reservationId = this.route.snapshot.queryParamMap.get('reservationId');
    }

    if (!reservationId) {
      this.toastr.error('Reservation ID not found');
      this.processing = false;
      return;
    }

    this.billingService.getBillings().subscribe((response) => {
      const billings = response.data;
      const billing = billings.find((b) => b.reservationId === +reservationId);

      if (!billing || typeof billing.id !== 'number') {
        this.toastr.error('Billing not found or invalid.');
        this.processing = false;
        return;
      }

      console.log(billings, 'billings');

      // Prepare payment payload matching backend structure
      const now = new Date().toISOString();
      const paymentDetails = {
        Id: 0,
        BillingId: billing.id,
        Amount: this.payment.amount,
        Method: 0, // 0 = Card (match your backend enum)
        Status: 0, // 0 = Pending (match your backend enum)
        TransactionId: Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase(),
        CardNumber: this.payment.cardNumber.slice(-4), // only last 4 digits
        CardHolderName: this.payment.cardHolder,
        CardExpiryDate: this.payment.expiryDate,
        CreatedAt: now,
        UpdatedAt: now,
        ProcessedAt: now,
      };

      console.log(paymentDetails, 'paymentDetails');

      this.customerService.makePayment(paymentDetails).subscribe({
        next: () => {
          this.processing = false;
          this.paymentSuccessful = true;
          this.toastr.success(
            'Reservation successful and reservation updated!'
          );
          setTimeout(() => {
            this.router.navigate(['/customer/my-reservations']);
          }, 1500);
        },
        error: () => {
          this.toastr.error('Payment failed');
          this.processing = false;
        },
      });
    });
  }

  onCancel(): void {
    this.router.navigate(['/customer/book-rooms']);
  }
}
