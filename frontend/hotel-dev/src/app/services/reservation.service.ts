import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
