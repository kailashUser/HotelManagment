import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomStatusCardComponent } from './room-status-card.component';
import { ClerkService } from '../../../services/clerk.service';
import { Room } from '../../../interfaces/room.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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
          <button class="btn btn-outline-warning" [class.active]="currentFilter === 'Maintenance'" (click)="filterRooms('Maintenance')">Maintenance</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let room of filteredRooms">
          <app-clerk-room-status-card 
            [room]="room"
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
     .btn-outline-warning.active {
      background-color: #ffc107;
      color: #212529;
      border-color: #ffc107;
    }
  `]
})
export class RoomStatusComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  currentFilter: string = 'All';

  constructor(private clerkService: ClerkService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.clerkService.getRooms().pipe(
      catchError((error: any) => {
        this.toastr.error('Failed to load rooms.');
        return throwError(() => error);
      })
    ).subscribe((rooms: Room[]) => {
      this.rooms = rooms;
      this.filterRooms(this.currentFilter);
    });
  }

  filterRooms(status: string): void {
    this.currentFilter = status;
    if (status === 'All') {
      this.filteredRooms = [...this.rooms];
    } else {
      this.filteredRooms = this.rooms.filter(room => room.status === status);
    }
  }

  onStatusChange(roomId: number, status: string): void {
    this.updateRoomStatus(roomId, status);
  }

  updateRoomStatus(roomId: number, status: string): void {
    this.clerkService.updateRoomStatus(roomId, status).pipe(
       catchError((error: any) => {
        console.error('Error updating room status:', error);
        this.loadRooms();
        return throwError(() => error);
      })
    ).subscribe((updatedRoom: Room) => {
      console.log('Room status updated in component:', updatedRoom);
      const index = this.rooms.findIndex(r => r.id === updatedRoom.id);
      if (index !== -1) {
        this.rooms[index] = updatedRoom;
        this.filterRooms(this.currentFilter);
      }
    });
  }
}