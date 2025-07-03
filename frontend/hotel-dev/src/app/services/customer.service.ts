import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Interfaces
import { Customer } from '../interfaces/customer.interface';
import { Reservation } from '../interfaces/reservation.interface';
import { Room } from '../interfaces/room.interface';

interface PaymentDetails {
  method: 'cash' | 'card' | 'bankTransfer';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bankAccount?: string;
  amount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client/network error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (${error.status}): ${error.message}`;
    }
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  // 🔍 Customer Profile
  getCustomerProfile(): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/Customer`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateCustomerProfile(customerData: Partial<Customer>): Observable<ApiResponse<Customer>> {
    return this.http.put<ApiResponse<Customer>>(`${this.apiUrl}/Customer/profile`, customerData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // 📅 Reservations
  getCustomerReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/Customer/reservations`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getReservationById(reservationId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/Customer/reservations/${reservationId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
  getReservationsByCustomer(customerId: number): Observable<ApiResponse<Reservation[]>> {
    return this.http.get<ApiResponse<Reservation[]>>(
      `${this.apiUrl}/Reservation/by-customer/${customerId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // PUT update reservation
  updateReservation(reservation: Reservation): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/Reservation`,
      reservation,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }


  createReservation(reservationData: {
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    specialRequests?: string;
    addOns?: {
      breakfast: boolean;
      wifi: boolean;
      parking: boolean;
    };
  }): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/Customer/reservations`, reservationData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  cancelReservation(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Customer/reservations/${reservationId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // 🏨 Room Lookup
  getAvailableRooms(checkInDate: string, checkOutDate: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/Customer/rooms/available`, {
      headers: this.getAuthHeaders(),
      params: { checkInDate, checkOutDate }
    }).pipe(catchError(this.handleError));
  }

  getRoomDetails(roomId: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/Customer/rooms/${roomId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // 💳 Payments
  makePayment(reservationId: number, paymentDetails: PaymentDetails): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Customer/payments`, {
      reservationId,
      ...paymentDetails
    }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Customer/payments`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // 🧾 Services
  requestService(serviceType: string, details: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Customer/services`, {
      type: serviceType,
      details
    }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getServiceHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Customer/services`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
