import api from './api.js';

/**
 * Enviar credenciales para iniciar sesión
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Datos del usuario y token JWT
 */
const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data; // Devuelve { success: true, message: "...", data: { token, user } }
};

/**
 * Registrar un nuevo usuario en el sistema
 * @param {Object} userData - Datos de registro (nombre, apellido, email, password, rol)
 * @returns {Promise<Object>} Respuesta del servidor con los datos creados
 */
const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data; // Devuelve { success: true, message: "...", data: { ... } }
};

export default {
  login,
  register,
};
