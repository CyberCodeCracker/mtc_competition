import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import { verifyToken, isAdmin, isStudent, hasRole, validate } from '../middleware';
import { updateStudentSchema } from '../validators/schemas';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// Student-only routes
router.get('/me/applications', isStudent, studentController.getStudentApplications);
router.get('/me/stats', isStudent, studentController.getStudentStats);

// Admin-only routes
router.get('/', isAdmin, studentController.getAllStudents);
router.delete('/:id', isAdmin, studentController.deleteStudent);

// Routes for student (own) or admin
router.get('/:id', hasRole(UserRole.ADMIN, UserRole.STUDENT), studentController.getStudentById);
router.put(
  '/:id',
  hasRole(UserRole.ADMIN, UserRole.STUDENT),
  validate(updateStudentSchema),
  studentController.updateStudent
);

export default router;
