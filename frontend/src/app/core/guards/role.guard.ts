import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Redirect to appropriate dashboard based on role
    router.navigate([authService.getDashboardRoute()]);
    return false;
  };
};

// Convenience guards for specific roles
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);
export const companyGuard: CanActivateFn = roleGuard([UserRole.COMPANY]);
export const studentGuard: CanActivateFn = roleGuard([UserRole.STUDENT]);
export const adminOrCompanyGuard: CanActivateFn = roleGuard([UserRole.ADMIN, UserRole.COMPANY]);
