import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StudentService } from '../../../core/services/student.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus } from '../../../core/models';

@Component({
  selector: 'app-student-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="My Applications" 
      pageSubtitle="Track your application status"
      [showSearch]="false"
    ></app-navbar>

    <div class="applications-content">
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          *ngFor="let tab of tabs" 
          class="tab-btn" 
          [class.active]="activeTab === tab.value"
          (click)="filterByStatus(tab.value)"
        >
          {{ tab.label }}
          <span class="tab-count" *ngIf="tab.count !== undefined">{{ tab.count }}</span>
        </button>
      </div>

      <app-loading-spinner *ngIf="isLoading()" message="Loading applications..."></app-loading-spinner>

      <!-- Applications List -->
      <div class="applications-list" *ngIf="!isLoading()">
        <div class="application-card glass-card" *ngFor="let app of applications()">
          <div class="app-main">
            <div class="app-info">
              <h3 class="app-title">{{ app.offer?.title }}</h3>
              <p class="app-company">{{ app.offer?.company?.name }}</p>
              <div class="app-meta">
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Applied: {{ app.applicationDate | date:'mediumDate' }}
                </span>
              </div>
            </div>
            <div class="app-status">
              <span class="badge badge-lg" [ngClass]="{
                'badge-pending': app.status === 'PENDING',
                'badge-accepted': app.status === 'ACCEPTED',
                'badge-rejected': app.status === 'REJECTED'
              }">{{ app.status }}</span>
            </div>
          </div>
          
          <div class="app-actions">
            <a [routerLink]="['/student/offers', app.offerId]" class="btn-glass btn-sm">View Offer</a>
            <button 
              *ngIf="app.status === 'PENDING'" 
              class="btn-danger btn-sm"
              (click)="withdrawApplication(app.id)"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-card" *ngIf="!isLoading() && applications().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        <h3>No applications found</h3>
        <p>Start applying to offers to see them here</p>
        <a routerLink="/student/offers" class="btn-primary">Browse Offers</a>
      </div>
    </div>
  `,
  styles: [`
    .applications-content { max-width: 900px; }
    .filter-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .tab-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: rgba(255,255,255,0.7); cursor: pointer; transition: all 0.3s; }
    .tab-btn:hover { background: rgba(255,255,255,0.1); }
    .tab-btn.active { background: rgba(0,212,170,0.2); border-color: rgba(0,212,170,0.5); color: #00d4aa; }
    .tab-count { background: rgba(255,255,255,0.1); padding: 0.125rem 0.5rem; border-radius: 10px; font-size: 0.75rem; }
    .applications-list { display: flex; flex-direction: column; gap: 1rem; }
    .application-card { padding: 1.5rem; }
    .app-main { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    @media (max-width: 640px) { .app-main { flex-direction: column; gap: 1rem; } }
    .app-title { font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0 0 0.25rem; }
    .app-company { font-size: 0.875rem; color: #00d4aa; margin: 0 0 0.5rem; }
    .app-meta { display: flex; gap: 1rem; }
    .meta-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: rgba(255,255,255,0.6); }
    .badge-lg { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .app-actions { display: flex; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.8125rem; }
    .btn-danger { background: rgba(244,67,54,0.2); border: 1px solid rgba(244,67,54,0.5); color: #f44336; cursor: pointer; border-radius: 8px; transition: all 0.3s; }
    .btn-danger:hover { background: rgba(244,67,54,0.3); }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 3rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1rem 0 0.5rem; }
    .empty-state .btn-primary { margin-top: 1rem; }
  `]
})
export class StudentApplicationsComponent implements OnInit {
  isLoading = signal(true);
  applications = signal<Application[]>([]);
  allApplications: Application[] = [];
  activeTab = '';

  tabs = [
    { label: 'All', value: '', count: 0 },
    { label: 'Pending', value: 'PENDING', count: 0 },
    { label: 'Accepted', value: 'ACCEPTED', count: 0 },
    { label: 'Rejected', value: 'REJECTED', count: 0 }
  ];

  constructor(
    private studentService: StudentService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.studentService.getMyApplications().subscribe({
      next: (response) => {
        if (response.success) {
          this.allApplications = response.data || [];
          this.updateCounts();
          this.filterByStatus(this.activeTab);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  updateCounts(): void {
    this.tabs[0].count = this.allApplications.length;
    this.tabs[1].count = this.allApplications.filter(a => a.status === 'PENDING').length;
    this.tabs[2].count = this.allApplications.filter(a => a.status === 'ACCEPTED').length;
    this.tabs[3].count = this.allApplications.filter(a => a.status === 'REJECTED').length;
  }

  filterByStatus(status: string): void {
    this.activeTab = status;
    if (status === '') {
      this.applications.set(this.allApplications);
    } else {
      this.applications.set(this.allApplications.filter(a => a.status === status));
    }
  }

  withdrawApplication(id: number): void {
    if (confirm('Are you sure you want to withdraw this application?')) {
      this.applicationService.withdrawApplication(id).subscribe({
        next: () => this.loadApplications()
      });
    }
  }
}
