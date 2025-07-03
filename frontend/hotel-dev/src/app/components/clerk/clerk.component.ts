import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clerk',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clerk.component.html',
  styleUrls: ['./clerk.component.scss']
})
export class ClerkComponent {
  // Sample data for demonstration
  clerkInfo = {
    name: 'John Doe',
    employeeId: 'CLK123',
    department: 'Front Desk',
    status: 'Active',
    shift: 'Morning',
    contact: '+1 234 567 8900'
  };

  // Sample tasks for demonstration
  tasks = [
    { id: 1, title: 'Check-in Guest', status: 'Pending', priority: 'High' },
    { id: 2, title: 'Process Payment', status: 'Completed', priority: 'Medium' },
    { id: 3, title: 'Room Assignment', status: 'In Progress', priority: 'High' }
  ];
}
