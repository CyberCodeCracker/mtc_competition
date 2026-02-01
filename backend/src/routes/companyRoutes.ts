import { Router } from 'express';
import * as companyController from '../controllers/companyController';
import { verifyToken, isAdmin, isCompany, hasRole, validate } from '../middleware';
import { updateCompanySchema } from '../validators/schemas';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// Company-only routes
router.get('/me/offers', isCompany, companyController.getCompanyOffers);
router.get('/me/stats', isCompany, companyController.getCompanyStats);
router.get('/me/applications', isCompany, companyController.getCompanyApplications);

// Admin-only routes
router.get('/', isAdmin, companyController.getAllCompanies);
router.delete('/:id', isAdmin, companyController.deleteCompany);
router.patch('/:id/approval', isAdmin, companyController.toggleCompanyApproval);

// Routes for company (own) or admin
router.get('/:id', companyController.getCompanyById);
router.put(
  '/:id',
  hasRole(UserRole.ADMIN, UserRole.COMPANY),
  validate(updateCompanySchema),
  companyController.updateCompany
);

export default router;
