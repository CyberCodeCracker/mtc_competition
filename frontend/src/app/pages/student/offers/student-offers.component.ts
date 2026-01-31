import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { OfferService } from '../../../core/services/offer.service';
import { Offer, OfferCategory, PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-student-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Browse Offers" 
      pageSubtitle="Find your perfect opportunity"
      (search)="onSearch($event)"
    ></app-navbar>

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
            <option value="ACTIVE">Active</option>
            <option value="">All</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading offers..."></app-loading-spinner>

      <!-- Offers Grid -->
      <div class="offers-grid" *ngIf="!isLoading()">
        <div class="offer-card glass-card" *ngFor="let offer of offers()">
          <div class="offer-header">
            <span class="badge" [ngClass]="{
              'badge-active': offer.category === 'PFE',
              'badge-pending': offer.category === 'SUMMER_INTERNSHIP',
              'badge-accepted': offer.category === 'JOB'
            }">{{ getCategoryLabel(offer.category) }}</span>
            <span class="badge" [ngClass]="{
              'badge-active': offer.status === 'ACTIVE',
              'badge-closed': offer.status === 'CLOSED'
            }">{{ offer.status }}</span>
          </div>
          <h3 class="offer-title">{{ offer.title }}</h3>
          <p class="offer-company">{{ offer.company?.name }}</p>
          <p class="offer-description">{{ offer.description | slice:0:100 }}...</p>
          <div class="offer-meta">
            <span *ngIf="offer.location" class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {{ offer.location }}
            </span>
            <span *ngIf="offer.duration" class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {{ offer.duration }}
            </span>
          </div>
          <div class="offer-footer">
            <span class="posted-date">Posted: {{ offer.postedDate | date:'mediumDate' }}</span>
            <a [routerLink]="['/student/offers', offer.id]" class="btn-primary btn-sm">View Details</a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-card" *ngIf="!isLoading() && offers().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <h3>No offers found</h3>
        <p>Try adjusting your filters or check back later</p>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages() > 1">
        <button class="btn-glass" [disabled]="currentPage() === 1" (click)="changePage(currentPage() - 1)">Previous</button>
        <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
        <button class="btn-glass" [disabled]="currentPage() === totalPages()" (click)="changePage(currentPage() + 1)">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .offers-content { max-width: 1400px; }
    .filters { display: flex; gap: 1rem; padding: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filter-group { display: flex; flex-direction: column; gap: 0.5rem; min-width: 200px; }
    .filter-group label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    .filter-group select { max-width: 250px; }
    .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    .offer-card { padding: 1.5rem; transition: all 0.3s; }
    .offer-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,212,170,0.15); }
    .offer-header { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .offer-title { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; color: white; margin: 0 0 0.5rem; }
    .offer-company { font-size: 0.875rem; color: #00d4aa; margin: 0 0 0.75rem; }
    .offer-description { font-size: 0.875rem; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0 0 1rem; }
    .offer-meta { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .meta-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: rgba(255,255,255,0.6); }
    .offer-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .posted-date { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.8125rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 3rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1rem 0 0.5rem; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; }
    .page-info { color: rgba(255,255,255,0.7); }
  `]
})
export class StudentOffersComponent implements OnInit {
  isLoading = signal(true);
  offers = signal<Offer[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  
  categoryFilter = '';
  statusFilter = 'ACTIVE';
  searchQuery = '';

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading.set(true);
    this.offerService.getOffers({
      page: this.currentPage(),
      limit: 12,
      category: this.categoryFilter || undefined,
      status: this.statusFilter || undefined,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.offers.set(response.data.data);
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

  getCategoryLabel(category: OfferCategory): string {
    switch (category) {
      case OfferCategory.PFE: return 'PFE';
      case OfferCategory.SUMMER_INTERNSHIP: return 'Internship';
      case OfferCategory.JOB: return 'Job';
      default: return category;
    }
  }
}
