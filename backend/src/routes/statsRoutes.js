import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/statsController.js';

const router = express.Router();

// Todas las rutas de estadísticas requieren autenticación JWT
router.use(protect);

// GET /api/stats/dashboard
router.get('/dashboard', getDashboardStats);

export default router;
