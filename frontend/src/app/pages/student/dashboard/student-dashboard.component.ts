import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StudentService } from '../../../core/services/student.service';
import { OfferService } from '../../../core/services/offer.service';
import { StudentStats, Offer, Application, OfferCategory } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Student Dashboard" 
      pageSubtitle="Welcome back! Here's your overview"
      [showSearch]="false"
    ></app-navbar>

    <div class="dashboard-content">
      <!-- Loading State -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading dashboard..."></app-loading-spinner>

      <div *ngIf="!isLoading()">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
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
              <span class="stat-label">Pending</span>
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
              <span class="stat-value">{{ stats()?.acceptedApplications || 0 }}</span>
              <span class="stat-label">Accepted</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon red">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.rejectedApplications || 0 }}</span>
              <span class="stat-label">Rejected</span>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Recent Applications -->
          <div class="glass-card content-card">
            <div class="card-header">
              <h3 class="card-title">Recent Applications</h3>
              <a routerLink="/student/applications" class="view-all-link">View All</a>
            </div>
            
            <div class="applications-list" *ngIf="recentApplications().length > 0">
              <div class="application-item" *ngFor="let app of recentApplications()">
                <div class="app-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <div class="app-info">
                  <span class="app-title">{{ app.offer?.title }}</span>
                  <span class="app-company">{{ app.offer?.company?.name }}</span>
                </div>
                <span class="badge" [ngClass]="{
                  'badge-pending': app.status === 'PENDING',
                  'badge-accepted': app.status === 'ACCEPTED',
                  'badge-rejected': app.status === 'REJECTED'
                }">{{ app.status }}</span>
              </div>
            </div>

            <div class="empty-state" *ngIf="recentApplications().length === 0">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p>No applications yet</p>
              <a routerLink="/student/offers" class="btn-secondary">Browse Offers</a>
            </div>
          </div>

          <!-- Recommended Offers -->
          <div class="glass-card content-card">
            <div class="card-header">
              <h3 class="card-title">Latest Offers</h3>
              <a routerLink="/student/offers" class="view-all-link">View All</a>
            </div>
            
            <div class="offers-list" *ngIf="latestOffers().length > 0">
              <div class="offer-item" *ngFor="let offer of latestOffers()">
                <div class="offer-header">
                  <span class="offer-category badge" [ngClass]="{
                    'badge-active': offer.category === 'PFE',
                    'badge-pending': offer.category === 'SUMMER_INTERNSHIP',
                    'badge-accepted': offer.category === 'JOB'
                  }">{{ getCategoryLabel(offer.category) }}</span>
                </div>
                <h4 class="offer-title">{{ offer.title }}</h4>
                <p class="offer-company">{{ offer.company?.name }}</p>
                <div class="offer-footer">
                  <span class="offer-location" *ngIf="offer.location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {{ offer.location }}
                  </span>
                  <a [routerLink]="['/student/offers', offer.id]" class="btn-glass btn-sm" style="display: flex; align-items: center; gap: 4px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                </div>
              </div>
            </div>

            <div class="empty-state" *ngIf="latestOffers().length === 0">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <p>No offers available</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions glass-card">
          <h3 class="card-title">Quick Actions</h3>
          <div class="actions-grid">
            <a routerLink="/student/offers" class="action-card">
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <span class="action-label">Browse Offers</span>
            </a>
            <a routerLink="/student/applications" class="action-card">
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <span class="action-label">Track Applications</span>
            </a>
            <a routerLink="/student/profile" class="action-card">
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span class="action-label">Update Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      max-width: 1400px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.blue {
      background: rgba(33, 150, 243, 0.2);
      color: #2196f3;
    }

    .stat-icon.yellow {
      background: rgba(255, 152, 0, 0.2);
      color: #ff9800;
    }

    .stat-icon.green {
      background: rgba(0, 212, 170, 0.2);
      color: #00d4aa;
    }

    .stat-icon.red {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
    }

    .stat-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 968px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .content-card {
      padding: 1.5rem;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    .view-all-link {
      font-size: 0.875rem;
      color: #00d4aa;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .view-all-link:hover {
      opacity: 0.8;
    }

    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .application-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      transition: background 0.3s;
    }

    .application-item:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    .app-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(33, 150, 243, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2196f3;
    }

    .app-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .app-title {
      font-weight: 500;
      color: white;
      font-size: 0.9375rem;
    }

    .app-company {
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .offers-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .offer-item {
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      transition: background 0.3s;
    }

    .offer-item:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    .offer-header {
      margin-bottom: 0.75rem;
    }

    .offer-title {
      font-weight: 600;
      color: white;
      font-size: 0.9375rem;
      margin: 0 0 0.25rem;
    }

    .offer-company {
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 0.75rem;
    }

    .offer-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .offer-location {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state p {
      margin-bottom: 1rem;
    }

    .quick-actions {
      padding: 1.5rem;
    }

    .quick-actions .card-title {
      margin-bottom: 1rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.3s;
    }

    .action-card:hover {
      background: rgba(0, 212, 170, 0.1);
      transform: translateY(-3px);
    }

    .action-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(33, 150, 243, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00d4aa;
    }

    .action-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  isLoading = signal(true);
  stats = signal<StudentStats | null>(null);
  recentApplications = signal<Application[]>([]);
  latestOffers = signal<Offer[]>([]);

  constructor(
    private studentService: StudentService,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load stats
    this.studentService.getMyStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats.set(response.data!);
        }
      }
    });

    // Load recent applications
    this.studentService.getMyApplications().subscribe({
      next: (response) => {
        if (response.success) {
          this.recentApplications.set(response.data!.slice(0, 5));
        }
      }
    });

    // Load latest offers
    this.offerService.getOffers({ limit: 4 }).subscribe({
      next: (response) => {
        if (response.success) {
          this.latestOffers.set(response.data!.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
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
