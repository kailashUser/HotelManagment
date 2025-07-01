import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomService } from '../../../services/room.service';

// Assuming a Room interface exists (can import from customer book-rooms if needed)
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
  rooms: any[] = []; // Placeholder for room data

  constructor(private roomServices: RoomService) { }

  ngOnInit(): void {
    // Load room data (placeholder)
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomServices.getAllRooms().subscribe((data) => {
      this.rooms = data;
      console.log("rooms loading" + data)
    })
  }

  editRoom(id: number): void {
    // TODO: Navigate to edit room page
    console.log('Editing room with ID:', id);
  }

  deleteRoom(id: number): void {
    // TODO: Implement delete room logic
    console.log('Deleting room with ID:', id);
    // Remove from mock data for immediate view update
    this.rooms = this.rooms.filter(r => r.id !== id);
  }
}
