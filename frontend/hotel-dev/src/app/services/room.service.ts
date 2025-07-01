import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Room } from '../models/room.model';
import { environment } from '../../environments/environment';

interface RawRoom {
  id: number;
  roomNumber: string;
  type: number; // enum index
  basePrice: number;
  capacity: number;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<Room[]> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    };

    return this.http
      .get<{ success: boolean; message: string; data: RawRoom[] }>(
        `${this.apiUrl}/Room`,
        { headers }
      )
      .pipe(
        map((res) =>
          res.data.map((room: RawRoom, index: number) => {
            const typeString = this.mapRoomType(room.type);

            return {
              id: room.id,
              name: `Room ${room.roomNumber}`,
              type: typeString,
              price: room.basePrice,
              capacity: room.capacity,
              amenities: this.getAmenities(typeString),
              imageUrl: this.getImageUrl(index),
              available: room.isAvailable,
            };
          })
        )
      );
  }

  private getImageUrl(index: number): string {
    const images = [
      'assets/images/room1.jpg',
      'assets/images/room2.jpg',
      'assets/images/room3.jpg',
      'assets/images/room4.jpg',
      'assets/images/room5.jpg',
      'assets/images/room6.jpg',
    ];
    return images[index % images.length];
  }

  private getAmenities(type: string): string[] {
    switch (type.toLowerCase()) {
      case 'standard':
        return ['WiFi', 'TV'];
      case 'deluxe':
        return ['WiFi', 'TV', 'AC'];
      case 'suite':
        return ['WiFi', 'TV', 'AC', 'Balcony'];
      case 'executive':
        return ['WiFi', 'TV', 'AC', 'Balcony', 'Desk'];
      case 'presidential':
        return ['WiFi', 'TV', 'AC', 'Balcony', 'Desk', 'Jacuzzi'];
      default:
        return ['WiFi'];
    }
  }

  private mapRoomType(type: number): string {
    const typeMap = [
      'Standard',
      'Deluxe',
      'Suite',
      'Executive',
      'Presidential',
    ];
    return typeMap[type] ?? 'Standard';
  }
}
