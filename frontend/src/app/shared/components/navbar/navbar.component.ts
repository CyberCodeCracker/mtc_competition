import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar glass">
      <div class="navbar-content">
        <!-- Left: Page Title -->
        <div class="navbar-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-subtitle" *ngIf="pageSubtitle">{{ pageSubtitle }}</p>
        </div>

        <!-- Right: Actions -->
        <div class="navbar-right">
          <!-- Search -->
          <div class="search-box" *ngIf="showSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input 
              type="text" 
              [placeholder]="searchPlaceholder" 
              (input)="onSearch($event)"
              class="search-input" 
            />
          </div>

          <!-- Notifications -->
          <button class="icon-btn" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
            <span class="notification-badge" *ngIf="notificationCount > 0">
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </button>

          <!-- User Menu -->
          <div class="user-menu">
            <button class="user-btn" (click)="toggleUserMenu()">
              <div class="user-avatar">
                {{ userInitials }}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>

            <div class="user-dropdown" *ngIf="showUserMenu">
              <div class="dropdown-header">
                <span class="dropdown-name">{{ userName }}</span>
                <span class="dropdown-email">{{ userEmail }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <a routerLink="profile" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" (click)="onLogout()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .page-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s;
    }

    .search-box:focus-within {
      border-color: rgba(0, 212, 170, 0.5);
      background: rgba(255, 255, 255, 0.08);
    }

    .search-input {
      background: none;
      border: none;
      outline: none;
      color: white;
      font-size: 0.875rem;
      width: 200px;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.3s;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      background: #f44336;
      border-radius: 9px;
      font-size: 0.625rem;
      font-weight: 700;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0.375rem 0.75rem 0.375rem 0.375rem;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.3s;
    }

    .user-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #00d4aa, #2196f3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.75rem;
      color: white;
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 220px;
      background: rgba(20, 40, 60, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .dropdown-header {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .dropdown-name {
      font-weight: 600;
      color: white;
    }

    .dropdown-email {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .dropdown-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 0.875rem;
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      transition: all 0.2s;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .dropdown-item.danger {
      color: #f44336;
    }

    .dropdown-item.danger:hover {
      background: rgba(244, 67, 54, 0.1);
    }
  `]
})
export class NavbarComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = '';
  @Input() showSearch = true;
  @Input() searchPlaceholder = 'Search...';
  @Input() notificationCount = 0;
  @Output() search = new EventEmitter<string>();

  showUserMenu = false;

  constructor(private authService: AuthService) {}

  get userName(): string {
    return this.authService.currentUser()?.name || 'User';
  }

  get userEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  get userInitials(): string {
    const name = this.userName;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
