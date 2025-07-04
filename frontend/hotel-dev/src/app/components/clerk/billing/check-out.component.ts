import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClerkService } from '../../../services/clerk.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

interface Billing {
  id: number;
  reservationId: number;
  customerId: number;
  totalAmount: number;
  tax: number;
  discount?: number;
  roomCharges: number;
  additionalCharges?: number;
  finalAmount: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Payment {
  id: number;
  billingId: number;
  amount: number;
  method: number;
  status: number;
  transactionId?: string;
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  processedAt?: string;
}

@Component({
  selector: 'app-clerk-check-out',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <h4>Check-out</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Find Reservation</h5>
              <form #searchForm="ngForm" (ngSubmit)="searchReservation()">
                <div class="mb-3">
                  <label for="roomNumber" class="form-label">Room Number</label>
                  <input type="text" class="form-control" id="roomNumber" 
                         [(ngModel)]="searchRoomNumber" name="roomNumber" required>
                  <div class="invalid-feedback" *ngIf="searchForm.submitted && !searchRoomNumber">
                    Room number is required
                  </div>
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-md-6" *ngIf="reservation">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Reservation Details</h5>
              <div class="mb-3">
                <strong>Guest:</strong> {{ reservation.customer?.firstName }} {{ reservation.customer?.lastName }}
              </div>
              <div class="mb-3">
                <strong>Room:</strong> {{ reservation.room?.number }}
              </div>
              <div class="mb-3">
                <strong>Check-in:</strong> {{ reservation.checkInDate | date }}
              </div>
              <div class="mb-3">
                <strong>Check-out:</strong> {{ reservation.checkOutDate | date }}
              </div>
              <div class="mb-3">
                <strong>Additional Services:</strong>
                <ul class="list-unstyled">
                  <li *ngIf="reservation.addOns?.breakfast">Breakfast</li>
                  <li *ngIf="reservation.addOns?.wifi">Wi-Fi</li>
                  <li *ngIf="reservation.addOns?.parking">Parking</li>
                </ul>
              </div>
              <div class="mb-3">
                <strong>Stay Charges:</strong> {{ reservation.stayCharges | currency }}
              </div>
              <div class="mb-3">
                <strong>Taxes:</strong> {{ reservation.taxes | currency }}
              </div>
              <div class="mb-3">
                <strong>Total Amount:</strong> {{ reservation.totalAmount | currency }}
              </div>

              <!-- Billing Information -->
              <div *ngIf="billing" class="mt-4">
                <h6 class="card-subtitle mb-3">Billing Information</h6>
                <div class="mb-2">
                  <strong>Room Charges:</strong> {{ billing.roomCharges | currency }}
                </div>
                <div class="mb-2" *ngIf="billing.additionalCharges">
                  <strong>Additional Charges:</strong> {{ billing.additionalCharges | currency }}
                </div>
                <div class="mb-2" *ngIf="billing.discount">
                  <strong>Discount:</strong> {{ billing.discount | currency }}
                </div>
                <div class="mb-2">
                  <strong>Tax:</strong> {{ billing.tax | currency }}
                </div>
                <div class="mb-2">
                  <strong>Total Amount:</strong> {{ billing.finalAmount | currency }}
                </div>
              </div>

              <!-- Payment Information -->
              <div *ngIf="payment" class="mt-4">
                <h6 class="card-subtitle mb-3">Payment Information</h6>
                <div class="mb-2">
                  <strong>Status:</strong> 
                  <span [ngClass]="{
                    'text-success': payment.status === 1,
                    'text-warning': payment.status === 2,
                    'text-danger': payment.status === 3
                  }">
                    {{ payment.status === 1 ? 'Paid' : payment.status === 2 ? 'Pending' : 'Failed' }}
                  </span>
                </div>
                <div class="mb-2" *ngIf="payment.method === 2">
                  <strong>Payment Method:</strong> Card
                </div>
                <div class="mb-2" *ngIf="payment.method === 1">
                  <strong>Payment Method:</strong> Cash
                </div>
                <div class="mb-2" *ngIf="payment.method === 3">
                  <strong>Payment Method:</strong> Bank Transfer
                </div>
                <div class="mb-2" *ngIf="payment.transactionId">
                  <strong>Transaction ID:</strong> {{ payment.transactionId }}
                </div>
              </div>

              <div class="d-grid gap-2 mt-4">
                <button class="btn btn-success" (click)="proceedToPayment()" 
                        [disabled]="payment?.status === 1">
                  {{ payment?.status === 1 ? 'Payment Completed' : 'Proceed to Payment' }}
                </button>
                <button class="btn btn-secondary" (click)="clearSearch()">
                  Clear
                </button>
              </div>
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
export class CheckOutComponent implements OnInit {
  searchRoomNumber: string = '';
  reservation: Reservation | undefined | null = null;
  billing: Billing | undefined | null = null;
  payment: Payment | undefined | null = null;

  constructor(
    private router: Router,
    private clerkService: ClerkService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Load initial data if needed
  }

  searchReservation(): void {
    if (this.searchRoomNumber) {
      this.clerkService.getReservationByRoom(this.searchRoomNumber).pipe(
        catchError((error: any) => {
          this.toastr.error('Error fetching reservation.');
          this.reservation = null;
          this.billing = null;
          this.payment = null;
          return of(undefined);
        })
      ).subscribe((reservation: Reservation | undefined) => {
        if (reservation) {
          this.reservation = reservation;
          this.loadBillingAndPayment(reservation.id);
          this.toastr.success('Reservation found!');
        } else {
          this.reservation = null;
          this.billing = null;
          this.payment = null;
          this.toastr.info('No reservation found for that room number.');
        }
      });
    }
  }

  private loadBillingAndPayment(reservationId: number): void {
    // Load billing data
    this.clerkService.getBillingById(reservationId).pipe(
      catchError((error: any) => {
        console.error('Error fetching billing:', error);
        return of(null);
      })
    ).subscribe(billing => {
      this.billing = billing;
      if (billing) {
        // Load payment data if billing exists
        this.loadPayment(billing.id);
      }
    });
  }

  private loadPayment(billingId: number): void {
    this.clerkService.getPaymentById(billingId).pipe(
      catchError((error: any) => {
        console.error('Error fetching payment:', error);
        return of(null);
      })
    ).subscribe(payment => {
      this.payment = payment;
    });
  }

  proceedToPayment(): void {
    if (this.reservation) {
      this.router.navigate(['/clerk/billing/summary'], {
        queryParams: { reservationId: this.reservation.id }
      });
    }
  }

  clearSearch(): void {
    this.searchRoomNumber = '';
    this.reservation = null;
    this.billing = null;
    this.payment = null;
  }
} 