import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BillingService,
  CreateBillingDto,
} from '../../../services/billing.service';

interface BookingForm {
  roomId: number;
  CustomerId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  public booking: BookingForm = {
    roomId: 0,
    CustomerId: 0,
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
    paymentMethod: 'credit',
  };

  public roomPrice: number = 150; // Will be updated from actual room data
  public resId: number = 0;
  constructor(
    private router: Router,
    private billingService: BillingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const navState = history.state;
    if (navState && navState.roomId && navState.roomPrice) {
      this.booking.roomId = navState.navigationId;
      this.roomPrice = navState.roomPrice;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    this.resId = idParam ? +idParam : 0;

    console.log('Reservation ID from route param:', this.resId);
  }

  public get numberOfNights(): number {
    if (!this.booking.checkIn || !this.booking.checkOut) return 0;
    const checkIn = new Date(this.booking.checkIn);
    const checkOut = new Date(this.booking.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public get subtotal(): number {
    return this.roomPrice * this.numberOfNights;
  }

  public get tax(): number {
    return this.subtotal * 0.1;
  }

  public get total(): number {
    return this.subtotal + this.tax;
  }

  public formatPrice(price: number): string {
    return price.toFixed(2);
  }

  public onSubmit() {
    console.log('Booking submitted:', this.booking);
    const CustomerId = Number(localStorage.getItem('customerId')); // Assumes it's stored in localStorage
    const ReservationId = this.resId; // Or pass from navigation state if needed
    console.log(this.resId);
    const billing: CreateBillingDto = {
      ReservationId,
      CustomerId,
      totalAmount: this.total,
      tax: this.tax,
      discount: 0,
      roomCharges: this.subtotal,
      additionalCharges: 0,
      finalAmount: this.total,
      status: 0, // Pending
      createdAt: new Date().toISOString(),
    };

    this.billingService.createBilling(billing).subscribe({
      next: () => {
        this.router.navigate(['/customer/payment'], {
          state: { booking: this.booking, total: this.total },
        });
      },
      error: (err) => {
        console.error('Billing creation failed:', err);
        alert('Failed to create billing.');
      },
    });
  }
}
