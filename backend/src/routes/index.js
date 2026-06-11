import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import serviceRequestRoutes from './serviceRequestRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/service-requests', serviceRequestRoutes);
router.use('/stats', statsRoutes);

export default router;