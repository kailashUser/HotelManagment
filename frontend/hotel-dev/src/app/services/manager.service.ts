import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Interfaces
interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Room {
  id: number;
  number: string;
  type: string;
  status: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RevenueData {
  totalRevenue: number;
  roomRevenue: number;
  serviceRevenue: number;
  period: string;
  details: {
    date: string;
    amount: number;
    type: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  // Staff Management
  getStaffMembers(): Observable<StaffMember[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<StaffMember[]>(`${this.apiUrl}/Manager/staff`, { headers })
      .pipe(catchError(this.handleError));
  }

  getStaffMemberById(id: number): Observable<StaffMember> {
    const headers = this.getAuthHeaders();
    return this.http.get<StaffMember>(`${this.apiUrl}/Manager/staff/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  addStaffMember(staffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>): Observable<StaffMember> {
    const headers = this.getAuthHeaders();
    return this.http.post<StaffMember>(`${this.apiUrl}/Manager/staff`, staffData, { headers })
      .pipe(catchError(this.handleError));
  }

  updateStaffMember(id: number, staffData: Partial<StaffMember>): Observable<StaffMember> {
    const headers = this.getAuthHeaders();
    return this.http.put<StaffMember>(`${this.apiUrl}/Manager/staff/${id}`, staffData, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteStaffMember(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/Manager/staff/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Room Management
  getRooms(): Observable<Room[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Room[]>(`${this.apiUrl}/Manager/rooms`, { headers })
      .pipe(catchError(this.handleError));
  }

  getRoomById(id: number): Observable<Room> {
    const headers = this.getAuthHeaders();
    return this.http.get<Room>(`${this.apiUrl}/Manager/rooms/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  addRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Observable<Room> {
    const headers = this.getAuthHeaders();
    return this.http.post<Room>(`${this.apiUrl}/Manager/rooms`, roomData, { headers })
      .pipe(catchError(this.handleError));
  }

  updateRoom(id: number, roomData: Partial<Room>): Observable<Room> {
    const headers = this.getAuthHeaders();
    return this.http.put<Room>(`${this.apiUrl}/Manager/rooms/${id}`, roomData, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteRoom(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/Manager/rooms/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Revenue Management
  getRevenueData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Observable<RevenueData> {
    const headers = this.getAuthHeaders();
    return this.http.get<RevenueData>(`${this.apiUrl}/Manager/revenue`, {
      headers,
      params: { period }
    }).pipe(catchError(this.handleError));
  }

  getRevenueByDateRange(startDate: string, endDate: string): Observable<RevenueData> {
    const headers = this.getAuthHeaders();
    return this.http.get<RevenueData>(`${this.apiUrl}/Manager/revenue/range`, {
      headers,
      params: { startDate, endDate }
    }).pipe(catchError(this.handleError));
  }

  // Additional Manager Operations
  getOccupancyRate(): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.apiUrl}/Manager/occupancy-rate`, { headers })
      .pipe(catchError(this.handleError));
  }

  getCustomerSatisfaction(): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.apiUrl}/Manager/customer-satisfaction`, { headers })
      .pipe(catchError(this.handleError));
  }

  getMaintenanceRequests(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/Manager/maintenance-requests`, { headers })
      .pipe(catchError(this.handleError));
  }
} 