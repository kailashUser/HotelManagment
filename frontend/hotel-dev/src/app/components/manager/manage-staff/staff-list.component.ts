import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagerService } from '../../../services/manager.service';

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

  constructor(private managerService: ManagerService) { }

  ngOnInit(): void {
    // Load staff data (placeholder)
    this.loadStaff();
  }

  loadStaff(): void {
    this.managerService.getStaffMembers().subscribe((data) => {
      this.staffMembers = data;
      console.log("staff members" + data)
    })
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
