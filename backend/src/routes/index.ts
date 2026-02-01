import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import companyRoutes from './companyRoutes';
import offerRoutes from './offerRoutes';
import applicationRoutes from './applicationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/companies', companyRoutes);
router.use('/offers', offerRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ENET\'COM Forum API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
