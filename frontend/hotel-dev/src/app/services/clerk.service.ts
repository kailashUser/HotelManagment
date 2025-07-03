import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Room } from '../interfaces/room.interface';
import { ApiResponse } from '../models/ApiResponse';
import { AuthService } from './auth.service';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  createdAt?: string; // Assuming ISO 8601 date strings
  updatedAt?: string;
}

interface TravelCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Reservation {
  id: number;
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
  createdAt?: string | null;
  updatedAt?: string | null;
  customer?: Customer;
  room?: Room;
}

interface Billing {
  id: number;
  reservationId: number;
  customerId: number;
  totalAmount: number;
  tax: number;
  discount?: number;
  roomCharges: number;
  additionalCharges?: number;
  finalAmount: number;
  status: number; // Or string like 'Pending', 'Paid', 'Cancelled' - check API response
  createdAt?: string;
  updatedAt?: string;
}

interface Payment {
  id: number;
  billingId: number;
  amount: number;
  method: number; // Or string/enum - check API response
  status: number; // Or string/enum - check API response
  transactionId?: string;
  cardNumber?: string; // Last 4 digits?
  cardHolderName?: string;
  cardExpiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  processedAt?: string;
}

interface TotalRevenueReport {
  totalRevenue: number;
  // Add other fields if the API returns more
}

interface TopBookedRoom {
  roomNumber: string;
  bookingCount: number;
  // Add other fields if the API returns more
}

interface CustomerSpending {
  customerId: number;
  customerName: string; // Assuming name is included or can be joined
  totalSpent: number;
  // Add other fields if the API returns more
}

interface OccupancyRate {
  rate: number; // e.g., 0.75 for 75%
  // Add other fields if the API returns more (like period)
}

