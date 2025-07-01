import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
    expect(component.registerForm.get('phone')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();
    expect(form.get('username')?.errors?.['required']).toBeTruthy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
    expect(form.get('password')?.errors?.['required']).toBeTruthy();
    expect(form.get('firstName')?.errors?.['required']).toBeTruthy();
    expect(form.get('lastName')?.errors?.['required']).toBeTruthy();
    expect(form.get('phone')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate phone number format', () => {
    const phoneControl = component.registerForm.get('phone');
    phoneControl?.setValue('123'); // Too short
    expect(phoneControl?.errors?.['pattern']).toBeTruthy();

    phoneControl?.setValue('1234567890'); // Valid 10-digit number
    expect(phoneControl?.errors?.['pattern']).toBeFalsy();
  });

  it('should handle successful registration', () => {
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890'
    };

    component.registerForm.patchValue(testUser);
    authService.register.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(testUser);
    expect(toastrService.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
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

    component.registerForm.patchValue(testUser);
    authService.register.and.returnValue(throwError(() => ({
      error: { message: 'Registration failed' }
    })));

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(testUser);
    expect(toastrService.error).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(authService.register).not.toHaveBeenCalled();
    expect(toastrService.error).toHaveBeenCalled();
  });
});
