import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private modalService: NgbModal
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
  //   this.processing = true; // Disable button and show processing state
  //   console.log('Payment submitted:', this.payment);

  //   // Simulate payment processing result (replace with actual logic)
  //   const paymentSuccessful = Math.random() > 0.5; // Simulate success/failure

  //   setTimeout(() => {
  //     this.processing = false; // Re-enable button or handle state change
  //     if (paymentSuccessful) {
  //       this.paymentSuccessful = true; // Set success state for template message
  //       this.toastr.success('Payment successful!', 'Success');
  //       console.log('Payment successful!'); // Placeholder

  //       // Navigate after a short delay
  //       setTimeout(() => {
  //         this.router.navigate(['/customer/my-reservations']);
  //       }, 1500);

  //     } else {
  //       this.toastr.error('Payment failed. Please try again.', 'Error');
  //       console.error('Payment failed.'); // Placeholder

  //       // Optional: Stay on the page or navigate to an error page
  //       // For now, we'll just show the error toast and stay on the page.
  //     }
  //   }, 2000); // Simulate processing delay
  // }

  onSubmit(): void {
    this.processing = true; // Disable button
    console.log('Payment submitted:', this.payment);

    // const paymentSuccessful = Math.random() > 0.5; // Simulated result

    setTimeout(() => {
      this.processing = false;

      // if (paymentSuccessful) {
      this.paymentSuccessful = true;

      // ✅ Log payment success details
      console.log('Payment successful! Details:', this.payment);

      // ✅ Show confirmation modal
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        centered: true,
        backdrop: 'static',
      });

      modalRef.componentInstance.title = '💳 Payment Successful!';
      modalRef.componentInstance.message = `
        <p>Your payment has been processed successfully.</p>
        <p><strong>Thank you</strong> for your reservation!</p>
        <p>You will be redirected shortly.</p>
      `;

      // ✅ Navigate after modal is closed
      modalRef.result.then(() => {
        this.router.navigate(['/customer/my-reservations']);
      });
      // }
      //  else {
      //   // ❌ Payment failed
      //   this.toastr.error('Payment failed. Please try again.', 'Error');
      //   console.error('Payment failed.');
      // }
    }, 2000); // Simulated delay
  }

  onCancel(): void {
    this.router.navigate(['/customer/book-rooms']);
  }
}
