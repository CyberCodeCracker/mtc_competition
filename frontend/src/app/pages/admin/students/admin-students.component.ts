import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StudentService } from '../../../core/services/student.service';
import { Student, PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar 
      pageTitle="Manage Students" 
      pageSubtitle="View and manage all students on the platform"
      [showSearch]="true"
      (search)="onSearch($event)"
    ></app-navbar>

    <div class="students-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card glass-card">
          <div class="stat-icon total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalStudents() }}</span>
            <span class="stat-label">Total Students</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters glass-card">
        <div class="filter-group">
          <label>Study Level</label>
          <select [(ngModel)]="levelFilter" (change)="loadStudents()" class="input-glass">
            <option value="">All Levels</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="Master 1">Master 1</option>
            <option value="Master 2">Master 2</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading()" message="Loading students..."></app-loading-spinner>

      <!-- Students Table -->
      <div class="students-table glass-card" *ngIf="!isLoading() && students().length > 0">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Study Level</th>
              <th>Group</th>
              <th>Applications</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of students()">
              <td>
                <div class="student-cell">
                  <div class="avatar">{{ getInitials(student.firstName, student.lastName) }}</div>
                  <div class="student-info">
                    <span class="name">{{ student.firstName }} {{ student.lastName }}</span>
                    <span class="email">{{ student.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="level">{{ student.studyLevel }}</span>
              </td>
              <td>
                <span class="badge badge-active">{{ student.groupName }}</span>
              </td>
              <td>
                <span class="applications-count">{{ student._count?.applications || 0 }}</span>
              </td>
              <td>
                <span class="date">{{ student.createdAt | date:'mediumDate' }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-view" title="View Details" (click)="viewStudent(student)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button class="btn-icon btn-delete" title="Delete Student" (click)="confirmDelete(student)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages() > 1">
        <button class="btn-glass" [disabled]="currentPage() === 1" (click)="changePage(currentPage() - 1)">Previous</button>
        <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
        <button class="btn-glass" [disabled]="currentPage() === totalPages()" (click)="changePage(currentPage() + 1)">Next</button>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-card" *ngIf="!isLoading() && students().length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <h3>No students found</h3>
        <p>{{ levelFilter || searchQuery ? 'Try adjusting your filters' : 'No students have registered yet' }}</p>
      </div>
    </div>

    <!-- Student Detail Modal -->
    <div class="modal-overlay" *ngIf="selectedStudent()" (click)="closeModal()">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="student-profile">
            <div class="avatar-large">{{ getInitials(selectedStudent()?.firstName, selectedStudent()?.lastName) }}</div>
            <div class="profile-info">
              <h2>{{ selectedStudent()?.firstName }} {{ selectedStudent()?.lastName }}</h2>
              <p>{{ selectedStudent()?.email }}</p>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Study Level</span>
              <span class="value">{{ selectedStudent()?.studyLevel }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Group</span>
              <span class="value">{{ selectedStudent()?.groupName }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedStudent()?.phone">
              <span class="label">Phone</span>
              <span class="value">{{ selectedStudent()?.phone }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Applications</span>
              <span class="value">{{ selectedStudent()?._count?.applications || 0 }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Joined</span>
              <span class="value">{{ selectedStudent()?.createdAt | date:'medium' }}</span>
            </div>
          </div>

          <div class="skills-section" *ngIf="selectedStudent()?.skills">
            <h4>Skills</h4>
            <div class="skills-list">
              <span class="skill" *ngFor="let skill of getSkillsList(selectedStudent()?.skills)">{{ skill }}</span>
            </div>
          </div>

          <div class="links-section" *ngIf="selectedStudent()?.linkedin || selectedStudent()?.github">
            <a *ngIf="selectedStudent()?.linkedin" [href]="selectedStudent()?.linkedin" target="_blank" class="link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </a>
            <a *ngIf="selectedStudent()?.github" [href]="selectedStudent()?.github" target="_blank" class="link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal()" (click)="cancelDelete()">
      <div class="modal glass-card delete-modal" (click)="$event.stopPropagation()">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete {{ studentToDelete()?.firstName }} {{ studentToDelete()?.lastName }}? This will also delete all their applications.</p>
        <div class="modal-actions">
          <button class="btn-glass" (click)="cancelDelete()">Cancel</button>
          <button class="btn-danger" (click)="deleteStudent()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .students-content { max-width: 1400px; }
    
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.total { background: rgba(0,212,170,0.15); color: #00d4aa; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; color: white; }
    .stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .filters { display: flex; gap: 1rem; padding: 1rem 1.5rem; margin-bottom: 1.5rem; }
    .filter-group { display: flex; flex-direction: column; gap: 0.5rem; min-width: 180px; }
    .filter-group label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    
    .students-table { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem 1.5rem; font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.1); }
    td { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
    tr:hover td { background: rgba(255,255,255,0.02); }
    
    .student-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 0.875rem; font-weight: 600; color: white; flex-shrink: 0; }
    .student-info { display: flex; flex-direction: column; }
    .student-info .name { font-weight: 500; color: white; }
    .student-info .email { font-size: 0.8125rem; color: rgba(255,255,255,0.5); }
    
    .level { color: rgba(255,255,255,0.8); }
    .applications-count { font-weight: 600; color: #a855f7; }
    .date { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
    
    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .btn-view { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
    .btn-view:hover { background: rgba(255,255,255,0.1); color: white; }
    .btn-delete { background: rgba(239,68,68,0.15); color: #ef4444; }
    .btn-delete:hover { background: rgba(239,68,68,0.25); }
    
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .page-info { color: rgba(255,255,255,0.7); }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 4rem; text-align: center; color: rgba(255,255,255,0.5); }
    .empty-state h3 { color: white; margin: 1.5rem 0 0.5rem; }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal { max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 0; position: relative; }
    .modal-close { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border: none; width: 36px; height: 36px; border-radius: 50%; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 1; }
    .modal-close:hover { background: rgba(255,255,255,0.2); color: white; }
    
    .modal-header { padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .student-profile { display: flex; align-items: center; gap: 1rem; }
    .avatar-large { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa, #0ea5e9); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: white; }
    .profile-info h2 { font-family: 'Outfit', sans-serif; font-size: 1.375rem; font-weight: 600; color: white; margin: 0 0 0.25rem; }
    .profile-info p { color: rgba(255,255,255,0.6); margin: 0; }
    
    .modal-body { padding: 2rem; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .detail-item .label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
    .detail-item .value { font-size: 0.9375rem; color: white; }
    
    .skills-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .skills-section h4 { font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; margin: 0 0 0.75rem; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill { font-size: 0.8125rem; padding: 0.375rem 0.75rem; background: rgba(168,85,247,0.1); color: #a855f7; border-radius: 4px; }
    
    .links-section { display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .link-item { display: flex; align-items: center; gap: 0.5rem; color: #00d4aa; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
    .link-item:hover { color: #5eead4; }
    
    .delete-modal { padding: 2rem; max-width: 420px; }
    .delete-modal h3 { color: white; margin: 0 0 1rem; font-size: 1.25rem; }
    .delete-modal p { color: rgba(255,255,255,0.7); margin: 0 0 1.5rem; }
    .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239,68,68,0.4); }
    
    @media (max-width: 768px) {
      .filters { flex-direction: column; }
      .students-table { overflow-x: auto; }
      table { min-width: 700px; }
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminStudentsComponent implements OnInit {
  isLoading = signal(true);
  students = signal<Student[]>([]);
  totalStudents = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedStudent = signal<Student | null>(null);
  showDeleteModal = signal(false);
  studentToDelete = signal<Student | null>(null);
  
  levelFilter = '';
  searchQuery = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading.set(true);
    this.studentService.getAllStudents({
      page: this.currentPage(),
      limit: 15,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          let filtered = response.data.data;
          if (this.levelFilter) {
            filtered = filtered.filter(s => s.studyLevel === this.levelFilter);
          }
          this.students.set(filtered);
          this.totalStudents.set(response.data.pagination.total);
          this.totalPages.set(response.data.pagination.totalPages);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage.set(1);
    this.loadStudents();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadStudents();
  }

  getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }

  getSkillsList(skills?: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(s => s.trim()).filter(s => s);
  }

  viewStudent(student: Student): void {
    this.selectedStudent.set(student);
  }

  closeModal(): void {
    this.selectedStudent.set(null);
  }

  confirmDelete(student: Student): void {
    this.studentToDelete.set(student);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.studentToDelete.set(null);
  }

  deleteStudent(): void {
    const student = this.studentToDelete();
    if (!student) return;

    this.studentService.deleteStudent(student.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.students.update(students => students.filter(s => s.id !== student.id));
          this.totalStudents.update(t => t - 1);
        }
        this.cancelDelete();
      },
      error: () => this.cancelDelete()
    });
  }
}
