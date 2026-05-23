import userService from './userService.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import CustomError from '../utils/customError.js';

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Datos del usuario registrado sin password
 */
const register = async (userData) => {
  return await userService.createUser(userData);
};

/**
 * Valida credenciales de usuario y genera un token de autenticación
 * @param {string} email - Correo del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<Object>} Token JWT y datos públicos del usuario
 */
const login = async (email, password) => {
  // Buscar usuario incluyendo su contraseña para la verificación
  const user = await userService.getUserByEmailWithPassword(email);

  if (!user) {
    throw new CustomError(
      'Credenciales inválidas. Por favor verifique el correo y la contraseña.',
      401,
      'UnauthorizedError'
    );
  }

  // Verificar contraseña hasheada
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError(
      'Credenciales inválidas. Por favor verifique el correo y la contraseña.',
      401,
      'UnauthorizedError'
    );
  }

  // Generar JWT
  const token = generateToken(user.id);

  // Retornar token y datos limpios del usuario
  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

export default {
  register,
  login,
};
