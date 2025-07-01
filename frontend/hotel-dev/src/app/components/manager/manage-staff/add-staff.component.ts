import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface NewStaffMember {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-manager-add-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent {
  newStaff: NewStaffMember = {
    name: '',
    email: '',
    role: ''
  };

  constructor(private router: Router) { }

  addStaff(): void {
    // TODO: Implement logic to add new staff with validation
    console.log('Adding new staff...', this.newStaff);
    // Show success/error message and navigate back to staff list
    this.router.navigate(['/manager/manage-staff']);
  }

  cancel(): void {
    this.router.navigate(['/manager/manage-staff']);
  }
} 