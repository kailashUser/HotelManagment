import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CreateRoomDto, Room } from '../../../models/room.model'; // Import the shared Room interface
import { ClerkService } from '../../../services/clerk.service';
import { RoomService } from '../../../services/room.service';
import { RoomStatusCardComponent } from './room-status-card.component';

@Component({
  selector: 'app-clerk-room-status',
  standalone: true,
  imports: [CommonModule, RoomStatusCardComponent],
  template: `
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>Room Status</h4>
        <div class="btn-group">
          <button class="btn btn-outline-primary" [class.active]="currentFilter === 'All'" (click)="filterRooms('All')">All</button>
          <button class="btn btn-outline-success" [class.active]="currentFilter === 'Available'" (click)="filterRooms('Available')">Available</button>
          <button class="btn btn-outline-danger" [class.active]="currentFilter === 'Occupied'" (click)="filterRooms('Occupied')">Occupied</button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let room of filteredRooms">
          <app-clerk-room-status-card
            [room]="transformRoomForCard(room)"
            (statusChange)="onStatusChange(room.id, $event)">
          </app-clerk-room-status-card>
        </div>
      </div>

      <div *ngIf="!filteredRooms.length && currentFilter !== 'All'" class="alert alert-info mt-3">
        No {{ currentFilter.toLowerCase() }} rooms found.
      </div>
      <div *ngIf="!filteredRooms.length && currentFilter === 'All'" class="alert alert-info mt-3">
        No rooms found.
      </div>
    </div>
  `,
  styles: [`
    .btn-group {
      gap: 0.5rem;
    }
    .btn-outline-primary.active {
      background-color: #007bff;
      color: #fff;
    }
    .btn-outline-success.active {
      background-color: #28a745;
      color: #fff;
    }
    .btn-outline-danger.active {
      background-color: #dc3545;
      color: #fff;
    }
  `]
})
export class RoomStatusComponent implements OnInit {

  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  currentFilter: string = 'All';

  constructor(
    private roomService: RoomService,
    private toastr: ToastrService,
    private clerkService: ClerkService
  ) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.filteredRooms = [...this.rooms]; // Initialize filtered rooms
        console.log('Rooms loaded:', data);
      },
      error: (err) => {
        console.error('Failed to load rooms:', err);
        this.toastr.error('Failed to load rooms');
      }
    });
  }

  filterRooms(status: string): void {
    this.currentFilter = status;

    if (status === 'Available') {
      this.filteredRooms = this.rooms.filter(room => room.available === true);
    } else if (status === 'Occupied') {
      this.filteredRooms = this.rooms.filter(room => room.available === false);
    } else {
      this.filteredRooms = [...this.rooms]; // All rooms
    }

    console.log(`Filtered rooms (${status}):`, this.filteredRooms);
  }

  onStatusChange(roomId: number, status: string): void {
    this.updateRoomStatus(roomId, status);
  }

  updateRoomStatus(roomId: number, status: string): void {
    console.log('selected ID: ', roomId);

    // Find the room in the local array
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) {
      this.toastr.error('Room not found');
      return;
    }

    // Convert status string to boolean
    const isAvailable = status === 'Available';

    // Create the DTO - use existing room data, only change the status
    const roomDto: CreateRoomDto = {
      roomNumber: room.name.replace('Room ', ''), // or use room.roomNumber if available
      type: Number(room.type) || 1,                    // use existing or default
      basePrice: room.price || 100,  // use existing or default
      capacity: room.capacity || 2,               // use existing or default
      isAvailable: isAvailable,                   // This is what actually changes
      description: room.description || null
    };

    // Call the API
    this.roomService.updateRoom(roomId, roomDto).subscribe({
      next: (response) => {
        console.log('Room updated successfully');

        // Update local state only after API success
        room.available = isAvailable;
        this.filterRooms(this.currentFilter);

        this.toastr.success(`Room status updated to ${status}`);
      },
      error: (error) => {
        console.error('Failed to update room:', error);
        this.toastr.error('Failed to update room status');
      }
    });
  }
  // Transform room data to match RoomStatusCardComponent's expected interface
  transformRoomForCard(room: Room): any {
    return {
      ...room,
      number: room.name.replace('Room ', ''), // Extract room number from name
      status: room.available ? 'Available' : 'Occupied'
    };
  }
}
