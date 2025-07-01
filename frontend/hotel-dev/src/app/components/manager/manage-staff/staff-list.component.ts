import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {

  staffMembers: StaffMember[] = [];

  constructor() { }

  ngOnInit(): void {
    // Load staff data (placeholder)
    this.loadStaff();
  }

  loadStaff(): void {
    // TODO: Implement logic to load staff data
    console.log('Loading staff list...');
    // Mock data for now
    this.staffMembers = [
      { id: 1, name: 'Alice Johnson', role: 'Receptionist', email: 'alice.j@hotel.com' },
      { id: 2, name: 'Bob Williams', role: 'Housekeeping', email: 'bob.w@hotel.com' },
    ];
  }

  editStaff(id: number): void {
    // TODO: Navigate to edit staff page
    console.log('Editing staff with ID:', id);
  }

  deleteStaff(id: number): void {
    // TODO: Implement delete staff logic
    console.log('Deleting staff with ID:', id);
    // Remove from mock data for immediate view update
    this.staffMembers = this.staffMembers.filter(s => s.id !== id);
  }

} 