import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  managerProfile: any = {}; // Placeholder for profile data

  constructor() { }

  ngOnInit(): void {
    // Load profile data (placeholder)
    this.loadProfile();
  }

  loadProfile(): void {
    // TODO: Implement logic to load manager profile data
    console.log('Loading manager profile...');
    // Mock data for now
    this.managerProfile = {
      name: 'John Smith',
      email: 'john.smith@hotel.com',
      // Password is typically not loaded directly
    };
  }

  updateProfile(): void {
    // TODO: Implement logic to update manager profile data with validation
    console.log('Updating manager profile...', this.managerProfile);
    // Show success/error message
  }
} 