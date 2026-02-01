import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Offer, Application, ApplicationStatus, OfferCategory } from '../../../core/models';

@Component({
  selector: 'app-company-offer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      [pageTitle]="offer()?.title || 'Offer Details'" 
      pageSubtitle="Manage applications for this offer"
      [showSearch]="false"
    ></app-navbar>

    <app-loading-spinner *ngIf="isLoading()" message="Loading offer details..."></app-loading-spinner>

    <div class="offer-detail-content" *ngIf="!isLoading() && offer()">
      <!-- Offer Summary -->
      <div class="offer-summary glass-card">
        <div class="summary-header">
          <div class="summary-badges">
            <span class="badge" [ngClass]="{
              'badge-active': offer()?.category === 'PFE',
              'badge-pending': offer()?.category === 'SUMMER_INTERNSHIP',
              'badge-accepted': offer()?.category === 'JOB'
            }">{{ getCategoryLabel(offer()?.category!) }}</span>
            <span class="badge" [ngClass]="{
              'badge-active': offer()?.status === 'ACTIVE',
              'badge-closed': offer()?.status === 'CLOSED',
              'badge-pending': offer()?.status === 'DRAFT'
            }">{{ offer()?.status }}</span>
          </div>
          <button class="btn-glass" routerLink="/company/offers">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Offers
          </button>
        </div>
        
        <h1 class="offer-title">{{ offer()?.title }}</h1>
        
        <div class="offer-meta">
          <span *ngIf="offer()?.location" class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {{ offer()?.location }}
          </span>
          <span *ngIf="offer()?.duration" class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ offer()?.duration }}
          </span>
          <span *ngIf="offer()?.salary" class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            {{ offer()?.salary }}
          </span>
          <span class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Posted: {{ offer()?.postedDate | date:'mediumDate' }}
          </span>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-value">{{ applications().length }}</span>
            <span class="stat-label">Total Applications</span>
          </div>
          <div class="stat-card">
            <span class="stat-value pending">{{ getStatusCount(ApplicationStatus.PENDING) }}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat-card">
            <span class="stat-value accepted">{{ getStatusCount(ApplicationStatus.ACCEPTED) }}</span>
            <span class="stat-label">Accepted</span>
          </div>
          <div class="stat-card">
            <span class="stat-value rejected">{{ getStatusCount(ApplicationStatus.REJECTED) }}</span>
            <span class="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      <!-- Applications Section -->
      <div class="applications-section">
        <div class="section-header">
          <h2>Applications</h2>
          <div class="filter-group">
            <select [(ngModel)]="statusFilter" (change)="applyFilter()" class="input-glass">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <!-- Applications List -->
        <div class="applications-list" *ngIf="filteredApplications().length > 0">
          <div class="application-card glass-card" *ngFor="let app of filteredApplications()">
            <div class="applicant-info">
              <div class="avatar">
                {{ getInitials(app.student?.firstName, app.student?.lastName) }}
              </div>
              <div class="info">
                <h3>{{ app.student?.firstName }} {{ app.student?.lastName }}</h3>
                <p class="email">{{ app.student?.email }}</p>
                <div class="tags">
                  <span class="tag">{{ app.student?.studyLevel }}</span>
                  <span class="tag">{{ app.student?.groupName }}</span>
                </div>
              </div>
            </div>
            
            <div class="application-meta">
              <span class="applied-date">Applied: {{ app.applicationDate | date:'mediumDate' }}</span>
              <span class="badge" [ngClass]="{
                'badge-pending': app.status === ApplicationStatus.PENDING,
                'badge-accepted': app.status === ApplicationStatus.ACCEPTED,
                'badge-rejected': app.status === ApplicationStatus.REJECTED
              }">{{ app.status }}</span>
            </div>

            <div class="cover-letter" *ngIf="app.coverLetter">
              <h4>Cover Letter</h4>
              <p>{{ app.coverLetter }}</p>
            </div>

            <div class="action-buttons" *ngIf="app.status === ApplicationStatus.PENDING">
              <button class="btn-accept" (click)="updateStatus(app, ApplicationStatus.ACCEPTED)" [disabled]="isUpdating()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Accept
              </button>
              <button class="btn-reject" (click)="updateStatus(app, ApplicationStatus.REJECTED)" [disabled]="isUpdating()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Reject
              </button>
              <a *ngIf="app.student?.cvPath" [href]="app.student?.cvPath" target="_blank" class="btn-glass">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                View CV
              </a>
            </div>

            <div class="status-message" *ngIf="app.status !== ApplicationStatus.PENDING">
              <span *ngIf="app.status === ApplicationStatus.ACCEPTED" class="accepted-msg">
                ✓ You have accepted this application
              </span>
              <span *ngIf="app.status === ApplicationStatus.REJECTED" class="rejected-msg">
                ✗ You have rejected this application
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state glass-card" *ngIf="filteredApplications().length === 0">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h3>No applications {{ statusFilter ? 'with this status' : 'yet' }}</h3>
          <p>{{ statusFilter ? 'Try changing the filter' : 'Applications will appear here when students apply' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .offer-detail-content { max-width: 1000px; }
    .offer-summary { padding: 2rem; margin-bottom: 1.5rem; }
    .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .summary-badges { display: flex; gap: 0.5rem; }
    .offer-title { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 700; color: white; margin: 0 0 1rem; }
    .offer-meta { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 1.5rem; }
    .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9375rem; color: rgba(255,255,255,0.7); }
    .meta-item svg { color: #00d4aa; }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .stat-card { text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; }
    .stat-value { display: block; font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 700; color: #00d4aa; }
    .stat-value.pending { color: #f59e0b; }
    .stat-value.accepted { color: #10b981; }
    .stat-value.rejected { color: #ef4444; }
    .stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .applications-section { }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .section-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; margin: 0; }
    .filter-group select { min-width: 160px; }
    
    .applications-list { display: flex; flex-direction: column; gap: 1rem; }
    .application-card { padding: 1.5rem; }
    .applicant-info { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; color: white; flex-shrink: 0; }
    .info h3 { font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0 0 0.25rem; }
    .email { font-size: 0.875rem; color: rgba(255,255,255,0.6); margin: 0 0 0.5rem; }
    .tags { display: flex; gap: 0.5rem; }
    .tag { font-size: 0.75rem; padding: 0.25rem 0.625rem; background: rgba(0,212,170,0.1); color: #00d4aa; border-radius: 4px; }
    
    .application-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .applied-date { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .cover-letter { margin-bottom: 1rem; }
    .cover-letter h4 { font-size: 0.875rem; font-weight: 600; color: rgba(255,255,255,0.7); margin: 0 0 0.5rem; }
    .cover-letter p { font-size: 0.875rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin: 0; white-space: pre-wrap; }
    
    .action-buttons { display: flex; gap: 0.75rem; }
    .btn-accept { display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-accept:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16,185,129,0.4); }
    .btn-accept:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-reject { display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-reject:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239,68,68,0.4); }
    .btn-reject:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    
    .status-message { padding: 0.75rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500; }
    .accepted-msg { color: #10b981; background: rgba(16,185,129,0.1); display: block; padding: 0.75rem; border-radius: 6px; }
    .rejected-msg { color: #ef4444; background: rgba(239,68,68,0.1); display: block; padding: 0.75rem; border-radius: 6px; }
    
    .badge-rejected { background: rgba(239,68,68,0.15); color: #f87171; }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 3rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1rem 0 0.5rem; }
    
    @media (max-width: 768px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .action-buttons { flex-wrap: wrap; }
    }
  `]
})
export class CompanyOfferDetailComponent implements OnInit {
  // Expose enums to template
  ApplicationStatus = ApplicationStatus;
  OfferCategory = OfferCategory;

  isLoading = signal(true);
  isUpdating = signal(false);
  offer = signal<Offer | null>(null);
  applications = signal<Application[]>([]);
  filteredApplications = signal<Application[]>([]);
  
  statusFilter = '';

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOffer(parseInt(id, 10));
    }
  }

  loadOffer(id: number): void {
    this.isLoading.set(true);
    
    // Load offer details
    this.offerService.getOfferById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.offer.set(response.data);
          this.loadApplications(id);
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadApplications(offerId: number): void {
    this.offerService.getOfferApplications(offerId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.applications.set(response.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  applyFilter(): void {
    if (this.statusFilter) {
      this.filteredApplications.set(
        this.applications().filter(app => app.status === this.statusFilter)
      );
    } else {
      this.filteredApplications.set(this.applications());
    }
  }

  getStatusCount(status: ApplicationStatus): number {
    return this.applications().filter(app => app.status === status).length;
  }

  getCategoryLabel(category: OfferCategory): string {
    switch (category) {
      case OfferCategory.PFE: return 'PFE';
      case OfferCategory.SUMMER_INTERNSHIP: return 'Internship';
      case OfferCategory.JOB: return 'Job';
      default: return String(category);
    }
  }

  getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }

  updateStatus(application: Application, status: ApplicationStatus): void {
    this.isUpdating.set(true);
    
    this.applicationService.updateApplicationStatus(application.id, status).subscribe({
      next: (response) => {
        if (response.success) {
          // Update the local state
          this.applications.update(apps => 
            apps.map(app => app.id === application.id ? { ...app, status } : app)
          );
          this.applyFilter();
        }
        this.isUpdating.set(false);
      },
      error: () => this.isUpdating.set(false)
    });
  }
}
