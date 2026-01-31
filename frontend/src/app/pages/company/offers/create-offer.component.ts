import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="Create Offer" pageSubtitle="Post a new job opportunity" [showSearch]="false"></app-navbar>
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 style="color: white;">Create Offer Page</h2>
      <p style="color: rgba(255,255,255,0.7);">Offer creation form coming soon...</p>
    </div>
  `
})
export class CreateOfferComponent {}
