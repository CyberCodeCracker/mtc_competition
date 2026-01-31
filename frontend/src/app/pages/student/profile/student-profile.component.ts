import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="My Profile" pageSubtitle="Manage your profile information" [showSearch]="false"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Profile Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Profile management coming soon...</p>
    </div>
  `
})
export class StudentProfileComponent {}
