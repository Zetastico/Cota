import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  createUserValidation,
  updateUserValidation,
  idParamValidation,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Aplicar el middleware de protección JWT a todas las rutas de este router
router.use(protect);

router.route('/')
  .get(authorize('ADMIN'), getAllUsers)
  .post(authorize('ADMIN'), createUserValidation, createUser);

router.route('/:id')
  .get(authorize('ADMIN'), idParamValidation, getUserById)
  .put(authorize('ADMIN'), idParamValidation, updateUserValidation, updateUser)
  .delete(authorize('ADMIN'), idParamValidation, deleteUser);

// Rutas para el CRUD de usuarios


export default router;
