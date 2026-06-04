import api from './api.js';

/**
 * Obtener todos los servicios aprobados (Público)
 * @param {Object} filters - { search, category, sort, page, limit }
 */
const getPublicServices = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const response = await api.get(`/api/services/public?${params.toString()}`);
  return response.data;
};

/**
 * Obtener los servicios del HOST autenticado
 */
const getMyServices = async () => {
  const response = await api.get('/api/services/my-services');
  return response.data;
};

/**
 * Obtener los servicios pendientes de aprobación (ADMIN)
 */
const getPendingServices = async () => {
  const response = await api.get('/api/services/pending');
  return response.data;
};

/**
 * Crear un nuevo servicio
 * @param {Object} serviceData - { title, description, price, category }
 */
const createService = async (serviceData) => {
  const response = await api.post('/api/services', serviceData);
  return response.data;
};

/**
 * Actualizar un servicio
 * @param {string} id - UUID del servicio
 * @param {Object} serviceData - { title, description, price, category }
 */
const updateService = async (id, serviceData) => {
  const response = await api.put(`/api/services/${id}`, serviceData);
  return response.data;
};

/**
 * Eliminar un servicio
 * @param {string} id - UUID del servicio
 */
const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}`);
  return response.data;
};

/**
 * Aprobar un servicio (ADMIN)
 * @param {string} id - UUID del servicio
 */
const approveService = async (id) => {
  const response = await api.patch(`/api/services/${id}/approve`);
  return response.data;
};

/**
 * Rechazar un servicio (ADMIN)
 * @param {string} id - UUID del servicio
 */
const rejectService = async (id) => {
  const response = await api.patch(`/api/services/${id}/reject`);
  return response.data;
};

export default {
  getPublicServices,
  getMyServices,
  getPendingServices,
  createService,
  updateService,
  deleteService,
  approveService,
  rejectService,
};
