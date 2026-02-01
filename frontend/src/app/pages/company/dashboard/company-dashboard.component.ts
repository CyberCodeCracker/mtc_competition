import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CompanyService } from '../../../core/services/company.service';
import { CompanyStats, Offer, Application, ApplicationStatus, OfferStatus } from '../../../core/models';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Company Dashboard" 
      pageSubtitle="Manage your offers and applications"
      [showSearch]="false"
    ></app-navbar>

    <div class="dashboard-content">
      <app-loading-spinner *ngIf="isLoading()" message="Loading dashboard..."></app-loading-spinner>

      <div *ngIf="!isLoading()">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalOffers || 0 }}</span>
              <span class="stat-label">Total Offers</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.activeOffers || 0 }}</span>
              <span class="stat-label">Active Offers</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalApplications || 0 }}</span>
              <span class="stat-label">Total Applications</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon yellow">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.pendingApplications || 0 }}</span>
              <span class="stat-label">Pending Review</span>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Recent Applications -->
          <div class="glass-card content-card">
            <div class="card-header">
              <h3 class="card-title">Recent Applications</h3>
              <a routerLink="/company/applications" class="view-all-link">View All</a>
            </div>
            
            <div class="applications-list" *ngIf="recentApplications().length > 0">
              <div class="application-item" *ngFor="let app of recentApplications()">
                <div class="app-avatar">
                  {{ getInitials(app.student?.firstName, app.student?.lastName) }}
                </div>
                <div class="app-info">
                  <span class="app-title">{{ app.student?.firstName }} {{ app.student?.lastName }}</span>
                  <span class="app-subtitle">Applied for: {{ app.offer?.title }}</span>
                </div>
                <span class="badge" [ngClass]="{
                  'badge-pending': app.status === ApplicationStatus.PENDING,
                  'badge-accepted': app.status === ApplicationStatus.ACCEPTED,
                  'badge-rejected': app.status === ApplicationStatus.REJECTED
                }">{{ app.status }}</span>
              </div>
            </div>

            <div class="empty-state" *ngIf="recentApplications().length === 0">
              <p>No applications yet</p>
            </div>
          </div>

          <!-- My Offers -->
          <div class="glass-card content-card">
            <div class="card-header">
              <h3 class="card-title">My Offers</h3>
              <a routerLink="/company/offers" class="view-all-link">View All</a>
            </div>
            
            <div class="offers-list" *ngIf="myOffers().length > 0">
              <div class="offer-item" *ngFor="let offer of myOffers()">
                <div class="offer-info">
                  <h4 class="offer-title">{{ offer.title }}</h4>
                  <p class="offer-meta">
                    <span class="badge" [ngClass]="{
                      'badge-active': offer.status === OfferStatus.ACTIVE,
                      'badge-closed': offer.status === OfferStatus.CLOSED
                    }">{{ offer.status }}</span>
                    <span class="applications-count">{{ offer._count?.applications || 0 }} applications</span>
                  </p>
                </div>
                <a [routerLink]="['/company/offers', offer.id]" class="btn-glass btn-sm" style="display: flex; align-items: center; gap: 4px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View Details
                </a>
              </div>
            </div>

            <div class="empty-state" *ngIf="myOffers().length === 0">
              <p>No offers yet</p>
              <a routerLink="/company/offers/new" class="btn-primary btn-sm">Create Offer</a>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions glass-card">
          <h3 class="card-title">Quick Actions</h3>
          <div class="actions-grid">
            <a routerLink="/company/offers/new" class="action-card">
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <span class="action-label">Create New Offer</span>
            </a>
            <a routerLink="/company/applications" class="action-card">
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <span class="action-label">Review Applications</span>
            </a>
            <a routerLink="/company/profile" class="action-card">
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <span class="action-label">Company Settings</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content { max-width: 1400px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
    @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; transition: all 0.3s; }
    .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
    .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.blue { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
    .stat-icon.green { background: rgba(0, 212, 170, 0.2); color: #00d4aa; }
    .stat-icon.purple { background: rgba(156, 39, 176, 0.2); color: #9c27b0; }
    .stat-icon.yellow { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; color: white; }
    .stat-label { font-size: 0.875rem; color: rgba(255, 255, 255, 0.6); }
    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    @media (max-width: 968px) { .content-grid { grid-template-columns: 1fr; } }
    .content-card { padding: 1.5rem; }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .card-title { font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0; }
    .view-all-link { font-size: 0.875rem; color: #00d4aa; text-decoration: none; }
    .applications-list, .offers-list { display: flex; flex-direction: column; gap: 1rem; }
    .application-item, .offer-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.03); border-radius: 12px; }
    .app-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #00d4aa, #2196f3); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; color: white; }
    .app-info, .offer-info { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .app-title, .offer-title { font-weight: 500; color: white; font-size: 0.9375rem; margin: 0; }
    .app-subtitle, .offer-meta { font-size: 0.8125rem; color: rgba(255, 255, 255, 0.6); display: flex; align-items: center; gap: 0.5rem; }
    .applications-count { font-size: 0.75rem; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: rgba(255, 255, 255, 0.5); text-align: center; }
    .quick-actions { padding: 1.5rem; }
    .quick-actions .card-title { margin-bottom: 1rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    @media (max-width: 640px) { .actions-grid { grid-template-columns: 1fr; } }
    .action-card { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border-radius: 12px; text-decoration: none; transition: all 0.3s; }
    .action-card:hover { background: rgba(0, 212, 170, 0.1); transform: translateY(-3px); }
    .action-icon { width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(33, 150, 243, 0.2)); display: flex; align-items: center; justify-content: center; color: #00d4aa; }
    .action-label { font-size: 0.875rem; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
  `]
})
export class CompanyDashboardComponent implements OnInit {
  // Expose enums to template
  ApplicationStatus = ApplicationStatus;
  OfferStatus = OfferStatus;

  isLoading = signal(true);
  stats = signal<CompanyStats | null>(null);
  recentApplications = signal<Application[]>([]);
  myOffers = signal<Offer[]>([]);

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.companyService.getMyStats().subscribe({
      next: (response) => {
        if (response.success) this.stats.set(response.data!);
      }
    });

    this.companyService.getMyApplications().subscribe({
      next: (response) => {
        if (response.success) this.recentApplications.set(response.data!.slice(0, 5));
      }
    });

    this.companyService.getMyOffers().subscribe({
      next: (response) => {
        if (response.success) this.myOffers.set(response.data!.slice(0, 4));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getInitials(firstName?: string, lastName?: string): string {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  }
}
