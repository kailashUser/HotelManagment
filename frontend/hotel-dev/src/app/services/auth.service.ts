import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, timeout, retry } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) {}


  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Auth/login`, { email, password })
      .pipe(
        timeout(10000),
        retry(1),
        tap((response) => {
          if (response?.success) {
            const token = response.data || response.token;
            console.log(response);
            if (token) {
              localStorage.setItem('token', token);

              const decoded: any = jwtDecode(token);
              const role =
                decoded[
                  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ];
              const userId =
                decoded[
                  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                ];
              const username =
                decoded[
                  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                ];

              localStorage.setItem('role', role);
              localStorage.setItem('userId', userId);
              localStorage.setItem('username', username);

              this.authStatusSubject.next(true);
            }
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }


  register(userData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Auth/register`, userData)
      .pipe(timeout(15000), retry(1), catchError(this.handleError.bind(this)));
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    this.authStatusSubject.next(false);
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const raw = localStorage.getItem('role');
    return raw === null ? null : this.getRoleName(raw);
  }

  getRawRoleId(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  
  getUserProfile(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return throwError(() => new Error('User ID not found'));

    return this.http.get<any>(`${this.apiUrl}/Auth/user/${userId}`).pipe(
      tap((profile) => {
        const username = profile?.firstName || profile?.username;
        if (username) this.setUsername(username);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private getRoleName(roleId: string): string {
    switch (roleId.toString()) {
      case '0':
        return 'Admin';
      case '1':
        return 'Manager';
      case '2':
        return 'Clerk';
      case '3':
        return 'Customer';
      case '4':
        return 'Travel Company';
      default:
        return 'Unknown';
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot connect to server.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Invalid input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Check credentials.';
          break;
        case 403:
          errorMessage = 'Access denied.';
          break;
        case 404:
          errorMessage = 'Not found.';
          break;
        case 409:
          errorMessage = 'Conflict. Possibly already exists.';
          break;
        case 500:
          errorMessage = 'Server error.';
          break;
        default:
          errorMessage = error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
