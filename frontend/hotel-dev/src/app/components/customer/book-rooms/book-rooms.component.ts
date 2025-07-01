import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomCardComponent } from './room-card.component';
import { RoomFilterComponent } from './room-filter.component';
import { PaginationComponent } from './pagination.component';
import { RoomService } from '../../../services/room.service'; // ✅ correct relative path
import { Room } from '../../../models/room.model'; // ✅ fix here

@Component({
  selector: 'app-book-rooms',
  standalone: true,
  imports: [
    CommonModule,
    RoomCardComponent,
    RoomFilterComponent,
    PaginationComponent,
  ],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <app-room-filter
            (filterChange)="onFilterChange($event)"
            (sortChange)="onSortChange($event)"
          >
          </app-room-filter>
        </div>
        <div class="col-md-9">
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col" *ngFor="let room of displayedRooms">
              <app-room-card [room]="room"></app-room-card>
            </div>
          </div>
          <div class="mt-4">
            <app-pagination
              [totalItems]="filteredRooms.length"
              [itemsPerPage]="itemsPerPage"
              [currentPage]="currentPage"
              (pageChange)="onPageChange($event)"
            >
            </app-pagination>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }
    `,
  ],
})
export class BookRoomsComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  displayedRooms: Room[] = [];
  currentPage = 1;
  itemsPerPage = 6; // Adjust based on UI
  isLoading = true;

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.isLoading = true;
    console.log(12);
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.filteredRooms = [...rooms];
        this.updateDisplayedRooms();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load rooms:', err);
        this.isLoading = false;
      },
    });
  }

  onFilterChange(filters: any) {
    // TODO: Apply filtering logic
    this.updateDisplayedRooms();
  }

  onSortChange(sortOption: string) {
    // TODO: Apply sorting logic
    this.updateDisplayedRooms();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedRooms();
  }

  private updateDisplayedRooms() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedRooms = this.filteredRooms.slice(startIndex, endIndex);
  }
}
