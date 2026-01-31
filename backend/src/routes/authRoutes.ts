import { Router } from 'express';
import * as authController from '../controllers/authController';
import { verifyToken, isAdmin, validate } from '../middleware';
import {
  loginSchema,
  registerStudentSchema,
  registerCompanySchema,
  registerAdminSchema,
  refreshTokenSchema,
} from '../validators/schemas';

const router = Router();

// Public routes
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.post('/change-password', verifyToken, authController.changePassword);

// Admin-only registration routes
router.post(
  '/register/student',
  verifyToken,
  isAdmin,
  validate(registerStudentSchema),
  authController.registerStudent
);

router.post(
  '/register/company',
  verifyToken,
  isAdmin,
  validate(registerCompanySchema),
  authController.registerCompany
);

router.post(
  '/register/admin',
  verifyToken,
  isAdmin,
  validate(registerAdminSchema),
  authController.registerAdmin
);

export default router;
