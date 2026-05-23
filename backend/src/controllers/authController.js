import authService from '../services/authService.js';

/**
 * Controlador para registro de nuevos usuarios
 */
export const register = async (req, res, next) => {
  try {
    const newUser = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: newUser,
    });
  } catch (error) {
    // Redirigir el error al middleware global de manejo de errores
    next(error);
  }
};

/**
 * Controlador para inicio de sesión de usuarios
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authData = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: authData,
    });
  } catch (error) {
    next(error);
  }
};
