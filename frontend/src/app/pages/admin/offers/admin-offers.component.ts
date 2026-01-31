import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="Manage Offers" pageSubtitle="View all job postings" [showSearch]="true"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Offers Management Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Offers list coming soon...</p>
    </div>
  `
})
export class AdminOffersComponent {}
