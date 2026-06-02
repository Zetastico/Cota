import express from 'express';
import {
  getPublicServices,
  getMyServices,
  getPendingServices,
  createService,
  updateService,
  deleteService,
  approveService,
  rejectService,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createServiceValidation,
  updateServiceValidation,
  idParamValidation,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// --- RUTAS PÚBLICAS ---
// GET /api/services/public - Listar servicios aprobados (cualquier visitante)
router.get('/public', getPublicServices);

// --- RUTAS PROTEGIDAS ---

// GET /api/services/my-services - Listar servicios del HOST autenticado
router.get(
  '/my-services',
  protect,
  authorize('HOST'),
  getMyServices
);

// POST /api/services - Crear un nuevo servicio
router.post(
  '/',
  protect,
  authorize('HOST'),
  createServiceValidation,
  createService
);

// PUT /api/services/:id - Editar un servicio propio (HOST)
router.put(
  '/:id',
  protect,
  authorize('HOST', 'ADMIN'),
  idParamValidation,
  updateServiceValidation,
  updateService
);

// DELETE /api/services/:id - Eliminar un servicio propio (HOST)
router.delete(
  '/:id',
  protect,
  authorize('HOST', 'ADMIN'),
  idParamValidation,
  deleteService
);

// --- RUTAS ADMINISTRATIVAS ---

// GET /api/services/pending - Listar todos los servicios pendientes de aprobación
router.get(
  '/pending',
  protect,
  authorize('ADMIN'),
  getPendingServices
);

// PATCH /api/services/:id/approve - Aprobar un servicio
router.patch(
  '/:id/approve',
  protect,
  authorize('ADMIN'),
  idParamValidation,
  approveService
);

// PATCH /api/services/:id/reject - Rechazar un servicio
router.patch(
  '/:id/reject',
  protect,
  authorize('ADMIN'),
  idParamValidation,
  rejectService
);

export default router;