import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClerkService } from '../../../services/clerk.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

interface Reservation {
  id: number;
  customerId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  status: number;
  totalAmount: number;
  depositAmount?: number;
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
  room?: {
    number: string;
  };
  addOns?: {
    breakfast: boolean;
    wifi: boolean;
    parking: boolean;
  };
  stayCharges?: number;
  taxes?: number;
}

interface PaymentDetails {
  method: 'cash' | 'card' | 'bankTransfer';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bankAccount?: string;
}

@Component({
  selector: 'app-clerk-bill-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <h4>Bill Summary</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Reservation Details</h5>
              <div class="mb-3" *ngIf="reservation">
                <strong>Guest:</strong> {{ reservation.customer?.firstName }} {{ reservation.customer?.lastName }}
              </div>
              <div class="mb-3" *ngIf="reservation">
                <strong>Room:</strong> {{ reservation.room?.number }}
              </div>
              <div class="mb-3" *ngIf="reservation">
                <strong>Check-in:</strong> {{ reservation.checkInDate | date }}
              </div>
              <div class="mb-3" *ngIf="reservation">
                <strong>Check-out:</strong> {{ reservation.checkOutDate | date }}
              </div>
              <div class="mb-3" *ngIf="reservation">
                <strong>Additional Services:</strong>
                <ul class="list-unstyled">
                  <li *ngIf="reservation.addOns?.breakfast">Breakfast</li>
                  <li *ngIf="reservation.addOns?.wifi">Wi-Fi</li>
                  <li *ngIf="reservation.addOns?.parking">Parking</li>
                </ul>
              </div>
              <div class="mb-3" *ngIf="reservation">
                <strong>Stay Charges:</strong> {{ reservation.stayCharges | currency }}
              </div>
              <div class="mb-3" *ngIf="reservation">
                <strong>Taxes:</strong> {{ reservation.taxes | currency }}
              </div>
              <div class="mb-3" *ngIf="reservation">
                <strong>Total Amount:</strong> {{ reservation.totalAmount | currency }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Payment Details</h5>
              <form #paymentForm="ngForm" (ngSubmit)="processPayment()">
                <div class="mb-3">
                  <label class="form-label">Payment Method</label>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="paymentMethod" 
                           id="cash" value="cash" [(ngModel)]="payment.method" required>
                    <label class="form-check-label" for="cash">
                      Cash
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="paymentMethod" 
                           id="card" value="card" [(ngModel)]="payment.method" required>
                    <label class="form-check-label" for="card">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="paymentMethod" 
                           id="bankTransfer" value="bankTransfer" [(ngModel)]="payment.method" required>
                    <label class="form-check-label" for="bankTransfer">
                      Bank Transfer
                    </label>
                  </div>
                </div>

                <div *ngIf="payment.method === 'card'">
                  <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="cardNumber" 
                           [(ngModel)]="payment.cardNumber" name="cardNumber" required>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="expiryDate" class="form-label">Expiry Date</label>
                        <input type="text" class="form-control" id="expiryDate" 
                               [(ngModel)]="payment.expiryDate" name="expiryDate" 
                               placeholder="MM/YY" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="cvv" class="form-label">CVV</label>
                        <input type="text" class="form-control" id="cvv" 
                               [(ngModel)]="payment.cvv" name="cvv" required>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="payment.method === 'bankTransfer'">
                  <div class="mb-3">
                    <label for="bankAccount" class="form-label">Bank Account Number</label>
                    <input type="text" class="form-control" id="bankAccount" 
                           [(ngModel)]="payment.bankAccount" name="bankAccount" required>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-success" 
                          [disabled]="!paymentForm.form.valid || processing">
                    <span *ngIf="!processing">Process Payment</span>
                    <span *ngIf="processing">
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Processing...
                    </span>
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="goBack()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-control:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
  `]
})
export class BillSummaryComponent implements OnInit {
  reservation: Reservation | undefined | null = null;
  payment: PaymentDetails = {
    method: 'cash'
  };
  processing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clerkService: ClerkService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadReservation();
  }

  loadReservation(): void {
    this.route.queryParams.subscribe(params => {
      const reservationId = Number(params['reservationId']);
      if (!isNaN(reservationId)) {
        this.clerkService.getReservationById(reservationId).pipe(
          catchError((error: any) => {
            this.toastr.error('Failed to load reservation details.');
            this.router.navigate(['/clerk/check-out']);
            return of(undefined);
          })
        ).subscribe((reservation: Reservation | undefined) => {
          if (reservation) {
            this.reservation = reservation;
          } else {
            this.toastr.info('Reservation not found.');
            this.router.navigate(['/clerk/check-out']);
          }
        });
      } else {
        this.toastr.error('Invalid reservation ID.');
        this.router.navigate(['/clerk/check-out']);
      }
    });
  }

  processPayment(): void {
    if (this.reservation && this.payment.method && !this.processing) {
      this.processing = true;
      const paymentData = {
        billingId: this.reservation.id,
        amount: this.reservation.totalAmount,
        method: this.payment.method === 'cash' ? 1 : this.payment.method === 'card' ? 2 : 3,
        status: 1, // Pending
        cardNumber: this.payment.cardNumber,
        cardHolderName: this.payment.cardNumber ? 'Guest' : undefined,
        cardExpiryDate: this.payment.expiryDate
      };

      this.clerkService.processPayment(paymentData).pipe(
        catchError((error: any) => {
          console.error('Error processing payment:', error);
          this.processing = false;
          this.toastr.error('Failed to process payment. Please try again.');
          return throwError(() => error);
        })
      ).subscribe(
        response => {
          this.toastr.success('Payment processed successfully');
          this.router.navigate(['/clerk/room-status']);
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/clerk/check-out']);
  }
}