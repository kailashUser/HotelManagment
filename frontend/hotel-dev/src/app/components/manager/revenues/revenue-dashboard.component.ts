import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueChartComponent } from './revenue-chart.component';

@Component({
  selector: 'app-manager-revenue-dashboard',
  standalone: true,
  imports: [CommonModule, RevenueChartComponent],
  templateUrl: './revenue-dashboard.component.html',
  styleUrls: ['./revenue-dashboard.component.scss'],
})
export class RevenueDashboardComponent implements OnInit {
  totalRevenue: number = 0; // Placeholder
  totalBookings: number = 0; // Placeholder
  bookingsPerMonth: any[] = []; // Placeholder for chart data
  earningsBreakdown: any[] = []; // Placeholder for breakdown data

  constructor() {}

  ngOnInit(): void {
    // Load revenue data (placeholder)
    this.loadRevenueData();
  }

  loadRevenueData(): void {
    // TODO: Implement logic to load revenue data
    console.log('Loading revenue data...');
    // Mock data for now
    this.totalRevenue = 15000;
    this.totalBookings = 10;
    this.bookingsPerMonth = [
      { month: 'Jan', bookings: 15 },
      { month: 'Feb', bookings: 10 },
      { month: 'Mar', bookings: 25 },
      { month: 'Apr', bookings: 30 },
      { month: 'May', bookings: 40 },
    ];
    this.earningsBreakdown = [
      { category: 'Room Bookings', amount: 12000 },
      { category: 'Additional Services', amount: 3000 },
    ];
  }

  // TODO: Add methods for filtering by date range, room type, etc.
}
