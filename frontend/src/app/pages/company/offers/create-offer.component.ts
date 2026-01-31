import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { OfferService } from '../../../core/services/offer.service';
import { OfferCategory, OfferStatus, CreateOfferData } from '../../../core/models';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Create Offer" 
      pageSubtitle="Post a new job opportunity"
      [showSearch]="false"
    ></app-navbar>

    <div class="create-offer-content">
      <div class="form-container glass-card">
        <form [formGroup]="offerForm" (ngSubmit)="onSubmit()">
          <!-- Basic Information -->
          <div class="form-section">
            <h3 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Basic Information
            </h3>
            
            <div class="form-group">
              <label for="title">Job Title *</label>
              <input type="text" id="title" formControlName="title" class="input-glass" 
                     placeholder="e.g., Software Engineering Intern">
              <div class="error-message" *ngIf="offerForm.get('title')?.touched && offerForm.get('title')?.invalid">
                Title is required
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Category *</label>
                <select id="category" formControlName="category" class="input-glass">
                  <option value="">Select Category</option>
                  <option value="PFE">PFE (End of Studies Project)</option>
                  <option value="SUMMER_INTERNSHIP">Summer Internship</option>
                  <option value="JOB">Full-time Job</option>
                </select>
                <div class="error-message" *ngIf="offerForm.get('category')?.touched && offerForm.get('category')?.invalid">
                  Please select a category
                </div>
              </div>

              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" formControlName="status" class="input-glass">
                  <option value="ACTIVE">Active (Visible to students)</option>
                  <option value="DRAFT">Draft (Not visible)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea id="description" formControlName="description" class="input-glass" rows="5"
                        placeholder="Describe the position, responsibilities, and what you're looking for..."></textarea>
              <div class="error-message" *ngIf="offerForm.get('description')?.touched && offerForm.get('description')?.invalid">
                Description is required (minimum 50 characters)
              </div>
            </div>

            <div class="form-group">
              <label for="requirements">Requirements</label>
              <textarea id="requirements" formControlName="requirements" class="input-glass" rows="4"
                        placeholder="Required skills, qualifications, experience..."></textarea>
            </div>
          </div>

          <!-- Details -->
          <div class="form-section">
            <h3 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Details
            </h3>

            <div class="form-row">
              <div class="form-group">
                <label for="location">Location</label>
                <input type="text" id="location" formControlName="location" class="input-glass" 
                       placeholder="e.g., Tunis, Tunisia or Remote">
              </div>

              <div class="form-group">
                <label for="duration">Duration</label>
                <input type="text" id="duration" formControlName="duration" class="input-glass" 
                       placeholder="e.g., 3 months, 6 months">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate">Start Date</label>
                <input type="date" id="startDate" formControlName="startDate" class="input-glass">
              </div>

              <div class="form-group">
                <label for="deadline">Application Deadline</label>
                <input type="date" id="deadline" formControlName="deadline" class="input-glass">
              </div>
            </div>

            <div class="form-group">
              <label for="salary">Salary / Compensation</label>
              <input type="text" id="salary" formControlName="salary" class="input-glass" 
                     placeholder="e.g., 1000 TND/month, Competitive, or Unpaid">
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn-glass" routerLink="/company/offers">
              Cancel
            </button>
            <button type="button" class="btn-secondary" (click)="saveAsDraft()" [disabled]="isSubmitting()">
              Save as Draft
            </button>
            <button type="submit" class="btn-primary" [disabled]="offerForm.invalid || isSubmitting()">
              <span *ngIf="isSubmitting()" class="spinner"></span>
              {{ isSubmitting() ? 'Publishing...' : 'Publish Offer' }}
            </button>
          </div>

          <!-- Error Message -->
          <div class="form-error glass-card" *ngIf="errorMessage()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {{ errorMessage() }}
          </div>
        </form>
      </div>

      <!-- Preview Panel -->
      <div class="preview-panel glass-card">
        <h3 class="preview-title">Preview</h3>
        <div class="preview-content">
          <div class="preview-header">
            <span class="badge" [ngClass]="{
              'badge-active': offerForm.value.category === 'PFE',
              'badge-pending': offerForm.value.category === 'SUMMER_INTERNSHIP',
              'badge-accepted': offerForm.value.category === 'JOB'
            }">{{ getCategoryLabel(offerForm.value.category) || 'Category' }}</span>
            <span class="badge" [ngClass]="{
              'badge-active': offerForm.value.status === 'ACTIVE',
              'badge-pending': offerForm.value.status === 'DRAFT'
            }">{{ offerForm.value.status || 'ACTIVE' }}</span>
          </div>
          <h2 class="preview-job-title">{{ offerForm.value.title || 'Job Title' }}</h2>
          <p class="preview-description">{{ offerForm.value.description || 'Description will appear here...' }}</p>
          
          <div class="preview-meta">
            <div class="meta-item" *ngIf="offerForm.value.location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ offerForm.value.location }}
            </div>
            <div class="meta-item" *ngIf="offerForm.value.duration">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ offerForm.value.duration }}
            </div>
            <div class="meta-item" *ngIf="offerForm.value.salary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              {{ offerForm.value.salary }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .create-offer-content { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; max-width: 1400px; }
    .form-container { padding: 2rem; }
    .form-section { margin-bottom: 2rem; }
    .section-title { display: flex; align-items: center; gap: 0.75rem; font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0 0 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .section-title svg { color: #00d4aa; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .input-glass { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.75rem 1rem; color: white; font-size: 0.9375rem; transition: all 0.2s; }
    .input-glass:focus { outline: none; border-color: #00d4aa; box-shadow: 0 0 0 3px rgba(0,212,170,0.15); }
    .input-glass::placeholder { color: rgba(255,255,255,0.3); }
    textarea.input-glass { resize: vertical; min-height: 100px; }
    select.input-glass { cursor: pointer; }
    select.input-glass option { background: #1e293b; color: white; }
    .error-message { font-size: 0.8125rem; color: #f87171; margin-top: 0.375rem; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .btn-secondary { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-secondary:hover { background: rgba(255,255,255,0.15); }
    .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; margin-right: 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .form-error { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; margin-top: 1.5rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
    
    /* Preview Panel */
    .preview-panel { padding: 1.5rem; position: sticky; top: 1rem; align-self: start; }
    .preview-title { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1.5rem; }
    .preview-content { }
    .preview-header { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .preview-job-title { font-family: 'Outfit', sans-serif; font-size: 1.375rem; font-weight: 600; color: white; margin: 0 0 1rem; min-height: 2rem; }
    .preview-description { font-size: 0.875rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 1.5rem; min-height: 60px; white-space: pre-wrap; }
    .preview-meta { display: flex; flex-direction: column; gap: 0.75rem; }
    .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: rgba(255,255,255,0.6); }
    .meta-item svg { color: #00d4aa; }
    
    @media (max-width: 1024px) {
      .create-offer-content { grid-template-columns: 1fr; }
      .preview-panel { display: none; }
    }
    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column; }
      .form-actions button { width: 100%; }
    }
  `]
})
export class CreateOfferComponent {
  isSubmitting = signal(false);
  errorMessage = signal('');
  
  offerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private router: Router
  ) {
    this.offerForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      requirements: [''],
      location: [''],
      duration: [''],
      startDate: [''],
      deadline: [''],
      salary: [''],
      status: ['ACTIVE']
    });
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'PFE': return 'PFE';
      case 'SUMMER_INTERNSHIP': return 'Internship';
      case 'JOB': return 'Job';
      default: return category || '';
    }
  }

  saveAsDraft(): void {
    this.offerForm.patchValue({ status: 'DRAFT' });
    this.submitOffer();
  }

  onSubmit(): void {
    if (this.offerForm.valid) {
      this.offerForm.patchValue({ status: 'ACTIVE' });
      this.submitOffer();
    } else {
      this.markFormGroupTouched(this.offerForm);
    }
  }

  private submitOffer(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValue = this.offerForm.value;
    const offerData: CreateOfferData = {
      title: formValue.title,
      category: formValue.category as OfferCategory,
      description: formValue.description,
      requirements: formValue.requirements || undefined,
      location: formValue.location || undefined,
      duration: formValue.duration || undefined,
      startDate: formValue.startDate || undefined,
      deadline: formValue.deadline || undefined,
      salary: formValue.salary || undefined,
      status: formValue.status as OfferStatus
    };

    this.offerService.createOffer(offerData).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.router.navigate(['/company/offers']);
        } else {
          this.errorMessage.set(response.message || 'Failed to create offer');
        }
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.error?.message || 'An error occurred while creating the offer');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
