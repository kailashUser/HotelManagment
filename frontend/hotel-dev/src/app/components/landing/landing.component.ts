import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  rooms = [
    {
      id: 1,
      name: 'Deluxe Room',
      description:
        'Spacious room with city view, king-size bed, and modern amenities.',
      price: 6000,
      image:
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 2,
      name: 'Executive Suite',
      description:
        'Luxurious suite with separate living area and premium services.',
      price: 7350,
      image:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    },
    {
      id: 3,
      name: 'Presidential Suite',
      description:
        'Ultimate luxury with panoramic views and exclusive amenities.',
      price: 9500,
      image:
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
  ];

  reviews = [
    {
      id: 1,
      name: 'John Smith',
      rating: 5,
      comment:
        'Amazing experience! The staff was incredibly attentive and the facilities were top-notch.',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      rating: 5,
      comment:
        'The presidential suite was absolutely breathtaking. Worth every penny!',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: 3,
      name: 'Michael Brown',
      rating: 4.5,
      comment:
        'Great location and excellent service. Will definitely come back!',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
  ];

  floor(value: number): number {
    return Math.floor(value);
  }
}
