import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Assuming a Room interface exists (can import from customer book-rooms if needed)
interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[]; // Assuming array of strings
  imageUrl: string;
  available: boolean;
}

@Component({
  selector: 'app-manager-edit-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class EditRoomComponent implements OnInit {
  roomId: number | null = null;
  roomData: any = {}; // Placeholder for room data
  room: Room | undefined;
  amenitiesString: string = ''; // Property to bind the amenities input

  // Mock room data (should be fetched from a service)
   private mockRooms: Room[] = [
      {
        id: 1,
        name: 'Deluxe Room',
        type: 'Deluxe',
        price: 150,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'AC'],
        imageUrl: 'assets/images/room1.jpg',
        available: true
      },
       {
        id: 2,
        name: 'Standard Room',
        type: 'Standard',
        price: 100,
        capacity: 2,
        amenities: ['WiFi', 'TV'],
        imageUrl: 'assets/images/room2.jpg',
        available: false
      },
      {
        id: 3,
        name: 'Suite',
        type: 'Suite',
        price: 250,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'AC', 'Balcony'],
        imageUrl: 'assets/images/room3.jpg',
        available: true
      },
      {
        id: 4,
        name: 'Family Room',
        type: 'Family',
        price: 200,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'AC', 'Kitchenette'],
        imageUrl: 'assets/images/room4.jpg',
        available: true
      },
      {
        id: 5,
        name: 'Single Room',
        type: 'Single',
        price: 80,
        capacity: 1,
        amenities: ['WiFi'],
        imageUrl: 'assets/images/room5.jpg',
        available: true
      },
      {
        id: 6,
        name: 'Executive Suite',
        type: 'Suite',
        price: 350,
        capacity: 3,
        amenities: ['WiFi', 'TV', 'AC', 'Balcony', 'Desk'],
        imageUrl: 'assets/images/room6.jpg',
        available: true
      }
    ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = Number(params.get('id'));
      if (this.roomId) {
        this.loadRoomData(this.roomId);
      }
    });
  }

  loadRoomData(id: number): void {
    // TODO: Implement logic to load room data by ID
    console.log('Loading room data for ID:', id);
    // Mock data for now
    this.roomData = { 
      id: id, 
      number: 'Edit Room 101', 
      type: 'Single', 
      status: 'Available', 
      price: 120, 
      capacity: 2, 
      amenities: 'WiFi, TV', 
      imageUrl: 'path/to/image.jpg' 
    };
    this.room = this.mockRooms.find(room => room.id === id);

    // Initialize amenitiesString from room.amenities
    if (this.room?.amenities) {
      this.amenitiesString = this.room.amenities.join(', ');
    }
  }

  updateRoom(): void {
    // TODO: Implement logic to update room data with validation
    console.log('Updating room data for ID:', this.roomId, this.roomData);
    // Show success/error message and navigate back to room list
    this.router.navigate(['/manager/manage-rooms']);
  }

  cancel(): void {
    this.router.navigate(['/manager/manage-rooms']);
  }

  // Method to update room.amenities from amenitiesString
  updateAmenities(): void {
    if (this.room && this.amenitiesString !== null) {
      this.room.amenities = this.amenitiesString.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
  }
} 