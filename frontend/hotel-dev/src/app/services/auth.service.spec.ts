import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890'
    };

    const mockResponse = {
      success: true,
      message: 'User registered successfully'
    };

    service.register(testUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testUser);
    req.flush(mockResponse);
  });

  it('should handle registration error', () => {
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890'
    };

    const mockError = {
      status: 400,
      statusText: 'Bad Request',
      error: { message: 'Email already exists' }
    };

    service.register(testUser).subscribe({
      error: (error) => {
        expect(error.message).toContain('Server Error: 400');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/register`);
    req.flush(mockError, mockError);
  });

  it('should login a user', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse = {
      success: true,
      data: 'mock-token'
    };

    service.login(credentials.email, credentials.password).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('mock-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const mockError = {
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Invalid credentials' }
    };

    service.login(credentials.email, credentials.password).subscribe({
      error: (error) => {
        expect(error.message).toContain('Server Error: 401');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/login`);
    req.flush(mockError, mockError);
  });

  it('should logout user', () => {
    localStorage.setItem('token', 'mock-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should check if user is logged in', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();

    localStorage.setItem('token', 'mock-token');
    expect(service.isLoggedIn()).toBeTrue();
  });
}); 