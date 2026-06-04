import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import serviceRequestRoutes from './serviceRequestRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/service-requests', serviceRequestRoutes);

export default router;