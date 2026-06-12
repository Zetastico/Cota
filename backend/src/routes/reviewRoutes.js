import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createReview, getHostReviews } from '../controllers/reviewController.js';

const router = express.Router();

// Crear una review (Solo usuarios logueados con rol USER)
router.post('/', protect, authorize('USER'), createReview);

// Obtener las reviews de un Host (Público)
router.get('/host/:hostId', getHostReviews);

export default router;
