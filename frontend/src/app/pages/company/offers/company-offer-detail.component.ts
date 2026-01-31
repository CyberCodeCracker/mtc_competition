import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-company-offer-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="Offer Details" pageSubtitle="View and manage applications" [showSearch]="false"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Offer Detail Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Offer details coming soon...</p>
    </div>
  `
})
export class CompanyOfferDetailComponent {}
