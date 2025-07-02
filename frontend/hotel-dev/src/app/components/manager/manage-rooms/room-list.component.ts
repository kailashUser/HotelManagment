import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RoomService } from '../../../services/room.service';

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  available: boolean;
}

@Component({
  selector: 'app-manager-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private roomService: RoomService, private router: Router) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        console.log('Rooms loaded:', data);
      },
      error: (err) => {
        console.error('Failed to load rooms:', err);
      }
    });
  }

  editRoom(id: number): void {
   
    this.router.navigate(['/manager/edit-room', id]);
  }

  deleteRoom(id: number): void {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    this.roomService.deleteRoom(id).subscribe({
      next: () => {

        this.rooms = this.rooms.filter(r => r.id !== id);
        alert('Room deleted successfully.');
      },
      error: (err) => {
        console.error('Failed to delete room:', err);
        alert('Failed to delete room. Please try again.');
      }
    });
  }
}
