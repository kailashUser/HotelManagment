import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../../interfaces/reservation.interface';
import {
  BillingService,
  CreateBillingDto,
} from '../../../services/billing.service';
import { CustomerService } from '../../../services/customer.service';

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

  public roomPrice: number = 150;
  public resId: number = 0;
  constructor(
    private router: Router,
    private billingService: BillingService,
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const navState = history.state;
    if (navState && navState.roomId && navState.roomPrice) {
      this.booking.roomId = navState.roomId;
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
    const customerId = Number(localStorage.getItem('customerId'));
    const reservationId = this.resId; // Make sure this is already set

    const billing: CreateBillingDto = {
      reservationId: reservationId,
      customerId: customerId,
      totalAmount: this.total,
      tax: this.tax,
      discount: 0,
      roomCharges: this.subtotal,
      additionalCharges: 0,
      finalAmount: this.total,
      status: 0, // Pending
    };

    console.log('Billing data being sent:', billing);

    this.billingService.createBilling(billing).subscribe({
      next: () => {
        this.router.navigate([`/customer/payment/${this.resId}`], {
          state: {
            booking: this.booking,
            total: this.total,
            reservationId: this.resId,
          },
        });
      },
      error: (err) => {
        console.error('Billing creation failed:', err);
        alert('Failed to create billing.');
      },
    });
  }

  // public onSubmit() {
  //   console.log('Booking submitted:', this.booking);
  //   const CustomerId = Number(localStorage.getItem('customerId'));
  //   // Create reservation first
  //   const reservationData = {
  //     customerId: CustomerId,
  //     roomId: this.booking.roomId,
  //     checkInDate: this.booking.checkIn,
  //     checkOutDate: this.booking.checkOut,
  //     guests: this.booking.guests,
  //     specialRequests: this.booking.specialRequests,
  //     addOns: {
  //       breakfast: false,
  //       wifi: false,
  //       parking: false
  //     }
  //   };
  //   console.log('Reservation data being sent:', reservationData);
  //   this.customerService.createReservation(reservationData).subscribe({
  //     next: (reservation) => {
  //       const billing: CreateBillingDto = {
  //         reservationId: reservation.id,
  //         customerId: CustomerId,
  //         totalAmount: this.total,
  //         tax: this.tax,
  //         discount: 0,
  //         roomCharges: this.subtotal,
  //         additionalCharges: 0,
  //         finalAmount: this.total,
  //         status: 0, // Pending
  //       };
  //       this.billingService.createBilling(billing).subscribe({
  //         next: () => {
  //           // Fetch the full reservation before updating
  //           this.customerService.getReservationById(reservation.id).subscribe({
  //             next: (fullReservation) => {
  //               const updatedReservation: Reservation = {
  //                 ...fullReservation,
  //                 status: 1
  //               };
  //               this.customerService.updateReservationById(updatedReservation).subscribe({
  //                 next: () => {
  //                   this.router.navigate(['/customer/payment'], {
  //                     state: { booking: this.booking, total: this.total, reservationId: reservation.id },
  //                   });
  //                 },
  //                 error: (err) => {
  //                   console.error('Failed to update reservation status:', err);
  //                   alert('Failed to update reservation status.');
  //                 }
  //               });
  //             },
  //             error: (err) => {
  //               console.error('Failed to fetch full reservation:', err);
  //               alert('Failed to fetch full reservation.');
  //             }
  //           });
  //         },
  //         error: (err) => {
  //           console.error('Billing creation failed:', err);
  //           alert('Failed to create billing.');
  //         },
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Reservation creation failed:', err);
  //       alert('Failed to create reservation.');
  //     }
  //   });
  // }
}
