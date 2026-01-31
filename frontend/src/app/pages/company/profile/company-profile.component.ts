import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="Company Profile" pageSubtitle="Manage your company information" [showSearch]="false"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Company Profile Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Profile management coming soon...</p>
    </div>
  `
})
export class CompanyProfileComponent {}
