import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    };

    return this.http.get<{
      success: Boolean;
      message: string;
      data: UserDisplay[]
    }>(`${this.apiUrl}/Auth`)
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
