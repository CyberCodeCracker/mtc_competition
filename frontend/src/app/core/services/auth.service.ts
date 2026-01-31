import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  User,
  UserRole,
  JwtPayload,
  RegisterStudentData,
  RegisterCompanyData,
  RegisterAdminData,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private isLoadingSignal = signal<boolean>(false);

  // Computed signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === UserRole.ADMIN);
  readonly isCompany = computed(() => this.currentUserSignal()?.role === UserRole.COMPANY);
  readonly isStudent = computed(() => this.currentUserSignal()?.role === UserRole.STUDENT);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr && !this.isTokenExpired(token)) {
      try {
        const user = JSON.parse(userStr) as User;
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch {
        this.clearAuth();
      }
    } else {
      this.clearAuth();
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.storeAuth(response.data);
        }
      }),
      catchError((error) => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      }),
      tap(() => this.isLoadingSignal.set(false))
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    return this.http.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${this.apiUrl}/refresh-token`,
      { refreshToken }
    ).pipe(
      tap((response) => {
        if (response.success && response.data) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  getProfile(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/profile`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          const user = this.currentUserSignal();
          if (user) {
            this.currentUserSignal.set({ ...user, ...response.data });
          }
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  // Admin-only registration methods
  registerStudent(data: RegisterStudentData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/register/student`, data);
  }

  registerCompany(data: RegisterCompanyData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/register/company`, data);
  }

  registerAdmin(data: RegisterAdminData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/register/admin`, data);
  }

  // Token helpers
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private storeAuth(data: LoginResponse): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    this.currentUserSignal.set(data.user);
    this.isAuthenticatedSignal.set(true);
  }

  private clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  // Get dashboard route based on role
  getDashboardRoute(): string {
    const user = this.currentUserSignal();
    if (!user) return '/login';

    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.COMPANY:
        return '/company';
      case UserRole.STUDENT:
        return '/student';
      default:
        return '/login';
    }
  }
}
