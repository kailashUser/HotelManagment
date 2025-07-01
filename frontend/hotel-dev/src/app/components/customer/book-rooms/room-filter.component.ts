import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FilterOptions {
  priceRange: { min: number; max: number };
  roomType: { [key: string]: boolean };
  amenities: { [key: string]: boolean };
  availability: boolean;
}

@Component({
  selector: 'app-room-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title mb-4">Filter Rooms</h5>
        
        <!-- Price Range -->
        <div class="mb-4">
          <label class="form-label">Price Range</label>
          <div class="d-flex gap-2">
            <input type="number" class="form-control" [(ngModel)]="filters.priceRange.min" placeholder="Min">
            <input type="number" class="form-control" [(ngModel)]="filters.priceRange.max" placeholder="Max">
          </div>
        </div>

        <!-- Room Type -->
        <div class="mb-4">
          <label class="form-label">Room Type</label>
          <div class="form-check" *ngFor="let type of roomTypes">
            <input class="form-check-input" type="checkbox" [id]="type" 
                   [(ngModel)]="filters.roomType[type]">
            <label class="form-check-label" [for]="type">
              {{ type }}
            </label>
          </div>
        </div>

        <!-- Amenities -->
        <div class="mb-4">
          <label class="form-label">Amenities</label>
          <div class="form-check" *ngFor="let amenity of amenities">
            <input class="form-check-input" type="checkbox" [id]="amenity"
                   [(ngModel)]="filters.amenities[amenity]">
            <label class="form-check-label" [for]="amenity">
              {{ amenity }}
            </label>
          </div>
        </div>

        <!-- Availability -->
        <div class="mb-4">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="available"
                   [(ngModel)]="filters.availability">
            <label class="form-check-label" for="available">
              Show only available rooms
            </label>
          </div>
        </div>

        <!-- Sort -->
        <div class="mb-4">
          <label class="form-label">Sort By</label>
          <select class="form-select" [(ngModel)]="selectedSort" (change)="onSortChange()">
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        <button class="btn btn-primary w-100" (click)="applyFilters()">
          Apply Filters
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-check {
      margin-bottom: 0.5rem;
    }
  `]
})
export class RoomFilterComponent {
  @Output() filterChange = new EventEmitter<FilterOptions>();
  @Output() sortChange = new EventEmitter<string>();

  filters: FilterOptions = {
    priceRange: { min: 0, max: 1000 },
    roomType: {},
    amenities: {},
    availability: false
  };

  selectedSort = 'price-asc';
  roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive'];
  amenities = ['WiFi', 'TV', 'AC', 'Mini Bar', 'Room Service'];

  constructor() {
    // Initialize roomType and amenities objects
    this.roomTypes.forEach(type => {
      this.filters.roomType[type] = false;
    });
    this.amenities.forEach(amenity => {
      this.filters.amenities[amenity] = false;
    });
  }

  onSortChange() {
    this.sortChange.emit(this.selectedSort);
  }

  applyFilters() {
    this.filterChange.emit(this.filters);
  }
} 