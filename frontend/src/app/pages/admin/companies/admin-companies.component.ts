import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CompanyService } from '../../../core/services/company.service';
import { Company, PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-admin-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Manage Companies" 
      pageSubtitle="View and approve company accounts"
      [showSearch]="true"
      (search)="onSearch($event)"
    ></app-navbar>

    <div class="companies-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card glass-card">
          <div class="stat-icon total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalCompanies() }}</span>
            <span class="stat-label">Total Companies</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon approved">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getApprovalCount(true) }}</span>
            <span class="stat-label">Approved</span>
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
            <span class="stat-value">{{ getApprovalCount(false) }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters glass-card">
        <div class="filter-group">
          <label>Approval Status</label>
          <select [(ngModel)]="approvalFilter" (change)="loadCompanies()" class="input-glass">
            <option value="">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending Approval</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Sector</label>
          <select [(ngModel)]="sectorFilter" (change)="loadCompanies()" class="input-glass">
            <option value="">All Sectors</option>
            <option *ngFor="let sector of uniqueSectors()" [value]="sector">{{ sector }}</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading companies..."></app-loading-spinner>

      <!-- Companies Table -->
      <div class="companies-table glass-card" *ngIf="!isLoading() && companies().length > 0">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Sector</th>
              <th>Status</th>
              <th>Offers</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let company of companies()">
              <td>
                <div class="company-cell">
                  <div class="company-logo">{{ getInitials(company.name) }}</div>
                  <div class="company-info">
                    <span class="name">{{ company.name }}</span>
                    <span class="email">{{ company.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="sector">{{ company.sector }}</span>
              </td>
              <td>
                <span class="badge" [ngClass]="{ 'badge-active': company.isApproved, 'badge-pending': !company.isApproved }">
                  {{ company.isApproved ? 'Approved' : 'Pending' }}
                </span>
              </td>
              <td>
                <span class="offers-count">{{ company._count?.offers || 0 }}</span>
              </td>
              <td>
                <span class="date">{{ company.createdAt | date:'mediumDate' }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-view" title="View Details" (click)="viewCompany(company)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button *ngIf="!company.isApproved" class="btn-icon btn-approve" title="Approve Company" 
                          (click)="toggleApproval(company, true)" [disabled]="isUpdating()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button *ngIf="company.isApproved" class="btn-icon btn-revoke" title="Revoke Approval"
                          (click)="toggleApproval(company, false)" [disabled]="isUpdating()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                  <button class="btn-icon btn-delete" title="Delete Company" (click)="confirmDelete(company)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
      <div class="empty-state glass-card" *ngIf="!isLoading() && companies().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <h3>No companies found</h3>
        <p>{{ approvalFilter || sectorFilter || searchQuery ? 'Try adjusting your filters' : 'No companies have registered yet' }}</p>
      </div>
    </div>

    <!-- Company Detail Modal -->
    <div class="modal-overlay" *ngIf="selectedCompany()" (click)="closeModal()">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="company-profile">
            <div class="logo-large">{{ getInitials(selectedCompany()?.name) }}</div>
            <div class="profile-info">
              <h2>{{ selectedCompany()?.name }}</h2>
              <p>{{ selectedCompany()?.sector }}</p>
              <span class="badge" [ngClass]="{ 'badge-active': selectedCompany()?.isApproved, 'badge-pending': !selectedCompany()?.isApproved }">
                {{ selectedCompany()?.isApproved ? 'Approved' : 'Pending Approval' }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="detail-section" *ngIf="selectedCompany()?.description">
            <h4>Description</h4>
            <p>{{ selectedCompany()?.description }}</p>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Email</span>
              <span class="value">{{ selectedCompany()?.email }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedCompany()?.phone">
              <span class="label">Phone</span>
              <span class="value">{{ selectedCompany()?.phone }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedCompany()?.address">
              <span class="label">Address</span>
              <span class="value">{{ selectedCompany()?.address }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Offers Posted</span>
              <span class="value">{{ selectedCompany()?._count?.offers || 0 }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Joined</span>
              <span class="value">{{ selectedCompany()?.createdAt | date:'medium' }}</span>
            </div>
          </div>

          <div class="links-section" *ngIf="selectedCompany()?.website">
            <a [href]="selectedCompany()?.website" target="_blank" class="link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Visit Website
            </a>
          </div>
        </div>

        <div class="modal-actions">
          <button *ngIf="!selectedCompany()?.isApproved" class="btn-approve-lg" 
                  (click)="toggleApproval(selectedCompany()!, true); closeModal();">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Approve Company
          </button>
          <button *ngIf="selectedCompany()?.isApproved" class="btn-revoke-lg"
                  (click)="toggleApproval(selectedCompany()!, false); closeModal();">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Revoke Approval
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal()" (click)="cancelDelete()">
      <div class="modal glass-card delete-modal" (click)="$event.stopPropagation()">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete {{ companyToDelete()?.name }}? This will also delete all their offers and associated applications.</p>
        <div class="delete-actions">
          <button class="btn-glass" (click)="cancelDelete()">Cancel</button>
          <button class="btn-danger" (click)="deleteCompany()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .companies-content { max-width: 1400px; }
    
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.total { background: rgba(0,212,170,0.15); color: #00d4aa; }
    .stat-icon.approved { background: rgba(16,185,129,0.15); color: #10b981; }
    .stat-icon.pending { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; color: white; }
    .stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .filters { display: flex; gap: 1rem; padding: 1rem 1.5rem; margin-bottom: 1.5rem; }
    .filter-group { display: flex; flex-direction: column; gap: 0.5rem; min-width: 180px; }
    .filter-group label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    
    .companies-table { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem 1.5rem; font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.1); }
    td { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
    tr:hover td { background: rgba(255,255,255,0.02); }
    
    .company-cell { display: flex; align-items: center; gap: 0.75rem; }
    .company-logo { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 0.875rem; font-weight: 600; color: white; flex-shrink: 0; }
    .company-info { display: flex; flex-direction: column; }
    .company-info .name { font-weight: 500; color: white; }
    .company-info .email { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .sector { color: rgba(255,255,255,0.8); }
    .offers-count { font-weight: 600; color: #a855f7; }
    .date { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
    
    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .btn-view { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
    .btn-view:hover { background: rgba(255,255,255,0.1); color: white; }
    .btn-approve { background: rgba(16,185,129,0.15); color: #10b981; }
    .btn-approve:hover { background: rgba(16,185,129,0.25); }
    .btn-revoke { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .btn-revoke:hover { background: rgba(245,158,11,0.25); }
    .btn-delete { background: rgba(239,68,68,0.15); color: #ef4444; }
    .btn-delete:hover { background: rgba(239,68,68,0.25); }
    .btn-icon:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .page-info { color: rgba(255,255,255,0.7); }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 4rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1.5rem 0 0.5rem; }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal { max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 0; position: relative; }
    .modal-close { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border: none; width: 36px; height: 36px; border-radius: 50%; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 1; }
    .modal-close:hover { background: rgba(255,255,255,0.2); color: white; }
    
    .modal-header { padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .company-profile { display: flex; align-items: center; gap: 1.25rem; }
    .logo-large { width: 72px; height: 72px; border-radius: 16px; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 700; color: white; }
    .profile-info h2 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; margin: 0 0 0.25rem; }
    .profile-info p { color: rgba(255,255,255,0.6); margin: 0 0 0.75rem; }
    
    .modal-body { padding: 2rem; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h4 { font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; margin: 0 0 0.5rem; }
    .detail-section p { color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0; }
    
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .detail-item .label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
    .detail-item .value { font-size: 0.9375rem; color: white; }
    
    .links-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .link-item { display: inline-flex; align-items: center; gap: 0.5rem; color: #00d4aa; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
    .link-item:hover { color: #5eead4; }
    
    .modal-actions { display: flex; gap: 1rem; padding: 1.5rem 2rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .btn-approve-lg { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem; border-radius: 8px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-approve-lg:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16,185,129,0.4); }
    .btn-revoke-lg { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem; border-radius: 8px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-revoke-lg:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(245,158,11,0.4); }
    
    .delete-modal { padding: 2rem; max-width: 420px; }
    .delete-modal h3 { color: white; margin: 0 0 1rem; font-size: 1.25rem; }
    .delete-modal p { color: rgba(255,255,255,0.7); margin: 0 0 1.5rem; }
    .delete-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239,68,68,0.4); }
    
    @media (max-width: 1024px) {
      .stats-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .filters { flex-direction: column; }
      .companies-table { overflow-x: auto; }
      table { min-width: 800px; }
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminCompaniesComponent implements OnInit {
  isLoading = signal(true);
  isUpdating = signal(false);
  companies = signal<Company[]>([]);
  totalCompanies = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedCompany = signal<Company | null>(null);
  showDeleteModal = signal(false);
  companyToDelete = signal<Company | null>(null);
  
  approvalFilter = '';
  sectorFilter = '';
  searchQuery = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading.set(true);
    
    const isApproved = this.approvalFilter === '' ? undefined : this.approvalFilter === 'true';
    
    this.companyService.getAllCompanies({
      page: this.currentPage(),
      limit: 15,
      search: this.searchQuery || undefined,
      isApproved,
      sector: this.sectorFilter || undefined
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.companies.set(response.data.data);
          this.totalCompanies.set(response.data.pagination.total);
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
    this.loadCompanies();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadCompanies();
  }

  getApprovalCount(approved: boolean): number {
    return this.companies().filter(c => c.isApproved === approved).length;
  }

  uniqueSectors(): string[] {
    const sectors = new Set(this.companies().map(c => c.sector));
    return Array.from(sectors).filter(s => s);
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  viewCompany(company: Company): void {
    this.selectedCompany.set(company);
  }

  closeModal(): void {
    this.selectedCompany.set(null);
  }

  toggleApproval(company: Company, isApproved: boolean): void {
    this.isUpdating.set(true);
    
    this.companyService.toggleApproval(company.id, isApproved).subscribe({
      next: (response) => {
        if (response.success) {
          this.companies.update(companies => 
            companies.map(c => c.id === company.id ? { ...c, isApproved } : c)
          );
        }
        this.isUpdating.set(false);
      },
      error: () => this.isUpdating.set(false)
    });
  }

  confirmDelete(company: Company): void {
    this.companyToDelete.set(company);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.companyToDelete.set(null);
  }

  deleteCompany(): void {
    const company = this.companyToDelete();
    if (!company) return;

    this.companyService.deleteCompany(company.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.companies.update(companies => companies.filter(c => c.id !== company.id));
          this.totalCompanies.update(t => t - 1);
        }
        this.cancelDelete();
      },
      error: () => this.cancelDelete()
    });
  }
}
