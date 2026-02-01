import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Company Profile" 
      pageSubtitle="Manage your company information"
      [showSearch]="false"
    ></app-navbar>

    <div class="profile-content">
      <app-loading-spinner *ngIf="isLoading()" message="Loading profile..."></app-loading-spinner>

      <div *ngIf="!isLoading()" class="profile-grid">
        <!-- Profile Card -->
        <div class="profile-card glass-card">
          <div class="profile-header">
            <div class="company-logo-large">
              {{ getInitials(company()?.name) }}
            </div>
            <div class="company-info">
              <h1>{{ company()?.name }}</h1>
              <p class="sector">{{ company()?.sector }}</p>
              <span class="badge" [ngClass]="{ 'badge-active': company()?.isApproved, 'badge-pending': !company()?.isApproved }">
                {{ company()?.isApproved ? 'Approved' : 'Pending Approval' }}
              </span>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat">
              <span class="value">{{ company()?._count?.offers || 0 }}</span>
              <span class="label">Offers Posted</span>
            </div>
            <div class="stat">
              <span class="value">{{ formatDate(company()?.createdAt) }}</span>
              <span class="label">Member Since</span>
            </div>
          </div>

          <div class="profile-links" *ngIf="company()?.website || company()?.phone">
            <a *ngIf="company()?.website" [href]="company()?.website" target="_blank" class="link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Website
            </a>
            <a *ngIf="company()?.phone" [href]="'tel:' + company()?.phone" class="link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"></path>
              </svg>
              {{ company()?.phone }}
            </a>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="edit-form glass-card">
          <h2 class="form-title">Edit Profile</h2>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="name">Company Name *</label>
              <input type="text" id="name" formControlName="name" class="input-glass">
              <div class="error-message" *ngIf="profileForm.get('name')?.touched && profileForm.get('name')?.invalid">
                Company name is required
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" formControlName="email" class="input-glass" readonly>
              <span class="help-text">Email cannot be changed</span>
            </div>

            <div class="form-group">
              <label for="sector">Sector *</label>
              <input type="text" id="sector" formControlName="sector" class="input-glass" 
                     placeholder="e.g., Technology, Finance, Healthcare">
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" formControlName="description" class="input-glass" rows="4"
                        placeholder="Tell students about your company..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="website">Website</label>
                <input type="url" id="website" formControlName="website" class="input-glass" 
                       placeholder="https://yourcompany.com">
              </div>

              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" formControlName="phone" class="input-glass" 
                       placeholder="+216 XX XXX XXX">
              </div>
            </div>

            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" id="address" formControlName="address" class="input-glass" 
                     placeholder="Company address">
            </div>

            <div class="form-actions">
              <button type="button" class="btn-glass" (click)="resetForm()">Reset</button>
              <button type="submit" class="btn-primary" [disabled]="profileForm.invalid || isSubmitting()">
                <span *ngIf="isSubmitting()" class="spinner"></span>
                {{ isSubmitting() ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>

            <!-- Success/Error Messages -->
            <div class="form-message success" *ngIf="successMessage()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ successMessage() }}
            </div>
            <div class="form-message error" *ngIf="errorMessage()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {{ errorMessage() }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .profile-content { max-width: 1200px; }
    .profile-grid { display: grid; grid-template-columns: 360px 1fr; gap: 1.5rem; align-items: start; }
    
    .profile-card { padding: 2rem; position: sticky; top: 1rem; }
    .profile-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 2rem; }
    .company-logo-large { width: 100px; height: 100px; border-radius: 20px; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 700; color: white; margin-bottom: 1rem; }
    .company-info h1 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; margin: 0 0 0.375rem; }
    .sector { color: rgba(255,255,255,0.6); margin: 0 0 0.75rem; }
    
    .profile-stats { display: flex; justify-content: center; gap: 2rem; padding: 1.5rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; }
    .stat { text-align: center; }
    .stat .value { display: block; font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: #00d4aa; }
    .stat .label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
    
    .profile-links { display: flex; flex-direction: column; gap: 0.75rem; }
    .link-item { display: flex; align-items: center; gap: 0.75rem; color: #00d4aa; text-decoration: none; font-size: 0.9375rem; padding: 0.75rem; background: rgba(0,212,170,0.05); border-radius: 8px; transition: all 0.2s; }
    .link-item:hover { background: rgba(0,212,170,0.1); }
    
    .edit-form { padding: 2rem; }
    .form-title { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; color: white; margin: 0 0 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .input-glass { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.75rem 1rem; color: white; font-size: 0.9375rem; transition: all 0.2s; }
    .input-glass:focus { outline: none; border-color: #00d4aa; box-shadow: 0 0 0 3px rgba(0,212,170,0.15); }
    .input-glass::placeholder { color: rgba(255,255,255,0.3); }
    .input-glass:read-only { opacity: 0.6; cursor: not-allowed; }
    textarea.input-glass { resize: vertical; min-height: 100px; }
    .help-text { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 0.25rem; }
    .error-message { font-size: 0.8125rem; color: #f87171; margin-top: 0.375rem; }
    
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 1.5rem; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; margin-right: 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .form-message { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 8px; margin-top: 1.5rem; font-size: 0.9375rem; }
    .form-message.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; }
    .form-message.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
    
    @media (max-width: 968px) {
      .profile-grid { grid-template-columns: 1fr; }
      .profile-card { position: static; }
    }
    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column; }
      .form-actions button { width: 100%; }
    }
  `]
})
export class CompanyProfileComponent implements OnInit {
  isLoading = signal(true);
  isSubmitting = signal(false);
  company = signal<Company | null>(null);
  successMessage = signal('');
  errorMessage = signal('');
  
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private companyService: CompanyService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      sector: ['', Validators.required],
      description: [''],
      website: [''],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const user = this.authService.currentUser();
    if (user?.id) {
      this.companyService.getCompanyById(user.id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.company.set(response.data);
            this.populateForm(response.data);
          }
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.isLoading.set(false);
    }
  }

  populateForm(company: Company): void {
    this.profileForm.patchValue({
      name: company.name,
      email: company.email,
      sector: company.sector,
      description: company.description || '',
      website: company.website || '',
      phone: company.phone || '',
      address: company.address || ''
    });
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  resetForm(): void {
    const company = this.company();
    if (company) {
      this.populateForm(company);
    }
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.company()) {
      this.isSubmitting.set(true);
      this.successMessage.set('');
      this.errorMessage.set('');

      const formValue = this.profileForm.getRawValue();
      const updateData = {
        name: formValue.name,
        sector: formValue.sector,
        description: formValue.description || undefined,
        website: formValue.website || undefined,
        phone: formValue.phone || undefined,
        address: formValue.address || undefined
      };

      this.companyService.updateCompany(this.company()!.id, updateData).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          if (response.success) {
            this.company.set(response.data!);
            this.successMessage.set('Profile updated successfully!');
          } else {
            this.errorMessage.set(response.message || 'Failed to update profile');
          }
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(error.error?.message || 'An error occurred while updating profile');
        }
      });
    }
  }
}
