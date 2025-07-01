import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Room } from '../../../models/room.model';
import {
  CreateReservationDto,
  ReservationService,
} from '../../../services/reservation.service';
import { RoomService } from '../../../services/room.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-reserve-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserve-room.component.html',
  styleUrls: ['./reserve-room.component.css'],
})
export class ReserveRoomComponent implements OnInit {
  roomId: number | null = null;
  room: Room | undefined;

  checkInDate: string = '';
  checkOutDate: string = '';
  specialRequests: string = '';
  customerId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.extractCustomerIdFromToken();

    this.route.paramMap.subscribe((params) => {
      this.roomId = Number(params.get('id'));
      if (this.roomId) this.loadRoomDetails(this.roomId);
    });
  }

  private extractCustomerIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.customerId = Number(
        decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]
      );
    }
  }

  loadRoomDetails(id: number): void {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.room = rooms.find((r) => r.id === id);
      },
      error: (err) => {
        console.error('Error loading room details:', err);
        this.router.navigate(['/error']);
      },
    });
  }

  formatPrice(price: number): string {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  }

  confirmReservation(): void {
    console.log(this.room);
    if (!this.room || !this.checkInDate || !this.checkOutDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const nights =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);

    if (nights <= 0) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    const reservation: CreateReservationDto = {
      customerId: this.customerId,
      roomId: this.room.id,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      status: 0,
      totalAmount: this.room.price * nights,
      depositAmount: this.room.price * nights * 0.2,
      specialRequests: this.specialRequests,
      createdAt: new Date().toISOString(),
    };

    this.reservationService.createReservation(reservation).subscribe({
      next: () => {
        const modalRef = this.modalService.open(ConfirmationModalComponent, {
          centered: true,
          backdrop: 'static',
        });

        modalRef.componentInstance.title = '✔️ Consultation Confirmed!';
        modalRef.componentInstance.message = `
      <p>Your reservation is scheduled for <em>7:00 PM</em>. We look forward to assisting you.</p>
      <p><strong>⚠️ Late Arrival Policy:</strong><br>
      To ensure the best service for all clients, please arrive on time.<br>
      If you are <em>more than 15 minutes late</em>, your appointment may be:<br>
      - <em>Shortened</em> to avoid delays for others, or<br>
      - <em>Rescheduled</em> with a <em>late fee of 20%</em> of the service cost.</p>
      <p>Thank you for understanding.</p>
    `;

        modalRef.result.then(() => {
          this.router.navigate(['/customer/my-reservations']);
        });
      },
      error: (err) => {
        console.error('Reservation failed:', err);
        alert(err?.error?.message || 'Reservation failed');
      },
    });
  }
}
