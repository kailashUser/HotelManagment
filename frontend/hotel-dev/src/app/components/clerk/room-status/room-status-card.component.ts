import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room } from '../../../interfaces/room.interface';

@Component({
  selector: 'app-clerk-room-status-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Room {{ room.number }}</h5>
        <p class="card-text">Type: {{ room.type }}</p>
        <p class="card-text">Status: 
          <span class="badge" [ngClass]="{
            'bg-success': room.status === 'Available',
            'bg-danger': room.status === 'Occupied',
            'bg-warning': room.status === 'Maintenance'
          }">{{ room.status }}</span>
        </p>
        <div class="mb-3">
          <label for="status-{{room.id}}" class="form-label">Change Status</label>
          <select class="form-select" id="status-{{room.id}}" [(ngModel)]="room.status" (change)="onStatusChange()">
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add styles here if needed */
    .badge {
        padding: 0.5em 0.75em;
        font-size: 0.8em;
    }
  `]
})
export class RoomStatusCardComponent {

  @Input() room!: Room;
  @Output() statusChange = new EventEmitter<string>();

  onStatusChange(): void {
    console.log(`Status for room ${this.room.number} changed to ${this.room.status}`);
    this.statusChange.emit(this.room.status);
  }

} 