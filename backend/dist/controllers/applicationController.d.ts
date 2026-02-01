import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const createApplication: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getApplicationById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateApplicationStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const withdrawApplication: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllApplications: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=applicationController.d.ts.map