import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Offer, OfferCategory } from '../../../core/models';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      [pageTitle]="offer()?.title || 'Offer Details'" 
      [pageSubtitle]="offer()?.company?.name || ''"
      [showSearch]="false"
    ></app-navbar>

    <div class="offer-detail-content">
      <app-loading-spinner *ngIf="isLoading()" message="Loading offer..."></app-loading-spinner>

      <div *ngIf="!isLoading() && offer()">
        <div class="detail-grid">
          <!-- Main Content -->
          <div class="main-content">
            <div class="glass-card detail-card">
              <div class="detail-header">
                <div class="badges">
                  <span class="badge" [ngClass]="{
                    'badge-active': offer()!.category === 'PFE',
                    'badge-pending': offer()!.category === 'SUMMER_INTERNSHIP',
                    'badge-accepted': offer()!.category === 'JOB'
                  }">{{ getCategoryLabel(offer()!.category) }}</span>
                  <span class="badge" [ngClass]="{
                    'badge-active': offer()!.status === 'ACTIVE',
                    'badge-closed': offer()!.status === 'CLOSED'
                  }">{{ offer()!.status }}</span>
                </div>
                <h1 class="detail-title">{{ offer()!.title }}</h1>
                <p class="detail-company">{{ offer()!.company?.name }}</p>
              </div>

              <div class="detail-meta">
                <div class="meta-item" *ngIf="offer()!.location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{{ offer()!.location }}</span>
                </div>
                <div class="meta-item" *ngIf="offer()!.duration">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{{ offer()!.duration }}</span>
                </div>
                <div class="meta-item" *ngIf="offer()!.salary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>{{ offer()!.salary }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3>Description</h3>
                <p>{{ offer()!.description }}</p>
              </div>

              <div class="detail-section" *ngIf="offer()!.requirements">
                <h3>Requirements</h3>
                <p>{{ offer()!.requirements }}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="sidebar-content">
            <div class="glass-card apply-card">
              <h3>Apply for this position</h3>
              
              <div *ngIf="offer()!.hasApplied" class="already-applied">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>You have already applied</span>
                <span class="badge" [ngClass]="{
                  'badge-pending': offer()!.applicationStatus === 'PENDING',
                  'badge-accepted': offer()!.applicationStatus === 'ACCEPTED',
                  'badge-rejected': offer()!.applicationStatus === 'REJECTED'
                }">{{ offer()!.applicationStatus }}</span>
              </div>

              <form *ngIf="!offer()!.hasApplied && offer()!.status === 'ACTIVE'" (ngSubmit)="submitApplication()">
                <div class="form-group">
                  <label>Cover Letter (Optional)</label>
                  <textarea 
                    [(ngModel)]="coverLetter" 
                    name="coverLetter"
                    class="input-glass" 
                    rows="5" 
                    placeholder="Write a brief cover letter..."
                  ></textarea>
                </div>
                <button type="submit" class="btn-primary w-full" [disabled]="isSubmitting()">
                  {{ isSubmitting() ? 'Submitting...' : 'Submit Application' }}
                </button>
              </form>

              <div *ngIf="offer()!.status !== 'ACTIVE'" class="closed-message">
                <p>This position is no longer accepting applications</p>
              </div>
            </div>

            <div class="glass-card info-card">
              <h3>Important Dates</h3>
              <div class="info-row">
                <span class="info-label">Posted</span>
                <span class="info-value">{{ offer()!.postedDate | date:'mediumDate' }}</span>
              </div>
              <div class="info-row" *ngIf="offer()!.deadline">
                <span class="info-label">Deadline</span>
                <span class="info-value">{{ offer()!.deadline | date:'mediumDate' }}</span>
              </div>
              <div class="info-row" *ngIf="offer()!.startDate">
                <span class="info-label">Start Date</span>
                <span class="info-value">{{ offer()!.startDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
        </div>

        <a routerLink="/student/offers" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"></path></svg>
          Back to Offers
        </a>
      </div>
    </div>
  `,
  styles: [`
    .offer-detail-content { max-width: 1200px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; margin-bottom: 1.5rem; }
    @media (max-width: 968px) { .detail-grid { grid-template-columns: 1fr; } }
    .detail-card { padding: 2rem; }
    .detail-header { margin-bottom: 1.5rem; }
    .badges { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .detail-title { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; color: white; margin: 0 0 0.5rem; }
    .detail-company { font-size: 1rem; color: #00d4aa; margin: 0; }
    .detail-meta { display: flex; flex-wrap: wrap; gap: 1.5rem; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; }
    .meta-item { display: flex; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.8); }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h3 { font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0 0 0.75rem; }
    .detail-section p { color: rgba(255,255,255,0.8); line-height: 1.7; margin: 0; white-space: pre-wrap; }
    .apply-card, .info-card { padding: 1.5rem; margin-bottom: 1rem; }
    .apply-card h3, .info-card h3 { font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0 0 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    .form-group textarea { width: 100%; resize: vertical; }
    .w-full { width: 100%; }
    .already-applied { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; background: rgba(0,212,170,0.1); border-radius: 10px; text-align: center; color: #00d4aa; }
    .closed-message { text-align: center; padding: 1rem; color: rgba(255,255,255,0.5); }
    .info-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: rgba(255,255,255,0.6); }
    .info-value { color: white; font-weight: 500; }
    .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.3s; }
    .back-link:hover { color: #00d4aa; }
  `]
})
export class OfferDetailComponent implements OnInit {
  isLoading = signal(true);
  isSubmitting = signal(false);
  offer = signal<Offer | null>(null);
  coverLetter = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOffer(+id);
    }
  }

  loadOffer(id: number): void {
    this.offerService.getOfferById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.offer.set(response.data!);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/student/offers']);
      }
    });
  }

  submitApplication(): void {
    if (!this.offer()) return;
    
    this.isSubmitting.set(true);
    this.applicationService.createApplication({
      offerId: this.offer()!.id,
      coverLetter: this.coverLetter || undefined
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadOffer(this.offer()!.id);
        }
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  getCategoryLabel(category: OfferCategory): string {
    switch (category) {
      case OfferCategory.PFE: return 'PFE';
      case OfferCategory.SUMMER_INTERNSHIP: return 'Internship';
      case OfferCategory.JOB: return 'Job';
      default: return category;
    }
  }
}
