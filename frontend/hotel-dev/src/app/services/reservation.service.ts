import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reservation } from '../models/Reservation';

export interface CreateReservationDto {
  customerId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string | null;
  actualCheckOut?: string | null;
  status: number;
  totalAmount: number;
  depositAmount?: number;
  specialRequests?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/Reservation`;

  constructor(private http: HttpClient) { }

  createReservation(data: CreateReservationDto): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, data, { headers });
  }

  getAllReservations(): Observable<Reservation[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    });

    return this.http
      .get<{ success: boolean; data: any[] }>(`${this.apiUrl}`, { headers })
      .pipe(
        map((res) =>
          res.data.map((r) => ({
            id: r.id,
            CustomerId: r.CustomerId,
            roomName: `Room ${r.roomId}`, // you can adjust this if `Room` info is joined
            checkIn: r.checkInDate,
            checkOut: r.checkOutDate,
            status: this.mapStatus(r.status),
            totalPrice: r.totalAmount,
            guests: 1, // you can change if guests info is available
          }))
        )
      );
  }


  getAllReservationsWithCustID(customerId: number): Observable<Reservation[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    });

    const url = `${this.apiUrl}/by-customer/${customerId}`;

    return this.http
      .get<{ success: boolean; data: any[] }>(url, { headers })
      .pipe(
        map((res) =>
          res.data.map((r) => ({
            id: r.id,
            CustomerId: r.customerId, // ✅ Fix casing here
            roomName: r.room?.roomNumber ? `Room ${r.room.roomNumber}` : `Room ${r.roomId}`,
            checkIn: r.checkInDate,
            checkOut: r.checkOutDate,
            status: this.mapStatus(r.status), // should return 'ongoing' | 'pending' | 'completed'
            totalPrice: r.totalAmount,
            guests: r.numberOfGuests ?? 1,
          }))
        )
      );
  }


  private mapStatus(code: number): 'pending' | 'completed' | 'ongoing' {
    switch (code) {
      case 0:
        return 'pending';
      case 1:
        return 'completed';
      case 2:
        return 'ongoing';
      default:
        return 'pending';
    }
  }

  cancelReservation(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {}, { headers });
  }
}
