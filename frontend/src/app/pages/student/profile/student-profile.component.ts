import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { Student, StudentStats } from '../../../core/models';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="My Profile" 
      pageSubtitle="Manage your credentials and portfolio"
      [showSearch]="false"
    ></app-navbar>

    <div class="profile-container">
      <app-loading-spinner *ngIf="isLoading()" message="Loading profile..."></app-loading-spinner>

      <div class="profile-grid" *ngIf="!isLoading() && student()">
        <!-- Left Column: Basic Info & Profile Action -->
        <div class="profile-sidebar">
          <div class="glass-card profile-header-card">
            <div class="avatar-container">
              <div class="avatar-large">
                {{ getInitials() }}
              </div>
              <div class="avatar-edit-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            <h2 class="student-name">{{ student()?.firstName }} {{ student()?.lastName }}</h2>
            <p class="student-role">Student at ENET'COM</p>
            
            <div class="stats-mini">
              <div class="stat-mini-item">
                <span class="val">{{ stats()?.totalApplications || 0 }}</span>
                <span class="lbl">Applications</span>
              </div>
              <div class="stat-mini-item">
                <span class="val">{{ stats()?.acceptedApplications || 0 }}</span>
                <span class="lbl">Accepted</span>
              </div>
            </div>

            <div class="profile-actions">
              <button class="btn-primary w-full" (click)="saveProfile()" [disabled]="profileForm.invalid || isSaving()">
                <span *ngIf="isSaving()" class="spinner"></span>
                {{ isSaving() ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="glass-card quick-links">
            <h3 class="card-title">Professional Links</h3>
            <div class="links-form" [formGroup]="profileForm">
              <div class="form-group">
                <label>LinkedIn URL</label>
                <div class="input-with-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <input type="url" formControlName="linkedin" class="input-glass" placeholder="https://linkedin.com/in/...">
                </div>
              </div>
              <div class="form-group">
                <label>GitHub URL</label>
                <div class="input-with-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <input type="url" formControlName="github" class="input-glass" placeholder="https://github.com/...">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Profile Details Form -->
        <div class="profile-main">
          <div class="glass-card main-form-card" [formGroup]="profileForm">
            <h3 class="section-title">Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" formControlName="firstName" class="input-glass">
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" formControlName="lastName" class="input-glass">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" formControlName="email" class="input-glass" readonly>
                <span class="helper-text">Email cannot be changed</span>
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" formControlName="phone" class="input-glass" placeholder="+216 ...">
              </div>
            </div>

            <h3 class="section-title mt-8">Academic Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Study Level</label>
                <select formControlName="studyLevel" class="input-glass">
                  <option value="GL3">GL3 - Software Engineering 1</option>
                  <option value="GL4">GL4 - Software Engineering 2</option>
                  <option value="GL5">GL5 - Software Engineering 3</option>
                  <option value="RT3">RT3 - Network & Telecom 1</option>
                  <option value="RT4">RT4 - Network & Telecom 2</option>
                  <option value="RT5">RT5 - Network & Telecom 3</option>
                  <option value="MPI1">MPI1 - Prepa 1</option>
                  <option value="MPI2">MPI2 - Prepa 2</option>
                </select>
              </div>
              <div class="form-group">
                <label>Group / Class</label>
                <input type="text" formControlName="groupName" class="input-glass" placeholder="e.g., GL3-A">
              </div>
            </div>

            <h3 class="section-title mt-8">Skills & Expertise</h3>
            <div class="form-group">
              <label>Skills (comma separated)</label>
              <textarea formControlName="skills" class="input-glass" rows="3" 
                        placeholder="e.g., Angular, Node.js, TypeScript, Docker, SQL"></textarea>
              <div class="skills-preview" *ngIf="profileForm.get('skills')?.value">
                <span class="skill-tag" *ngFor="let skill of getSkillsList()">{{ skill }}</span>
              </div>
            </div>
          </div>

          <!-- Password Change -->
          <div class="glass-card main-form-card mt-6">
            <h3 class="section-title">Change Password</h3>
            <p class="section-desc">Keep your account secure by updating your password regularly.</p>
            <div class="password-form" [formGroup]="passwordForm">
              <div class="form-row">
                <div class="form-group">
                  <label>Current Password</label>
                  <input type="password" formControlName="currentPassword" class="input-glass" placeholder="••••••••">
                </div>
                <div class="form-group">
                  <label>New Password</label>
                  <input type="password" formControlName="newPassword" class="input-glass" placeholder="••••••••">
                </div>
              </div>
              <div class="form-actions-mini">
                <button class="btn-secondary" (click)="changePassword()" 
                        [disabled]="passwordForm.invalid || isChangingPassword()">
                  <span *ngIf="isChangingPassword()" class="spinner"></span>
                  Update Password
                </button>
              </div>
              <p class="success-msg" *ngIf="passwordSuccess()">Password updated successfully!</p>
              <p class="error-msg" *ngIf="passwordError()">{{ passwordError() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 1200px; margin: 0 auto; }
    .profile-grid { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; }
    
    .profile-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
    .profile-header-card { padding: 2.5rem 2rem; text-align: center; }
    
    .avatar-container { position: relative; width: 120px; height: 120px; margin: 0 auto 1.5rem; }
    .avatar-large { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 700; color: white; border: 4px solid rgba(255,255,255,0.1); }
    .avatar-edit-overlay { position: absolute; bottom: 5px; right: 5px; background: #1e293b; color: #00d4aa; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.2s; }
    .avatar-edit-overlay:hover { background: #00d4aa; color: white; transform: scale(1.1); }
    
    .student-name { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; margin: 0 0 0.25rem; }
    .student-role { color: rgba(255,255,255,0.5); font-size: 0.9375rem; margin-bottom: 2rem; }
    
    .stats-mini { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; }
    .stat-mini-item { display: flex; flex-direction: column; align-items: center; }
    .stat-mini-item .val { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; color: #00d4aa; }
    .stat-mini-item .lbl { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; }
    
    .section-title { font-family: 'Outfit', sans-serif; font-size: 1.125rem; font-weight: 600; color: white; margin: 0 0 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .mt-8 { margin-top: 2rem; }
    .mt-6 { margin-top: 1.5rem; }
    
    .card-title { font-size: 1rem; color: white; margin-bottom: 1.5rem; }
    .quick-links { padding: 1.5rem; }
    .links-form { display: flex; flex-direction: column; gap: 1rem; }
    
    .input-with-icon { position: relative; }
    .input-with-icon svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4); }
    .input-with-icon input { padding-left: 2.75rem; }
    
    .main-form-card { padding: 2.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.7); }
    .helper-text { font-size: 0.75rem; color: rgba(255,255,255,0.4); font-style: italic; }
    
    .input-glass { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.75rem 1rem; color: white; font-size: 0.9375rem; transition: all 0.2s; }
    .input-glass:focus { outline: none; border-color: #00d4aa; box-shadow: 0 0 0 3px rgba(0,212,170,0.15); }
    .input-glass:read-only { opacity: 0.7; cursor: not-allowed; }
    select.input-glass option { background: #1e293b; color: white; }
    
    .skills-preview { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .skill-tag { background: rgba(0,212,170,0.1); color: #00d4aa; padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.8125rem; font-weight: 500; }
    
    .section-desc { color: rgba(255,255,255,0.5); font-size: 0.875rem; margin-bottom: 1.5rem; }
    .form-actions-mini { display: flex; justify-content: flex-end; margin-top: 1rem; }
    
    .success-msg { color: #10b981; font-size: 0.875rem; margin-top: 1rem; }
    .error-msg { color: #ef4444; font-size: 0.875rem; margin-top: 1rem; }
    
    .w-full { width: 100%; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; margin-right: 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    @media (max-width: 992px) {
      .profile-grid { grid-template-columns: 1fr; }
      .profile-sidebar { order: 2; }
      .profile-main { order: 1; }
    }
    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  isLoading = signal(true);
  isSaving = signal(false);
  isChangingPassword = signal(false);
  
  student = signal<Student | null>(null);
  stats = signal<StudentStats | null>(null);
  
  passwordSuccess = signal(false);
  passwordError = signal('');
  
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private studentService: StudentService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: [''],
      studyLevel: [''],
      groupName: [''],
      skills: [''],
      linkedin: [''],
      github: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    
    // Get full profile from auth service (which fetches from /auth/profile)
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.student.set(response.data);
          this.patchForm(response.data);
          this.loadStats();
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadStats(): void {
    this.studentService.getMyStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats.set(response.data);
        } else if (response.success) {
          this.stats.set(null);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  patchForm(student: Student): void {
    this.profileForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      studyLevel: student.studyLevel || '',
      groupName: student.groupName || '',
      skills: student.skills || '',
      linkedin: student.linkedin || '',
      github: student.github || ''
    });
  }

  getInitials(): string {
    const first = this.student()?.firstName?.charAt(0) || '';
    const last = this.student()?.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  getSkillsList(): string[] {
    const skills = this.profileForm.get('skills')?.value;
    if (!skills) return [];
    return skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    const updatedData = this.profileForm.getRawValue();
    delete updatedData.email; // Don't send email even if ignored by backend

    this.studentService.updateStudent(this.student()!.id, updatedData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.student.set(response.data);
          // Update auth service signal too
          this.loadProfile();
        }
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false)
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isChangingPassword.set(true);
    this.passwordSuccess.set(false);
    this.passwordError.set('');

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          this.passwordSuccess.set(true);
          this.passwordForm.reset();
        } else {
          this.passwordError.set(response.message || 'Failed to change password');
        }
        this.isChangingPassword.set(false);
      },
      error: (error) => {
        this.passwordError.set(error.error?.message || 'Current password incorrect');
        this.isChangingPassword.set(false);
      }
    });
  }
}
