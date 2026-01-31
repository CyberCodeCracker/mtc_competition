import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const registerStudentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  studyLevel: z.string().min(1, 'Study level is required'),
  groupName: z.string().min(1, 'Group name is required'),
  phone: z.string().optional(),
  skills: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

export const registerCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  sector: z.string().min(1, 'Sector is required'),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const registerAdminSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Student Schemas
export const updateStudentSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  studyLevel: z.string().optional(),
  groupName: z.string().optional(),
  phone: z.string().optional(),
  skills: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

// Company Schemas
export const updateCompanySchema = z.object({
  name: z.string().min(2).optional(),
  sector: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Offer Schemas
export const createOfferSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.enum(['PFE', 'SUMMER_INTERNSHIP', 'JOB']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  startDate: z.string().optional().or(z.null()),
  salary: z.string().optional(),
  deadline: z.string().optional().or(z.null()),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT']).optional(),
});

export const updateOfferSchema = createOfferSchema.partial();

// Application Schemas
export const createApplicationSchema = z.object({
  offerId: z.number().int().positive('Invalid offer ID'),
  coverLetter: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
});

// Query Schemas
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const offerFilterSchema = z.object({
  category: z.enum(['PFE', 'SUMMER_INTERNSHIP', 'JOB']).optional(),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT']).optional(),
  companyId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  search: z.string().optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;
export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
