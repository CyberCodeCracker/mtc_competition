import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const login: (req: AuthRequest, res: Response) => Promise<void>;
export declare const refreshToken: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const registerStudent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const registerCompany: (req: AuthRequest, res: Response) => Promise<void>;
export declare const registerAdmin: (req: AuthRequest, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map