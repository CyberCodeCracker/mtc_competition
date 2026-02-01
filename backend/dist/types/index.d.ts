import { Request } from 'express';
export declare enum UserRole {
    ADMIN = "ADMIN",
    COMPANY = "COMPANY",
    STUDENT = "STUDENT"
}
export interface JwtPayload {
    userId: number;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
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
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: any;
}
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
export interface OfferFilters {
    category?: string;
    status?: string;
    companyId?: number;
    search?: string;
}
export interface ApplicationFilters {
    status?: string;
    studentId?: number;
    offerId?: number;
    companyId?: number;
}
//# sourceMappingURL=index.d.ts.map