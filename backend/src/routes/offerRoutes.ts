import { Router } from 'express';
import * as offerController from '../controllers/offerController';
import { verifyToken, isCompany, isAdminOrCompany, validate } from '../middleware';
import { createOfferSchema, updateOfferSchema } from '../validators/schemas';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// All authenticated users can view offers
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);

// Company-only routes
router.post('/', isCompany, validate(createOfferSchema), offerController.createOffer);

// Company or admin routes
router.put('/:id', isAdminOrCompany, validate(updateOfferSchema), offerController.updateOffer);
router.delete('/:id', isAdminOrCompany, offerController.deleteOffer);
router.get('/:id/applications', isAdminOrCompany, offerController.getOfferApplications);

export default router;
