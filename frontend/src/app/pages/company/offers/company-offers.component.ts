import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-company-offers',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="My Offers" pageSubtitle="Manage your job postings" [showSearch]="false"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Company Offers Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Offers management coming soon...</p>
    </div>
  `
})
export class CompanyOffersComponent {}
