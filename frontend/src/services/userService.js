import api from './api.js';

/**
 * Obtener todos los usuarios registrados
 * Requiere JWT inyectado automáticamente
 */
const getAllUsers = async () => {
  const response = await api.get('/api/users');
  return response.data; // Devuelve { success: true, count: N, data: [...] }
};

/**
 * Obtener un usuario por su ID
 * @param {string} id - UUID del usuario
 */
const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data; // Devuelve { success: true, data: { ... } }
};

/**
 * Crear un usuario de forma directa (Administración)
 * @param {Object} userData - Datos (nombre, apellido, email, password, rol)
 */
const createUser = async (userData) => {
  const response = await api.post('/api/users', userData);
  return response.data; // Devuelve { success: true, message: "...", data: { ... } }
};

/**
 * Actualizar datos de un usuario existente
 * @param {string} id - UUID del usuario
 * @param {Object} updateData - Campos modificados
 */
const updateUser = async (id, updateData) => {
  const response = await api.put(`/api/users/${id}`, updateData);
  return response.data; // Devuelve { success: true, message: "...", data: { ... } }
};

/**
 * Eliminar físicamente un usuario por su ID
 * @param {string} id - UUID del usuario
 */
const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data; // Devuelve { success: true, message: "..." }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
