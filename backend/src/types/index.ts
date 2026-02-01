import { Request } from 'express';

// User roles enum
export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  STUDENT = 'STUDENT',
}

// JWT Payload interface
export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Extended Request with user info
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Login response
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
    name?: string;
  };
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

// Pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Statistics types for admin dashboard
export interface DashboardStats {
  totalStudents: number;
  totalCompanies: number;
  totalOffers: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  activeOffers: number;
  recentOffers: number;
  approvedCompanies: number;
  pendingCompanies: number;
}

// Offer filters
export interface OfferFilters {
  category?: string;
  status?: string;
  companyId?: number;
  search?: string;
}

// Application filters
export interface ApplicationFilters {
  status?: string;
  studentId?: number;
  offerId?: number;
  companyId?: number;
}
