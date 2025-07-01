import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-room-browse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-browse.component.html',
  styleUrl: './room-browse.component.css'
})
export class RoomBrowseComponent implements OnInit {
  rooms: Room[] = [];
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  selectedRoom: Room | null = null;
  showReservationModal = false;
  reservationDates = {
    checkIn: '',
    checkOut: '',
    guests: 1
  };

  ngOnInit() {
    // Mock data - replace with actual API call
    this.rooms = [
      {
        id: 1,
        roomNumber: '101',
        type: 'Deluxe King',
        price: 200,
        capacity: 2,
        amenities: ['King Bed', 'Ocean View', 'Balcony'],
        imageUrl: 'assets/images/room1.jpg',
        isAvailable: true
      },
      {
        id: 2,
        roomNumber: '102',
        type: 'Deluxe Queen',
        price: 180,
        capacity: 2,
        amenities: ['Queen Bed', 'City View'],
        imageUrl: 'assets/images/room2.jpg',
        isAvailable: true
      },
      // Add more mock rooms here...
    ];
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.rooms.length / this.itemsPerPage);
  }

  getCurrentPageRooms(): Room[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.rooms.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  openReservationModal(room: Room) {
    this.selectedRoom = room;
    this.showReservationModal = true;
  }

  closeReservationModal() {
    this.showReservationModal = false;
    this.selectedRoom = null;
    this.reservationDates = {
      checkIn: '',
      checkOut: '',
      guests: 1
    };
  }

  submitReservation() {
    if (this.selectedRoom && this.reservationDates.checkIn && this.reservationDates.checkOut) {
      // Here you would typically make an API call to create the reservation
      console.log('Reservation submitted:', {
        room: this.selectedRoom,
        dates: this.reservationDates
      });
      this.closeReservationModal();
      // Add success message or redirect
    }
  }
} 