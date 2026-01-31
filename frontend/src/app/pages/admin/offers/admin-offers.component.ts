import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { OfferService } from '../../../core/services/offer.service';
import { Offer, OfferCategory, OfferStatus, PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Manage Offers" 
      pageSubtitle="View and manage all job postings on the platform"
      [showSearch]="true"
      (search)="onSearch($event)"
    ></app-navbar>

    <div class="offers-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card glass-card">
          <div class="stat-icon total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalOffers() }}</span>
            <span class="stat-label">Total Offers</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getStatusCount(OfferStatus.ACTIVE) }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon closed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getStatusCount(OfferStatus.CLOSED) }}</span>
            <span class="stat-label">Closed</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon draft">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getStatusCount(OfferStatus.DRAFT) }}</span>
            <span class="stat-label">Drafts</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters glass-card">
        <div class="filter-group">
          <label>Category</label>
          <select [(ngModel)]="categoryFilter" (change)="loadOffers()" class="input-glass">
            <option value="">All Categories</option>
            <option value="PFE">PFE</option>
            <option value="SUMMER_INTERNSHIP">Summer Internship</option>
            <option value="JOB">Job</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Status</label>
          <select [(ngModel)]="statusFilter" (change)="loadOffers()" class="input-glass">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading offers..."></app-loading-spinner>

      <!-- Offers Table -->
      <div class="offers-table glass-card" *ngIf="!isLoading() && offers().length > 0">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Category</th>
              <th>Status</th>
              <th>Applications</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let offer of offers()">
              <td>
                <div class="offer-cell">
                  <span class="offer-title">{{ offer.title }}</span>
                  <span class="offer-location" *ngIf="offer.location">{{ offer.location }}</span>
                </div>
              </td>
              <td>
                <div class="company-cell">
                  <div class="company-logo">{{ getCompanyInitials(offer.company?.name) }}</div>
                  <span>{{ offer.company?.name }}</span>
                </div>
              </td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-active': offer.category === OfferCategory.PFE,
                  'badge-pending': offer.category === OfferCategory.SUMMER_INTERNSHIP,
                  'badge-accepted': offer.category === OfferCategory.JOB
                }">{{ getCategoryLabel(offer.category) }}</span>
              </td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-active': offer.status === OfferStatus.ACTIVE,
                  'badge-closed': offer.status === OfferStatus.CLOSED,
                  'badge-pending': offer.status === OfferStatus.DRAFT
                }">{{ offer.status }}</span>
              </td>
              <td>
                <span class="applications-count">{{ offer._count?.applications || 0 }}</span>
              </td>
              <td>
                <span class="date">{{ offer.postedDate | date:'mediumDate' }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-view" title="View Details" (click)="viewOffer(offer)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button *ngIf="offer.status === OfferStatus.ACTIVE" class="btn-icon btn-close" title="Close Offer" 
                          (click)="closeOffer(offer)" [disabled]="isUpdating()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                  <button *ngIf="offer.status === OfferStatus.CLOSED" class="btn-icon btn-reopen" title="Reopen Offer"
                          (click)="reopenOffer(offer)" [disabled]="isUpdating()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                  </button>
                  <button class="btn-icon btn-delete" title="Delete Offer" (click)="confirmDelete(offer)">
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
      <div class="empty-state glass-card" *ngIf="!isLoading() && offers().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <h3>No offers found</h3>
        <p>{{ categoryFilter || statusFilter || searchQuery ? 'Try adjusting your filters' : 'No offers have been posted yet' }}</p>
      </div>
    </div>

    <!-- Offer Detail Modal -->
    <div class="modal-overlay" *ngIf="selectedOffer()" (click)="closeModal()">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="offer-badges">
            <span class="badge" [ngClass]="{
              'badge-active': selectedOffer()?.category === OfferCategory.PFE,
              'badge-pending': selectedOffer()?.category === OfferCategory.SUMMER_INTERNSHIP,
              'badge-accepted': selectedOffer()?.category === OfferCategory.JOB
            }">{{ getCategoryLabel(selectedOffer()?.category!) }}</span>
            <span class="badge" [ngClass]="{
              'badge-active': selectedOffer()?.status === OfferStatus.ACTIVE,
              'badge-closed': selectedOffer()?.status === OfferStatus.CLOSED,
              'badge-pending': selectedOffer()?.status === OfferStatus.DRAFT
            }">{{ selectedOffer()?.status }}</span>
          </div>
          <h2>{{ selectedOffer()?.title }}</h2>
          <p class="company-name">{{ selectedOffer()?.company?.name }}</p>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h4>Description</h4>
            <p>{{ selectedOffer()?.description }}</p>
          </div>

          <div class="detail-section" *ngIf="selectedOffer()?.requirements">
            <h4>Requirements</h4>
            <p>{{ selectedOffer()?.requirements }}</p>
          </div>

          <div class="detail-grid">
            <div class="detail-item" *ngIf="selectedOffer()?.location">
              <span class="label">Location</span>
              <span class="value">{{ selectedOffer()?.location }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedOffer()?.duration">
              <span class="label">Duration</span>
              <span class="value">{{ selectedOffer()?.duration }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedOffer()?.salary">
              <span class="label">Salary</span>
              <span class="value">{{ selectedOffer()?.salary }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedOffer()?.deadline">
              <span class="label">Deadline</span>
              <span class="value">{{ selectedOffer()?.deadline | date:'mediumDate' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Posted</span>
              <span class="value">{{ selectedOffer()?.postedDate | date:'medium' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Applications</span>
              <span class="value">{{ selectedOffer()?._count?.applications || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal()" (click)="cancelDelete()">
      <div class="modal glass-card delete-modal" (click)="$event.stopPropagation()">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ offerToDelete()?.title }}"? This action cannot be undone and will also delete all associated applications.</p>
        <div class="modal-actions">
          <button class="btn-glass" (click)="cancelDelete()">Cancel</button>
          <button class="btn-danger" (click)="deleteOffer()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .offers-content { max-width: 1400px; }
    
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.total { background: rgba(0,212,170,0.15); color: #00d4aa; }
    .stat-icon.active { background: rgba(16,185,129,0.15); color: #10b981; }
    .stat-icon.closed { background: rgba(239,68,68,0.15); color: #ef4444; }
    .stat-icon.draft { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; color: white; }
    .stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .filters { display: flex; gap: 1rem; padding: 1rem 1.5rem; margin-bottom: 1.5rem; }
    .filter-group { display: flex; flex-direction: column; gap: 0.5rem; min-width: 180px; }
    .filter-group label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    
    .offers-table { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem 1.5rem; font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.1); }
    td { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
    tr:hover td { background: rgba(255,255,255,0.02); }
    
    .offer-cell { display: flex; flex-direction: column; gap: 0.25rem; }
    .offer-title { font-weight: 500; color: white; }
    .offer-location { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .company-cell { display: flex; align-items: center; gap: 0.75rem; }
    .company-logo { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: white; }
    
    .applications-count { font-weight: 600; color: #a855f7; }
    .date { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
    
    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .btn-view { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
    .btn-view:hover { background: rgba(255,255,255,0.1); color: white; }
    .btn-close { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .btn-close:hover { background: rgba(245,158,11,0.25); }
    .btn-reopen { background: rgba(16,185,129,0.15); color: #10b981; }
    .btn-reopen:hover { background: rgba(16,185,129,0.25); }
    .btn-delete { background: rgba(239,68,68,0.15); color: #ef4444; }
    .btn-delete:hover { background: rgba(239,68,68,0.25); }
    .btn-icon:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .badge-closed { background: rgba(239,68,68,0.15); color: #f87171; }
    
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .page-info { color: rgba(255,255,255,0.7); }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 4rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1.5rem 0 0.5rem; }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal { max-width: 640px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 0; position: relative; }
    .modal-close { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border: none; width: 36px; height: 36px; border-radius: 50%; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 1; }
    .modal-close:hover { background: rgba(255,255,255,0.2); color: white; }
    
    .modal-header { padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .offer-badges { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .modal-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; margin: 0 0 0.5rem; }
    .company-name { color: #00d4aa; margin: 0; }
    
    .modal-body { padding: 2rem; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h4 { font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem; }
    .detail-section p { color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0; white-space: pre-wrap; }
    
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .detail-item .label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
    .detail-item .value { font-size: 0.9375rem; color: white; }
    
    .delete-modal { padding: 2rem; max-width: 420px; }
    .delete-modal h3 { color: white; margin: 0 0 1rem; font-size: 1.25rem; }
    .delete-modal p { color: rgba(255,255,255,0.7); margin: 0 0 1.5rem; }
    .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239,68,68,0.4); }
    
    @media (max-width: 1024px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .stats-row { grid-template-columns: 1fr; }
      .filters { flex-direction: column; }
      .offers-table { overflow-x: auto; }
      table { min-width: 900px; }
    }
  `]
})
export class AdminOffersComponent implements OnInit {
  // Expose enums to template
  OfferStatus = OfferStatus;
  OfferCategory = OfferCategory;

  isLoading = signal(true);
  isUpdating = signal(false);
  offers = signal<Offer[]>([]);
  totalOffers = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedOffer = signal<Offer | null>(null);
  showDeleteModal = signal(false);
  offerToDelete = signal<Offer | null>(null);
  
  categoryFilter = '';
  statusFilter = '';
  searchQuery = '';

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading.set(true);
    this.offerService.getOffers({
      page: this.currentPage(),
      limit: 15,
      category: this.categoryFilter || undefined,
      status: this.statusFilter || undefined,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.offers.set(response.data.data);
          this.totalOffers.set(response.data.pagination.total);
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
    this.loadOffers();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadOffers();
  }

  getStatusCount(status: OfferStatus): number {
    return this.offers().filter(o => o.status === status).length;
  }

  getCategoryLabel(category: OfferCategory): string {
    switch (category) {
      case OfferCategory.PFE: return 'PFE';
      case OfferCategory.SUMMER_INTERNSHIP: return 'Internship';
      case OfferCategory.JOB: return 'Job';
      default: return String(category);
    }
  }

  getCompanyInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  viewOffer(offer: Offer): void {
    this.selectedOffer.set(offer);
  }

  closeModal(): void {
    this.selectedOffer.set(null);
  }

  closeOffer(offer: Offer): void {
    this.updateOfferStatus(offer, OfferStatus.CLOSED);
  }

  reopenOffer(offer: Offer): void {
    this.updateOfferStatus(offer, OfferStatus.ACTIVE);
  }

  private updateOfferStatus(offer: Offer, status: OfferStatus): void {
    this.isUpdating.set(true);
    this.offerService.updateOffer(offer.id, { status }).subscribe({
      next: (response) => {
        if (response.success) {
          this.offers.update(offers => 
            offers.map(o => o.id === offer.id ? { ...o, status } : o)
          );
        }
        this.isUpdating.set(false);
      },
      error: () => this.isUpdating.set(false)
    });
  }

  confirmDelete(offer: Offer): void {
    this.offerToDelete.set(offer);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.offerToDelete.set(null);
  }

  deleteOffer(): void {
    const offer = this.offerToDelete();
    if (!offer) return;

    this.offerService.deleteOffer(offer.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.offers.update(offers => offers.filter(o => o.id !== offer.id));
          this.totalOffers.update(t => t - 1);
        }
        this.cancelDelete();
      },
      error: () => this.cancelDelete()
    });
  }
}
