import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Room } from '../../models/room.model';
import { ClerkService } from '../../services/clerk.service';
import { RoomService } from '../../services/room.service';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-clerk-check-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-light text-primary">
              <h4 class="mb-0">Check-in</h4>
            </div>
            <div class="card-body">
              <form (ngSubmit)="checkIn()">
                <div class="row mb-4">
                  <div class="col-md-6">
                    <label class="form-label text-secondary">Select Customer</label>
                    <select class="form-select" [(ngModel)]="selectedCustomerId" name="customer" required>
                      <option [ngValue]="null">Select a customer</option>
                      <option *ngFor="let customer of customers" [ngValue]="customer.id">
                        {{ customer.firstName }} {{ customer.lastName }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-secondary">Select Room</label>
                    <select class="form-select" [(ngModel)]="selectedRoomId" name="room" required>
                      <option [ngValue]="null">Select a room</option>
                      <option *ngFor="let room of availableRooms" [ngValue]="room.id">
                        Room {{ room.name }} ({{ room.type }})
                      </option>
                    </select>
                  </div>
                </div>
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!selectedCustomerId || !selectedRoomId || loading">
                    <span *ngIf="!loading">Check-in</span>
                    <span *ngIf="loading">
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Checking in...
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class CheckInComponent implements OnInit {
  customers: Customer[] = [];
  availableRooms: Room[] = [];
  selectedCustomerId: number | null = null;
  selectedRoomId: number | null = null;
  loading = false;

  constructor(
    private clerkService: ClerkService,
    private roomService: RoomService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadAvailableRooms();
  }

  loadCustomers(): void {
    this.clerkService.getCustomers().subscribe({
      next: (response: any) => {
        // Extract the data array from the response wrapper
        this.customers = response.data || [];
        console.log(this.customers)
      },
      error: () => this.toastr.error('Failed to load customers')
    });
  }

  loadAvailableRooms(): void {
    this.roomService.getAllRooms().subscribe(
      (data: Room[]) => { this.availableRooms = data.filter(r => r.available); },
      () => { this.toastr.error('Failed to load rooms'); }
    );
  }

  checkIn(): void {
    if (!this.selectedCustomerId || !this.selectedRoomId) {
      this.toastr.error('Please select both customer and room');
      return;
    }

    this.loading = true;
    const room = this.availableRooms.find(r => r.id === this.selectedRoomId);
    if (!room) {
      this.toastr.error('Selected room not found');
      this.loading = false;
      return;
    }

    // Create reservation with CheckedIn status (2)
    const reservationData = {
      id: 0,
      customerId: this.selectedCustomerId,
      roomId: this.selectedRoomId,
      checkInDate: new Date().toISOString(), // Current date/time
      checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default 1 day later
      actualCheckIn: new Date().toISOString(), // Actual check-in time
      status: 2, // ReservationStatus.CheckedIn
      totalAmount: room.price, // Use room price as base amount
      depositAmount: 0,
      specialRequests: '',
      customerName: this.getCustomerName(this.selectedCustomerId),
      roomName: room.name
    };



    this.clerkService.updatestatus(reservationData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response.success)
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


  private resetForm(): void {
    this.selectedCustomerId = null;
    this.selectedRoomId = null;
  }

  private getCustomerName(customerId: number): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  }

  // Helper to map type string to number
  getRoomTypeNumber(type: string): number {
    const typeMap = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'];
    return typeMap.indexOf(type);
  }
}
