import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-edit-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss']
})
export class EditStaffComponent implements OnInit {

  staffId: number | null = null;
  staffData: any = {}; // Placeholder for staff data

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.staffId = Number(params.get('id'));
      if (this.staffId) {
        this.loadStaffData(this.staffId);
      }
    });
  }

  loadStaffData(id: number): void {
    // TODO: Implement logic to load staff data by ID
    console.log('Loading staff data for ID:', id);
    // Mock data for now
    this.staffData = {
      id: id,
      name: 'Edit User Name',
      email: `edituser${id}@hotel.com`,
      role: 'Receptionist'
    };
  }

  updateStaff(): void {
    // TODO: Implement logic to update staff data with validation
    console.log('Updating staff data for ID:', this.staffId, this.staffData);
    // Show success/error message and navigate back to staff list
    this.router.navigate(['/manager/manage-staff']);
  }

  cancel(): void {
    this.router.navigate(['/manager/manage-staff']);
  }

} 