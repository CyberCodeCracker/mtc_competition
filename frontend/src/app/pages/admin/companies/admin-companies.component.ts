import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-admin-companies',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="Manage Companies" pageSubtitle="View and approve companies" [showSearch]="true"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Companies Management Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Companies list coming soon...</p>
    </div>
  `
})
export class AdminCompaniesComponent {}
