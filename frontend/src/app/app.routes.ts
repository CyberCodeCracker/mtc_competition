import { Routes } from '@angular/router';
import { authGuard, adminGuard, companyGuard, studentGuard } from './core/guards';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'ENET\'COM - Career Platform'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login - ENET\'COM'
  },

  // Student routes
  {
    path: 'student',
    loadComponent: () => import('./pages/student/student-layout.component').then(m => m.StudentLayoutComponent),
    canActivate: [authGuard, studentGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/student/dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
        title: 'Student Dashboard - ENET\'COM'
      },
      {
        path: 'offers',
        loadComponent: () => import('./pages/student/offers/student-offers.component').then(m => m.StudentOffersComponent),
        title: 'Browse Offers - ENET\'COM'
      },
      {
        path: 'offers/:id',
        loadComponent: () => import('./pages/student/offers/offer-detail.component').then(m => m.OfferDetailComponent),
        title: 'Offer Details - ENET\'COM'
      },
      {
        path: 'applications',
        loadComponent: () => import('./pages/student/applications/student-applications.component').then(m => m.StudentApplicationsComponent),
        title: 'My Applications - ENET\'COM'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/student/profile/student-profile.component').then(m => m.StudentProfileComponent),
        title: 'Profile - ENET\'COM'
      },
    ]
  },

  // Company routes
  {
    path: 'company',
    loadComponent: () => import('./pages/company/company-layout.component').then(m => m.CompanyLayoutComponent),
    canActivate: [authGuard, companyGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/company/dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent),
        title: 'Company Dashboard - ENET\'COM'
      },
      {
        path: 'offers',
        loadComponent: () => import('./pages/company/offers/company-offers.component').then(m => m.CompanyOffersComponent),
        title: 'My Offers - ENET\'COM'
      },
      {
        path: 'offers/new',
        loadComponent: () => import('./pages/company/offers/create-offer.component').then(m => m.CreateOfferComponent),
        title: 'Create Offer - ENET\'COM'
      },
      {
        path: 'offers/:id',
        loadComponent: () => import('./pages/company/offers/company-offer-detail.component').then(m => m.CompanyOfferDetailComponent),
        title: 'Offer Details - ENET\'COM'
      },
      {
        path: 'applications',
        loadComponent: () => import('./pages/company/applications/company-applications.component').then(m => m.CompanyApplicationsComponent),
        title: 'Applications - ENET\'COM'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/company/profile/company-profile.component').then(m => m.CompanyProfileComponent),
        title: 'Company Profile - ENET\'COM'
      },
    ]
  },

  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - ENET\'COM'
      },
      {
        path: 'students',
        loadComponent: () => import('./pages/admin/students/admin-students.component').then(m => m.AdminStudentsComponent),
        title: 'Manage Students - ENET\'COM'
      },
      {
        path: 'companies',
        loadComponent: () => import('./pages/admin/companies/admin-companies.component').then(m => m.AdminCompaniesComponent),
        title: 'Manage Companies - ENET\'COM'
      },
      {
        path: 'offers',
        loadComponent: () => import('./pages/admin/offers/admin-offers.component').then(m => m.AdminOffersComponent),
        title: 'Manage Offers - ENET\'COM'
      },
      {
        path: 'applications',
        loadComponent: () => import('./pages/admin/applications/admin-applications.component').then(m => m.AdminApplicationsComponent),
        title: 'Manage Applications - ENET\'COM'
      },
      {
        path: 'users/new',
        loadComponent: () => import('./pages/admin/users/create-user.component').then(m => m.CreateUserComponent),
        title: 'Create User - ENET\'COM'
      },
    ]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: ''
  }
];
