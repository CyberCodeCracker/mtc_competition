import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
export declare const verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isCompany: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isStudent: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isAdminOrCompany: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const hasRole: (...roles: UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map