// User roles
export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  STUDENT = 'STUDENT',
}

// Auth models
export interface LoginRequest {
  email: string;
  password: string;
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

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// User models
export interface User {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  createdAt?: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studyLevel: string;
  groupName: string;
  cvPath?: string;
  skills?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  avatarPath?: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export interface Company {
  id: number;
  name: string;
  email: string;
  sector: string;
  description?: string;
  isApproved: boolean;
  logoPath?: string;
  website?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  _count?: {
    offers: number;
  };
}

// Offer models
export enum OfferCategory {
  PFE = 'PFE',
  SUMMER_INTERNSHIP = 'SUMMER_INTERNSHIP',
  JOB = 'JOB',
}

export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

export interface Offer {
  id: number;
  title: string;
  category: OfferCategory;
  description: string;
  requirements?: string;
  location?: string;
  duration?: string;
  startDate?: string;
  salary?: string;
  status: OfferStatus;
  postedDate: string;
  deadline?: string;
  companyId: number;
  company?: Company;
  _count?: {
    applications: number;
  };
  hasApplied?: boolean;
  applicationStatus?: ApplicationStatus;
}

// Application models
export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface Application {
  id: number;
  applicationDate: string;
  status: ApplicationStatus;
  coverLetter?: string;
  cvPath?: string;
  studentId: number;
  offerId: number;
  student?: Student;
  offer?: Offer;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard Stats
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

export interface StudentStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

export interface CompanyStats {
  totalOffers: number;
  activeOffers: number;
  closedOffers: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

// Form Data
export interface RegisterStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studyLevel: string;
  groupName: string;
  phone?: string;
  skills?: string;
  linkedin?: string;
  github?: string;
}

export interface RegisterCompanyData {
  name: string;
  email: string;
  password: string;
  sector: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
}

export interface RegisterAdminData {
  username: string;
  email: string;
  password: string;
}

export interface CreateOfferData {
  title: string;
  category: OfferCategory;
  description: string;
  requirements?: string;
  location?: string;
  duration?: string;
  startDate?: string;
  salary?: string;
  deadline?: string;
  status?: OfferStatus;
}

export interface CreateApplicationData {
  offerId: number;
  coverLetter?: string;
}
