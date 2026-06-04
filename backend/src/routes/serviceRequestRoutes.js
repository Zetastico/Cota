import express from 'express';
import {
  createRequest,
  getMyServiceRequests,
  acceptRequest,
  rejectRequest,
  getMyRequests,
} from '../controllers/serviceRequestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createRequestValidation,
  idParamValidation,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// GET /api/service-requests/my-requests - Ver solicitudes enviadas (Solo USER)
router.get(
  '/my-requests',
  protect,
  authorize('USER'),
  getMyRequests
);

// Todas las rutas de solicitudes requieren inicio de sesión
router.use(protect);

// POST /api/service-requests - Crear una solicitud (Solo USER)
router.post(
  '/',
  authorize('USER'),
  createRequestValidation,
  createRequest
);

// GET /api/service-requests/my-services - Ver solicitudes recibidas (Solo HOST)
router.get(
  '/my-services',
  authorize('HOST'),
  getMyServiceRequests
);

// PATCH /api/service-requests/:id/accept - Aceptar una solicitud (Solo HOST)
router.patch(
  '/:id/accept',
  authorize('HOST'),
  idParamValidation,
  acceptRequest
);

// PATCH /api/service-requests/:id/reject - Rechazar una solicitud (Solo HOST)
router.patch(
  '/:id/reject',
  authorize('HOST'),
  idParamValidation,
  rejectRequest
);

export default router;
