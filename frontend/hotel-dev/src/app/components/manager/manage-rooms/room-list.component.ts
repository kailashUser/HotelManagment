import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private roomService: RoomService, private router: Router, private toastr: ToastrService) { }

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

    this.roomService.deleteRoom(id).subscribe({
      next: () => {

        this.rooms = this.rooms.filter(r => r.id !== id);
        this.toastr.success(' Room deleted successful!.', 'Success');
      },
      error: (err) => {
        console.error('Failed to delete room:', err);
        this.toastr.error('Failed to delete room. Please try again')
      }
    });
  }
}
