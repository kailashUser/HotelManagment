import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-add-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent {
  newRoom: any = {}; // Placeholder for new room data

  constructor(private router: Router) { }

  addRoom(): void {
    // TODO: Implement logic to add new room with validation
    console.log('Adding new room...', this.newRoom);
    // Show success/error message and navigate back to room list
    this.router.navigate(['/manager/manage-rooms']);
  }

  cancel(): void {
    this.router.navigate(['/manager/manage-rooms']);
  }
} 