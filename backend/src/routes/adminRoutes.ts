import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { verifyToken, isAdmin } from '../middleware';

const router = Router();

// All routes require admin authentication
router.use(verifyToken, isAdmin);

// Dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/offers-by-category', adminController.getOffersByCategory);
router.get('/dashboard/recent-activity', adminController.getRecentActivity);
router.get('/dashboard/application-trends', adminController.getApplicationTrends);
router.get('/dashboard/top-companies', adminController.getTopCompanies);

export default router;
