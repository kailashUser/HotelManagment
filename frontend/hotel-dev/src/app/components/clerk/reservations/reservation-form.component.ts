import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClerkService } from '../../../services/clerk.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Room } from '../../../interfaces/room.interface';

interface ReservationForm {
  guestName: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  source: 'customer' | 'travelCompany';
  sourceId: number;
  addOns: {
    breakfast: boolean;
    wifi: boolean;
    parking: boolean;
  };
}

@Component({
  selector: 'app-clerk-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <h4>Reservation Details</h4>
      <form #reservationForm="ngForm" (ngSubmit)="createReservation()">
        <div class="row">
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title">Guest Information</h5>
                <div class="mb-3">
                  <label for="guestName" class="form-label">Guest Name</label>
                  <input type="text" class="form-control" id="guestName" 
                         [(ngModel)]="reservation.guestName" name="guestName" required>
                  <div class="invalid-feedback" *ngIf="reservationForm.submitted && !reservation.guestName">
                    Guest name is required
                  </div>
                </div>
                <div class="mb-3">
                  <label for="room" class="form-label">Room</label>
                  <select class="form-select" id="room" 
                          [(ngModel)]="reservation.roomId" name="roomId" required>
                    <option [ngValue]="null">Select a Room</option>
                    <option *ngFor="let room of availableRooms" [ngValue]="room.id">
                      Room {{ room.number }} ({{ room.type }}) - {{ room.price | currency }}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="reservationForm.submitted && !reservation.roomId">
                    Room selection is required
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title">Dates</h5>
                <div class="mb-3">
                  <label for="checkIn" class="form-label">Check-in Date</label>
                  <input type="date" class="form-control" id="checkIn" 
                         [(ngModel)]="reservation.checkInDate" name="checkInDate" required>
                  <div class="invalid-feedback" *ngIf="reservationForm.submitted && !reservation.checkInDate">
                    Check-in date is required
                  </div>
                </div>
                <div class="mb-3">
                  <label for="checkOut" class="form-label">Check-out Date</label>
                  <input type="date" class="form-control" id="checkOut" 
                         [(ngModel)]="reservation.checkOutDate" name="checkOutDate" required>
                  <div class="invalid-feedback" *ngIf="reservationForm.submitted && !reservation.checkOutDate">
                    Check-out date is required
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Additional Services</h5>
            <div class="row">
              <div class="col-md-4">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="breakfast" 
                         [(ngModel)]="reservation.addOns.breakfast" name="breakfast">
                  <label class="form-check-label" for="breakfast">
                    Breakfast (+$50/day)
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="wifi" 
                         [(ngModel)]="reservation.addOns.wifi" name="wifi">
                  <label class="form-check-label" for="wifi">
                    Wi-Fi (+$20/day)
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="parking" 
                         [(ngModel)]="reservation.addOns.parking" name="parking">
                  <label class="form-check-label" for="parking">
                    Parking (+$30/day)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="!reservationForm.form.valid">
            Create Reservation
          </button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-control:focus, .form-select:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
  `]
})
export class ReservationFormComponent implements OnInit {
  availableRooms: Room[] = [];
  reservation: ReservationForm = {
    guestName: '',
    roomId: 0,
    checkInDate: '',
    checkOutDate: '',
    source: 'customer',
    sourceId: 0,
    addOns: {
      breakfast: false,
      wifi: false,
      parking: false
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clerkService: ClerkService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAvailableRooms();
    this.setupReservationSource();
  }

  loadAvailableRooms(): void {
    this.clerkService.getRooms().pipe(
       catchError((error: any) => {
        this.toastr.error('Failed to load available rooms.');
        return throwError(() => error);
      })
    ).subscribe((rooms: Room[]) => {
      this.availableRooms = rooms.filter(room => room.status === 'Available');
    });
  }

  setupReservationSource(): void {
    this.route.queryParams.subscribe(params => {
      this.reservation.source = params['type'] as 'customer' | 'travelCompany';
      this.reservation.sourceId = Number(params['id']);
    });
  }

  createReservation(): void {
    if (this.reservation.roomId && this.reservation.checkInDate && this.reservation.checkOutDate) {
      const reservationData = {
        customerId: this.reservation.sourceId,
        roomId: this.reservation.roomId,
        checkInDate: this.reservation.checkInDate,
        checkOutDate: this.reservation.checkOutDate,
        addOns: this.reservation.addOns,
        status: 1  // Assuming 1 is the status for new reservations
      };

      this.clerkService.createReservation(reservationData).pipe(
        catchError((error: any) => {
          this.toastr.error('Failed to create reservation.');
          return throwError(() => error);
        })
      ).subscribe(
        (response: any) => {
          // Service already shows success toast
          console.log('Reservation created successfully');
          this.router.navigate(['/clerk/room-status']);
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/clerk/add-reservation']);
  }
} 