import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const getAllOffers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getOfferById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createOffer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateOffer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteOffer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getOfferApplications: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=offerController.d.ts.map