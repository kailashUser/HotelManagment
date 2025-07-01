import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Billing {
  ReservationId: number;
  CustomerId: number;
  totalAmount: number;
  tax: number;
  discount: number;
  roomCharges: number;
  additionalCharges: number;
  finalAmount: number;
  status: number; // 0: Pending, 1: Paid
  createdAt: string;
}

export interface CreateBillingDto {
  ReservationId: number;
  CustomerId: number;
  totalAmount: number;
  tax: number;
  discount: number;
  roomCharges: number;
  additionalCharges: number;
  finalAmount: number;
  status: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class BillingService {
  private apiUrl = `${environment.apiUrl}/Billing`;

  constructor(private http: HttpClient) {}

  createBilling(data: Billing): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    });

    return this.http.post(`${this.apiUrl}`, data, { headers });
  }
}
