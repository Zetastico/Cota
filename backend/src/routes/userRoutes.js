import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createUserValidation,
  updateUserValidation,
  idParamValidation,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Aplicar el middleware de protección JWT a todas las rutas de este router
router.use(protect);

// Rutas para el CRUD de usuarios
router.route('/')
  .get(getAllUsers)
  .post(createUserValidation, createUser);

router.route('/:id')
  .get(idParamValidation, getUserById)
  .put(idParamValidation, updateUserValidation, updateUser)
  .delete(idParamValidation, deleteUser);

export default router;
