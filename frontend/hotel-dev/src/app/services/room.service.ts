import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateRoomDto, RawRoom, Room } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
      'Content-Type': 'application/json',
    });
  }

  getAllRooms(): Observable<Room[]> {
    console.log('Fetching all rooms');
    return this.http
      .get<{ success: boolean; message: string; data: RawRoom[] }>(
        `${this.apiUrl}/Room`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((res) =>
          res.data.map((room, index) => this.mapToRoom(room, index))
        )
      );
  }
  getRoomById(id: number): Observable<RawRoom> {
    console.log('Fetching room with ID:', id);
    return this.http
      .get<{ success: boolean; message: string; data: RawRoom }>(
        `${this.apiUrl}/Room/${id}`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((res) => res.data),
        catchError((error) => {
          const msg = this.extractErrorMessage(error, 'Failed to fetch room.');
          return throwError(() => new Error(msg));
        })
      );
  }

  createRoom(roomDto: CreateRoomDto): Observable<any> {
    console.log('Creating room with DTO:', roomDto);
    return this.http
      .post(`${this.apiUrl}/Room`, roomDto, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          const msg = this.extractErrorMessage(error, 'Room creation failed.');
          return throwError(() => new Error(msg));
        })
      );
  }

  updateRoom(id: number, roomDto: CreateRoomDto): Observable<any> {
    console.log('Updating room', id, 'with DTO:', roomDto);
    return this.http
      .put(`${this.apiUrl}/Room/${id}`, roomDto, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          const msg = this.extractErrorMessage(error, 'Room update failed.');
          return throwError(() => new Error(msg));
        })
      );
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Room/${id}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        const msg = this.extractErrorMessage(error, 'Room deletion failed.');
        return throwError(() => new Error(msg));
      })
    );
  }

  // Helper functions

  private mapToRoom(room: RawRoom, index: number): Room {
    const typeString = this.getRoomTypeName(room.type);
    return {
      id: room.id,
      name: `Room ${room.roomNumber}`,
      type: typeString,
      price: room.basePrice,
      capacity: room.capacity,
      amenities: this.getAmenities(typeString),
      imageUrl: this.getImageUrl(index),
      available: room.isAvailable,
      description: room.description ?? '',  // <-- add this to fix error
    };
  }

  private getRoomTypeName(type: number): string {
    const typeMap = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'];
    return typeMap[type] ?? 'Standard';
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

  private extractErrorMessage(error: any, fallback: string): string {
    if (error?.error?.message) return error.error.message;
    if (error?.error?.errors)
      return Object.values(error.error.errors).flat().join(', ');
    if (error?.message) return error.message;
    return fallback;
  }
}
