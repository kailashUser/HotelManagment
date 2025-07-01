import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor() { }

  ngOnInit(): void {
    // Load room data (placeholder)
    this.loadRooms();
  }

  loadRooms(): void {
    // TODO: Implement logic to load room data with pagination
    console.log('Loading room list...');
    // Mock data for now
    this.rooms = [
      { id: 1, number: '101', type: 'Single', status: 'Available', price: 100 },
      { id: 2, number: '102', type: 'Double', status: 'Booked', price: 150 },
      { id: 3, number: '201', type: 'Suite', status: 'Maintenance', price: 300 },
    ];
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