interface ClerkProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface PaymentDetails {
  method: 'cash' | 'card' | 'bankTransfer';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bankAccount?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClerkService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      // Handle case where token is not available (user not logged in)
      // This might involve redirecting to login or throwing an error
      console.warn('ClerkService: JWT token not found. Request may fail.');
      // Depending on security requirements, you might return empty headers or throw an error
      return new HttpHeaders({ 'Content-Type': 'application/json' });
      // throw new Error('User not authenticated.'); // Alternative: throw error immediately
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error occurred:', error);
    let userMessage = 'An unexpected error occurred.';
    if (error.error && typeof error.error === 'object' && error.error.message) {
      // Check if error.error is an object and has message
      userMessage = error.error.message;
    } else if (typeof error.error === 'string') {
      // Handle plain string error responses
      userMessage = error.error;
    } else if (error.message) {
      userMessage = error.message;
    }
    this.toastr.error(userMessage);
    return throwError(() => new Error(userMessage));
  }

  // Room operations
  getRooms(): Observable<Room[]> {
    const headers = this.getAuthHeaders();
    // TODO: Add pagination or filtering query parameters if needed based on API capability
    return this.http
      .get<Room[]>(`${this.apiUrl}/Room`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateRoom(room: Room): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/room/${room.id}`, room, {
      headers,
    });
  }

  updateRoomStatus(roomId: number, status: string): Observable<Room> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Room>(
      `${this.apiUrl}/room/${roomId}/status`,
      { status },
      { headers }
    );
  }

  deleteRoom(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/room/${id}`, { headers });
  }

  // Clerk profile operations
  getClerkProfile(): Observable<ClerkProfile> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<ClerkProfile>(`${this.apiUrl}/User/clerkProfile`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateClerkProfile(profileData: any): Observable<ClerkProfile> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<ClerkProfile>(`${this.apiUrl}/User/clerkProfile`, profileData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  // Customer and travel company operations
  getCustomers(): Observable<Customer[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Customer[]>(`${this.apiUrl}/Customer`, { headers })
      .pipe(catchError(this.handleError));
  }

  getTravelCompanies(): Observable<TravelCompany[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<TravelCompany[]>(`${this.apiUrl}/TravelCompany`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Reservation operations
  getReservations(): Observable<Reservation[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<{ success: boolean; message: string; data: Reservation[] }>(
        `${this.apiUrl}/Reservation/with-customer`,
        { headers }
      )
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }


  getReservationById(id: number): Observable<Reservation> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Reservation>(`${this.apiUrl}/Reservation/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getReservationByRoom(
    roomNumber: string
  ): Observable<Reservation | undefined> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('roomNumber', roomNumber);
    return this.http
      .get<Reservation[]>(`${this.apiUrl}/Reservation`, { headers, params })
      .pipe(
        map((reservations) =>
          reservations.length > 0 ? reservations[0] : undefined
        ),
        catchError((error) => {
          if (error.status === 404) {
            console.warn(`Reservation for room ${roomNumber} not found.`);
            return of(undefined);
          }
          return this.handleError(error);
        })
      );
  }

  createReservation(
    reservationData: Omit<
      Reservation,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'customer'
      | 'room'
      | 'totalAmount'
      | 'depositAmount'
      | 'actualCheckIn'
      | 'actualCheckOut'
      | 'status'
    > & { status: number }
  ): Observable<Reservation> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<Reservation>(`${this.apiUrl}/Reservation`, reservationData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }


  updatestatus(
    reservationData: Partial<Reservation> & { id: number }
  ): Observable<ApiResponse<string>> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<ApiResponse<string>>(`${this.apiUrl}/Reservation/updateStatus`, reservationData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }


  updateCheckout(
    reservationData: Partial<Reservation> & { id: number }
  ): Observable<ApiResponse<string>> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<ApiResponse<string>>(`${this.apiUrl}/Reservation/updateStatus`, reservationData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }




  deleteReservation(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.apiUrl}/Reservation/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Billing operations
  getBillings(): Observable<Billing[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Billing[]>(`${this.apiUrl}/Billing`, { headers })
      .pipe(catchError(this.handleError));
  }

  getBillingById(id: number): Observable<Billing> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Billing>(`${this.apiUrl}/Billing/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  createBilling(
    billingData: Omit<Billing, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Billing> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<Billing>(`${this.apiUrl}/Billing`, billingData, { headers })
      .pipe(catchError(this.handleError));
  }

  updateBilling(
    billingData: Partial<Billing> & { id: number }
  ): Observable<Billing> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<Billing>(`${this.apiUrl}/Billing`, billingData, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteBilling(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.apiUrl}/Billing/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }


  // Payment operations
  getPayments(): Observable<Payment[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Payment[]>(`${this.apiUrl}/Payment`, { headers })
      .pipe(catchError(this.handleError));
  }

  getPaymentById(id: number): Observable<Payment> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Payment>(`${this.apiUrl}/Payment/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  processPayment(
    paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'processedAt'>
  ): Observable<Payment> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<Payment>(`${this.apiUrl}/Payment`, paymentData, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Posts a payment object to the backend Payment API.
   * Usage: pass the full payment object as in the curl example.
   */
  postPayment(payment: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/Payment`, payment, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Report operations
  getTotalRevenue(from?: string, to?: string): Observable<TotalRevenueReport> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }
    return this.http
      .get<TotalRevenueReport>(`${this.apiUrl}/Report/total-revenue`, {
        headers,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getTopBookedRooms(): Observable<TopBookedRoom[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<TopBookedRoom[]>(`${this.apiUrl}/Report/top-booked-rooms`, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  getCustomerSpending(): Observable<CustomerSpending[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<CustomerSpending[]>(`${this.apiUrl}/Report/customer-spending`, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  getOccupancyRate(from?: string, to?: string): Observable<OccupancyRate> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }
    return this.http
      .get<OccupancyRate>(`${this.apiUrl}/Report/occupancy-rate`, {
        headers,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  // Customer operations
  getCustomerById(id: number): Observable<Customer> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Customer>(`${this.apiUrl}/Customer/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
