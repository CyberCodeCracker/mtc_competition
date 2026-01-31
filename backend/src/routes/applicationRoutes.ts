import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { verifyToken, isStudent, isAdmin, isAdminOrCompany, validate } from '../middleware';
import { createApplicationSchema, updateApplicationStatusSchema } from '../validators/schemas';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// Student-only routes
router.post('/', isStudent, validate(createApplicationSchema), applicationController.createApplication);
router.delete('/:id/withdraw', isStudent, applicationController.withdrawApplication);

// Admin-only routes
router.get('/', isAdmin, applicationController.getAllApplications);

// Any authenticated user with proper access
router.get('/:id', applicationController.getApplicationById);

// Company or admin routes
router.patch(
  '/:id/status',
  isAdminOrCompany,
  validate(updateApplicationStatusSchema),
  applicationController.updateApplicationStatus
);

export default router;
