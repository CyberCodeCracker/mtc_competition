import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Admin Dashboard" 
      pageSubtitle="Overview of the entire platform"
      [showSearch]="false"
    ></app-navbar>

    <div class="dashboard-content">
      <app-loading-spinner *ngIf="isLoading()" message="Loading dashboard..."></app-loading-spinner>

      <div *ngIf="!isLoading()">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card" routerLink="/admin/students">
            <div class="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalStudents || 0 }}</span>
              <span class="stat-label">Total Students</span>
            </div>
          </div>

          <div class="stat-card" routerLink="/admin/companies">
            <div class="stat-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalCompanies || 0 }}</span>
              <span class="stat-label">Companies</span>
              <span class="stat-sub">{{ stats()?.pendingCompanies || 0 }} pending</span>
            </div>
          </div>

          <div class="stat-card" routerLink="/admin/offers">
            <div class="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalOffers || 0 }}</span>
              <span class="stat-label">Total Offers</span>
              <span class="stat-sub">{{ stats()?.activeOffers || 0 }} active</span>
            </div>
          </div>

          <div class="stat-card" routerLink="/admin/applications">
            <div class="stat-icon yellow">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalApplications || 0 }}</span>
              <span class="stat-label">Applications</span>
              <span class="stat-sub">{{ stats()?.pendingApplications || 0 }} pending</span>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-grid">
          <!-- Offers by Category -->
          <div class="glass-card chart-card">
            <h3 class="card-title">Offers by Category</h3>
            <div class="category-stats">
              <div class="category-item">
                <div class="category-bar">
                  <div class="bar-fill pfe" [style.width.%]="getCategoryPercentage('PFE')"></div>
                </div>
                <div class="category-info">
                  <span class="category-label">PFE</span>
                  <span class="category-value">{{ offersByCategory()?.PFE || 0 }}</span>
                </div>
              </div>
              <div class="category-item">
                <div class="category-bar">
                  <div class="bar-fill internship" [style.width.%]="getCategoryPercentage('SUMMER_INTERNSHIP')"></div>
                </div>
                <div class="category-info">
                  <span class="category-label">Internship</span>
                  <span class="category-value">{{ offersByCategory()?.SUMMER_INTERNSHIP || 0 }}</span>
                </div>
              </div>
              <div class="category-item">
                <div class="category-bar">
                  <div class="bar-fill job" [style.width.%]="getCategoryPercentage('JOB')"></div>
                </div>
                <div class="category-info">
                  <span class="category-label">Job</span>
                  <span class="category-value">{{ offersByCategory()?.JOB || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Application Status -->
          <div class="glass-card chart-card">
            <h3 class="card-title">Application Status</h3>
            <div class="status-stats">
              <div class="status-circle">
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path class="circle accepted" [attr.stroke-dasharray]="getAcceptedPercent() + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                </svg>
                <div class="status-center">
                  <span class="status-percent">{{ getAcceptedPercent() }}%</span>
                  <span class="status-label">Accepted</span>
                </div>
              </div>
              <div class="status-legend">
                <div class="legend-item">
                  <span class="legend-dot accepted"></span>
                  <span>Accepted: {{ stats()?.acceptedApplications || 0 }}</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot pending"></span>
                  <span>Pending: {{ stats()?.pendingApplications || 0 }}</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot rejected"></span>
                  <span>Rejected: {{ stats()?.rejectedApplications || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Top Companies -->
        <div class="content-grid">
          <div class="glass-card content-card">
            <div class="card-header">
              <h3 class="card-title">Recent Activity</h3>
            </div>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let student of recentStudents()">
                <div class="activity-icon student">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="activity-info">
                  <span class="activity-text">New student: <strong>{{ student.firstName }} {{ student.lastName }}</strong></span>
                  <span class="activity-time">{{ student.createdAt | date:'short' }}</span>
                </div>
              </div>
              <div class="activity-item" *ngFor="let company of recentCompanies()">
                <div class="activity-icon company">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                </div>
                <div class="activity-info">
                  <span class="activity-text">New company: <strong>{{ company.name }}</strong></span>
                  <span class="activity-time">{{ company.createdAt | date:'short' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-card content-card">
            <div class="card-header">
              <h3 class="card-title">Top Companies</h3>
            </div>
            <div class="top-companies-list">
              <div class="company-rank" *ngFor="let company of topCompanies(); let i = index">
                <span class="rank-number">#{{ i + 1 }}</span>
                <div class="company-info">
                  <span class="company-name">{{ company.name }}</span>
                  <span class="company-sector">{{ company.sector }}</span>
                </div>
                <div class="company-stats">
                  <span class="stat-mini">{{ company.totalOffers }} offers</span>
                  <span class="stat-mini">{{ company.totalApplications }} apps</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions glass-card">
          <h3 class="card-title">Quick Actions</h3>
          <div class="actions-grid">
            <a routerLink="/admin/users/new" class="action-card">
              <div class="action-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg></div>
              <span class="action-label">Create User</span>
            </a>
            <a routerLink="/admin/companies" class="action-card">
              <div class="action-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <span class="action-label">Approve Companies</span>
            </a>
            <a routerLink="/admin/applications" class="action-card">
              <div class="action-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg></div>
              <span class="action-label">View Reports</span>
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
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; cursor: pointer; transition: all 0.3s; }
    .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
    .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.blue { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
    .stat-icon.purple { background: rgba(156, 39, 176, 0.2); color: #9c27b0; }
    .stat-icon.green { background: rgba(0, 212, 170, 0.2); color: #00d4aa; }
    .stat-icon.yellow { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; color: white; }
    .stat-label { font-size: 0.875rem; color: rgba(255, 255, 255, 0.6); }
    .stat-sub { font-size: 0.75rem; color: #00d4aa; }
    
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    @media (max-width: 968px) { .charts-grid { grid-template-columns: 1fr; } }
    .chart-card { padding: 1.5rem; }
    .card-title { font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0 0 1.5rem; }
    
    .category-stats { display: flex; flex-direction: column; gap: 1.25rem; }
    .category-item { display: flex; align-items: center; gap: 1rem; }
    .category-bar { flex: 1; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
    .bar-fill.pfe { background: linear-gradient(90deg, #2196f3, #64b5f6); }
    .bar-fill.internship { background: linear-gradient(90deg, #ff9800, #ffb74d); }
    .bar-fill.job { background: linear-gradient(90deg, #00d4aa, #33debb); }
    .category-info { display: flex; flex-direction: column; min-width: 80px; }
    .category-label { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }
    .category-value { font-weight: 600; color: white; }
    
    .status-stats { display: flex; align-items: center; gap: 2rem; }
    .status-circle { position: relative; width: 120px; height: 120px; }
    .circular-chart { display: block; width: 100%; height: 100%; }
    .circle-bg { fill: none; stroke: rgba(255, 255, 255, 0.1); stroke-width: 3; }
    .circle { fill: none; stroke: #00d4aa; stroke-width: 3; stroke-linecap: round; transform: rotate(-90deg); transform-origin: center; }
    .status-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
    .status-percent { display: block; font-size: 1.5rem; font-weight: 700; color: #00d4aa; }
    .status-label { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }
    .status-legend { display: flex; flex-direction: column; gap: 0.75rem; }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: rgba(255, 255, 255, 0.8); }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
    .legend-dot.accepted { background: #00d4aa; }
    .legend-dot.pending { background: #ff9800; }
    .legend-dot.rejected { background: #f44336; }
    
    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .content-card { padding: 1.5rem; }
    .card-header { margin-bottom: 1rem; }
    
    .activity-list { display: flex; flex-direction: column; gap: 0.75rem; max-height: 300px; overflow-y: auto; }
    .activity-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
    .activity-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .activity-icon.student { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
    .activity-icon.company { background: rgba(156, 39, 176, 0.2); color: #9c27b0; }
    .activity-info { flex: 1; display: flex; flex-direction: column; gap: 0.125rem; }
    .activity-text { font-size: 0.875rem; color: rgba(255, 255, 255, 0.8); }
    .activity-time { font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); }
    
    .top-companies-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .company-rank { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
    .rank-number { font-family: 'Outfit', sans-serif; font-weight: 700; color: #00d4aa; min-width: 30px; }
    .company-info { flex: 1; display: flex; flex-direction: column; }
    .company-name { font-weight: 500; color: white; }
    .company-sector { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }
    .company-stats { display: flex; flex-direction: column; align-items: flex-end; }
    .stat-mini { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }
    
    .quick-actions { padding: 1.5rem; }
    .quick-actions .card-title { margin-bottom: 1rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .action-card { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border-radius: 12px; text-decoration: none; transition: all 0.3s; }
    .action-card:hover { background: rgba(0, 212, 170, 0.1); transform: translateY(-3px); }
    .action-icon { width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(33, 150, 243, 0.2)); display: flex; align-items: center; justify-content: center; color: #00d4aa; }
    .action-label { font-size: 0.875rem; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  isLoading = signal(true);
  stats = signal<DashboardStats | null>(null);
  offersByCategory = signal<{ PFE: number; SUMMER_INTERNSHIP: number; JOB: number } | null>(null);
  recentStudents = signal<any[]>([]);
  recentCompanies = signal<any[]>([]);
  topCompanies = signal<any[]>([]);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (response) => { if (response.success) this.stats.set(response.data!); }
    });

    this.adminService.getOffersByCategory().subscribe({
      next: (response) => { if (response.success) this.offersByCategory.set(response.data!); }
    });

    this.adminService.getRecentActivity().subscribe({
      next: (response) => {
        if (response.success) {
          this.recentStudents.set(response.data!.recentStudents || []);
          this.recentCompanies.set(response.data!.recentCompanies || []);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.adminService.getTopCompanies().subscribe({
      next: (response) => { if (response.success) this.topCompanies.set(response.data!); }
    });
  }

  getCategoryPercentage(category: 'PFE' | 'SUMMER_INTERNSHIP' | 'JOB'): number {
    const data = this.offersByCategory();
    if (!data) return 0;
    const total = data.PFE + data.SUMMER_INTERNSHIP + data.JOB;
    if (total === 0) return 0;
    return Math.round((data[category] / total) * 100);
  }

  getAcceptedPercent(): number {
    const s = this.stats();
    if (!s || s.totalApplications === 0) return 0;
    return Math.round((s.acceptedApplications / s.totalApplications) * 100);
  }
}
