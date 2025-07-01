import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.css'],
})
export class RoomCardComponent {
  @Input() room!: Room;
  @Output() reserveClicked = new EventEmitter<number>();

  constructor(private router: Router) {}

  formatPrice(price: number): string {
    if (typeof price !== 'number') {
      return '0.00';
    }
    return price.toFixed(2);
  }

  // onReserve(): void {
  //   console.log('Reserve button clicked for room:', this.room.name);
  //   this.router.navigate(['/customer/reserve', this.room.id]);
  // }

  onReserve(roomId: number) {
    // Option 1: Emit to parent
    this.reserveClicked.emit(roomId);
    console.log(roomId);

    // OR Option 2: Navigate directly
    this.router.navigate(['/customer/reserve', roomId]);
  }
}
