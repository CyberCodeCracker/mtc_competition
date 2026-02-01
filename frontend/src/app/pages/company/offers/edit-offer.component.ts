import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../../core/services/offer.service';
import { Offer, OfferCategory, OfferStatus, CreateOfferData } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-edit-offer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Edit Offer</h2>
          <button class="close-btn" (click)="onCancel()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="title">Offer Title</label>
              <input type="text" id="title" formControlName="title" class="input-glass" placeholder="e.g. Senior Frontend Developer">
              <span class="error" *ngIf="editForm.get('title')?.touched && editForm.get('title')?.invalid">Title is required</span>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" formControlName="category" class="input-glass">
                <option value="PFE">PFE</option>
                <option value="SUMMER_INTERNSHIP">Summer Internship</option>
                <option value="JOB">Job</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" formControlName="status" class="input-glass">
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div class="form-group">
              <label for="location">Location</label>
              <input type="text" id="location" formControlName="location" class="input-glass" placeholder="e.g. Tunis, Sfax, Remote">
            </div>

            <div class="form-group">
              <label for="duration">Duration</label>
              <input type="text" id="duration" formControlName="duration" class="input-glass" placeholder="e.g. 6 months, Permanent">
            </div>

            <div class="form-group">
              <label for="salary">Salary Range (Optional)</label>
              <input type="text" id="salary" formControlName="salary" class="input-glass" placeholder="e.g. 1500 - 2000 TND">
            </div>

            <div class="form-group">
              <label for="deadline">Deadline</label>
              <input type="date" id="deadline" formControlName="deadline" class="input-glass">
            </div>

            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea id="description" formControlName="description" class="input-glass" rows="4" placeholder="Describe the role and responsibilities..."></textarea>
              <span class="error" *ngIf="editForm.get('description')?.touched && editForm.get('description')?.invalid">Description is required</span>
            </div>

            <div class="form-group full-width">
              <label for="requirements">Requirements</label>
              <textarea id="requirements" formControlName="requirements" class="input-glass" rows="4" placeholder="List technical requirements, experience, etc..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="onCancel()" [disabled]="isSubmitting()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="editForm.invalid || isSubmitting()">
              <app-loading-spinner *ngIf="isSubmitting()"></app-loading-spinner>
              {{ isSubmitting() ? 'Updating...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal {
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      color: white;
    }

    .close-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 0.5rem;
      transition: all 0.2s;
    }

    .close-btn:hover {
      color: white;
      transform: scale(1.1);
    }

    .modal-body {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .full-width {
      grid-column: span 2;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
    }

    .error {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.25rem;
    }

    .modal-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    textarea {
      resize: vertical;
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .full-width {
        grid-column: span 1;
      }
      .modal {
        max-height: 100vh;
        border-radius: 0;
      }
    }
  `]
})
export class EditOfferComponent implements OnInit {
  @Input({ required: true }) offer!: Offer;
  @Output() saved = new EventEmitter<Offer>();
  @Output() cancelled = new EventEmitter<void>();

  editForm!: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    let deadlineDate = '';
    if (this.offer.deadline) {
      try {
        const d = new Date(this.offer.deadline);
        if (!isNaN(d.getTime())) {
          deadlineDate = d.toISOString().split('T')[0];
        }
      } catch (e) {
        console.warn('Invalid deadline date:', this.offer.deadline);
      }
    }

    this.editForm = this.fb.group({
      title: [this.offer.title, [Validators.required]],
      category: [this.offer.category, [Validators.required]],
      status: [this.offer.status, [Validators.required]],
      description: [this.offer.description, [Validators.required]],
      requirements: [this.offer.requirements || ''],
      location: [this.offer.location || ''],
      duration: [this.offer.duration || ''],
      salary: [this.offer.salary || ''],
      deadline: [deadlineDate]
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.isSubmitting.set(true);
    const updateData: CreateOfferData = this.editForm.value;

    this.offerService.updateOffer(this.offer.id, updateData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.saved.emit(response.data);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error updating offer:', err);
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
