import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerStudentSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    studyLevel: z.ZodString;
    groupName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    studyLevel: string;
    groupName: string;
    phone?: string | undefined;
    skills?: string | undefined;
    linkedin?: string | undefined;
    github?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    studyLevel: string;
    groupName: string;
    phone?: string | undefined;
    skills?: string | undefined;
    linkedin?: string | undefined;
    github?: string | undefined;
}>;
export declare const registerCompanySchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    sector: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    sector: string;
    phone?: string | undefined;
    description?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    sector: string;
    phone?: string | undefined;
    description?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
}>;
export declare const registerAdminSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    username: string;
}, {
    email: string;
    password: string;
    username: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const updateStudentSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    studyLevel: z.ZodOptional<z.ZodString>;
    groupName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    studyLevel?: string | undefined;
    groupName?: string | undefined;
    phone?: string | undefined;
    skills?: string | undefined;
    linkedin?: string | undefined;
    github?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    studyLevel?: string | undefined;
    groupName?: string | undefined;
    phone?: string | undefined;
    skills?: string | undefined;
    linkedin?: string | undefined;
    github?: string | undefined;
}>;
export declare const updateCompanySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    sector: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone?: string | undefined;
    name?: string | undefined;
    sector?: string | undefined;
    description?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
}, {
    phone?: string | undefined;
    name?: string | undefined;
    sector?: string | undefined;
    description?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
}>;
export declare const createOfferSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodEnum<["PFE", "SUMMER_INTERNSHIP", "JOB"]>;
    description: z.ZodString;
    requirements: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodString>;
    startDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodNull]>;
    salary: z.ZodOptional<z.ZodString>;
    deadline: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodNull]>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "CLOSED", "DRAFT"]>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    category: "PFE" | "SUMMER_INTERNSHIP" | "JOB";
    status?: "ACTIVE" | "CLOSED" | "DRAFT" | undefined;
    requirements?: string | undefined;
    location?: string | undefined;
    duration?: string | undefined;
    startDate?: string | null | undefined;
    salary?: string | undefined;
    deadline?: string | null | undefined;
}, {
    description: string;
    title: string;
    category: "PFE" | "SUMMER_INTERNSHIP" | "JOB";
    status?: "ACTIVE" | "CLOSED" | "DRAFT" | undefined;
    requirements?: string | undefined;
    location?: string | undefined;
    duration?: string | undefined;
    startDate?: string | null | undefined;
    salary?: string | undefined;
    deadline?: string | null | undefined;
}>;
export declare const updateOfferSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["PFE", "SUMMER_INTERNSHIP", "JOB"]>>;
    description: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    duration: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodNull]>>;
    salary: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    deadline: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodNull]>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<["ACTIVE", "CLOSED", "DRAFT"]>>>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "CLOSED" | "DRAFT" | undefined;
    description?: string | undefined;
    title?: string | undefined;
    category?: "PFE" | "SUMMER_INTERNSHIP" | "JOB" | undefined;
    requirements?: string | undefined;
    location?: string | undefined;
    duration?: string | undefined;
    startDate?: string | null | undefined;
    salary?: string | undefined;
    deadline?: string | null | undefined;
}, {
    status?: "ACTIVE" | "CLOSED" | "DRAFT" | undefined;
    description?: string | undefined;
    title?: string | undefined;
    category?: "PFE" | "SUMMER_INTERNSHIP" | "JOB" | undefined;
    requirements?: string | undefined;
    location?: string | undefined;
    duration?: string | undefined;
    startDate?: string | null | undefined;
    salary?: string | undefined;
    deadline?: string | null | undefined;
}>;
export declare const createApplicationSchema: z.ZodObject<{
    offerId: z.ZodNumber;
    coverLetter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    offerId: number;
    coverLetter?: string | undefined;
}, {
    offerId: number;
    coverLetter?: string | undefined;
}>;
export declare const updateApplicationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "ACCEPTED", "REJECTED"]>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "ACCEPTED" | "REJECTED";
}, {
    status: "PENDING" | "ACCEPTED" | "REJECTED";
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}, {
    page?: string | undefined;
    limit?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const offerFilterSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<["PFE", "SUMMER_INTERNSHIP", "JOB"]>>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "CLOSED", "DRAFT"]>>;
    companyId: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "CLOSED" | "DRAFT" | undefined;
    category?: "PFE" | "SUMMER_INTERNSHIP" | "JOB" | undefined;
    companyId?: number | undefined;
    search?: string | undefined;
}, {
    status?: "ACTIVE" | "CLOSED" | "DRAFT" | undefined;
    category?: "PFE" | "SUMMER_INTERNSHIP" | "JOB" | undefined;
    companyId?: string | undefined;
    search?: string | undefined;
}>;
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
//# sourceMappingURL=schemas.d.ts.map