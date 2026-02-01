import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const getAllCompanies: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCompanyById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCompany: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCompany: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleCompanyApproval: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCompanyOffers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCompanyStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCompanyApplications: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=companyController.d.ts.map