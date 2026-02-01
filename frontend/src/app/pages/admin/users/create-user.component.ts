import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar pageTitle="Create User" pageSubtitle="Add a new student, company, or admin" [showSearch]="false"></app-navbar>
    
    <div class="create-user-content">
      <div class="glass-card form-card">
        <!-- User Type Selector -->
        <div class="type-selector">
          <button 
            *ngFor="let type of userTypes" 
            class="type-btn" 
            [class.active]="selectedType() === type.value"
            (click)="selectedType.set(type.value)"
          >
            <span>{{ type.label }}</span>
          </button>
        </div>

        <!-- Student Form -->
        <form *ngIf="selectedType() === 'student'" (ngSubmit)="createStudent()">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name *</label>
              <input type="text" [(ngModel)]="studentData.firstName" name="firstName" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Last Name *</label>
              <input type="text" [(ngModel)]="studentData.lastName" name="lastName" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="studentData.email" name="email" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" [(ngModel)]="studentData.password" name="password" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Study Level *</label>
              <select [(ngModel)]="studentData.studyLevel" name="studyLevel" class="input-glass" required>
                <option value="">Select level</option>
                <option value="1ere">1ère année</option>
                <option value="2eme">2ème année</option>
                <option value="3eme">3ème année</option>
              </select>
            </div>
            <div class="form-group">
              <label>Group *</label>
              <input type="text" [(ngModel)]="studentData.groupName" name="groupName" class="input-glass" required placeholder="e.g., GL1" />
            </div>
          </div>
          <button type="submit" class="btn-primary" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Creating...' : 'Create Student' }}
          </button>
        </form>

        <!-- Company Form -->
        <form *ngIf="selectedType() === 'company'" (ngSubmit)="createCompany()">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Company Name *</label>
              <input type="text" [(ngModel)]="companyData.name" name="name" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="companyData.email" name="email" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" [(ngModel)]="companyData.password" name="password" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Sector *</label>
              <input type="text" [(ngModel)]="companyData.sector" name="sector" class="input-glass" required placeholder="e.g., IT, Finance" />
            </div>
            <div class="form-group">
              <label>Website</label>
              <input type="url" [(ngModel)]="companyData.website" name="website" class="input-glass" placeholder="https://" />
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea [(ngModel)]="companyData.description" name="description" class="input-glass" rows="3"></textarea>
            </div>
          </div>
          <button type="submit" class="btn-primary" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Creating...' : 'Create Company' }}
          </button>
        </form>

        <!-- Admin Form -->
        <form *ngIf="selectedType() === 'admin'" (ngSubmit)="createAdmin()">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Username *</label>
              <input type="text" [(ngModel)]="adminData.username" name="username" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="adminData.email" name="email" class="input-glass" required />
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" [(ngModel)]="adminData.password" name="password" class="input-glass" required />
            </div>
          </div>
          <button type="submit" class="btn-primary" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Creating...' : 'Create Admin' }}
          </button>
        </form>

        <!-- Message -->
        <div class="message success" *ngIf="successMessage()">{{ successMessage() }}</div>
        <div class="message error" *ngIf="errorMessage()">{{ errorMessage() }}</div>
      </div>
    </div>
  `,
  styles: [`
    .create-user-content { max-width: 700px; }
    .form-card { padding: 2rem; }
    .type-selector { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .type-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.7); cursor: pointer; transition: all 0.3s; }
    .type-btn:hover { background: rgba(255,255,255,0.08); }
    .type-btn.active { background: rgba(0,212,170,0.1); border-color: #00d4aa; color: #00d4aa; }
    .type-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    .form-group input, .form-group select, .form-group textarea { width: 100%; }
    .message { padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center; }
    .message.success { background: rgba(0,212,170,0.1); color: #00d4aa; }
    .message.error { background: rgba(244,67,54,0.1); color: #f44336; }
  `]
})
export class CreateUserComponent {
  selectedType = signal<'student' | 'company' | 'admin'>('student');
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  userTypes = [
    { value: 'student' as const, label: 'Student', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
    { value: 'company' as const, label: 'Company', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>' },
    { value: 'admin' as const, label: 'Admin', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' }
  ];

  studentData = { firstName: '', lastName: '', email: '', password: '', studyLevel: '', groupName: '' };
  companyData = { name: '', email: '', password: '', sector: '', description: '', website: '' };
  adminData = { username: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  createStudent(): void {
    this.isSubmitting.set(true);
    this.clearMessages();
    this.authService.registerStudent(this.studentData).subscribe({
      next: () => { this.successMessage.set('Student created successfully!'); this.resetForm(); },
      error: (err) => this.errorMessage.set(err.error?.message || 'Failed to create student'),
      complete: () => this.isSubmitting.set(false)
    });
  }

  createCompany(): void {
    this.isSubmitting.set(true);
    this.clearMessages();
    this.authService.registerCompany(this.companyData).subscribe({
      next: () => { this.successMessage.set('Company created successfully!'); this.resetForm(); },
      error: (err) => this.errorMessage.set(err.error?.message || 'Failed to create company'),
      complete: () => this.isSubmitting.set(false)
    });
  }

  createAdmin(): void {
    this.isSubmitting.set(true);
    this.clearMessages();
    this.authService.registerAdmin(this.adminData).subscribe({
      next: () => { this.successMessage.set('Admin created successfully!'); this.resetForm(); },
      error: (err) => this.errorMessage.set(err.error?.message || 'Failed to create admin'),
      complete: () => this.isSubmitting.set(false)
    });
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  private resetForm(): void {
    this.studentData = { firstName: '', lastName: '', email: '', password: '', studyLevel: '', groupName: '' };
    this.companyData = { name: '', email: '', password: '', sector: '', description: '', website: '' };
    this.adminData = { username: '', email: '', password: '' };
  }
}
