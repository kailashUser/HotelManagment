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

  constructor(private http: HttpClient) {}

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

    const url = `${this.apiUrl}/with-customer/${customerId}`;

    return this.http
      .get<{ success: boolean; data: any[] }>(url, { headers })
      .pipe(
        map((res) =>
          res.data.map((r) => ({
            id: r.id,
            CustomerId: r.customerId, // ✅ Fix casing here
            roomName: r.room?.roomNumber
              ? `Room ${r.room.roomNumber}`
              : `Room ${r.roomId}`,
            checkIn: r.checkInDate,
            checkOut: r.checkOutDate,
            status: this.mapStatus(r.status), // should return 'ongoing' | 'pending' | 'completed'
            totalPrice: r.totalAmount,
            guests: r.numberOfGuests ?? 1,
          }))
        )
      );
  }
  private mapStatus(status: string | number): string {
    const statusMap: Record<number, string> = {
      0: 'Pending',
      1: 'Confirmed',
      2: 'CheckedIn',
      3: 'CheckedOut',
      4: 'Cancelled',
      5: 'NoShow',
    };

    const normalized =
      typeof status === 'string' ? parseInt(status.trim(), 10) : status;

    return statusMap[normalized] || 'Unknown';
  }

  cancelReservation(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {}, { headers });
  }

  autocancel(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch(`${this.apiUrl}/autocancel`, {}, { headers });
  }
}
