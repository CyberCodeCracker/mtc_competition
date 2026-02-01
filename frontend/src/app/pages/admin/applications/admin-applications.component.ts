import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus, OfferCategory, PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Manage Applications" 
      pageSubtitle="View all applications across the platform"
      [showSearch]="true"
      (search)="onSearch($event)"
    ></app-navbar>

    <div class="applications-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card glass-card">
          <div class="stat-icon total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalApplications() }}</span>
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
            <span class="stat-label">Pending</span>
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
          <select [(ngModel)]="statusFilter" (change)="loadApplications()" class="input-glass">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading applications..."></app-loading-spinner>

      <!-- Applications Table -->
      <div class="applications-table glass-card" *ngIf="!isLoading() && applications().length > 0">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Offer</th>
              <th>Company</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of applications()">
              <td>
                <div class="student-cell">
                  <div class="avatar">{{ getInitials(app.student?.firstName, app.student?.lastName) }}</div>
                  <div class="student-info">
                    <span class="name">{{ app.student?.firstName }} {{ app.student?.lastName }}</span>
                    <span class="email">{{ app.student?.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="offer-cell">
                  <span class="offer-title">{{ app.offer?.title }}</span>
                  <span class="badge badge-sm" [ngClass]="{
                    'badge-active': app.offer?.category === OfferCategory.PFE,
                    'badge-pending': app.offer?.category === OfferCategory.SUMMER_INTERNSHIP,
                    'badge-accepted': app.offer?.category === OfferCategory.JOB
                  }">{{ getCategoryLabel(app.offer?.category!) }}</span>
                </div>
              </td>
              <td>
                <span class="company-name">{{ app.offer?.company?.name }}</span>
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages() > 1">
        <button class="btn-glass" [disabled]="currentPage() === 1" (click)="changePage(currentPage() - 1)">Previous</button>
        <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
        <button class="btn-glass" [disabled]="currentPage() === totalPages()" (click)="changePage(currentPage() + 1)">Next</button>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-card" *ngIf="!isLoading() && applications().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <h3>No applications found</h3>
        <p>{{ statusFilter || searchQuery ? 'Try adjusting your filters' : 'No applications have been submitted yet' }}</p>
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
          <h2>Application Details</h2>
          <span class="badge" [ngClass]="{
            'badge-pending': selectedApplication()?.status === ApplicationStatus.PENDING,
            'badge-accepted': selectedApplication()?.status === ApplicationStatus.ACCEPTED,
            'badge-rejected': selectedApplication()?.status === ApplicationStatus.REJECTED
          }">{{ selectedApplication()?.status }}</span>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h4>Student</h4>
            <div class="detail-content">
              <div class="student-profile">
                <div class="avatar-large">{{ getInitials(selectedApplication()?.student?.firstName, selectedApplication()?.student?.lastName) }}</div>
                <div class="profile-info">
                  <span class="name">{{ selectedApplication()?.student?.firstName }} {{ selectedApplication()?.student?.lastName }}</span>
                  <span class="email">{{ selectedApplication()?.student?.email }}</span>
                  <div class="tags">
                    <span class="tag">{{ selectedApplication()?.student?.studyLevel }}</span>
                    <span class="tag">{{ selectedApplication()?.student?.groupName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Offer</h4>
            <div class="detail-content">
              <span class="offer-name">{{ selectedApplication()?.offer?.title }}</span>
              <span class="company">by {{ selectedApplication()?.offer?.company?.name }}</span>
            </div>
          </div>

          <div class="detail-section" *ngIf="selectedApplication()?.coverLetter">
            <h4>Cover Letter</h4>
            <p class="cover-letter">{{ selectedApplication()?.coverLetter }}</p>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Applied On</span>
              <span class="value">{{ selectedApplication()?.applicationDate | date:'medium' }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedApplication()?.student?.phone">
              <span class="label">Phone</span>
              <span class="value">{{ selectedApplication()?.student?.phone }}</span>
            </div>
          </div>
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
    
    .student-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 0.875rem; font-weight: 600; color: white; flex-shrink: 0; }
    .student-info { display: flex; flex-direction: column; }
    .student-info .name { font-weight: 500; color: white; }
    .student-info .email { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .offer-cell { display: flex; flex-direction: column; gap: 0.375rem; }
    .offer-title { font-weight: 500; color: white; }
    .badge-sm { font-size: 0.6875rem; padding: 0.125rem 0.5rem; }
    
    .company-name { color: #00d4aa; font-size: 0.9375rem; }
    .date { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
    
    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .btn-view { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
    .btn-view:hover { background: rgba(255,255,255,0.1); color: white; }
    
    .badge-rejected { background: rgba(239,68,68,0.15); color: #f87171; }
    
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .page-info { color: rgba(255,255,255,0.7); }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 4rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1.5rem 0 0.5rem; }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal { max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 0; position: relative; }
    .modal-close { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border: none; width: 36px; height: 36px; border-radius: 50%; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 1; }
    .modal-close:hover { background: rgba(255,255,255,0.2); color: white; }
    
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .modal-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; color: white; margin: 0; }
    
    .modal-body { padding: 2rem; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h4 { font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.75rem; }
    .detail-content { }
    
    .student-profile { display: flex; align-items: center; gap: 1rem; }
    .avatar-large { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; color: white; }
    .profile-info { display: flex; flex-direction: column; gap: 0.25rem; }
    .profile-info .name { font-weight: 600; color: white; font-size: 1.125rem; }
    .profile-info .email { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
    .tags { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
    .tag { font-size: 0.75rem; padding: 0.25rem 0.625rem; background: rgba(0,212,170,0.1); color: #00d4aa; border-radius: 4px; }
    
    .offer-name { display: block; font-size: 1.0625rem; font-weight: 500; color: white; }
    .company { font-size: 0.875rem; color: #00d4aa; }
    
    .cover-letter { color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0; white-space: pre-wrap; font-size: 0.9375rem; }
    
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .detail-item .label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
    .detail-item .value { font-size: 0.9375rem; color: white; }
    
    @media (max-width: 1024px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .stats-row { grid-template-columns: 1fr; }
      .filters { flex-direction: column; }
      .applications-table { overflow-x: auto; }
      table { min-width: 800px; }
    }
  `]
})
export class AdminApplicationsComponent implements OnInit {
  // Expose enums to template
  ApplicationStatus = ApplicationStatus;
  OfferCategory = OfferCategory;

  isLoading = signal(true);
  applications = signal<Application[]>([]);
  totalApplications = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedApplication = signal<Application | null>(null);
  
  statusFilter = '';
  searchQuery = '';

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading.set(true);
    this.applicationService.getAllApplications({
      page: this.currentPage(),
      limit: 15,
      status: this.statusFilter || undefined
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.applications.set(response.data.data);
          this.totalApplications.set(response.data.pagination.total);
          this.totalPages.set(response.data.pagination.totalPages);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage.set(1);
    this.loadApplications();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadApplications();
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

  viewApplication(application: Application): void {
    this.selectedApplication.set(application);
  }

  closeModal(): void {
    this.selectedApplication.set(null);
  }
}
