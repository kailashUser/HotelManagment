import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDisplay } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  // getting all the users from auth end point
  getAllUsers(): Observable<UserDisplay[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    });

    return this.http.get<{
      success: Boolean;
      message: string;
      data: UserDisplay[]
    }>(`${this.apiUrl}/Auth`, { headers })
      .pipe(
        map((res) => res.data.map((user: UserDisplay) => {
          const typeString = this.mapUserRole(user.roleId);

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: typeString,
            roleId: user.roleId,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            isActive: user.isActive
          };
        })
        )
      )
  }

  
  create(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });

    return this.http.post<any>(`${this.apiUrl}/Auth/register`, userData, { headers })
      .pipe(
        catchError((error) => {
          console.error('User registration error:', error);

          let errorMessage = 'User registration failed.';

          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.error?.errors) {
            // Handle validation errors from server
            const errors = Object.values(error.error.errors).flat();
            errorMessage = errors.join(', ');
          } else if (error?.message) {
            errorMessage = error.message;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // update user

  updateUser(id: number, user: UserDisplay): Observable<UserDisplay> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    });

    return this.http.put<UserDisplay>(`${this.apiUrl}/Auth/${id}`, user, { headers });

  }

  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
    });


    return this.http.delete(`${this.apiUrl}/Auth/${id}`, { headers });
  }
  // maping user role
  private mapUserRole(role: number): string {
    const roleMap = [
      'Admin',
      'Manager',
      'Clerk',
      'Customer',
      'TravelCompany',
    ]
    return roleMap[role] ?? 'Customer'
  }
}
