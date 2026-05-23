import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Ruta de registro público (valida esquema y ejecuta controlador)
router.post('/register', registerValidation, register);

// Ruta de login público (valida esquema y ejecuta controlador)
router.post('/login', loginValidation, login);

export default router;
