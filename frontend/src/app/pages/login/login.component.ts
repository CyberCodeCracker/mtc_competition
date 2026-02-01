import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ParticlesComponent } from '../../shared/components/particles/particles.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ParticlesComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="login-page">
      <app-particles></app-particles>
      
      <div class="login-container">
        <!-- Left Side - Branding -->
        <div class="login-branding">
          <div class="branding-content">
            <img src="assets/enet.png" alt="ENET'COM" class="brand-title-img" />
            <p class="brand-description">
              Connecting students with opportunities. Find your dream internship, PFE, or job through our platform.
            </p>
            
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Browse PFE & Internship offers</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Connect with top companies</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Track your applications</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="login-form-container">
          <div class="login-form-wrapper glass-card">
            <div class="form-header">
              <h2 class="form-title">Welcome Back</h2>
              <p class="form-subtitle">Sign in to continue to your dashboard</p>
            </div>

            <div class="message-box error" *ngIf="errorMessage">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errorMessage }}
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <div class="input-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 0.5rem;">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input 
                    type="email" 
                    id="email" 
                    formControlName="email" 
                    class="input-glass"
                    placeholder="Enter your email"
                    autocomplete="email"
                  />
                </div>
                <span class="error-text" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']">
                  Email is required
                </span>
                <span class="error-text" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']">
                  Please enter a valid email
                </span>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">Password</label>

                <div class="input-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 0.5rem;">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    id="password"
                    formControlName="password"
                    class="input-glass"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                  />
                  <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                    <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
                <span class="error-text" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">
                  Password is required
                </span>
              </div>

              <button 
                type="submit" 
                class="btn-primary submit-btn"
                [disabled]="loginForm.invalid || isLoading"
              >
                <app-loading-spinner *ngIf="isLoading" [small]="true" [message]="''"></app-loading-spinner>
                <span *ngIf="!isLoading">Sign In</span>
              </button>
            </form>

            <div class="demo-credentials">
              <p class="demo-title">Demo Credentials:</p>
              <div class="demo-list">
                <button (click)="fillDemo('admin')" class="demo-btn">Admin</button>
                <button (click)="fillDemo('company')" class="demo-btn">Company</button>
                <button (click)="fillDemo('student')" class="demo-btn">Student</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .login-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      max-width: 1200px;
      width: 100%;
    }

    @media (max-width: 968px) {
      .login-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .login-branding {
        display: none;
      }
    }

    .login-branding {
      display: flex;
      align-items: center;
    }

    .branding-content {
      padding: 2rem;
    }

    .brand-logo {
      width: 110px;
      margin-bottom: 1.5rem;
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .brand-title-img {
      width: auto;
      max-width: 300px;
      height: auto;
      margin-bottom: 1rem;
    }

    .brand-description {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .feature-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(246, 139, 30, 0.2), rgba(0, 61, 124, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-500);
    }

    .login-form-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-form-wrapper {
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
    }

    .message-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .message-box.error {
      background: rgba(244, 67, 54, 0.1);
      border: 1px solid rgba(244, 67, 54, 0.3);
      color: #f44336;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }

    .input-wrapper {
      position: relative;
      width: 100%;
    }

    .input-wrapper svg {
      position: absolute;
      left: 0rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.4);
      pointer-events: none;
      z-index: 2;
    }

    .input-wrapper .input-glass {
      padding-left: 2.75rem;
      padding-right: 2.75rem;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      padding: 8px;
      display: flex;
      z-index: 3;
      transition: color 0.2s;
    }

    .toggle-password:hover {
      color: var(--secondary-500);
    }

    .error-text {
      display: block;
      margin-top: 0.375rem;
      font-size: 0.75rem;
      color: #f44336;
    }

    .submit-btn {
      width: 100%;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .demo-credentials {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .demo-title {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      margin-bottom: 0.75rem;
    }

    .demo-list {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .demo-btn {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .demo-btn:hover {
      background: rgba(246, 139, 30, 0.1);
      border-color: rgba(246, 139, 30, 0.3);
      color: var(--secondary-500);
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Check if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.authService.getDashboardRoute()]);
    }

    // Check for query param message
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.errorMessage = params['message'];
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.authService.getDashboardRoute();
          this.router.navigate([returnUrl]);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  fillDemo(role: 'admin' | 'company' | 'student'): void {
    const credentials: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@enetcom.tn', password: 'admin123' },
      company: { email: 'contact@technosoft.tn', password: 'company123' },
      student: { email: 'ahmed.benali@enetcom.tn', password: 'student123' },
    };

    this.loginForm.patchValue(credentials[role]);
  }
}
