"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerFilterSchema = exports.paginationSchema = exports.updateApplicationStatusSchema = exports.createApplicationSchema = exports.updateOfferSchema = exports.createOfferSchema = exports.updateCompanySchema = exports.updateStudentSchema = exports.refreshTokenSchema = exports.registerAdminSchema = exports.registerCompanySchema = exports.registerStudentSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// Auth Schemas
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.registerStudentSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    studyLevel: zod_1.z.string().min(1, 'Study level is required'),
    groupName: zod_1.z.string().min(1, 'Group name is required'),
    phone: zod_1.z.string().optional(),
    skills: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    github: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
exports.registerCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Company name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    sector: zod_1.z.string().min(1, 'Sector is required'),
    description: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.registerAdminSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
// Student Schemas
exports.updateStudentSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).optional(),
    lastName: zod_1.z.string().min(2).optional(),
    studyLevel: zod_1.z.string().optional(),
    groupName: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    skills: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    github: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
// Company Schemas
exports.updateCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    sector: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
// Offer Schemas
exports.createOfferSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters'),
    category: zod_1.z.enum(['PFE', 'SUMMER_INTERNSHIP', 'JOB']),
    description: zod_1.z.string().min(20, 'Description must be at least 20 characters'),
    requirements: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    duration: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional().or(zod_1.z.null()),
    salary: zod_1.z.string().optional(),
    deadline: zod_1.z.string().optional().or(zod_1.z.null()),
    status: zod_1.z.enum(['ACTIVE', 'CLOSED', 'DRAFT']).optional(),
});
exports.updateOfferSchema = exports.createOfferSchema.partial();
// Application Schemas
exports.createApplicationSchema = zod_1.z.object({
    offerId: zod_1.z.number().int().positive('Invalid offer ID'),
    coverLetter: zod_1.z.string().optional(),
});
exports.updateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
});
// Query Schemas
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive().max(100)).optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
exports.offerFilterSchema = zod_1.z.object({
    category: zod_1.z.enum(['PFE', 'SUMMER_INTERNSHIP', 'JOB']).optional(),
    status: zod_1.z.enum(['ACTIVE', 'CLOSED', 'DRAFT']).optional(),
    companyId: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=schemas.js.map