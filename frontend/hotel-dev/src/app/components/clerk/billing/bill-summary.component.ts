import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reservation } from '../../../interfaces/reservation.interface';
import { ClerkService } from '../../../services/clerk.service';


@Component({
  selector: 'app-bill-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-summary.component.html',
  styleUrls: ['./bill-summary.component.scss']
})
export class BillSummaryComponent { 
  bill: any;
  loading = true;
  paymentMethod: 0 | 1 = 0; // 0: cash, 1: card
  processing = false;
  error: string | null = null;
  cardNumber = '';
  cardHolderName = '';
  cardExpiryDate = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reservation: Reservation },
    public dialogRef: MatDialogRef<BillSummaryComponent>,
    private clerkService: ClerkService
  ) {
    this.fetchBill();
  }

  fetchBill() {
    this.clerkService.getBillingById(this.data.reservation.id).subscribe({
      next: (bill) => {
        this.bill = bill;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bill.';
        this.loading = false;
      }
    });
  }

  processPayment() {
    this.processing = true;
    const paymentData: any = {
      billingId: this.bill.id,
      amount: this.bill.finalAmount,
      method: this.paymentMethod,
      status: 1 // Paid
    };
    if (this.paymentMethod === 1) {
      paymentData.cardNumber = this.cardNumber;
      paymentData.cardHolderName = this.cardHolderName;
      paymentData.cardExpiryDate = this.cardExpiryDate;
    }
    this.clerkService.processPayment(paymentData).subscribe({
      next: () => {
        // Mark reservation as checked-out (status 3)
        this.clerkService.updatestatus({ id: this.data.reservation.id, status: 3 }).subscribe({
          next: () => {
            this.processing = false;
            this.dialogRef.close(true);
          },
          error: () => {
            this.processing = false;
            this.error = 'Payment succeeded but failed to update reservation status.';
          }
        });
      },
      error: () => {
        this.processing = false;
        this.error = 'Payment failed.';
      }
    });
  }
}
