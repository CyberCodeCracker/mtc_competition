import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CompanyService } from '../../../core/services/company.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus, OfferCategory } from '../../../core/models';

@Component({
  selector: 'app-company-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="All Applications" 
      pageSubtitle="Review all candidate applications across your offers"
      [showSearch]="true"
      (search)="onSearch($event)"
    ></app-navbar>

    <div class="applications-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card glass-card">
          <div class="stat-icon total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ applications().length }}</span>
            <span class="stat-label">Total Applications</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon pending">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getStatusCount(ApplicationStatus.PENDING) }}</span>
            <span class="stat-label">Pending Review</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon accepted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getStatusCount(ApplicationStatus.ACCEPTED) }}</span>
            <span class="stat-label">Accepted</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon rejected">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getStatusCount(ApplicationStatus.REJECTED) }}</span>
            <span class="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters glass-card">
        <div class="filter-group">
          <label>Status</label>
          <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="input-glass">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Offer</label>
          <select [(ngModel)]="offerFilter" (change)="applyFilters()" class="input-glass">
            <option value="">All Offers</option>
            <option *ngFor="let offer of uniqueOffers()" [value]="offer.id">{{ offer.title }}</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading applications..."></app-loading-spinner>

      <!-- Applications Table -->
      <div class="applications-table glass-card" *ngIf="!isLoading() && filteredApplications().length > 0">
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Offer</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of filteredApplications()">
              <td>
                <div class="applicant-cell">
                  <div class="avatar">
                    {{ getInitials(app.student?.firstName, app.student?.lastName) }}
                  </div>
                  <div class="applicant-info">
                    <span class="name">{{ app.student?.firstName }} {{ app.student?.lastName }}</span>
                    <span class="email">{{ app.student?.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="offer-cell">
                  <span class="offer-title">{{ app.offer?.title }}</span>
                  <span class="badge badge-sm" [ngClass]="{
                    'badge-active': app.offer?.category === 'PFE',
                    'badge-pending': app.offer?.category === 'SUMMER_INTERNSHIP',
                    'badge-accepted': app.offer?.category === 'JOB'
                  }">{{ getCategoryLabel(app.offer?.category!) }}</span>
                </div>
              </td>
              <td>
                <span class="date">{{ app.applicationDate | date:'mediumDate' }}</span>
              </td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-pending': app.status === ApplicationStatus.PENDING,
                  'badge-accepted': app.status === ApplicationStatus.ACCEPTED,
                  'badge-rejected': app.status === ApplicationStatus.REJECTED
                }">{{ app.status }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-view" title="View Details" (click)="viewApplication(app)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button *ngIf="app.status === ApplicationStatus.PENDING" class="btn-icon btn-accept" title="Accept" 
                          (click)="updateStatus(app, ApplicationStatus.ACCEPTED)" [disabled]="isUpdating()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button *ngIf="app.status === ApplicationStatus.PENDING" class="btn-icon btn-reject" title="Reject"
                          (click)="updateStatus(app, ApplicationStatus.REJECTED)" [disabled]="isUpdating()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-card" *ngIf="!isLoading() && filteredApplications().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <h3>No applications found</h3>
        <p>{{ statusFilter || offerFilter ? 'Try adjusting your filters' : 'Applications will appear here when students apply to your offers' }}</p>
      </div>
    </div>

    <!-- Application Detail Modal -->
    <div class="modal-overlay" *ngIf="selectedApplication()" (click)="closeModal()">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="applicant-profile">
            <div class="avatar-large">
              {{ getInitials(selectedApplication()?.student?.firstName, selectedApplication()?.student?.lastName) }}
            </div>
            <div class="profile-info">
              <h2>{{ selectedApplication()?.student?.firstName }} {{ selectedApplication()?.student?.lastName }}</h2>
              <p>{{ selectedApplication()?.student?.email }}</p>
              <div class="profile-tags">
                <span class="tag">{{ selectedApplication()?.student?.studyLevel }}</span>
                <span class="tag">{{ selectedApplication()?.student?.groupName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h4>Applied For</h4>
            <p class="offer-name">{{ selectedApplication()?.offer?.title }}</p>
          </div>

          <div class="detail-section" *ngIf="selectedApplication()?.coverLetter">
            <h4>Cover Letter</h4>
            <p class="cover-letter-text">{{ selectedApplication()?.coverLetter }}</p>
          </div>

          <div class="detail-section" *ngIf="selectedApplication()?.student?.skills">
            <h4>Skills</h4>
            <div class="skills-list">
              <span class="skill" *ngFor="let skill of getSkillsList(selectedApplication()?.student?.skills)">{{ skill }}</span>
            </div>
          </div>

          <div class="contact-info">
            <a *ngIf="selectedApplication()?.student?.phone" [href]="'tel:' + selectedApplication()?.student?.phone" class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"></path>
              </svg>
              {{ selectedApplication()?.student?.phone }}
            </a>
            <a *ngIf="selectedApplication()?.student?.linkedin" [href]="selectedApplication()?.student?.linkedin" target="_blank" class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </a>
            <a *ngIf="selectedApplication()?.student?.github" [href]="selectedApplication()?.student?.github" target="_blank" class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div class="modal-actions" *ngIf="selectedApplication()?.status === ApplicationStatus.PENDING">
          <button class="btn-accept-lg" (click)="updateStatus(selectedApplication()!, ApplicationStatus.ACCEPTED); closeModal();">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Accept Application
          </button>
          <button class="btn-reject-lg" (click)="updateStatus(selectedApplication()!, ApplicationStatus.REJECTED); closeModal();">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Reject Application
          </button>
        </div>

        <div class="status-banner" *ngIf="selectedApplication()?.status !== ApplicationStatus.PENDING" 
             [ngClass]="{ 'accepted': selectedApplication()?.status === ApplicationStatus.ACCEPTED, 'rejected': selectedApplication()?.status === ApplicationStatus.REJECTED }">
          {{ selectedApplication()?.status === ApplicationStatus.ACCEPTED ? '✓ Application Accepted' : '✗ Application Rejected' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .applications-content { max-width: 1400px; }
    
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.total { background: rgba(0,212,170,0.15); color: #00d4aa; }
    .stat-icon.pending { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .stat-icon.accepted { background: rgba(16,185,129,0.15); color: #10b981; }
    .stat-icon.rejected { background: rgba(239,68,68,0.15); color: #ef4444; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; color: white; }
    .stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .filters { display: flex; gap: 1rem; padding: 1rem 1.5rem; margin-bottom: 1.5rem; }
    .filter-group { display: flex; flex-direction: column; gap: 0.5rem; min-width: 180px; }
    .filter-group label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    
    .applications-table { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem 1.5rem; font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.1); }
    td { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
    tr:hover td { background: rgba(255,255,255,0.02); }
    
    .applicant-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 0.875rem; font-weight: 600; color: white; flex-shrink: 0; }
    .applicant-info { display: flex; flex-direction: column; }
    .applicant-info .name { font-weight: 500; color: white; }
    .applicant-info .email { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .offer-cell { display: flex; flex-direction: column; gap: 0.375rem; }
    .offer-title { font-weight: 500; color: white; }
    .badge-sm { font-size: 0.6875rem; padding: 0.125rem 0.5rem; }
    
    .date { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
    
    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .btn-view { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
    .btn-view:hover { background: rgba(255,255,255,0.1); color: white; }
    .btn-accept { background: rgba(16,185,129,0.15); color: #10b981; }
    .btn-accept:hover { background: rgba(16,185,129,0.25); }
    .btn-accept:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-reject { background: rgba(239,68,68,0.15); color: #ef4444; }
    .btn-reject:hover { background: rgba(239,68,68,0.25); }
    .btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .badge-rejected { background: rgba(239,68,68,0.15); color: #f87171; }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 4rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1.5rem 0 0.5rem; }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal { max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 0; position: relative; }
    .modal-close { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border: none; width: 36px; height: 36px; border-radius: 50%; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 1; }
    .modal-close:hover { background: rgba(255,255,255,0.2); color: white; }
    
    .modal-header { padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .applicant-profile { display: flex; align-items: center; gap: 1.25rem; }
    .avatar-large { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; flex-shrink: 0; }
    .profile-info h2 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; margin: 0 0 0.25rem; }
    .profile-info p { color: rgba(255,255,255,0.6); margin: 0 0 0.75rem; }
    .profile-tags { display: flex; gap: 0.5rem; }
    .tag { font-size: 0.75rem; padding: 0.25rem 0.75rem; background: rgba(0,212,170,0.1); color: #00d4aa; border-radius: 4px; }
    
    .modal-body { padding: 2rem; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h4 { font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem; }
    .offer-name { font-size: 1.125rem; font-weight: 500; color: white; margin: 0; }
    .cover-letter-text { color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0; white-space: pre-wrap; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill { font-size: 0.8125rem; padding: 0.375rem 0.75rem; background: rgba(168,85,247,0.1); color: #a855f7; border-radius: 4px; }
    
    .contact-info { display: flex; flex-wrap: wrap; gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .contact-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #00d4aa; text-decoration: none; transition: color 0.2s; }
    .contact-item:hover { color: #5eead4; }
    
    .modal-actions { display: flex; gap: 1rem; padding: 1.5rem 2rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .btn-accept-lg, .btn-reject-lg { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem; border-radius: 8px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-accept-lg { background: linear-gradient(135deg, #10b981, #059669); color: white; }
    .btn-accept-lg:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16,185,129,0.4); }
    .btn-reject-lg { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
    .btn-reject-lg:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239,68,68,0.4); }
    
    .status-banner { padding: 1rem 2rem; text-align: center; font-weight: 600; }
    .status-banner.accepted { background: rgba(16,185,129,0.15); color: #10b981; }
    .status-banner.rejected { background: rgba(239,68,68,0.15); color: #ef4444; }
    select.input-glass option { background: #1e293b; color: white; }
    
    @media (max-width: 1024px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .stats-row { grid-template-columns: 1fr; }
      .filters { flex-direction: column; }
      .applications-table { overflow-x: auto; }
      table { min-width: 700px; }
    }
  `]
})
export class CompanyApplicationsComponent implements OnInit {
  // Expose enums to template
  ApplicationStatus = ApplicationStatus;
  OfferCategory = OfferCategory;

  isLoading = signal(true);
  isUpdating = signal(false);
  applications = signal<Application[]>([]);
  filteredApplications = signal<Application[]>([]);
  selectedApplication = signal<Application | null>(null);
  
  statusFilter = '';
  offerFilter = '';
  searchQuery = '';

  constructor(
    private companyService: CompanyService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading.set(true);
    this.companyService.getMyApplications().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.applications.set(response.data);
          this.applyFilters();
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  applyFilters(): void {
    let filtered = this.applications();
    
    if (this.statusFilter) {
      filtered = filtered.filter(app => app.status === this.statusFilter);
    }
    
    if (this.offerFilter) {
      filtered = filtered.filter(app => app.offerId === parseInt(this.offerFilter, 10));
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.student?.firstName?.toLowerCase().includes(query) ||
        app.student?.lastName?.toLowerCase().includes(query) ||
        app.student?.email?.toLowerCase().includes(query) ||
        app.offer?.title?.toLowerCase().includes(query)
      );
    }
    
    this.filteredApplications.set(filtered);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  getStatusCount(status: ApplicationStatus): number {
    return this.applications().filter(app => app.status === status).length;
  }

  uniqueOffers(): { id: number; title: string }[] {
    const offers = new Map<number, string>();
    this.applications().forEach(app => {
      if (app.offer) {
        offers.set(app.offerId, app.offer.title);
      }
    });
    return Array.from(offers.entries()).map(([id, title]) => ({ id, title }));
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

  getSkillsList(skills?: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(s => s.trim()).filter(s => s);
  }

  viewApplication(application: Application): void {
    this.selectedApplication.set(application);
  }

  closeModal(): void {
    this.selectedApplication.set(null);
  }

  updateStatus(application: Application, status: ApplicationStatus): void {
    this.isUpdating.set(true);
    
    this.applicationService.updateApplicationStatus(application.id, status).subscribe({
      next: (response) => {
        if (response.success) {
          this.applications.update(apps => 
            apps.map(app => app.id === application.id ? { ...app, status } : app)
          );
          this.applyFilters();
        }
        this.isUpdating.set(false);
      },
      error: () => this.isUpdating.set(false)
    });
  }
}
