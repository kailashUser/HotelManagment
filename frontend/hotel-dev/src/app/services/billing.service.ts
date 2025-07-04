import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Billing {
  id?: number;
  reservationId: number;
  customerId: number;
  totalAmount: number;
  tax: number;
  discount: number;
  roomCharges: number;
  additionalCharges: number;
  finalAmount: number;
  status: number;
  createdAt: string;
  updatedAt?: string | null;
}

// DTO for creating billing (without id and timestamps)
export interface CreateBillingDto {
  reservationId: number;
  customerId: number;
  totalAmount: number;
  tax: number;
  discount: number;
  roomCharges: number;
  additionalCharges: number;
  finalAmount: number;
  status: number;
}

// Interface for API response structure
export interface BillingResponse {
  success: boolean;
  message: string;
  data: Billing[];
}

// Interface for payment request
export interface PaymentRequest {
  id: number;
  billingId: number;
  amount: number;
  method: number;
  status: number;
  transactionId: string;
  cardNumber: string;
  cardHolderName: string;
  cardExpiryDate: string;
  cvv: string;
  createdAt: string;
  updatedAt: string;
  processedAt: string;
}

@Injectable({ providedIn: 'root' })
export class BillingService {
  private apiUrl = `${environment.apiUrl}/Billing`;

  constructor(private http: HttpClient) {}


  getBillings(): Observable<BillingResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      Accept: '*/*',
    });
    return this.http.get<BillingResponse>(this.apiUrl, { headers });
  }

  
  createBilling(data: CreateBillingDto): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl, data, { headers });
  }
}
