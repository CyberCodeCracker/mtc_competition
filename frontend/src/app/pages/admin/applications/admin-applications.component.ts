import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="Manage Applications" pageSubtitle="View all applications" [showSearch]="true"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Applications Management Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Applications list coming soon...</p>
    </div>
  `
})
export class AdminApplicationsComponent {}
