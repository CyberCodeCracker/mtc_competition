import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EditOfferComponent } from './edit-offer.component';
import { CompanyService } from '../../../core/services/company.service';
import { OfferService } from '../../../core/services/offer.service';
import { Offer, OfferCategory, OfferStatus } from '../../../core/models';

@Component({
  selector: 'app-company-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent, EditOfferComponent],
  template: `
    <app-navbar 
      pageTitle="My Offers" 
      pageSubtitle="Manage your job postings"
      [showSearch]="true"
      (search)="onSearch($event)"
    >
      <button class="btn-primary" routerLink="/company/offers/new">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create New Offer
      </button>
    </app-navbar>

    <div class="offers-content">
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
        <div class="stats-mini">
          <div class="stat-item">
            <span class="stat-value">{{ offers().length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ getActiveCount() }}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ getTotalApplications() }}</span>
            <span class="stat-label">Applications</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading your offers..."></app-loading-spinner>

      <!-- Offers Grid -->
      <div class="offers-grid" *ngIf="!isLoading()">
        <div class="offer-card glass-card" *ngFor="let offer of filteredOffers()" [@fadeIn]>
          <div class="offer-header">
            <span class="badge" [ngClass]="{
              'badge-active': offer.category === 'PFE',
              'badge-pending': offer.category === 'SUMMER_INTERNSHIP',
              'badge-accepted': offer.category === 'JOB'
            }">{{ getCategoryLabel(offer.category) }}</span>
            <span class="badge" [ngClass]="{
              'badge-active': offer.status === 'ACTIVE',
              'badge-closed': offer.status === 'CLOSED',
              'badge-pending': offer.status === 'DRAFT'
            }">{{ offer.status }}</span>
          </div>
          <h3 class="offer-title">{{ offer.title }}</h3>
          <p class="offer-description">{{ offer.description | slice:0:120 }}...</p>
          <div class="offer-meta">
            <span *ngIf="offer.location" class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ offer.location }}
            </span>
            <span *ngIf="offer.duration" class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ offer.duration }}
            </span>
            <span class="meta-item applications-count">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {{ offer._count?.applications || 0 }} applications
            </span>
          </div>
          <div class="offer-footer">
            <span class="posted-date">Posted: {{ offer.postedDate | date:'mediumDate' }}</span>
            <div class="action-buttons">
              <button class="btn-action btn-edit" title="Edit" (click)="editOffer(offer)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-action btn-view" title="View Applications" [routerLink]="['/company/offers', offer.id]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button class="btn-action btn-danger-glass" title="Delete" (click)="confirmDelete(offer)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-card" *ngIf="!isLoading() && filteredOffers().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <h3>No offers found</h3>
        <p>Create your first job posting to start receiving applications</p>
        <button class="btn-primary" routerLink="/company/offers/new">Create Offer</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal()" (click)="cancelDelete()">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ offerToDelete()?.title }}"? This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-glass" (click)="cancelDelete()">Cancel</button>
          <button class="btn-danger" (click)="deleteOffer()">Delete</button>
        </div>
      </div>
    </div>

    <app-edit-offer 
      *ngIf="editingOffer()" 
      [offer]="editingOffer()!"
      (saved)="onOfferSaved($event)"
      (cancelled)="onEditCancelled()"
    ></app-edit-offer>
  `,
  styles: [`
    :host { display: block; }
    .offers-content { max-width: 1400px; }
    .filters { display: flex; gap: 1rem; padding: 1rem 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end; }
    .filter-group { display: flex; flex-direction: column; gap: 0.5rem; min-width: 180px; }
    .filter-group label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    .filter-group select { max-width: 250px; }
    .stats-mini { display: flex; gap: 2rem; margin-left: auto; }
    .stat-item { display: flex; flex-direction: column; align-items: center; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: #00d4aa; }
    .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
    .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
    .offer-card { padding: 1.5rem; transition: all 0.3s; }
    .offer-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,212,170,0.15); }
    .offer-header { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .offer-title { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; color: white; margin: 0 0 0.75rem; }
    .offer-description { font-size: 0.875rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 1rem; min-height: 48px; }
    .offer-meta { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .meta-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: rgba(255,255,255,0.6); }
    .applications-count { color: #a855f7; }
    .offer-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .posted-date { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-action { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-edit { background: rgba(0,212,170,0.1); color: #00d4aa; border: 1px solid rgba(0,212,170,0.2); }
    .btn-edit:hover { background: rgba(0,212,170,0.2); transform: translateY(-2px); }
    .btn-view { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.1); }
    .btn-view:hover { background: rgba(255,255,255,0.1); color: white; transform: translateY(-2px); }
    .btn-glass { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
    .btn-glass:hover { background: rgba(255,255,255,0.1); color: white; }
    .btn-danger-glass { background: rgba(239,68,68,0.1); color: #ef4444; }
    .btn-danger-glass:hover { background: rgba(239,68,68,0.2); transform: translateY(-2px); }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 4rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1.5rem 0 0.5rem; font-size: 1.5rem; }
    .empty-state p { margin-bottom: 1.5rem; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { padding: 2rem; max-width: 420px; width: 90%; }
    .modal h3 { color: white; margin: 0 0 1rem; font-size: 1.25rem; }
    .modal p { color: rgba(255,255,255,0.7); margin: 0 0 1.5rem; }
    .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239,68,68,0.4); }
    .badge-closed { background: rgba(239,68,68,0.15); color: #f87171; }
    select.input-glass option { background: #1e293b; color: white; }
    @media (max-width: 768px) {
      .stats-mini { width: 100%; justify-content: space-around; margin-left: 0; margin-top: 1rem; }
      .offers-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CompanyOffersComponent implements OnInit {
  isLoading = signal(true);
  offers = signal<Offer[]>([]);
  filteredOffers = signal<Offer[]>([]);
  showDeleteModal = signal(false);
  offerToDelete = signal<Offer | null>(null);
  
  categoryFilter = '';
  statusFilter = '';
  searchQuery = '';
  editingOffer = signal<Offer | null>(null);

  constructor(
    private companyService: CompanyService,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading.set(true);
    this.companyService.getMyOffers(this.statusFilter || undefined).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.offers.set(response.data);
          this.applyFilters();
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  applyFilters(): void {
    let filtered = this.offers();
    
    if (this.categoryFilter) {
      filtered = filtered.filter(o => o.category === this.categoryFilter);
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.title.toLowerCase().includes(query) || 
        o.description.toLowerCase().includes(query)
      );
    }
    
    this.filteredOffers.set(filtered);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  getCategoryLabel(category: OfferCategory): string {
    switch (category) {
      case OfferCategory.PFE: return 'PFE';
      case OfferCategory.SUMMER_INTERNSHIP: return 'Internship';
      case OfferCategory.JOB: return 'Job';
      default: return String(category);
    }
  }

  getActiveCount(): number {
    return this.offers().filter(o => o.status === OfferStatus.ACTIVE).length;
  }

  getTotalApplications(): number {
    return this.offers().reduce((sum, o) => sum + (o._count?.applications || 0), 0);
  }

  editOffer(offer: Offer): void {
    console.log('Opening edit modal for offer:', offer.title);
    this.editingOffer.set(offer);
  }

  onOfferSaved(updatedOffer: Offer): void {
    this.offers.update(offers => offers.map(o => o.id === updatedOffer.id ? updatedOffer : o));
    this.applyFilters();
    this.editingOffer.set(null);
  }

  onEditCancelled(): void {
    this.editingOffer.set(null);
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
          this.applyFilters();
        }
        this.cancelDelete();
      },
      error: () => this.cancelDelete()
    });
  }
}
