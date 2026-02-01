import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const getAllStudents: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStudentById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateStudent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteStudent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStudentApplications: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStudentStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=studentController.d.ts.map