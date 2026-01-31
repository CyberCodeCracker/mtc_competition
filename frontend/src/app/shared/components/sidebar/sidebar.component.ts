import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo-container">
          <img src="assets/logo.png" alt="ENET'COM Forum" class="logo" />
          <span class="logo-text" *ngIf="!collapsed">ENET'COM Forum</span>
        </div>
        <button class="toggle-btn" (click)="toggleCollapse()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path *ngIf="!collapsed" d="M11 19l-7-7 7-7"></path>
            <path *ngIf="collapsed" d="M13 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of navItems" class="nav-item">
            <a [routerLink]="item.route" routerLinkActive="active" class="nav-link">
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- User Info -->
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-details" *ngIf="!collapsed">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRoleLabel }}</span>
          </div>
        </div>
        <button class="logout-btn" (click)="onLogout()" [title]="collapsed ? 'Logout' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span *ngIf="!collapsed">Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 260px;
      background: rgba(10, 22, 40, 0.95);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      z-index: 100;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #00d4aa, #2196f3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    }

    .toggle-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      padding: 0.5rem;
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.3s;
    }

    .toggle-btn:hover {
      background: rgba(0, 212, 170, 0.2);
      color: #00d4aa;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.3s;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
    }

    .nav-link.active {
      background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(33, 150, 243, 0.2));
      color: #00d4aa;
      border: 1px solid rgba(0, 212, 170, 0.3);
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .nav-label {
      font-size: 0.9375rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #00d4aa, #2196f3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      color: white;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      text-transform: capitalize;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem;
      background: rgba(244, 67, 54, 0.1);
      border: 1px solid rgba(244, 67, 54, 0.3);
      border-radius: 10px;
      color: #f44336;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .logout-btn:hover {
      background: rgba(244, 67, 54, 0.2);
    }

    .sidebar.collapsed .logo-text,
    .sidebar.collapsed .nav-label,
    .sidebar.collapsed .user-details,
    .sidebar.collapsed .logout-btn span {
      display: none;
    }

    .sidebar.collapsed .nav-link {
      justify-content: center;
      padding: 0.875rem;
    }

    .sidebar.collapsed .user-info {
      justify-content: center;
    }
  `]
})
export class SidebarComponent {
  @Input() navItems: NavItem[] = [];
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  get userName(): string {
    return this.authService.currentUser()?.name || 'User';
  }

  get userInitials(): string {
    const name = this.userName;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get userRoleLabel(): string {
    const role = this.authService.currentUser()?.role;
    switch (role) {
      case UserRole.ADMIN: return 'Administrator';
      case UserRole.COMPANY: return 'Company';
      case UserRole.STUDENT: return 'Student';
      default: return 'User';
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
